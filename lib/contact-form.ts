export const DISCIPLINAS = ["boxeo", "muay-thai", "k1", "jiu-jitsu"] as const;
export type Disciplina = typeof DISCIPLINAS[number];

export type FormState = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  disciplina: "" | Disciplina;
  mensaje: string;
  recaptchaToken: string;
};

export const initialForm: FormState = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  disciplina: "",
  mensaje: "",
  recaptchaToken: "",
};

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const soloNumeros = (s: string) => /^\d+$/.test(s);
const disciplinasOK = new Set<string>(DISCIPLINAS);

export function validate(values: FormState): Record<string, string> {
  const e: Record<string, string> = {};
  const { nombre, apellido, email, telefono, disciplina, mensaje, recaptchaToken } = values;

  if (nombre.trim().length < 2) e.nombre = "Mínimo 2 letras.";
  if (apellido.trim().length < 2) e.apellido = "Mínimo 2 letras.";
  if (!emailOk(email.trim())) e.email = "Email inválido.";
  if (telefono && !soloNumeros(telefono.trim())) e.telefono = "Solo números.";
  if (!disciplinasOK.has(disciplina)) e.disciplina = "Elegí una disciplina.";
  if (mensaje.trim().length > 500) e.mensaje = "Máximo 500 caracteres.";
  const recaptchaRequerido = !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (recaptchaRequerido && !recaptchaToken) e.recaptcha = "Completa la verificación reCAPTCHA.";

  return e;
}

export function titleToSlug(title: string): Disciplina | null {
  const t = title.toLowerCase();
  if (t.includes("k-1")) return "k1";
  if (t.includes("muay")) return "muay-thai";
  if (t.includes("boxeo")) return "boxeo";
  if (t.includes("jiu")) return "jiu-jitsu";
  return null;
}
