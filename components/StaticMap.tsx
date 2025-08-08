'use client'

interface StaticMapProps {
  center: { lat: number; lng: number }
  zoom?: number
  className?: string
  title?: string
  address?: string
}

export default function StaticMap({ 
  center, 
  zoom = 15, 
  className = "",
  title = "Fighting Spirit Dojo",
  address = "123 Calle Guerrero, Distrito Dojo, Ciudad 12345"
}: StaticMapProps) {
  
  // Crear URL para mapa estático de OpenStreetMap
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.01},${center.lat - 0.01},${center.lng + 0.01},${center.lat + 0.01}&layer=mapnik&marker=${center.lat},${center.lng}`

  return (
    <div className={`w-full ${className}`}>
      {/* Mapa interactivo */}
      <div className="w-full h-96 rounded-lg shadow-lg overflow-hidden">
        <iframe
          src={mapUrl}
          width="100%"
          height="400"
          style={{ border: 'none', borderRadius: '8px' }}
          title={title}
          allowFullScreen
        />
      </div>
      
      {/* Información del marcador */}
      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <div>
            <h4 className="text-white font-semibold">{title}</h4>
            <p className="text-gray-300 text-sm">{address}</p>
          </div>
        </div>
      </div>

      {/* Botón para obtener direcciones */}
      <div className="mt-4 text-center">
        <a
          href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 bg-transparent rounded-lg transition-colors duration-200"
        >
          Ver en OpenStreetMap
        </a>
      </div>
    </div>
  )
} 