"use client";
import { Clock, Award, Swords } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { DisciplinaInfo } from "@/lib/data/disciplinas";
import type { Disciplina } from "@/lib/contact-form";

export default function ModalDisciplina({
  info,
  onClose,
  onSelect,
}: {
  info: DisciplinaInfo;
  onClose: () => void;
  onSelect: (slug: Disciplina) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-gray-900 text-gray-100 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl modal-card">
        {/* Imagen */}
        <div className="relative">
          <Image
            src={info.imagen}
            alt={info.title}
            width={1200}
            height={600}
            className="w-full h-56 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-900 rounded-full px-3 py-1 text-sm font-bold"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <h2 className="text-2xl font-black mb-2">{info.title}</h2>
          <p className="text-gray-300">{info.descripcion}</p>

          {/* Niveles + Duración */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {info.niveles.map((n) => (
              <span key={n} className="inline-block px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold">
                {n}
              </span>
            ))}
            <span className="inline-flex items-center gap-2 text-sm text-gray-200">
              <Clock className="w-4 h-4" />
              {info.duracion}
            </span>
          </div>

          {/* Beneficios */}
          <div className="mt-5">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" /> Beneficios
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
              {info.beneficios.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipamiento */}
          <div className="mt-5">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Swords className="w-5 h-5 text-blue-400" /> Equipamiento necesario
            </h3>
            <ul className="list-disc ml-5 space-y-1 text-gray-300">
              {info.equipamiento.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700" onClick={() => onSelect(info.slug)}>
            Quiero entrenar {info.title}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          background: rgba(0, 0, 0, 0.6);
          animation: fadeIn 220ms ease-out forwards;
          opacity: 0;
        }
        .modal-card {
          transform: translateY(8px) scale(0.98);
          opacity: 0;
          animation: riseIn 220ms ease-out forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes riseIn {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
