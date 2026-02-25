"use client";
import { Target, Shield, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlanInfo, PlanSlug } from "@/lib/data/planes";

export default function ModalPlan({
  info,
  onClose,
  onSelect,
}: {
  info: PlanInfo;
  onClose: () => void;
  onSelect: (slug: PlanSlug) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-gray-900 text-gray-100 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl modal-card max-h-[90vh] overflow-y-auto">
        {/* Header con precio destacado */}
        <div
          className={`relative bg-gradient-to-br ${
            info.color === "blue"
              ? "from-blue-900 to-blue-800"
              : info.color === "gold"
              ? "from-yellow-900 to-yellow-800"
              : "from-gray-800 to-gray-700"
          } p-8`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-900 rounded-full px-3 py-1 text-sm font-bold"
            aria-label="Cerrar modal"
          >
            ✕
          </button>

          <div className="text-center">
            {info.popular && (
              <div className="inline-block bg-blue-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold mb-4">
                MÁS POPULAR
              </div>
            )}
            <h2 className="text-4xl font-black mb-2">{info.name}</h2>
            <p className="text-gray-300 mb-4">{info.tagline}</p>
            <div className="text-center mb-4">
              <span
                className={`text-6xl font-black ${
                  info.color === "blue"
                    ? "text-blue-400"
                    : info.color === "gold"
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                {info.price}
              </span>
              <span className="text-gray-300 text-xl">{info.period}</span>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8">
          <p className="text-gray-300 text-lg leading-relaxed mb-6">{info.description}</p>

          {/* Ideal para */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" /> Ideal para
            </h3>
            <p className="text-gray-300">{info.ideal}</p>
          </div>

          {/* Características incluidas */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" /> Características incluidas
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {info.extendedFeatures.map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full ${
                      info.color === "blue"
                        ? "bg-blue-400"
                        : info.color === "gold"
                        ? "bg-yellow-400"
                        : "bg-gray-400"
                    } flex-shrink-0`}
                  ></span>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Beneficios */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" /> Beneficios clave
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {info.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Button
            className={`w-full font-bold text-lg py-4 ${
              info.color === "blue"
                ? "bg-blue-600 hover:bg-blue-700"
                : info.color === "gold"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-gray-600 hover:bg-gray-700"
            } text-white`}
            onClick={() => onSelect(info.slug)}
          >
            Quiero el plan {info.name} 🥋
          </Button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Sin compromisos a largo plazo • Cancela cuando quieras
          </p>
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
