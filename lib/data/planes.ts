export type PlanSlug = "guerrero" | "samurai" | "shogun";

export type PlanInfo = {
  slug: PlanSlug;
  name: string;
  price: string;
  period: string;
  tagline: string;
  description: string;
  features: string[];
  extendedFeatures: string[];
  ideal: string;
  benefits: string[];
  popular: boolean;
  color: string;
};

export const PLANES_INFO: Record<PlanSlug, PlanInfo> = {
  guerrero: {
    slug: "guerrero",
    name: "Guerrero",
    price: "$99",
    period: "/mes",
    tagline: "Perfecto para comenzar tu viaje",
    description:
      "Ideal para principiantes que buscan introducirse al mundo de las artes marciales con acceso completo a todas nuestras disciplinas.",
    features: [
      "Clases grupales ilimitadas",
      "Acceso a todas las disciplinas",
      "Acceso a vestuarios",
      "Uso básico de equipo",
    ],
    extendedFeatures: [
      "Hasta 5 clases por semana",
      "Acceso a duchas y casilleros temporales",
      "Kit de bienvenida con camiseta del dojo",
      "Evaluación inicial gratuita",
      "Acceso a eventos comunitarios",
    ],
    ideal: "Principiantes y estudiantes",
    benefits: [
      "Rutina estructurada",
      "Comunidad de apoyo",
      "Flexibilidad de horarios",
      "Base sólida en fundamentos",
    ],
    popular: false,
    color: "gray",
  },
  samurai: {
    slug: "samurai",
    name: "Samurái",
    price: "$149",
    period: "/mes",
    tagline: "El equilibrio perfecto",
    description:
      "Para practicantes serios que buscan acelerar su progreso con entrenamiento personalizado y beneficios premium.",
    features: [
      "Todo lo del plan Guerrero",
      "2 sesiones de entrenamiento personal",
      "Reserva prioritaria de clases",
      "Consulta nutricional",
      "Acceso al equipo de competición",
    ],
    extendedFeatures: [
      "Clases grupales ilimitadas",
      "Plan de entrenamiento personalizado",
      "Seguimiento de progreso mensual",
      "Acceso a seminarios especiales",
      "Descuentos en merchandise del dojo",
      "Casillero semi-permanente",
    ],
    ideal: "Practicantes regulares y atletas amateur",
    benefits: [
      "Progreso acelerado",
      "Atención personalizada",
      "Nutrición optimizada",
      "Preparación para competencias",
    ],
    popular: true,
    color: "blue",
  },
  shogun: {
    slug: "shogun",
    name: "Shogun",
    price: "$199",
    period: "/mes",
    tagline: "La experiencia definitiva",
    description:
      "Para guerreros élite que buscan la máxima dedicación, entrenamiento personal ilimitado y acceso exclusivo a todas las facilidades.",
    features: [
      "Todo lo del plan Samurái",
      "Entrenamiento personal ilimitado",
      "Casillero privado",
      "Pases de invitado (2/mes)",
      "Seminarios exclusivos",
    ],
    extendedFeatures: [
      "Acceso 24/7 al dojo",
      "Sesiones de sparring privadas",
      "Plan nutricional completo",
      "Masajes de recuperación mensuales",
      "Acceso VIP a eventos",
      "Equipo personalizado incluido",
      "Línea directa con instructores",
    ],
    ideal: "Competidores profesionales y entusiastas serios",
    benefits: [
      "Máximo rendimiento",
      "Recuperación optimizada",
      "Acceso exclusivo",
      "Preparación profesional",
    ],
    popular: false,
    color: "gold",
  },
};
