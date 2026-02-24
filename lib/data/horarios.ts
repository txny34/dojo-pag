export type ClaseHorario = {
  time: string;
  discipline: string;
  instructor: string;
  level: string;
};

export type DiaHorario = {
  day: string;
  dayIndex: number; // matches Date.getDay() — 0=Dom, 1=Lun ... 6=Sáb
  classes: ClaseHorario[];
};

export const HORARIOS: DiaHorario[] = [
  {
    day: "Lunes",
    dayIndex: 1,
    classes: [
      { time: "6:00 AM", discipline: "Boxeo",     instructor: "Sensei Takeshi", level: "Todos los Niveles" },
      { time: "7:00 PM", discipline: "Muay Thai", instructor: "Kru Somchai",    level: "Intermedio"        },
    ],
  },
  {
    day: "Martes",
    dayIndex: 2,
    classes: [
      { time: "6:30 AM", discipline: "Jiu-Jitsu", instructor: "Professor Silva", level: "Principiante" },
      { time: "7:30 PM", discipline: "K-1",        instructor: "Coach Yamamoto", level: "Avanzado"     },
    ],
  },
  {
    day: "Miércoles",
    dayIndex: 3,
    classes: [
      { time: "6:00 AM", discipline: "Boxeo",     instructor: "Sensei Takeshi", level: "Todos los Niveles" },
      { time: "7:00 PM", discipline: "Muay Thai", instructor: "Kru Somchai",    level: "Principiante"     },
    ],
  },
  {
    day: "Jueves",
    dayIndex: 4,
    classes: [
      { time: "6:30 AM", discipline: "Jiu-Jitsu", instructor: "Professor Silva", level: "Intermedio"        },
      { time: "7:30 PM", discipline: "K-1",        instructor: "Coach Yamamoto", level: "Todos los Niveles" },
    ],
  },
  {
    day: "Viernes",
    dayIndex: 5,
    classes: [
      { time: "6:00 AM", discipline: "Boxeo",       instructor: "Sensei Takeshi",        level: "Avanzado"         },
      { time: "7:00 PM", discipline: "Mat Abierto", instructor: "Todos los Instructores", level: "Todos los Niveles" },
    ],
  },
];
