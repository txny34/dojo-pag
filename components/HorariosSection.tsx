"use client";

import { useState, useEffect, useMemo } from "react";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HORARIOS, type ClaseHorario } from "@/lib/data/horarios";

type Disciplina = "boxeo" | "muay-thai" | "k1" | "jiu-jitsu";

interface HorariosSectionProps {
  onReservar: (disciplina: Disciplina) => void;
}

// ─── helpers de módulo ────────────────────────────────────────────────────────

function parseTimeToMinutes(timeStr: string): number {
  const [rawTime, period] = timeStr.split(" ");
  const [hStr, mStr] = rawTime.split(":");
  let hours = parseInt(hStr, 10);
  const minutes = parseInt(mStr, 10);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function secondsUntil(targetDayIndex: number, timeStr: string, now: Date): number {
  const targetMins = parseTimeToMinutes(timeStr);
  const nowDayIndex = now.getDay();
  const nowTotalSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const targetTotalSecs = targetMins * 60;

  let daysDiff = targetDayIndex - nowDayIndex;
  if (daysDiff < 0) daysDiff += 7;
  if (daysDiff === 0 && targetTotalSecs <= nowTotalSecs) daysDiff = 7;

  return daysDiff * 86400 + (targetTotalSecs - nowTotalSecs);
}

type FlatClass = { dayIndex: number; day: string; clase: ClaseHorario };

function findNextClasses(now: Date, count: number): FlatClass[] {
  const flat: FlatClass[] = HORARIOS.flatMap((dia) =>
    dia.classes.map((clase) => ({ dayIndex: dia.dayIndex, day: dia.day, clase }))
  );
  return flat
    .map((fc) => ({ fc, secs: secondsUntil(fc.dayIndex, fc.clase.time, now) }))
    .sort((a, b) => a.secs - b.secs)
    .slice(0, count)
    .map((x) => x.fc);
}

const DISCIPLINE_SLUG: Record<string, Disciplina | null> = {
  "Boxeo":       "boxeo",
  "Muay Thai":   "muay-thai",
  "K-1":         "k1",
  "Jiu-Jitsu":   "jiu-jitsu",
  "Mat Abierto": null,
};

const LEVEL_COLOR: Record<string, string> = {
  "Principiante":      "border-green-400 text-green-400",
  "Intermedio":        "border-yellow-400 text-yellow-400",
  "Avanzado":          "border-red-400 text-red-400",
  "Todos los Niveles": "border-blue-400 text-blue-400",
};

const DISCIPLINE_COLOR: Record<string, string> = {
  "Boxeo":       "text-orange-400",
  "Muay Thai":   "text-red-400",
  "K-1":         "text-purple-400",
  "Jiu-Jitsu":   "text-green-400",
  "Mat Abierto": "text-blue-400",
};

const pad = (n: number) => String(n).padStart(2, "0");

function formatCountdown(secs: number): string {
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (d > 0) return `${d}d ${pad(h)}h ${pad(m)}m`;
  if (h > 0) return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  return `${pad(m)}m ${pad(s)}s`;
}

// ─── sub-componente tarjeta de clase ─────────────────────────────────────────

function ClaseCard({
  clase,
  onReservar,
}: {
  clase: ClaseHorario;
  onReservar: (d: Disciplina) => void;
}) {
  const slug = DISCIPLINE_SLUG[clase.discipline];
  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700/60 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className={`font-bold text-lg ${DISCIPLINE_COLOR[clase.discipline] ?? "text-blue-400"}`}>
            {clase.time}
          </div>
          <div className="text-white font-semibold">{clase.discipline}</div>
          <div className="text-gray-400 text-sm">{clase.instructor}</div>
        </div>
        <Badge
          variant="outline"
          className={`shrink-0 ${LEVEL_COLOR[clase.level] ?? "border-blue-400 text-blue-400"}`}
        >
          {clase.level}
        </Badge>
      </div>
      <Button
        size="sm"
        disabled={!slug}
        onClick={() => slug && onReservar(slug)}
        className={`w-full font-semibold ${
          slug
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-700 text-gray-500 cursor-not-allowed"
        }`}
      >
        {slug ? "Reservar clase" : "Mat Abierto — sin reserva"}
      </Button>
    </div>
  );
}

// ─── componente principal ─────────────────────────────────────────────────────

export default function HorariosSection({ onReservar }: HorariosSectionProps) {
  const [filterDiscipline, setFilterDiscipline] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "grilla">("cards");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const allDisciplines = useMemo(
    () => [...new Set(HORARIOS.flatMap((d) => d.classes.map((c) => c.discipline)))],
    []
  );
  const allLevels = useMemo(
    () => [...new Set(HORARIOS.flatMap((d) => d.classes.map((c) => c.level)))],
    []
  );

  const filteredHorarios = useMemo(
    () =>
      HORARIOS.map((dia) => ({
        ...dia,
        classes: dia.classes.filter((c) => {
          const discOk = filterDiscipline === null || c.discipline === filterDiscipline;
          const levelOk = filterLevel === null || c.level === filterLevel;
          return discOk && levelOk;
        }),
      })).filter((dia) => dia.classes.length > 0),
    [filterDiscipline, filterLevel]
  );

  const nextClasses = useMemo(() => (now ? findNextClasses(now, 3) : []), [now]);

  const countdownSecs = useMemo(() => {
    if (!now || nextClasses.length === 0) return 0;
    return secondsUntil(nextClasses[0].dayIndex, nextClasses[0].clase.time, now);
  }, [now, nextClasses]);

  const todayIndex = now?.getDay() ?? -1;

  // ─── render ───────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Banner próxima clase */}
      {nextClasses.length > 0 && (
        <div className="mb-8 p-5 bg-blue-900/40 border border-blue-500/50 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">
              Próxima clase
            </p>
            <p className="text-white text-xl font-bold">
              {nextClasses[0].clase.discipline} — {nextClasses[0].day} a las {nextClasses[0].clase.time}
            </p>
            <p className="text-gray-400 text-sm">{nextClasses[0].clase.instructor}</p>
          </div>
          <div className="text-center shrink-0">
            <div className="text-4xl font-black text-blue-400 tabular-nums tracking-tight">
              {formatCountdown(countdownSecs)}
            </div>
            <div className="text-gray-500 text-xs mt-1">tiempo restante</div>
          </div>
        </div>
      )}

      {/* Strip próximas 3 clases */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {nextClasses.map((fc, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg border text-sm ${
              i === 0
                ? "bg-blue-900/30 border-blue-500/60"
                : "bg-gray-900 border-gray-700"
            }`}
          >
            <span className="block text-gray-400 text-xs mb-1">
              {i === 0 ? "Siguiente" : i === 1 ? "2ª próxima" : "3ª próxima"}
            </span>
            <span className={`font-bold ${DISCIPLINE_COLOR[fc.clase.discipline] ?? "text-blue-400"}`}>
              {fc.clase.discipline}
            </span>
            <span className="text-gray-300 ml-2">
              {fc.day} {fc.clase.time}
            </span>
          </div>
        ))}
      </div>

      {/* Controles: filtros + toggle de vista */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Filtro disciplina */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-gray-400 text-sm font-medium mr-1">Disciplina:</span>
          <button
            onClick={() => setFilterDiscipline(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filterDiscipline === null
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Todas
          </button>
          {allDisciplines.map((d) => (
            <button
              key={d}
              onClick={() => setFilterDiscipline(filterDiscipline === d ? null : d)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterDiscipline === d
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Filtro nivel */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-gray-400 text-sm font-medium mr-1">Nivel:</span>
          <button
            onClick={() => setFilterLevel(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filterLevel === null
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Todos
          </button>
          {allLevels.map((l) => (
            <button
              key={l}
              onClick={() => setFilterLevel(filterLevel === l ? null : l)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterLevel === l
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Toggle vista */}
        <div className="flex gap-2 self-end">
          <Button
            size="sm"
            onClick={() => setViewMode("cards")}
            className={
              viewMode === "cards"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
            }
          >
            Cards
          </Button>
          <Button
            size="sm"
            onClick={() => setViewMode("grilla")}
            className={
              viewMode === "grilla"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
            }
          >
            Grilla semanal
          </Button>
        </div>
      </div>

      {/* Vista Cards */}
      {viewMode === "cards" && (
        <div className="grid gap-6">
          {filteredHorarios.map((dia) => {
            const isToday = dia.dayIndex === todayIndex;
            return (
              <Card
                key={dia.day}
                className={`bg-gray-900 transition-all duration-300 ${
                  isToday
                    ? "border-blue-400 shadow-[0_0_20px_2px_rgba(96,165,250,0.35)]"
                    : "border-gray-700"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-white text-2xl font-bold flex items-center gap-3">
                    <Clock className="h-6 w-6 text-blue-400" />
                    {dia.day}
                    {isToday && (
                      <Badge className="bg-blue-500 text-white text-xs font-bold">
                        HOY
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {dia.classes.map((clase, ci) => (
                      <ClaseCard key={ci} clase={clase} onReservar={onReservar} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filteredHorarios.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No hay clases para los filtros seleccionados.
            </div>
          )}
        </div>
      )}

      {/* Vista Grilla semanal */}
      {viewMode === "grilla" && (() => {
        const allTimes = [
          ...new Set(filteredHorarios.flatMap((d) => d.classes.map((c) => c.time))),
        ].sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));

        if (filteredHorarios.length === 0) {
          return (
            <div className="text-center text-gray-400 py-12">
              No hay clases para los filtros seleccionados.
            </div>
          );
        }

        return (
          <div className="overflow-x-auto rounded-xl border border-gray-700">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-900">
                  <th className="p-3 text-left text-gray-400 font-semibold border-b border-gray-700 w-24">
                    Hora
                  </th>
                  {filteredHorarios.map((dia) => {
                    const isToday = dia.dayIndex === todayIndex;
                    return (
                      <th
                        key={dia.day}
                        className={`p-3 text-center font-semibold border-b border-gray-700 ${
                          isToday ? "text-blue-400 bg-blue-900/20" : "text-white"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {dia.day}
                          {isToday && (
                            <Badge className="bg-blue-500 text-white text-[10px] py-0 px-1">
                              HOY
                            </Badge>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {allTimes.map((timeSlot) => (
                  <tr key={timeSlot} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="p-3 text-blue-400 font-bold align-top whitespace-nowrap">
                      {timeSlot}
                    </td>
                    {filteredHorarios.map((dia) => {
                      const clase = dia.classes.find((c) => c.time === timeSlot);
                      const isToday = dia.dayIndex === todayIndex;
                      return (
                        <td
                          key={dia.day}
                          className={`p-2 align-top ${isToday ? "bg-blue-900/10" : ""}`}
                        >
                          {clase ? (
                            <div className="flex flex-col gap-1 min-w-[130px]">
                              <span
                                className={`font-semibold ${
                                  DISCIPLINE_COLOR[clase.discipline] ?? "text-white"
                                }`}
                              >
                                {clase.discipline}
                              </span>
                              <span className="text-gray-400 text-xs">{clase.instructor}</span>
                              <Badge
                                variant="outline"
                                className={`text-[10px] w-fit ${
                                  LEVEL_COLOR[clase.level] ?? "border-blue-400 text-blue-400"
                                }`}
                              >
                                {clase.level}
                              </Badge>
                              {(() => {
                                const slug = DISCIPLINE_SLUG[clase.discipline];
                                return (
                                  <button
                                    disabled={!slug}
                                    onClick={() => slug && onReservar(slug)}
                                    className={`text-xs mt-1 px-2 py-1 rounded font-medium transition-colors ${
                                      slug
                                        ? "bg-blue-600/80 hover:bg-blue-600 text-white"
                                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                    }`}
                                  >
                                    {slug ? "Reservar" : "Sin reserva"}
                                  </button>
                                );
                              })()}
                            </div>
                          ) : (
                            <span className="text-gray-700 text-xs">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}
    </div>
  );
}
