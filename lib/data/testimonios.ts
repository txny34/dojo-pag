export type Testimonio = {
  name: string;
  discipline: string;
  since: string;
  rating: number;
  quote: string;
  initials: string;
  avatarColor: string;
};

export const TESTIMONIOS: Testimonio[] = [
  {
    name: "Carlos M.",
    discipline: "Boxeo",
    since: "8 meses entrenando",
    rating: 5,
    quote: "Perdí 15kg y gané una confianza que nunca había sentido. Los instructores te exigen pero siempre están para vos.",
    initials: "CM",
    avatarColor: "bg-orange-500",
  },
  {
    name: "Valentina S.",
    discipline: "Muay Thai",
    since: "1 año entrenando",
    rating: 5,
    quote: "Vine sin experiencia y hoy compito a nivel amateur. El ambiente del dojo es increíble, como una familia.",
    initials: "VS",
    avatarColor: "bg-red-500",
  },
  {
    name: "Diego R.",
    discipline: "Jiu-Jitsu",
    since: "6 meses entrenando",
    rating: 5,
    quote: "Nunca imaginé aprender tan rápido. La metodología de enseñanza es de otro nivel, muy diferente a otros gimnasios.",
    initials: "DR",
    avatarColor: "bg-green-500",
  },
  {
    name: "Sofía L.",
    discipline: "K-1 Kickboxing",
    since: "3 meses entrenando",
    rating: 5,
    quote: "Quería algo diferente al gym tradicional. Esto superó todas mis expectativas. Lo recomiendo sin dudar.",
    initials: "SL",
    avatarColor: "bg-purple-500",
  },
  {
    name: "Martín C.",
    discipline: "Muay Thai",
    since: "2 años entrenando",
    rating: 5,
    quote: "Fui campeón regional gracias a la formación de este dojo. Los instructores te preparan mentalmente tanto como físicamente.",
    initials: "MC",
    avatarColor: "bg-blue-500",
  },
  {
    name: "Ana P.",
    discipline: "Boxeo",
    since: "4 meses entrenando",
    rating: 5,
    quote: "En serio, lo mejor que hice por mi salud. No solo perdí peso sino que aprendí a defenderme y tengo más energía que nunca.",
    initials: "AP",
    avatarColor: "bg-pink-500",
  },
];
