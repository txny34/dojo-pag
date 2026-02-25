"use client";
import { useState } from "react";
import { Swords, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DOJO_CONFIG } from "@/lib/data/dojo.config";

export default function NavSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#about", label: "Acerca de" },
    { href: "#disciplines", label: "Disciplinas" },
    { href: "#schedule", label: "Horarios" },
    { href: "#instructors", label: "Instructores" },
    { href: "#membership", label: "Membresías" },
    { href: "#contact", label: "Contacto" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Swords className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{DOJO_CONFIG.name}</span>
          </div>
          <div className="hidden md:flex space-x-8">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                {label}
              </Link>
            ))}
          </div>
          <Button
            className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Únete Ahora
          </Button>
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 flex flex-col space-y-4">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium text-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full"
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Únete Ahora
          </Button>
        </div>
      )}
    </nav>
  );
}
