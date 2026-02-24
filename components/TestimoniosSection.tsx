"use client";

import { Star } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { TESTIMONIOS } from "@/lib/data/testimonios";

export default function TestimoniosSection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">

        {/* Header */}
        <FadeIn>
          <div className="text-center mb-6">
            <h2 className="text-5xl font-black text-white mb-6">LO QUE DICEN NUESTROS ALUMNOS</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8" />
          </div>
        </FadeIn>

        {/* Rating global */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col items-center gap-2 mb-16">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-white font-black text-2xl">4.9 / 5</p>
            <p className="text-gray-400 text-sm">Basado en +127 reseñas de alumnos verificados</p>
          </div>
        </FadeIn>

        {/* Grid de testimonios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {TESTIMONIOS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="h-full bg-gray-800 border border-gray-700 hover:border-blue-400/40 rounded-2xl p-6 flex flex-col gap-4 transition-colors duration-300">
                {/* Estrellas */}
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, si) => (
                    <Star key={si} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Cita */}
                <p className="text-gray-300 text-sm leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Autor */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-700">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0 ${t.avatarColor}`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.discipline} · {t.since}</p>
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
