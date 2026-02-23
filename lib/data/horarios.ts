export type ClaseHorario = {
  time: string;
  discipline: string;
  instructor: string;
  level: string;
};

export type DiaHorario = {
  day: string;
  classes: ClaseHorario[];
};

export const HORARIOS: DiaHorario[] = [
  {
    day: "Lunes",
    classes: [
      { time: "6:00 AM", discipline: "Boxeo", instructor: "Sensei Takeshi", level: "Todos los Niveles" },
      { time: "7:00 PM", discipline: "Muay Thai", instructor: "Kru Somchai", level: "Intermedio" },
    ],
  },
  {
    day: "Martes",
    classes: [
      { time: "6:30 AM", discipline: "Jiu-Jitsu", instructor: "Professor Silva", level: "Principiante" },
      { time: "7:30 PM", discipline: "K-1", instructor: "Coach Yamamoto", level: "Avanzado" },
    ],
  },
  {
    day: "Miércoles",
    classes: [
      { time: "6:00 AM", discipline: "Boxeo", instructor: "Sensei Takeshi", level: "Todos los Niveles" },
      { time: "7:00 PM", discipline: "Muay Thai", instructor: "Kru Somchai", level: "Principiante" },
    ],
  },
  {
    day: "Jueves",
    classes: [
      { time: "6:30 AM", discipline: "Jiu-Jitsu", instructor: "Professor Silva", level: "Intermedio" },
      { time: "7:30 PM", discipline: "K-1", instructor: "Coach Yamamoto", level: "Todos los Niveles" },
    ],
  },
  {
    day: "Viernes",
    classes: [
      { time: "6:00 AM", discipline: "Boxeo", instructor: "Sensei Takeshi", level: "Avanzado" },
      { time: "7:00 PM", discipline: "Mat Abierto", instructor: "Todos los Instructores", level: "Todos los Niveles" },
    ],
  },
];
