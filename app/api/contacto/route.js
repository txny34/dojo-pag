// app/api/contacto/route.js - Versión que envía a AMBOS
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
  const apellido = raw?.apellido ?? '';
  const disciplina = raw?.disciplina ?? 'nuestra disciplina';
  const telefono = raw?.telefono ?? '';
  const email = raw?.email ?? '';
  const mensaje = raw?.mensaje ?? '';

  const texto = `¡Hola ${nombre}! 🥋 Recibimos tu interés en ${disciplina}. ` +
                `Te contactaremos pronto para coordinar tu primera clase.`;

  let djangoSuccess = false;
  let supabaseSuccess = false;
  const errors = [];

  // 1. ENVIAR A DJANGO
  try {
    const djangoPayload = {
      nombre,
      apellido,
      email,
      telefono,
      disciplina,
      mensaje
    };

    const djangoResponse = await fetch('http://127.0.0.1:8000/contactos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(djangoPayload),
    });

    if (djangoResponse.ok) {
      djangoSuccess = true;
      console.log('✅ Enviado a Django exitosamente');
    } else {
      const errorText = await djangoResponse.text();
      errors.push(`Django: ${errorText}`);
      console.log('❌ Error enviando a Django:', errorText);
    }
  } catch (error) {
    errors.push(`Django connection: ${error.message}`);
    console.log('❌ Error conectando con Django:', error.message);
  }

  // 2. ENVIAR A SUPABASE
  try {
    const { error } = await supabaseAdmin.from('contacto').insert([{ 
      nombre, 
      apellido,
      email, 
      telefono, 
      disciplina,
      mensaje 
    }]);
    
    if (error) {
      errors.push(`Supabase: ${error.message}`);
      console.log('❌ Error Supabase:', error.message);
    } else {
      supabaseSuccess = true;
      console.log('✅ Enviado a Supabase exitosamente');
    }
  } catch (error) {
    errors.push(`Supabase: ${error.message}`);
    console.log('❌ Error Supabase:', error.message);
  }

  // 3. RESPUESTA
  if (djangoSuccess || supabaseSuccess) {
    return Response.json({ 
      echo: raw, 
      message: texto,
      status: {
        django: djangoSuccess ? 'success' : 'failed',
        supabase: supabaseSuccess ? 'success' : 'failed',
        errors: errors.length > 0 ? errors : null
      }
    }, { status: 200 });
  } else {
    return Response.json({ 
      error: 'Failed to save to both systems',
      errors 
    }, { status: 500 });
  }
}
