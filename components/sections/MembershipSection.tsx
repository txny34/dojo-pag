"use client";
import { useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/FadeIn";
import ModalPlan from "@/components/ModalPlan";
import { PLANES_INFO, type PlanSlug } from "@/lib/data/planes";
import { DOJO_CONFIG } from "@/lib/data/dojo.config";

const PLANES_CARDS = [
  {
    name: "Guerrero",
    planSlug: "guerrero" as const,
    price: "$99",
    period: "/mes",
    description: "Perfecto para comenzar tu viaje marcial.",
    features: [
      "Clases grupales ilimitadas",
      "Acceso a todas las disciplinas",
      "Acceso a vestuarios",
      "Uso básico de equipo",
    ],
    popular: false,
    highlight: false,
  },
  {
    name: "Samurái",
    planSlug: "samurai" as const,
    price: "$149",
    period: "/mes",
    description: "El balance ideal para progresar rápido.",
    features: [
      "Todo lo del plan Guerrero",
      "2 sesiones de entrenamiento personal",
      "Reserva prioritaria de clases",
      "Consulta nutricional",
      "Acceso al equipo de competición",
    ],
    popular: true,
    highlight: true,
  },
  {
    name: "Shogun",
    planSlug: "shogun" as const,
    price: "$199",
    period: "/mes",
    description: "La experiencia definitiva para élite.",
    features: [
      "Todo lo del plan Samurái",
      "Entrenamiento personal ilimitado",
      "Casillero privado",
      "Pases de invitado (2/mes)",
      "Seminarios exclusivos",
    ],
    popular: false,
    highlight: false,
  },
];

interface Props {
  onSelectPlan: (slug: PlanSlug) => void;
}

export default function MembershipSection({ onSelectPlan }: Props) {
  const [openPlanModal, setOpenPlanModal] = useState<PlanSlug | null>(null);

  const handleSelect = (slug: PlanSlug) => {
    setOpenPlanModal(null);
    onSelectPlan(slug);
  };

  return (
    <section id="membership" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">PLANES DE MEMBRESÍA</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8" />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Elige el camino que se adapte a tu viaje guerrero.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {PLANES_CARDS.map((plan, index) => (
            <FadeIn key={index} delay={index * 0.12}>
              <div
                className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 ${
                  plan.popular
                    ? "bg-gray-900 border-blue-400 shadow-[0_0_40px_rgba(96,165,250,0.25)] scale-105"
                    : "bg-gray-900 border-gray-700 hover:border-gray-500"
                }`}
              >
                {plan.popular && (
                  <div className="flex items-center justify-center gap-1.5 bg-blue-500 text-white text-xs font-black py-2 px-4 tracking-widest uppercase">
                    <Star className="h-3 w-3 fill-white" />
                    Más Popular
                    <Star className="h-3 w-3 fill-white" />
                  </div>
                )}

                <div className="flex flex-col flex-1 p-7">
                  <div className="mb-6">
                    <h3 className="text-white text-2xl font-black mb-1">{plan.name}</h3>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  <div className="flex items-end gap-1 mb-6">
                    <span className={`text-5xl font-black ${plan.popular ? "text-blue-400" : "text-white"}`}>
                      {plan.price}
                    </span>
                    <span className="text-gray-400 mb-1.5">{plan.period}</span>
                  </div>

                  <div className={`h-px mb-6 ${plan.popular ? "bg-blue-400/30" : "bg-gray-700"}`} />

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <CheckCircle2
                          className={`h-4 w-4 mt-0.5 shrink-0 ${plan.popular ? "text-blue-400" : "text-gray-500"}`}
                        />
                        <span className="text-gray-300 text-sm leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full font-bold text-base py-5 rounded-xl ${
                      plan.popular
                        ? "bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/30"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                    onClick={() => setOpenPlanModal(plan.planSlug)}
                  >
                    {plan.popular ? "Empezar ahora" : "Elegir plan"}
                  </Button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-12 text-gray-500 text-sm">
          {DOJO_CONFIG.trustItems.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {openPlanModal && (
          <ModalPlan
            info={PLANES_INFO[openPlanModal]}
            onClose={() => setOpenPlanModal(null)}
            onSelect={handleSelect}
          />
        )}
      </div>
    </section>
  );
}
