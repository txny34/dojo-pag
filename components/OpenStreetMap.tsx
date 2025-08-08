'use client'

import { useEffect, useRef } from 'react'

interface OpenStreetMapProps {
  center: { lat: number; lng: number }
  zoom?: number
  className?: string
  title?: string
  address?: string
}

export default function OpenStreetMap({ 
  center, 
  zoom = 15, 
  className = "",
  title = "Fighting Spirit Dojo",
  address = "123 Calle Guerrero, Distrito Dojo, Ciudad 12345"
}: OpenStreetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Crear el iframe de OpenStreetMap
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.01},${center.lat - 0.01},${center.lng + 0.01},${center.lat + 0.01}&layer=mapnik&marker=${center.lat},${center.lng}`
    iframe.width = '100%'
    iframe.height = '400'
    iframe.style.border = 'none'
    iframe.style.borderRadius = '8px'
    iframe.title = title

    // Limpiar contenido anterior
    mapRef.current.innerHTML = ''
    mapRef.current.appendChild(iframe)

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = ''
      }
    }
  }, [center, zoom, title])

  return (
    <div className={`w-full ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg shadow-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />
      
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
    </div>
  )
} 