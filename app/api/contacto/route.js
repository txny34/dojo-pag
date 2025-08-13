export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabaseServer';

// --- Utils ---
const DISC_MAP = { 'Muay Thai': 'muay-thai', 'Boxeo': 'boxeo', 'K-1': 'k1', 'Jiu-Jitsu': 'jiu-jitsu' };

function sanitizeEnv(v) { return (v || '').trim().replace(/^"+|"+$/g, '').replace(/\/+$/, ''); }
function backendBase() {
  const v = sanitizeEnv(process.env.BACKEND_URL);
  if (!v) throw new Error('Missing ENV: BACKEND_URL');
  return v;
}

async function parseBody(req) {
  const ct = req.headers.get('content-type') || '';
  if (ct.includes('application/json')) { try { return await req.json(); } catch {} }
  try { const fd = await req.formData(); const o = {}; for (const [k,v] of fd.entries()) o[k]=v; return o; } catch {}
  return {};
}

function normalizePhone(tel) {
  if (!tel) return '';
  const digits = String(tel).replace(/\D/g, '');
  return (digits.length >= 8 && digits.length <= 15) ? digits : '';
}

async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!token || !secret) return true;
  const params = new URLSearchParams({ secret, response: token });
  const r = await fetch('https://www.google.com/recaptcha/api/siteverify', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: params });
  const j = await r.json().catch(()=> ({}));
  return j.success === true && (j.score === undefined || j.score >= 0.5);
}

async function ping(url) {
  try {
    const r = await fetch(`${url}/admin/login/`, { method: 'HEAD', cache: 'no-store' });
    return r.status; // 302 esperado
  } catch (e) {
    return 0; // no conecta
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: {
    'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type',
  }});
}

export async function POST(req) {
  const raw = await parseBody(req);

  // Normalización para Django
  const nombre = String(raw?.nombre || 'Alumno').trim();
  const apellido = (raw?.apellido && String(raw.apellido).trim()) || '—';
  const email = String(raw?.email || '').trim();
  const telefono = normalizePhone(raw?.telefono);
  const disciplina = (() => { const v = String(raw?.disciplina || '').trim(); return DISC_MAP[v] || v; })();
  const mensaje = String(raw?.mensaje || '').trim();
  const token = raw?.token;

  // reCAPTCHA laxo
  const captchaOK = await verifyRecaptcha(token);
  if (!captchaOK) return Response.json({ ok:false, error:'reCAPTCHA failed' }, { status:400 });

  const base = backendBase();
  const health = await ping(base);

  const status = { django: 'failed', supabase: 'failed', errors: [], debug: { backend_url: base, pingStatus: health } };

  // 1) Django
  try {
    const url = `${base}/contactos/`;
    const r = await fetch(url, { method:'POST', headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ nombre, apellido, email, telefono, disciplina, mensaje }),
    });
    if (r.ok) status.django = 'success';
    else status.errors.push(`Django: ${r.status} ${await r.text()}`);
  } catch (e) {
    status.errors.push(`Django connection: ${e?.message || 'fetch failed'}`);
  }

  // 2) Supabase (si hay env)
  try {
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from('contacto')
        .insert([{ nombre, apellido, email, telefono, disciplina, mensaje }]);
      if (error) status.errors.push(`Supabase: ${error.message}`); else status.supabase = 'success';
    }
  } catch (e) { status.errors.push(`Supabase: ${e?.message}`); }

  const ok = status.django === 'success' || status.supabase === 'success';
  const texto = `¡Hola ${nombre}! 🥋 Recibimos tu interés en ${disciplina}. Te contactaremos pronto para coordinar tu primera clase.`;
  return Response.json({ ok, echo: raw, message: texto, status }, { status: ok ? 200 : 500 });
}
