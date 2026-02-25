import { Swords } from "lucide-react";
import { DOJO_CONFIG } from "@/lib/data/dojo.config";

export default function FooterSection() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Swords className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{DOJO_CONFIG.name}</span>
          </div>
          <div className="text-gray-400 text-center md:text-right">
            <p>&copy; {DOJO_CONFIG.copyrightYear} {DOJO_CONFIG.legalName}. Todos los derechos reservados.</p>
            <p className="text-sm mt-1">{DOJO_CONFIG.tagline}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
