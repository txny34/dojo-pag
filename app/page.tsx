"use client";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";

import { PLANES_INFO, type PlanSlug } from "@/lib/data/planes";
import { DOJO_CONFIG } from "@/lib/data/dojo.config";
import { type Disciplina, type FormState, initialForm, validate } from "@/lib/contact-form";

import NavSection from "@/components/sections/NavSection";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import DisciplinesSection from "@/components/sections/DisciplinesSection";
import ScheduleSection from "@/components/sections/ScheduleSection";
import InstructorsSection from "@/components/sections/InstructorsSection";
import MembershipSection from "@/components/sections/MembershipSection";
import ContactSection from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";
import TestimoniosSection from "@/components/TestimoniosSection";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function DojoWebsite() {
  // ── Form state ───────────────────────────────────────────────────────────────
  const [values, setValues] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [recaptchaKey, setRecaptchaKey] = useState(0);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  const isValid = useMemo(
    () =>
      Object.keys(errors).length === 0 &&
      !!values.nombre &&
      !!values.apellido &&
      !!values.email &&
      !!values.disciplina &&
      (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || !!values.recaptchaToken),
    [errors, values]
  );

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const resetRecaptcha = useCallback(() => {
    setRecaptchaKey((k) => k + 1);
    setValues((prev) => ({ ...prev, recaptchaToken: "" }));
    setErrors((prev) => { const { recaptcha, ...rest } = prev; return rest; });
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev) => {
        const next = { ...prev, [name]: value } as FormState;
        setErrors(validate(next));
        return next;
      });
    },
    []
  );

  const handleBlur = useCallback(() => {
    setErrors(validate(values));
  }, [values]);

  const handleRecaptchaChange = useCallback((token: string | null) => {
    setValues((prev) => {
      const next = { ...prev, recaptchaToken: token || "" };
      setErrors(validate(next));
      return next;
    });
  }, []);

  const handleWhatsAppSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatusMessage("");
      const currentErrors = validate(values);
      setErrors(currentErrors);
      if (Object.keys(currentErrors).length) return;

      setEnviando(true);
      try {
        const mensaje = `🥊 *NUEVO CONTACTO - ${DOJO_CONFIG.name.toUpperCase()}*

👤 *Datos del interesado:*
• Nombre: ${values.nombre} ${values.apellido}
• Email: ${values.email}
• Teléfono: ${values.telefono}
• Disciplina: ${
          values.disciplina === "k1"
            ? "K-1 Kickboxing"
            : values.disciplina === "muay-thai"
            ? "Muay Thai"
            : values.disciplina === "jiu-jitsu"
            ? "Jiu-Jitsu"
            : "Boxeo"
        }

💬 *Mensaje:*
${values.mensaje}

---
Enviado desde: ${window.location.href}`;

        fetch("/api/contacto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: values.nombre.trim(),
            apellido: values.apellido.trim(),
            email: values.email.trim(),
            telefono: values.telefono.trim(),
            disciplina: values.disciplina,
            mensaje: values.mensaje.trim(),
            recaptchaToken: values.recaptchaToken,
          }),
        }).catch(() => {});

        const numeroWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DOJO_CONFIG.whatsapp;
        window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`, "_blank");

        setStatusMessage("¡Perfecto! Se abrirá WhatsApp para enviar tu consulta 📱");
        setValues(initialForm);
        setErrors({});
        formRef.current?.reset();
        resetRecaptcha();
      } catch (err: any) {
        setStatusMessage(`Error: ${err?.message || "Fallo de red"}`);
        resetRecaptcha();
      } finally {
        setEnviando(false);
      }
    },
    [values, resetRecaptcha]
  );

  // ── Cross-section callbacks ───────────────────────────────────────────────────
  const handleSelectDisciplina = useCallback((slug: Disciplina) => {
    setValues((prev) => {
      const next = { ...prev, disciplina: slug };
      setErrors(validate(next));
      return next;
    });
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
  }, []);

  const handleSelectPlan = useCallback((slug: PlanSlug) => {
    const planName = PLANES_INFO[slug].name;
    const planPrice = PLANES_INFO[slug].price + PLANES_INFO[slug].period;
    setValues((prev) => {
      const mensajeConPlan = `Hola! Estoy interesado en el plan ${planName} (${planPrice}). ${prev.mensaje}`.trim();
      const next = { ...prev, mensaje: mensajeConPlan };
      setErrors(validate(next));
      return next;
    });
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <NavSection />
      <HeroSection />
      <AboutSection />
      <DisciplinesSection onSelectDisciplina={handleSelectDisciplina} />
      <ScheduleSection onReservar={handleSelectDisciplina} />
      <InstructorsSection onSelectDisciplina={handleSelectDisciplina} />
      <MembershipSection onSelectPlan={handleSelectPlan} />
      <TestimoniosSection />
      <ContactSection
        formRef={formRef}
        recaptchaKey={recaptchaKey}
        values={values}
        errors={errors}
        enviando={enviando}
        statusMessage={statusMessage}
        isClient={isClient}
        isValid={isValid}
        onChange={handleChange}
        onBlur={handleBlur}
        onSubmit={handleWhatsAppSubmit}
        onRecaptchaChange={handleRecaptchaChange}
      />
      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
