export type Nivel = "Principiante" | "Intermedio" | "Avanzado";

export type DisciplinaInfo = {
  slug: "boxeo" | "muay-thai" | "k1" | "jiu-jitsu";
  title: string;
  descripcion: string;
  beneficios: string[];
  niveles: Nivel[];
  duracion: string;
  equipamiento: string[];
  imagen: string;
};

export const DISCIPLINAS_INFO: Record<"boxeo" | "muay-thai" | "k1" | "jiu-jitsu", DisciplinaInfo> = {
  k1: {
    slug: "k1",
    title: "K-1 Kickboxing",
    descripcion: "Golpeo de alta intensidad combinando puñetazos, patadas y rodillazos.",
    beneficios: [
      "Quema de calorías acelerada",
      "Mejora el cardio y la potencia",
      "Reflejos y timing",
      "Técnica de golpeo completa",
      "Gestión del estrés",
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
      "Resistencia mental",
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
      "Reducción del estrés",
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
      "Comunidad y respeto",
    ],
    niveles: ["Principiante", "Intermedio", "Avanzado"],
    duracion: "60 min",
    equipamiento: ["Gi (Kimono) o Rashguard (No-Gi)", "Protector bucal"],
    imagen: "/images/disciplines/bjj.jpeg",
  },
};
