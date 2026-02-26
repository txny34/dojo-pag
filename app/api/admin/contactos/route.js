export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sanitizeEnv(v) {
  return (v || '').trim().replace(/^"+|"+$/g, '').replace(/\/+$/, '');
}

function backendBase() {
  const v = sanitizeEnv(process.env.BACKEND_URL);
  if (!v) throw new Error('Missing ENV: BACKEND_URL');
  return v;
}

function checkPassword(req) {
  const password = req.headers.get('x-admin-password');
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(req) {
  const authError = checkPassword(req);
  if (authError) return authError;

  try {
    const base = backendBase();
    const r = await fetch(`${base}/contactos/`, { cache: 'no-store', signal: AbortSignal.timeout(25000) });
    const data = await r.json();
    return Response.json(data, { status: r.status });
  } catch (e) {
    return Response.json({ error: e?.message || 'Error conectando con el backend' }, { status: 500 });
  }
}

export async function PATCH(req) {
  const authError = checkPassword(req);
  if (authError) return authError;

  try {
    const { id, ...fields } = await req.json();
    if (!id) return Response.json({ error: 'id requerido' }, { status: 400 });

    const base = backendBase();
    const r = await fetch(`${base}/contactos/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    const data = await r.json();
    return Response.json(data, { status: r.status });
  } catch (e) {
    return Response.json({ error: e?.message || 'Error conectando con el backend' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const authError = checkPassword(req);
  if (authError) return authError;

  try {
    const { id } = await req.json();
    if (!id) return Response.json({ error: 'id requerido' }, { status: 400 });

    const base = backendBase();
    const r = await fetch(`${base}/contactos/${id}/`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(10000),
    });

    if (r.status === 204) return new Response(null, { status: 204 });
    return Response.json({ error: 'Error al eliminar' }, { status: r.status });
  } catch (e) {
    return Response.json({ error: e?.message || 'Error conectando con el backend' }, { status: 500 });
  }
}
