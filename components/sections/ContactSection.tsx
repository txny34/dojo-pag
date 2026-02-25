"use client";
import React from "react";
import dynamic from "next/dynamic";
import { MapPin, Phone, Mail, Clock, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import StaticMap from "@/components/StaticMap";
import { DOJO_CONFIG } from "@/lib/data/dojo.config";
import { DISCIPLINAS, type FormState } from "@/lib/contact-form";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-700 p-6 rounded-xl border border-gray-600 animate-pulse">
      <div className="text-gray-400 text-center">Cargando verificación...</div>
    </div>
  ),
});

export interface ContactSectionProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  recaptchaKey: number;
  values: FormState;
  errors: Record<string, string>;
  enviando: boolean;
  statusMessage: string;
  isClient: boolean;
  isValid: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onRecaptchaChange: (token: string | null) => void;
}

export default function ContactSection({
  formRef,
  recaptchaKey,
  values,
  errors,
  enviando,
  statusMessage,
  isClient,
  isValid,
  onChange,
  onBlur,
  onSubmit,
  onRecaptchaChange,
}: ContactSectionProps) {
  return (
    <section id="contact" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-white mb-6">ENCUENTRA TU DOJO</h2>
          <div className="w-24 h-1 bg-blue-400 mx-auto mb-8" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Info panel */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-8">Ponte en Contacto</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-blue-400" />
                <div>
                  <div className="text-white font-semibold">Ubicación</div>
                  <div className="text-gray-300">{DOJO_CONFIG.address}, {DOJO_CONFIG.city}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-blue-400" />
                <div>
                  <div className="text-white font-semibold">Teléfono</div>
                  <div className="text-gray-300">{DOJO_CONFIG.phone}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-blue-400" />
                <div>
                  <div className="text-white font-semibold">Email</div>
                  <div className="text-gray-300">{DOJO_CONFIG.email}</div>
                </div>
              </div>
            </div>

            <Separator className="my-8 bg-gray-700" />

            <div>
              <h4 className="text-xl font-bold text-white mb-4">Horarios de Entrenamiento</h4>
              <div className="space-y-2 text-gray-300">
                {DOJO_CONFIG.hours.map((h) => (
                  <div key={h.label} className="flex justify-between">
                    <span>{h.label}</span>
                    <span>{h.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-800 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Inicia Tu Camino</h3>
            <form ref={formRef} className="space-y-4" onSubmit={onSubmit} noValidate>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                    required
                    value={values.nombre}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                  {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                    required
                    value={values.apellido}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                  {errors.apellido && <p className="text-red-400 text-sm mt-1">{errors.apellido}</p>}
                </div>
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Correo Electrónico"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                  required
                  value={values.email}
                  onChange={onChange}
                  onBlur={onBlur}
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Número de Teléfono"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                  value={values.telefono}
                  onChange={onChange}
                  onBlur={onBlur}
                />
                {errors.telefono && <p className="text-red-400 text-sm mt-1">{errors.telefono}</p>}
              </div>
              <div>
                <select
                  name="disciplina"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                  required
                  value={values.disciplina}
                  onChange={onChange}
                  onBlur={onBlur}
                >
                  <option value="">Disciplina de Interés</option>
                  {DISCIPLINAS.map((d) => (
                    <option key={d} value={d}>
                      {d === "k1" ? "K-1 Kickboxing" : d === "muay-thai" ? "Muay Thai" : d === "jiu-jitsu" ? "Jiu-Jitsu" : "Boxeo"}
                    </option>
                  ))}
                </select>
                {errors.disciplina && <p className="text-red-400 text-sm mt-1">{errors.disciplina}</p>}
              </div>
              <div>
                <textarea
                  name="mensaje"
                  placeholder="Cuéntanos sobre tus objetivos..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none resize-none"
                  value={values.mensaje}
                  onChange={onChange}
                  onBlur={onBlur}
                />
                {errors.mensaje && <p className="text-red-400 text-sm mt-1">{errors.mensaje}</p>}
              </div>

              {isClient && (
                <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <span className="text-white font-semibold">Verificación de Seguridad</span>
                  </div>
                  <div className="flex justify-center">
                    {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
                      <ReCAPTCHA
                        key={recaptchaKey}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                        onChange={onRecaptchaChange}
                        onExpired={() => onRecaptchaChange(null)}
                        onErrored={() => onRecaptchaChange(null)}
                        theme="dark"
                        size="normal"
                      />
                    ) : (
                      <div className="text-gray-500 text-sm text-center">reCAPTCHA no configurado</div>
                    )}
                  </div>
                  {errors.recaptcha && (
                    <p className="text-red-400 text-sm mt-3 text-center flex items-center justify-center gap-2">
                      <span>⚠️</span>
                      {errors.recaptcha}
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={enviando || !isValid}
                className={`w-full font-bold py-3 text-lg ${
                  isValid && !enviando
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                {enviando ? "Enviando..." : "Comienza Tu Entrenamiento"}
              </Button>
              {statusMessage && (
                <p
                  className={`text-center font-medium ${
                    statusMessage.toLowerCase().includes("error") ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {statusMessage}
                </p>
              )}
            </form>
          </div>

          {/* Map */}
          <div className="mt-20 lg:col-span-2">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-black text-white mb-3">CÓMO LLEGAR</h3>
              <div className="w-16 h-1 bg-blue-400 mx-auto mb-4" />
              <p className="text-gray-400">Visitanos en nuestra sede principal en Montevideo</p>
            </div>

            <div className="grid lg:grid-cols-3 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
              <div className="lg:col-span-2">
                <StaticMap
                  center={DOJO_CONFIG.coords}
                  className="h-full"
                  title={DOJO_CONFIG.name}
                />
              </div>

              <div className="bg-gray-900 p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-700">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Dirección</p>
                      <p className="text-white font-semibold leading-snug">{DOJO_CONFIG.address}</p>
                      <p className="text-gray-400 text-sm mt-0.5">{DOJO_CONFIG.city}</p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-700/60" />

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Horarios</p>
                      <div className="space-y-1 text-sm">
                        {DOJO_CONFIG.hours.map((h) => (
                          <div key={h.label} className="flex justify-between gap-4">
                            <span className="text-gray-400">{h.label}</span>
                            <span className="text-white font-medium">{h.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-700/60" />

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Teléfono</p>
                      <p className="text-white font-semibold">{DOJO_CONFIG.phone}</p>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${DOJO_CONFIG.address}, ${DOJO_CONFIG.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors duration-200 group"
                >
                  <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  Abrir en el mapa
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
