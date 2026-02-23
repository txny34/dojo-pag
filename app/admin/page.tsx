"use client";
import { useState } from "react";
import { Swords, LogIn, CheckCircle, Circle, RefreshCw } from "lucide-react";

type Contacto = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  disciplina: string;
  mensaje: string;
  fecha_envio: string;
  contactado: boolean;
};

const DISCIPLINA_LABELS: Record<string, string> = {
  boxeo: "Boxeo",
  "muay-thai": "Muay Thai",
  k1: "K-1",
  "jiu-jitsu": "Jiu-Jitsu",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE ?? "";

  async function fetchContactos(pwd: string) {
    setLoading(true);
    setError("");
    try {
      // 1) Verificar contraseña (llamada rápida a Vercel, sin tocar Django)
      const auth = await fetch("/api/admin/verify", {
        headers: { "x-admin-password": pwd },
      });
      if (auth.status === 401) {
        setError("Contraseña incorrecta.");
        setLoading(false);
        return;
      }

      // 2) Traer contactos directo desde Django (el browser llama a Render)
      const res = await fetch(`${backendUrl}/contactos/`, { cache: "no-store" });
      if (!res.ok) {
        setError("Error al cargar contactos. ¿Está el backend corriendo?");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setContactos(Array.isArray(data) ? data : data.results ?? []);
      setAuthed(true);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleContactado(id: number, current: boolean) {
    setUpdating(id);
    try {
      const res = await fetch(`${backendUrl}/contactos/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactado: !current }),
      });
      if (res.ok) {
        setContactos((prev) =>
          prev.map((c) => (c.id === id ? { ...c, contactado: !current } : c))
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Swords className="h-8 w-8 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Panel Admin</h1>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchContactos(password);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-300 text-sm mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Cargando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendientes = contactos.filter((c) => !c.contactado).length;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Swords className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
              <p className="text-gray-400 text-sm">Fighting Spirit Dojo</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              <span className="text-blue-400 font-bold">{pendientes}</span> sin contactar
            </span>
            <button
              onClick={() => fetchContactos(password)}
              disabled={loading}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(["boxeo", "muay-thai", "k1", "jiu-jitsu"] as const).map((d) => {
            const count = contactos.filter((c) => c.disciplina === d).length;
            return (
              <div key={d} className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-blue-400">{count}</div>
                <div className="text-gray-400 text-sm mt-1">{DISCIPLINA_LABELS[d]}</div>
              </div>
            );
          })}
        </div>

        {/* Tabla */}
        {contactos.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center text-gray-400">
            No hay contactos registrados todavía.
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-400 text-left">
                    <th className="px-4 py-3 font-medium">Nombre</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Teléfono</th>
                    <th className="px-4 py-3 font-medium">Disciplina</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Mensaje</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Fecha</th>
                    <th className="px-4 py-3 font-medium text-center">Contactado</th>
                  </tr>
                </thead>
                <tbody>
                  {contactos.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`border-b border-gray-700/50 hover:bg-gray-750 transition-colors ${
                        c.contactado ? "opacity-50" : ""
                      } ${i % 2 === 0 ? "" : "bg-gray-800/50"}`}
                    >
                      <td className="px-4 py-3 font-medium text-white">
                        {c.nombre} {c.apellido}
                      </td>
                      <td className="px-4 py-3 text-gray-300">{c.email}</td>
                      <td className="px-4 py-3 text-gray-300 hidden md:table-cell">
                        {c.telefono || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-semibold">
                          {DISCIPLINA_LABELS[c.disciplina] ?? c.disciplina}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden lg:table-cell max-w-xs truncate">
                        {c.mensaje || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell whitespace-nowrap">
                        {new Date(c.fecha_envio).toLocaleDateString("es-UY", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleContactado(c.id, c.contactado)}
                          disabled={updating === c.id}
                          className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 mx-auto block"
                          aria-label={c.contactado ? "Marcar como no contactado" : "Marcar como contactado"}
                        >
                          {c.contactado ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
