import FadeIn from "@/components/FadeIn";
import HorariosSection from "@/components/HorariosSection";
import type { Disciplina } from "@/lib/contact-form";

interface Props {
  onReservar: (slug: Disciplina) => void;
}

export default function ScheduleSection({ onReservar }: Props) {
  return (
    <section id="schedule" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">HORARIO DE CLASES</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8" />
          </div>
        </FadeIn>
        <div className="max-w-6xl mx-auto">
          <HorariosSection onReservar={onReservar} />
        </div>
      </div>
    </section>
  );
}
