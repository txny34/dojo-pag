export type Instructor = {
  name: string;
  discipline: string;
  experience: string;
  achievements: string;
  image: string;
};

export const INSTRUCTORES: Instructor[] = [
  {
    name: "Mike Tyson",
    discipline: "Boxeo & K-1",
    experience: "15+ Años",
    achievements: "Ex Campeón WBC",
    image: "/images/instructor/mikeTyson.jpeg",
  },
  {
    name: "Rodtang Jitmuangnon",
    discipline: "Muay Thai",
    experience: "20+ Años",
    achievements: "Campeón ONE Championship",
    image: "/images/instructor/roadTang.jpeg",
  },
  {
    name: "Leandro Lo",
    discipline: "Jiu-Jitsu Brasileño",
    experience: "18+ Años",
    achievements: "Cinturón Negro",
    image: "/images/instructor/leandro.jpeg",
  },
  {
    name: "Llia Topuria",
    discipline: "Artes Marciales Mixtas",
    experience: "12+ Años",
    achievements: "Doble Campeon UFC",
    image: "/images/instructor/topuria.jpeg",
  },
];
