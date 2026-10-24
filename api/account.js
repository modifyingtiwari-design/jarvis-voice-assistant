const { db, getUser, json, setCors } = require('./_lib');

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const user = await getUser(req);
    if (!user) return json(res, 401, { error: 'Sign in to continue.' });
    const accessToken = req.headers.authorization.slice(7);

    if (req.method === 'GET') {
      const [profile, conversations, memories] = await Promise.all([
        db(`profiles?id=eq.${user.id}&select=*`, {}, accessToken),
        db(`conversations?user_id=eq.${user.id}&select=id,title,created_at,updated_at&order=updated_at.desc&limit=30`, {}, accessToken),
        db(`memory_notes?user_id=eq.${user.id}&deleted_at=is.null&select=id,title,body,created_at,updated_at&order=updated_at.desc&limit=30`, {}, accessToken)
      ]);
      return json(res, 200, { user: { id: user.id, email: user.email }, profile: profile[0], conversations, memories });
    }

    if (req.method === 'PATCH' || req.method === 'POST') {
      const allowed = ['display_name', 'preferred_language', 'response_language', 'voice', 'personality'];
      const changes = Object.fromEntries(allowed
        .filter(key => typeof req.body?.[key] === 'string')
        .map(key => [key, req.body[key].trim().slice(0, key === 'display_name' ? 60 : 64)]));
      if (['brief','balanced','detailed'].includes(req.body?.reply_length)) changes.reply_length=req.body.reply_length;
      if (Number.isInteger(req.body?.humour) && req.body.humour>=0 && req.body.humour<=3) changes.humour=req.body.humour;
      if (!Object.keys(changes).length) return json(res, 400, { error: 'No valid profile fields supplied.' });
      const rows = await db(`profiles?id=eq.${user.id}`, { method: 'PATCH', body: JSON.stringify(changes) }, accessToken);
      return json(res, 200, { profile: rows[0] });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Account request failed.' });
  }
};

