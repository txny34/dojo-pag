import { supabaseAdmin } from '@/lib/supabaseServer'; 


async function parseBody(req) {
  // JSON
  if (req.headers.get('content-type')?.includes('application/json')) {
    try { return await req.json(); } catch {}
  }
  // FormData
  try {
    const fd = await req.formData();
    const o = {}; for (const [k,v] of fd.entries()) o[k] = v;
    return o;
  } catch {}
  return {};
}

export async function POST(req) {
  const raw = await parseBody(req);
  console.log('CT:', req.headers.get('content-type'));
  console.log('RAW BODY ->', raw);

  const nombre = raw?.nombre ?? 'Alumno';
  const disciplina = raw?.disciplina ?? 'nuestra disciplina';
  const telefono = raw?.telefono ?? '';
  const email = raw?.email ?? '';
  const mensaje = raw?.mensaje ?? '';

  const texto = `¡Hola ${nombre}! 🥋 Recibimos tu interés en ${disciplina}. ` +
                `Te contactaremos pronto para coordinar tu primera clase.`;

  // comenta Supabase si querés aislar aún más
  // const { error } = await supabaseAdmin.from('contacto').insert([{ nombre, email, telefono, mensaje }]);
  // if (error) return Response.json({ error: 'DB' }, { status: 500 });

  return Response.json({ echo: raw, message: texto }, { status: 200 });
}
