export type Instructor = {
  name: string;
  discipline: string;
  disciplinaSlug: "boxeo" | "muay-thai" | "k1" | "jiu-jitsu" | null;
  experience: string;
  achievements: string;
  specialty: string[];
  quote: string;
  image: string;
  accentColor: string; // clase Tailwind bg-*
  textColor: string;   // clase Tailwind text-*
};

export const INSTRUCTORES: Instructor[] = [
  {
    name: "Mike Tyson",
    discipline: "Boxeo & K-1",
    disciplinaSlug: "boxeo",
    experience: "15+ Años",
    achievements: "Ex Campeón WBC",
    specialty: ["Uppercut explosivo", "Defensa peak-a-boo", "Combinaciones veloces"],
    quote: "El miedo es solo una ilusión. En el ring, la preparación es todo.",
    image: "/images/instructor/mikeTyson.jpeg",
    accentColor: "bg-orange-500",
    textColor: "text-orange-400",
  },
  {
    name: "Rodtang Jitmuangnon",
    discipline: "Muay Thai",
    disciplinaSlug: "muay-thai",
    experience: "20+ Años",
    achievements: "Campeón ONE Championship",
    specialty: ["Codos devastadores", "Teep frontal", "Clinch dominante"],
    quote: "El Muay Thai no es solo un deporte, es un estilo de vida.",
    image: "/images/instructor/roadTang.jpeg",
    accentColor: "bg-red-500",
    textColor: "text-red-400",
  },
  {
    name: "Leandro Lo",
    discipline: "Jiu-Jitsu Brasileño",
    disciplinaSlug: "jiu-jitsu",
    experience: "18+ Años",
    achievements: "9x Campeón Mundial",
    specialty: ["Guard game élite", "Barridos creativos", "Sumisiones precisas"],
    quote: "El Jiu-Jitsu es el arte de ser más eficiente con menos energía.",
    image: "/images/instructor/leandro.jpeg",
    accentColor: "bg-green-500",
    textColor: "text-green-400",
  },
  {
    name: "Ilia Topuria",
    discipline: "Artes Marciales Mixtas",
    disciplinaSlug: null,
    experience: "12+ Años",
    achievements: "Doble Campeón UFC",
    specialty: ["KO power", "Grappling élite", "Control de octágono"],
    quote: "Vine de la nada y le mostré al mundo todo.",
    image: "/images/instructor/topuria.jpeg",
    accentColor: "bg-purple-500",
    textColor: "text-purple-400",
  },
];
