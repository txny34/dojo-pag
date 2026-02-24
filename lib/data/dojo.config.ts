/**
 * DOJO CONFIG
 * ──────────────────────────────────────────────────────────────────────────────
 * Todos los datos específicos del dojo en un único lugar.
 * Para adaptar el sitio a otro cliente, sólo hay que editar este archivo.
 */

export const DOJO_CONFIG = {
  // ── Identidad ───────────────────────────────────────────────────────────────
  name: "Nombre del Dojo",
  /** Nombre legal que aparece en el footer */
  legalName: "Nombre Legal S.A.",
  /** Eslogan corto (footer + meta description) */
  tagline: "Tu eslogan aquí.",

  // ── Hero ────────────────────────────────────────────────────────────────────
  hero: {
    headingLine1: "FORJA TU",
    headingLine2: "ESPÍRITU GUERRERO",
    subtitle:
      "Domina las artes marciales ancestrales en un entorno moderno. Disciplina, honor y fuerza te esperan.",
  },

  // ── Contacto ────────────────────────────────────────────────────────────────
  address: "Calle Ejemplo 1234",
  city: "Ciudad, País",
  phone: "+00 000 000 000",
  email: "info@tudojo.com",
  /** Número sin '+' ni espacios. Fallback si NEXT_PUBLIC_WHATSAPP_NUMBER no está en .env */
  whatsapp: "00000000000",

  // ── Ubicación (mapa) ────────────────────────────────────────────────────────
  /** Coordenadas del centro del mapa */
  coords: { lat: -34.9011, lng: -56.1645 },

  // ── Horarios de apertura ────────────────────────────────────────────────────
  hours: [
    { label: "Lun – Vie", value: "6:00 – 22:00" },
    { label: "Sábado",    value: "8:00 – 20:00" },
    { label: "Domingo",   value: "10:00 – 18:00" },
  ],

  // ── Stats (sección instructores) ────────────────────────────────────────────
  stats: [
    { value: "20+", label: "Años de experiencia combinada" },
    { value: "4",   label: "Instructores de élite" },
    { value: "10+", label: "Títulos internacionales" },
  ],

  // ── Trust strip (sección membresías) ───────────────────────────────────────
  trustItems: [
    "Sin contrato de permanencia",
    "Cancelación en cualquier momento",
    "Primer mes con garantía de satisfacción",
  ],

  // ── Footer ──────────────────────────────────────────────────────────────────
  copyrightYear: "2025",
} as const;
