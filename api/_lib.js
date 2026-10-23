const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsseypgcslsjvhvdkggs.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_28s6grUch_E0e2H0tR_JIg_ZBk8rGTA';

function setCors(req, res) {
  const configured = (process.env.ALLOWED_ORIGINS || '')
    .split(',').map(value => value.trim()).filter(Boolean);
  const origin = req.headers.origin;
  if (origin && configured.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function requireConfig(names) {
  const missing = names.filter(name => !process.env[name]);
  if (missing.length) throw new Error(`Server is missing ${missing.join(', ')}`);
}

async function getUser(req) {
  const authorization = req.headers.authorization || '';
  if (!authorization.startsWith('Bearer ')) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: authorization }
  });
  if (!response.ok) return null;
  return response.json();
}

async function db(path, options = {}, accessToken) {
  if (!accessToken) throw new Error('A signed-in session is required.');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.message || data?.error || `Database HTTP ${response.status}`);
  return data;
}

module.exports = { db, getUser, json, requireConfig, setCors, SUPABASE_URL, SUPABASE_ANON_KEY };
