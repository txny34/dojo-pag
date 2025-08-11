"use client";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Clock, Users, Award, Zap, Shield, Target, Swords } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import StaticMap from "@/components/StaticMap";
import dynamic from "next/dynamic";


// ⛑️ reCAPTCHA dinámico (sin SSR)
const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { 
  ssr: false,
  loading: () => (
    <div className="bg-gray-700 p-6 rounded-xl border border-gray-600 animate-pulse">
      <div className="text-gray-400 text-center">Cargando verificación...</div>
    </div>
  )
});

// ======= CONFIG =======
const API = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";
const DISCIPLINAS = ["boxeo", "muay-thai", "k1", "jiu-jitsu"] as const;
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

type Disciplina = typeof DISCIPLINAS[number];

type FormState = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  disciplina: "" | Disciplina;
  mensaje: string;
  recaptchaToken: string;
};

const initialForm: FormState = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  disciplina: "",
  mensaje: "",
  recaptchaToken: ""
};

// ======= HELPERS =======
const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const soloNumeros = (s: string) => /^\d+$/.test(s);
const disciplinasOK = new Set<string>(DISCIPLINAS);

function validate(values: FormState) {
  const e: Record<string, string> = {};
  const { nombre, apellido, email, telefono, disciplina, mensaje, recaptchaToken } = values;

  if (nombre.trim().length < 2) e.nombre = "Mínimo 2 letras.";
  if (apellido.trim().length < 2) e.apellido = "Mínimo 2 letras.";
  if (!emailOk(email.trim())) e.email = "Email inválido.";
  if (telefono && !soloNumeros(telefono.trim())) e.telefono = "Solo números.";
  if (!disciplinasOK.has(disciplina)) e.disciplina = "Elegí una disciplina.";
  if (mensaje.trim().length > 500) e.mensaje = "Máximo 500 caracteres.";
  if (!recaptchaToken) e.recaptcha = "Completa la verificación reCAPTCHA.";

  return e;
}

/* =========================================================================================
   DISCIPLINAS: contenido extendido + MODAL
========================================================================================= */
type Nivel = "Principiante" | "Intermedio" | "Avanzado";

type DisciplinaInfo = {
  slug: Disciplina;
  title: string;
  descripcion: string;
  beneficios: string[];
  niveles: Nivel[];
  duracion: string;
  equipamiento: string[];
  imagen: string;
};

const DISCIPLINAS_INFO: Record<Disciplina, DisciplinaInfo> = {
  k1: {
    slug: "k1",
    title: "K-1 Kickboxing",
    descripcion: "Golpeo de alta intensidad combinando puñetazos, patadas y rodillazos.",
    beneficios: [
      "Quema de calorías acelerada",
      "Mejora el cardio y la potencia",
      "Reflejos y timing",
      "Técnica de golpeo completa",
      "Gestión del estrés"
    ],
    niveles: ["Principiante", "Intermedio", "Avanzado"],
    duracion: "60 min",
    equipamiento: ["Guantes", "Vendas", "Protector bucal (sparring)", "Tibiales"],
    imagen: "/images/disciplines/kickBoxing.jpeg",
  },
  "muay-thai": {
    slug: "muay-thai",
    title: "Muay Thai",
    descripcion: "El arte de las 8 extremidades: puños, codos, rodillas y espinillas.",
    beneficios: [
      "Potencia y técnica en clinch",
      "Condición física total",
      "Confianza y disciplina",
      "Movilidad y equilibrio",
      "Resistencia mental"
    ],
    niveles: ["Principiante", "Intermedio", "Avanzado"],
    duracion: "60 min",
    equipamiento: ["Guantes", "Vendas", "Tibiales", "Protector bucal (sparring)"],
    imagen: "/images/disciplines/muyThai.jpeg",
  },
  boxeo: {
    slug: "boxeo",
    title: "Boxeo",
    descripcion: "La dulce ciencia: guardia, desplazamientos, combinaciones y defensa.",
    beneficios: [
      "Mejora cardiovascular",
      "Coordinación y precisión",
      "Fortaleza de tren superior",
      "Técnica y defensa",
      "Reducción del estrés"
    ],
    niveles: ["Principiante", "Intermedio", "Avanzado"],
    duracion: "60 min",
    equipamiento: ["Guantes", "Vendas", "Protector bucal (sparring)"],
    imagen: "/images/disciplines/boxeo.jpeg",
  },
  "jiu-jitsu": {
    slug: "jiu-jitsu",
    title: "Jiu-Jitsu",
    descripcion: "Lucha en suelo, control y sumisiones. Defensa personal real.",
    beneficios: [
      "Confianza y autocontrol",
      "Flexibilidad y movilidad",
      "Fuerza del core",
      "Estrategia y paciencia",
      "Comunidad y respeto"
    ],
    niveles: ["Principiante", "Intermedio", "Avanzado"],
    duracion: "60 min",
    equipamiento: ["Gi (Kimono) o Rashguard (No-Gi)", "Protector bucal"],
    imagen: "/images/disciplines/bjj.jpeg",
  },
};

function titleToSlug(title: string): Disciplina | null {
  const t = title.toLowerCase();
  if (t.includes("k-1")) return "k1";
  if (t.includes("muay")) return "muay-thai";
  if (t.includes("boxeo")) return "boxeo";
  if (t.includes("jiu")) return "jiu-jitsu";
  return null;
}

function ModalDisciplina({
  info,
  onClose,
  onSelect,
}: {
  info: DisciplinaInfo;
  onClose: () => void;
  onSelect: (slug: Disciplina) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-gray-900 text-gray-100 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl modal-card">
        {/* Imagen */}
        <div className="relative">
          <Image
            src={info.imagen}
            alt={info.title}
            width={1200}
            height={600}
            className="w-full h-56 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-900 rounded-full px-3 py-1 text-sm font-bold"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <h2 className="text-2xl font-black mb-2">{info.title}</h2>
          <p className="text-gray-300">{info.descripcion}</p>

          {/* Niveles + Duración */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {info.niveles.map((n) => (
              <span key={n} className="inline-block px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold">
                {n}
              </span>
            ))}
            <span className="inline-flex items-center gap-2 text-sm text-gray-200">
              <Clock className="w-4 h-4" />
              {info.duracion}
            </span>
          </div>

          {/* Beneficios */}
          <div className="mt-5">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" /> Beneficios
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
              {info.beneficios.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipamiento */}
          <div className="mt-5">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Swords className="w-5 h-5 text-blue-400" /> Equipamiento necesario
            </h3>
            <ul className="list-disc ml-5 space-y-1 text-gray-300">
              {info.equipamiento.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700" onClick={() => onSelect(info.slug)}>
            Quiero entrenar {info.title}
          </Button>
        </div>
      </div>

      {/* Fade styles */}
      <style jsx>{`
        .modal-backdrop {
          background: rgba(0,0,0,0.6);
          animation: fadeIn 220ms ease-out forwards;
          opacity: 0;
        }
        .modal-card {
          transform: translateY(8px) scale(0.98);
          opacity: 0;
          animation: riseIn 220ms ease-out forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes riseIn {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ========================================================================================= */

export default function DojoWebsite() {
  // UI state
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [enviando, setEnviando] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState<FormState>(initialForm);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const formRef = useRef<HTMLFormElement | null>(null);

  // reCAPTCHA
  const recaptchaRef = useRef<any>(null);

  const handleRecaptchaChange = useCallback((token: string | null) => {
    setValues(prev => {
      const next = { ...prev, recaptchaToken: token || "" };
      setErrors(validate(next));
      return next;
    });
  }, []);
  const resetRecaptcha = useCallback(() => {
    try { recaptchaRef.current?.reset?.(); } catch {}
    setValues(prev => ({ ...prev, recaptchaToken: "" }));
    setErrors(prev => { const { recaptcha, ...rest } = prev; return rest; });
  }, []);

  const isValid = useMemo(
    () =>
      Object.keys(errors).length === 0 &&
      !!values.nombre &&
      !!values.apellido &&
      !!values.email &&
      !!values.disciplina &&
      !!values.recaptchaToken,
    [errors, values]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev) => {
        const next = { ...prev, [name]: value } as FormState;
        setErrors(validate(next));
        return next;
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatusMessage("");
      const currentErrors = validate(values);
      setErrors(currentErrors);
      if (Object.keys(currentErrors).length) return;

      setEnviando(true);
      try {
        const payload = {
          nombre: values.nombre.trim(),
          apellido: values.apellido.trim(),
          email: values.email.trim(),
          telefono: values.telefono.trim(),
          disciplina: values.disciplina,
          mensaje: values.mensaje.trim(),
          recaptchaToken: values.recaptchaToken,
        };

        const res = await fetch("/api/contacto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const raw = await res.text();
        if (!res.ok) {
          let msg = "Error del servidor";
          try {
            const parsed = raw ? JSON.parse(raw) : {};
            msg = parsed?.detail || parsed?.mensaje || msg;
          } catch {}
          setStatusMessage(`Error: ${msg}`);
          resetRecaptcha();
          return;
        }

        // OK
        setStatusMessage("¡Gracias! 🥋 Recibimos tu consulta. Te contactaremos pronto para coordinar tu primera clase.");
        setValues(initialForm);
        setErrors({});
        formRef.current?.reset();
        resetRecaptcha();
      } catch (err: any) {
        setStatusMessage(`Error: ${err?.message || "Fallo de red"}`);
        resetRecaptcha();
      } finally {
        setEnviando(false);
      }
    },
    [values, resetRecaptcha]
  );

  /* ===== MODAL state + handler ===== */
  const [openModal, setOpenModal] = useState<Disciplina | null>(null);

  const handleSelectDisciplina = (slug: Disciplina) => {
    // Preseleccionar en el formulario (state controlado)
    setValues((prev) => {
      const next = { ...prev, disciplina: slug };
      setErrors(validate(next));
      return next;
    });

    // Forzar en el <select> y disparar change por si hay listeners
    if (typeof window !== 'undefined') {
      // Forzar en el <select>
      const select = document.querySelector<HTMLSelectElement>('select[name="disciplina"]');
      if (select) {
        select.value = slug;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
  
      
    }

  
    setOpenModal(null);
  };
    // Scroll a contacto y cerrar modal
    


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Swords className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">Fighting Spirit Dojo</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="#about" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                Acerca de
              </Link>
              <Link href="#disciplines" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                Disciplinas
              </Link>
              <Link href="#schedule" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                Horarios
              </Link>
              <Link href="#instructors" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                Instructores
              </Link>
              <Link href="#membership" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                Membresías
              </Link>
              <Link href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                Contacto
              </Link>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Únete Ahora
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70 z-10" />
        <Image src="/images/hero/mural.jpeg" alt="Mural Samurái" fill className="object-cover" priority sizes="100vw" />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-white leading-tight">
            FORJA TU
            <span className="block text-blue-400">ESPÍRITU GUERRERO</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Domina las artes marciales ancestrales en un entorno moderno. Disciplina, honor y fuerza te esperan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Inicia Tu Camino
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-400 text-gray-300 hover:bg-gray-800 font-bold px-8 py-4 text-lg transition-all duration-300 bg-transparent"
              onClick={() => document.getElementById('disciplines')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Clases
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-white mb-6">EL CAMINO DEL GUERRERO</h2>
              <div className="w-24 h-1 bg-blue-400 mx-auto mb-8" />
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Nuestro dojo encarna los principios ancestrales del Bushido mientras abraza metodologías de entrenamiento modernas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">Nuestra Filosofía</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Fundado en las siete virtudes del Bushido - Rectitud, Coraje, Benevolencia, Respeto, Honestidad, Honor y Lealtad - nuestro dojo es más que un lugar de entrenamiento. Es un santuario donde los guerreros se forjan a través de la disciplina, dedicación y respeto mutuo.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6 text-blue-400" />
                    <span className="text-gray-300 font-medium">Honor</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="h-6 w-6 text-blue-400" />
                    <span className="text-gray-300 font-medium">Disciplina</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="h-6 w-6 text-blue-400" />
                    <span className="text-gray-300 font-medium">Fuerza</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-blue-400" />
                    <span className="text-gray-300 font-medium">Respeto</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image src="/images/inside/insidedojo.jpeg" alt="Interior del Dojo" width={600} height={500} className="rounded-lg shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section id="disciplines" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">DISCIPLINAS MARCIALES</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8" />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Domina múltiples artes de combate bajo un mismo techo con instrucción de clase mundial.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "K-1 Kickboxing", description: "Golpeo de alta intensidad combinando puñetazos, patadas y rodillazos", image: "/images/disciplines/kickBoxing.jpeg" },
              { title: "Muay Thai", description: "El arte de las ocho extremidades - puños, codos, rodillas y espinillas", image: "/images/disciplines/muyThai.jpeg" },
              { title: "Boxeo", description: "La dulce ciencia del juego de piernas, timing y golpeo preciso", image: "/images/disciplines/boxeo.jpeg" },
              { title: "Jiu-Jitsu", description: "Técnicas de lucha en el suelo y sumisión", image: "/images/disciplines/bjj.jpeg" },
            ].map((discipline, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-blue-400 transition-all duration-300 hover:scale-105">
                <div className="relative overflow-hidden">
                  <Image src={discipline.image} alt={discipline.title} width={400} height={300} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                </div>
                <CardHeader>
                  <CardTitle className="text-white text-xl font-bold">{discipline.title}</CardTitle>
                  <CardDescription className="text-gray-300">{discipline.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    onClick={() => {
                      const slug = titleToSlug(discipline.title);
                      if (slug) setOpenModal(slug);
                    }}
                  >
                    Saber Más
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Render del Modal */}
        {openModal && (
          <ModalDisciplina
            info={DISCIPLINAS_INFO[openModal]}
            onClose={() => setOpenModal(null)}
            onSelect={handleSelectDisciplina}
          />
        )}
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">HORARIO DE CLASES</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8" />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid gap-6">
              {[
                { day: "Lunes", classes: [ { time: "6:00 AM", discipline: "Boxeo", instructor: "Sensei Takeshi", level: "Todos los Niveles" }, { time: "7:00 PM", discipline: "Muay Thai", instructor: "Kru Somchai", level: "Intermedio" }, ], },
                { day: "Martes", classes: [ { time: "6:30 AM", discipline: "Jiu-Jitsu", instructor: "Professor Silva", level: "Principiante" }, { time: "7:30 PM", discipline: "K-1", instructor: "Coach Yamamoto", level: "Avanzado" }, ], },
                { day: "Miércoles", classes: [ { time: "6:00 AM", discipline: "Boxeo", instructor: "Sensei Takeshi", level: "Todos los Niveles" }, { time: "7:00 PM", discipline: "Muay Thai", instructor: "Kru Somchai", level: "Principiante" }, ], },
                { day: "Jueves", classes: [ { time: "6:30 AM", discipline: "Jiu-Jitsu", instructor: "Professor Silva", level: "Intermedio" }, { time: "7:30 PM", discipline: "K-1", instructor: "Coach Yamamoto", level: "Todos los Niveles" }, ], },
                { day: "Viernes", classes: [ { time: "6:00 AM", discipline: "Boxeo", instructor: "Sensei Takeshi", level: "Avanzado" }, { time: "7:00 PM", discipline: "Mat Abierto", instructor: "Todos los Instructores", level: "Todos los Niveles" }, ], },
              ].map((day, index) => (
                <Card key={index} className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl font-bold flex items-center">
                      <Clock className="h-6 w-6 text-blue-400 mr-3" />
                      {day.day}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {day.classes.map((classItem, classIndex) => (
                        <div key={classIndex} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                          <div>
                            <div className="text-blue-400 font-bold text-lg">{classItem.time}</div>
                            <div className="text-white font-semibold">{classItem.discipline}</div>
                            <div className="text-gray-400 text-sm">{classItem.instructor}</div>
                          </div>
                          <Badge variant="outline" className="border-blue-400 text-blue-400">
                            {classItem.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section id="instructors" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">INSTRUCTORES MAESTROS</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8" />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Aprende de luchadores de clase mundial y maestros certificados de su oficio.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Mike Tyson", discipline: "Boxeo & K-1", experience: "15+ Años", achievements: "Ex Campeón WBC", image: "/images/instructor/mikeTyson.jpeg" },
              { name: "Rodtang Jitmuangnon", discipline: "Muay Thai", experience: "20+ Años", achievements: "Campeón ONE Championship ", image: "/images/instructor/roadTang.jpeg" },
              { name: "Leandro Lo", discipline: "Jiu-Jitsu Brasileño", experience: "18+ Años", achievements: "Cinturón Negro", image: "/images/instructor/leandro.jpeg" },
              { name: "Llia Topuria", discipline: "Artes Marciales Mixtas", experience: "12+ Años", achievements: "Doble Campeon UFC", image: "/images/instructor/topuria.jpeg" },
            ].map((instructor, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-blue-400 transition-all duration-300">
                <div className="relative overflow-hidden">
                  <Image src={instructor.image} alt={instructor.name} width={300} height={400} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-xl font-bold">{instructor.name}</CardTitle>
                  <CardDescription className="text-blue-400 font-semibold">{instructor.discipline}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <Award className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">{instructor.experience}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{instructor.achievements}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section id="membership" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">PLANES DE MEMBRESÍA</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8" />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Elige el camino que se adapte a tu viaje guerrero.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Guerrero", price: "$99", period: "/mes", features: ["Clases grupales ilimitadas", "Acceso a todas las disciplinas", "Acceso a vestuarios", "Uso básico de equipo"], popular: false },
              { name: "Samurái", price: "$149", period: "/mes", features: ["Todo lo del plan Guerrero", "2 sesiones de entrenamiento personal", "Reserva prioritaria de clases", "Consulta nutricional", "Acceso al equipo de competición"], popular: true },
              { name: "Shogun", price: "$199", period: "/mes", features: ["Todo lo del plan Samurái", "Entrenamiento personal ilimitado", "Casillero privado", "Pases de invitado (2/mes)", "Seminarios exclusivos"], popular: false },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden ${plan.popular ? "bg-blue-900 border-blue-400 scale-105" : "bg-gray-900 border-gray-700"} transition-all duration-300 hover:scale-105`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-400 text-gray-900 text-center py-2 font-bold text-sm">MÁS POPULAR</div>
                )}
                <CardHeader className={`text-center ${plan.popular ? "pt-12" : ""}`}>
                  <CardTitle className="text-white text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="text-center">
                    <span className="text-4xl font-black text-blue-400">{plan.price}</span>
                    <span className="text-gray-300">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full font-bold ${plan.popular ? "bg-blue-400 hover:bg-blue-500 text-gray-900" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
                    Elegir Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">ENCUENTRA TU DOJO</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-3xl font-bold text-white mb-8">Ponte en Contacto</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-blue-400" />
                  <div>
                    <div className="text-white font-semibold">Ubicación</div>
                    <div className="text-gray-300">Dr. Martín C. Martínez 1627, Montevideo</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-blue-400" />
                  <div>
                    <div className="text-white font-semibold">Teléfono</div>
                    <div className="text-gray-300">(555) 123-DOJO</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-blue-400" />
                  <div>
                    <div className="text-white font-semibold">Email</div>
                    <div className="text-gray-300">info@bushidodojo.com</div>
                  </div>
                </div>
              </div>

              <Separator className="my-8 bg-gray-700" />

              <div>
                <h4 className="text-xl font-bold text-white mb-4">Horarios de Entrenamiento</h4>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes</span>
                    <span>6:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado</span>
                    <span>8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Inicia Tu Camino</h3>
              <form ref={formRef} className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Nombre"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                      required
                      value={values.nombre}
                      onChange={handleChange}
                      onBlur={() => setErrors(validate(values))}
                    />
                    {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="apellido"
                      placeholder="Apellido"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                      required
                      value={values.apellido}
                      onChange={handleChange}
                      onBlur={() => setErrors(validate(values))}
                    />
                    {errors.apellido && <p className="text-red-400 text-sm mt-1">{errors.apellido}</p>}
                  </div>
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo Electrónico"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                    required
                    value={values.email}
                    onChange={handleChange}
                    onBlur={() => setErrors(validate(values))}
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Número de Teléfono"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                    value={values.telefono}
                    onChange={handleChange}
                    onBlur={() => setErrors(validate(values))}
                  />
                  {errors.telefono && <p className="text-red-400 text-sm mt-1">{errors.telefono}</p>}
                </div>
                <div>
                  <select
                    name="disciplina"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                    required
                    value={values.disciplina}
                    onChange={handleChange}
                    onBlur={() => setErrors(validate(values))}
                  >
                    <option value="">Disciplina de Interés</option>
                    {DISCIPLINAS.map((d) => (
                      <option key={d} value={d}>
                        {d === "k1" ? "K-1 Kickboxing" : d === "muay-thai" ? "Muay Thai" : d === "jiu-jitsu" ? "Jiu-Jitsu" : "Boxeo"}
                      </option>
                    ))}
                  </select>
                  {errors.disciplina && <p className="text-red-400 text-sm mt-1">{errors.disciplina}</p>}
                </div>
                <div>
                  <textarea
                    name="mensaje"
                    placeholder="Cuéntanos sobre tus objetivos..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none resize-none"
                    value={values.mensaje}
                    onChange={handleChange}
                    onBlur={() => setErrors(validate(values))}
                  />
                  {errors.mensaje && <p className="text-red-400 text-sm mt-1">{errors.mensaje}</p>}
                </div>

                {/* reCAPTCHA */}
                {isClient && (
    <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="h-5 w-5 text-blue-400" />
        <span className="text-white font-semibold">Verificación de Seguridad</span>
      </div>
      <div className="flex justify-center">
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={handleRecaptchaChange}
            onExpired={() => handleRecaptchaChange(null)}
            onErrored={() => handleRecaptchaChange(null)}
            theme="dark"
            size="normal"
          />
        ) : (
          <div className="text-gray-500 text-sm text-center">
            reCAPTCHA no configurado
          </div>
        )}
      </div>
      {errors.recaptcha && (
        <p className="text-red-400 text-sm mt-3 text-center flex items-center justify-center gap-2">
          <span>⚠️</span>{errors.recaptcha}
        </p>
      )}
    </div>
  )}


                <Button
                  type="submit"
                  disabled={enviando || !isValid}
                  className={`w-full font-bold py-3 text-lg ${isValid && !enviando ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                >
                  {enviando ? "Enviando..." : "Comienza Tu Entrenamiento"}
                </Button>
                {statusMessage && (
                  <p className={`text-center font-medium ${statusMessage.toLowerCase().includes("error") ? "text-red-400" : "text-green-400"}`}>
                    {statusMessage}
                  </p>
                )}
              </form>
            </div>

            {/* Mapa del Dojo - OpenStreetMap Gratuito */}
            <div className="mt-16">
              <div className="bg-gray-800 rounded-lg p-8">
                <div className="text-center mb-6">
                  <MapPin className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">Ubicación del Dojo</h4>
                  <p className="text-gray-300 mb-4">Encuentra fácilmente nuestro dojo</p>
                </div>

                {/* Mapa Interactivo Gratuito */}
                <StaticMap
                  center={{ lat: -34.8996499, lng: -56.1712952 }}
                  zoom={15}
                  className="w-full"
                  title="Fighting Spirit Dojo"
                  address="Dr. Martín C. Martínez 1627, Montevideo"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Swords className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">Fighting Spirit Dojo</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2025 Dojo Bushido. Todos los derechos reservados.</p>
              <p className="text-sm mt-1">Forja tu espíritu guerrero con honor y disciplina.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
