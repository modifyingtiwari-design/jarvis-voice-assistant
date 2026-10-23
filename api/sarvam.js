const { db, getUser, json, requireConfig, setCors } = require('./_lib');

const API = 'https://api.sarvam.ai';
const LANGUAGES = new Set(['en-IN','hi-IN','mr-IN','bn-IN','ta-IN','te-IN','kn-IN','ml-IN','gu-IN','pa-IN','od-IN']);

function text(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

async function recordUsage(userId, eventType, accessToken) {
  await db('usage_events', {
    method: 'POST', body: JSON.stringify({ user_id: userId, event_type: eventType })
  }, accessToken);
}

async function limitUsage(userId, eventType, accessToken) {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const events = await db(`usage_events?user_id=eq.${userId}&event_type=eq.${eventType}&created_at=gte.${encodeURIComponent(since)}&select=id&limit=121`, {}, accessToken);
  if (events.length >= 120) throw Object.assign(new Error('Hourly voice limit reached. Try again shortly.'), { status: 429 });
}

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    requireConfig(['SARVAM_API_KEY']);
    const user = await getUser(req);
    if (!user) return json(res, 401, { error: 'Sign in to use JARVIS voice.' });
    const accessToken = req.headers.authorization.slice(7);
    const kind = req.query?.kind;
    if (!['tts', 'stt'].includes(kind)) return json(res, 400, { error: 'Unknown voice operation.' });
    const eventType = kind === 'tts' ? 'text_to_speech' : 'speech_to_text';
    await limitUsage(user.id, eventType, accessToken);

    let upstream;
    if (kind === 'tts') {
      const spokenText = text(req.body?.text, 2000);
      if (!spokenText) return json(res, 400, { error: 'Text is required.' });
      const speaker = text(req.body?.speaker, 80);
      const language = LANGUAGES.has(req.body?.language_code) ? req.body.language_code : 'en-IN';
      upstream = await fetch(`${API}/text-to-speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-subscription-key': process.env.SARVAM_API_KEY },
        body: JSON.stringify({
          text: spokenText,
          model: 'bulbul:v4-flash',
          speaker: speaker || 'shubh_enhi_ads',
          language_code: language,
          output_audio_codec: 'wav',
          speech_sample_rate: 24000,
          pace: 1
        })
      });
    } else {
      const encoded = text(req.body?.audio, 12000000);
      if (!encoded || !/^[A-Za-z0-9+/=]+$/.test(encoded)) return json(res, 400, { error: 'Valid audio is required.' });
      const bytes = Buffer.from(encoded, 'base64');
      if (!bytes.length || bytes.length > 8000000) return json(res, 413, { error: 'Recording is too large.' });
      const mime = /^audio\/(?:wav|webm|mp4|ogg)(?:;.*)?$/i.test(req.body?.mimeType || '') ? req.body.mimeType : 'audio/webm';
      const extension = /wav/i.test(mime) ? 'wav' : /mp4/i.test(mime) ? 'm4a' : /ogg/i.test(mime) ? 'ogg' : 'webm';
      const form = new FormData();
      form.append('file', new Blob([bytes], { type: mime }), `instruction.${extension}`);
      form.append('model', 'saaras:v3');
      form.append('mode', 'transcribe');
      if (LANGUAGES.has(req.body?.language_code)) form.append('language_code', req.body.language_code);
      upstream = await fetch(`${API}/speech-to-text`, {
        method: 'POST', headers: { 'api-subscription-key': process.env.SARVAM_API_KEY }, body: form
      });
    }

    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return json(res, upstream.status >= 500 ? 502 : upstream.status, {
        error: result?.error?.message || result?.message || `Sarvam HTTP ${upstream.status}`
      });
    }
    await recordUsage(user.id, eventType, accessToken);
    return json(res, 200, result);
  } catch (error) {
    return json(res, error.status || 500, { error: error.message || 'Voice request failed.' });
  }
};

