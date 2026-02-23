export const runtime = 'nodejs';

export async function GET(req) {
  const password = req.headers.get('x-admin-password');
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return Response.json({ ok: true }, { status: 200 });
}
