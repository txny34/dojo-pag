"use client";
import Image from "next/image";
import { Award } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { INSTRUCTORES } from "@/lib/data/instructores";
import { DOJO_CONFIG } from "@/lib/data/dojo.config";
import type { Disciplina } from "@/lib/contact-form";

interface Props {
  onSelectDisciplina: (slug: Disciplina) => void;
}

export default function InstructorsSection({ onSelectDisciplina }: Props) {
  return (
    <section id="instructors" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">INSTRUCTORES MAESTROS</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8" />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Aprende de luchadores de clase mundial y maestros certificados de su oficio.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-16 text-center">
            {DOJO_CONFIG.stats.map((stat) => (
              <div key={stat.label} className="bg-gray-800/60 rounded-xl py-4 px-2 border border-gray-700">
                <div className="text-3xl font-black text-blue-400">{stat.value}</div>
                <div className="text-gray-400 text-xs mt-1 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {INSTRUCTORES.map((instructor, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="relative h-[460px] rounded-2xl overflow-hidden group cursor-pointer ring-2 ring-transparent hover:ring-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 hover:shadow-2xl">
                <div className={`absolute top-0 inset-x-0 h-1 z-10 ${instructor.accentColor}`} />
                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                  {instructor.experience}
                </div>
                <Image
                  src={instructor.image}
                  alt={instructor.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <h3 className="text-white text-xl font-black leading-tight">{instructor.name}</h3>
                  <p className={`text-sm font-semibold mb-1 ${instructor.textColor}`}>{instructor.discipline}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <Award className="h-3 w-3 text-blue-400 shrink-0" />
                    <span>{instructor.achievements}</span>
                  </div>
                  <div className="max-h-0 overflow-hidden group-hover:max-h-56 transition-all duration-500 ease-out">
                    <div className="pt-4 space-y-3">
                      <p className="text-gray-300 text-xs italic leading-relaxed">
                        &ldquo;{instructor.quote}&rdquo;
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {instructor.specialty.map((s) => (
                          <span
                            key={s}
                            className="text-[11px] bg-white/10 backdrop-blur-sm text-gray-200 px-2 py-0.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      {instructor.disciplinaSlug ? (
                        <button
                          onClick={() => onSelectDisciplina(instructor.disciplinaSlug!)}
                          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
                        >
                          Entrenar con {instructor.name.split(" ")[0]}
                        </button>
                      ) : (
                        <button
                          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                          className="w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold text-sm transition-colors"
                        >
                          Consultar disponibilidad
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
