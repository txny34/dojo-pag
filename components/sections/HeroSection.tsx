"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DOJO_CONFIG } from "@/lib/data/dojo.config";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70 z-10" />
      <Image src="/images/hero/mural.jpeg" alt="Mural Samurái" fill className="object-cover" priority sizes="100vw" />
      <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-6xl md:text-8xl font-black mb-6 text-white leading-tight">
          {DOJO_CONFIG.hero.headingLine1}
          <span className="block text-blue-400">{DOJO_CONFIG.hero.headingLine2}</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          {DOJO_CONFIG.hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Inicia Tu Camino
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-gray-400 text-gray-300 hover:bg-gray-800 font-bold px-8 py-4 text-lg transition-all duration-300 bg-transparent"
            onClick={() => document.getElementById("disciplines")?.scrollIntoView({ behavior: "smooth" })}
          >
            Ver Clases
          </Button>
        </div>
      </div>
    </section>
  );
}
