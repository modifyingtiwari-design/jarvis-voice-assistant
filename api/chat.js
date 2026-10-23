const { db, getUser, json, requireConfig, setCors } = require('./_lib');

const SARVAM_API = 'https://api.sarvam.ai/v1/chat/completions';

function cleanText(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function validUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function assistantPrompt(profile, memories) {
  const name = cleanText(profile?.display_name, 60);
  const personality = cleanText(profile?.personality, 24) || 'witty';
  const language = cleanText(profile?.response_language, 24) || 'auto';
  const memory = memories.map(item => `- ${item.title}: ${item.body}`).join('\n');
  return [
    'You are JARVIS, a fast, capable personal work assistant and fun conversational companion.',
    'Be practical, warm and naturally witty. Gentle sarcasm is welcome; never insult or belittle the user.',
    'Give concise answers by default. Suggest the next useful action when appropriate.',
    name ? `Address the user as ${name} when it feels natural.` : '',
    `Personality mode: ${personality}. Response language preference: ${language}.`,
    memory ? `Useful user memories:\n${memory}` : ''
  ].filter(Boolean).join('\n');
}

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    requireConfig(['SARVAM_API_KEY']);
    const user = await getUser(req);
    if (!user) return json(res, 401, { error: 'Sign in to use JARVIS.' });
    const accessToken = req.headers.authorization.slice(7);

    const text = cleanText(req.body?.message, 12000);
    if (!text) return json(res, 400, { error: 'Message is required.' });

    let conversationId = cleanText(req.body?.conversationId, 64);
    if (conversationId && !validUuid(conversationId)) {
      return json(res, 400, { error: 'Invalid conversation id.' });
    }

    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recentUsage = await db(`usage_events?user_id=eq.${user.id}&event_type=eq.chat&created_at=gte.${encodeURIComponent(hourAgo)}&select=id&limit=61`, {}, accessToken);
    if (recentUsage.length >= 60) {
      return json(res, 429, { error: 'Hourly JARVIS limit reached. Try again shortly.' });
    }
    let conversation;
    if (conversationId) {
      const rows = await db(`conversations?id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${user.id}&select=id,title`, {}, accessToken);
      conversation = rows[0];
      if (!conversation) return json(res, 404, { error: 'Conversation not found.' });
    } else {
      const title = text.replace(/\s+/g, ' ').slice(0, 72) || 'New conversation';
      const rows = await db('conversations', {
        method: 'POST', body: JSON.stringify({ user_id: user.id, title })
      }, accessToken);
      conversation = rows[0];
      conversationId = conversation.id;
    }

    await db('messages', {
      method: 'POST',
      body: JSON.stringify({ conversation_id: conversationId, user_id: user.id, role: 'user', content: text })
    }, accessToken);

    const [profileRows, memoryRows, historyRows] = await Promise.all([
      db(`profiles?id=eq.${user.id}&select=display_name,response_language,personality`, {}, accessToken),
      db(`memory_notes?user_id=eq.${user.id}&select=title,body&order=updated_at.desc&limit=8`, {}, accessToken),
      db(`messages?conversation_id=eq.${conversationId}&user_id=eq.${user.id}&select=role,content&order=created_at.desc&limit=20`, {}, accessToken)
    ]);

    const history = historyRows.reverse().map(item => ({ role: item.role, content: item.content }));
    const response = await fetch(SARVAM_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': process.env.SARVAM_API_KEY
      },
      body: JSON.stringify({
        model: 'sarvam-105b',
        messages: [
          { role: 'system', content: assistantPrompt(profileRows[0], memoryRows) },
          ...history
        ],
        max_tokens: 1100,
        temperature: 0.65,
        stream: false
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return json(res, response.status >= 500 ? 502 : response.status, {
        error: result?.error?.message || result?.message || `Sarvam HTTP ${response.status}`
      });
    }

    const answer = cleanText(result?.choices?.[0]?.message?.content, 20000);
    if (!answer) return json(res, 502, { error: 'Sarvam returned no reply.' });

    await Promise.all([
      db('messages', {
        method: 'POST',
        body: JSON.stringify({ conversation_id: conversationId, user_id: user.id, role: 'assistant', content: answer })
      }, accessToken),
      db('usage_events', {
        method: 'POST', body: JSON.stringify({ user_id: user.id, event_type: 'chat' })
      }, accessToken),
      db(`conversations?id=eq.${conversationId}&user_id=eq.${user.id}`, {
        method: 'PATCH', body: JSON.stringify({ updated_at: new Date().toISOString() })
      }, accessToken)
    ]);

    return json(res, 200, { conversationId, answer });
  } catch (error) {
    return json(res, 500, { error: error.message || 'JARVIS backend failed.' });
  }
};

