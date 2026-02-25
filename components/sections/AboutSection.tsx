import Image from "next/image";
import { Shield, Target, Zap, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">EL CAMINO DEL GUERRERO</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8" />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Nuestro dojo encarna los principios ancestrales del Bushido mientras abraza metodologías de
              entrenamiento modernas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Nuestra Filosofía</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Fundado en las siete virtudes del Bushido - Rectitud, Coraje, Benevolencia, Respeto, Honestidad,
                Honor y Lealtad - nuestro dojo es más que un lugar de entrenamiento. Es un santuario donde los
                guerreros se forjan a través de la disciplina, dedicación y respeto mutuo.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-blue-400" />
                  <span className="text-gray-300 font-medium">Honor</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-6 w-6 text-blue-400" />
                  <span className="text-gray-300 font-medium">Disciplina</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-6 w-6 text-blue-400" />
                  <span className="text-gray-300 font-medium">Fuerza</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-blue-400" />
                  <span className="text-gray-300 font-medium">Respeto</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/inside/insidedojo.jpeg"
                alt="Interior del Dojo"
                width={600}
                height={500}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
