const { json, setCors, SUPABASE_URL, SUPABASE_ANON_KEY } = require('./_lib');
const routes = new Set(['signup', 'token?grant_type=password', 'token?grant_type=refresh_token', 'logout']);

module.exports = async function handler(req, res) {
  setCors(req, res);
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const { operation, credentials } = req.body || {};
  if (!routes.has(operation) || !credentials || typeof credentials !== 'object') return json(res, 400, { error: 'Invalid account request.' });
  const headers = { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' };
  if (operation === 'logout') {
    if (!req.headers.authorization?.startsWith('Bearer ')) return json(res, 401, { error: 'Sign in to continue.' });
    headers.Authorization = req.headers.authorization;
  }
  try {
    const response = await fetch(SUPABASE_URL + '/auth/v1/' + operation, {
      method: 'POST', headers, body: JSON.stringify(credentials), signal: AbortSignal.timeout(20000)
    });
    const result = await response.json().catch(() => ({}));
    return json(res, response.status === 204 ? 200 : response.status, result);
  } catch {
    return json(res, 502, { error: 'The account service could not be reached. Please try again shortly.' });
  }
};
