'use client'

interface StaticMapProps {
  center: { lat: number; lng: number }
  className?: string
  title?: string
}

export default function StaticMap({
  center,
  className = "",
  title = "Fighting Spirit Dojo",
}: StaticMapProps) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.009},${center.lat - 0.009},${center.lng + 0.009},${center.lat + 0.009}&layer=mapnik&marker=${center.lat},${center.lng}`

  return (
    <iframe
      src={mapUrl}
      className={`w-full block ${className}`}
      style={{ border: "none", minHeight: "420px" }}
      title={title}
      allowFullScreen
      loading="lazy"
    />
  )
}
