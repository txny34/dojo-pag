"use client";
import { useState } from "react";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import ModalDisciplina from "@/components/ModalDisciplina";
import { DISCIPLINAS_INFO } from "@/lib/data/disciplinas";
import { titleToSlug, type Disciplina } from "@/lib/contact-form";

const DISCIPLINAS_CARDS = [
  {
    title: "K-1 Kickboxing",
    description: "Golpeo de alta intensidad combinando puñetazos, patadas y rodillazos para una potencia devastadora.",
    image: "/images/disciplines/kickBoxing.jpeg",
    accentColor: "bg-purple-500",
    textColor: "text-purple-400",
    tags: ["Alta Intensidad", "Golpeo", "Cardio Extremo"],
    num: "01",
  },
  {
    title: "Muay Thai",
    description: "El arte de las ocho extremidades — puños, codos, rodillas y espinillas en perfecta armonía.",
    image: "/images/disciplines/muyThai.jpeg",
    accentColor: "bg-red-500",
    textColor: "text-red-400",
    tags: ["8 Extremidades", "Contacto Completo", "Tradición"],
    num: "02",
  },
  {
    title: "Boxeo",
    description: "La dulce ciencia del juego de piernas, timing y golpeo preciso que forja campeones.",
    image: "/images/disciplines/boxeo.jpeg",
    accentColor: "bg-orange-500",
    textColor: "text-orange-400",
    tags: ["Timing", "Movimiento de Pies", "Defensa"],
    num: "03",
  },
  {
    title: "Jiu-Jitsu",
    description: "El arte suave — dominá el suelo con técnica, apalancamiento y sumisiones que no requieren fuerza bruta.",
    image: "/images/disciplines/bjj.jpeg",
    accentColor: "bg-green-500",
    textColor: "text-green-400",
    tags: ["Grappling", "Sumisiones", "Apalancamiento"],
    num: "04",
  },
];

interface Props {
  onSelectDisciplina: (slug: Disciplina) => void;
}

export default function DisciplinesSection({ onSelectDisciplina }: Props) {
  const [openModal, setOpenModal] = useState<Disciplina | null>(null);

  const handleSelect = (slug: Disciplina) => {
    setOpenModal(null);
    onSelectDisciplina(slug);
  };

  return (
    <section id="disciplines" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">DISCIPLINAS MARCIALES</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8" />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Domina múltiples artes de combate bajo un mismo techo con instrucción de clase mundial.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {DISCIPLINAS_CARDS.map((discipline, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div
                className="relative h-[420px] rounded-2xl overflow-hidden group cursor-pointer ring-2 ring-transparent hover:ring-white/20 transition-all duration-300 shadow-lg"
                onClick={() => {
                  const slug = titleToSlug(discipline.title);
                  if (slug) setOpenModal(slug);
                }}
              >
                <div className={`absolute top-0 inset-x-0 h-1 z-10 ${discipline.accentColor}`} />
                <div className={`absolute top-4 left-4 z-10 text-5xl font-black opacity-20 ${discipline.textColor} select-none leading-none`}>
                  {discipline.num}
                </div>
                <Image
                  src={discipline.image}
                  alt={discipline.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/50 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <h3 className={`text-xl font-black mb-1 ${discipline.textColor}`}>{discipline.title}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {discipline.tags.map((tag) => (
                      <span key={tag} className="text-[11px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-400 ease-out">
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">{discipline.description}</p>
                    <div className={`inline-flex items-center gap-1.5 text-sm font-semibold ${discipline.textColor}`}>
                      <span>Explorar disciplina</span>
                      <span className="text-lg leading-none">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {openModal && (
        <ModalDisciplina
          info={DISCIPLINAS_INFO[openModal]}
          onClose={() => setOpenModal(null)}
          onSelect={handleSelect}
        />
      )}
    </section>
  );
}
