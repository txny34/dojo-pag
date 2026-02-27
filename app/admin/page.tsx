"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Swords, LogIn, RefreshCw, Search, Users, CheckCircle2,
  Clock, Download, LogOut, ChevronUp, ChevronDown,
  Phone, Mail, MessageSquare, Calendar, Trash2,
  StickyNote, X, Check,
} from "lucide-react";

type Contacto = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  disciplina: string;
  mensaje: string;
  notas: string;
  fecha_envio: string;
  contactado: boolean;
};

type SortKey = keyof Contacto;
type FilterKey = "todos" | "pendientes" | "contactados";

const DISCIPLINAS: Record<string, { label: string; cls: string }> = {
  boxeo:       { label: "Boxeo",      cls: "bg-red-500/15 text-red-400 border-red-500/30" },
  "muay-thai": { label: "Muay Thai",  cls: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  k1:          { label: "K-1",        cls: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  "jiu-jitsu": { label: "Jiu-Jitsu", cls: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
};

function DisciplinaBadge({ d }: { d: string }) {
  const meta = DISCIPLINAS[d] ?? { label: d, cls: "bg-gray-500/15 text-gray-400 border-gray-500/30" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.cls}`}>
      {meta.label}
    </span>
  );
}

function EstadoBadge({ contactado }: { contactado: boolean }) {
  if (contactado)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
        Contactado
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
      Pendiente
    </span>
  );
}

export default function AdminPage() {
  const [password, setPassword]       = useState("");
  const [authed, setAuthed]           = useState(false);
  const [contactos, setContactos]     = useState<Contacto[]>([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [refreshError, setRefreshError] = useState("");
  const [updating, setUpdating]       = useState<Set<number>>(new Set());
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [selected, setSelected]       = useState<Set<number>>(new Set());
  const [filter, setFilter]           = useState<FilterKey>("todos");
  const [search, setSearch]           = useState("");
  const [sortBy, setSortBy]           = useState<SortKey>("fecha_envio");
  const [sortDir, setSortDir]         = useState<"asc" | "desc">("desc");
  // delete
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [deleting, setDeleting]           = useState<Set<number>>(new Set());
  // notes
  const [expandedNotes, setExpandedNotes] = useState<number | null>(null);
  const [notesDraft, setNotesDraft]       = useState<Record<number, string>>({});
  const [savingNotes, setSavingNotes]     = useState<Set<number>>(new Set());

  async function apiFetch(method = "GET", body?: object) {
    return fetch("/api/admin/contactos", {
      method,
      headers: { "x-admin-password": password, "Content-Type": "application/json" },
      cache: method === "GET" ? "no-store" : "default",
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  }

  async function login(pwd: string) {
    setLoading(true); setError("");
    try {
      const auth = await fetch("/api/admin/verify", { headers: { "x-admin-password": pwd } });
      if (auth.status === 401) { setError("Contraseña incorrecta."); return; }
      const res = await fetch("/api/admin/contactos", { headers: { "x-admin-password": pwd }, cache: "no-store" });
      if (!res.ok) { setError("Error al cargar contactos."); return; }
      const data = await res.json();
      setContactos(Array.isArray(data) ? data : (data.results ?? []));
      setLastRefresh(new Date());
      setAuthed(true);
    } catch { setError("No se pudo conectar con el servidor."); }
    finally   { setLoading(false); }
  }

  async function refresh() {
    setLoading(true);
    setRefreshError("");
    try {
      const res = await apiFetch();
      if (res.ok) {
        const data = await res.json();
        setContactos(Array.isArray(data) ? data : (data.results ?? []));
        setLastRefresh(new Date());
      } else {
        setRefreshError(`Error al actualizar (${res.status}). El backend puede estar iniciando, intentá en unos segundos.`);
      }
    } catch {
      setRefreshError("No se pudo conectar con el servidor. Verificá tu conexión.");
    } finally { setLoading(false); }
  }

  async function toggleContactado(id: number, current: boolean) {
    addUpdating(id);
    try {
      const res = await apiFetch("PATCH", { id, contactado: !current });
      if (res.ok) setContactos((p) => p.map((c) => c.id === id ? { ...c, contactado: !current } : c));
    } finally { removeUpdating(id); }
  }

  async function bulkMarcar(contactado: boolean) {
    const ids = [...selected];
    ids.forEach(addUpdating);
    try {
      await Promise.all(ids.map((id) => apiFetch("PATCH", { id, contactado })));
      setContactos((p) => p.map((c) => selected.has(c.id) ? { ...c, contactado } : c));
      setSelected(new Set());
    } finally { ids.forEach(removeUpdating); }
  }

  async function deleteContacto(id: number) {
    setDeleting((p) => new Set(p).add(id));
    try {
      const res = await apiFetch("DELETE", { id });
      if (res.ok || res.status === 204) {
        setContactos((p) => p.filter((c) => c.id !== id));
        setSelected((p) => { const n = new Set(p); n.delete(id); return n; });
        if (expandedNotes === id) setExpandedNotes(null);
      }
    } finally {
      setDeleting((p) => { const n = new Set(p); n.delete(id); return n; });
      setConfirmDelete(null);
    }
  }

  async function bulkDelete() {
    const ids = [...selected];
    ids.forEach((id) => setDeleting((p) => new Set(p).add(id)));
    try {
      await Promise.all(ids.map((id) => apiFetch("DELETE", { id })));
      setContactos((p) => p.filter((c) => !selected.has(c.id)));
      setSelected(new Set());
    } finally { ids.forEach((id) => setDeleting((p) => { const n = new Set(p); n.delete(id); return n; })); }
  }

  async function saveNotes(id: number) {
    const notas = notesDraft[id] ?? "";
    setSavingNotes((p) => new Set(p).add(id));
    try {
      const res = await apiFetch("PATCH", { id, notas });
      if (res.ok) {
        setContactos((p) => p.map((c) => c.id === id ? { ...c, notas } : c));
        setExpandedNotes(null);
      }
    } finally { setSavingNotes((p) => { const n = new Set(p); n.delete(id); return n; }); }
  }

  function openNotes(c: Contacto) {
    setNotesDraft((p) => ({ ...p, [c.id]: c.notas ?? "" }));
    setExpandedNotes((prev) => (prev === c.id ? null : c.id));
    setConfirmDelete(null);
  }

  function addUpdating(id: number)    { setUpdating((p) => new Set(p).add(id)); }
  function removeUpdating(id: number) { setUpdating((p) => { const n = new Set(p); n.delete(id); return n; }); }

  function toggleSort(col: SortKey) {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("asc"); }
  }

  function exportCSV() {
    const head = ["Nombre","Apellido","Email","Teléfono","Disciplina","Mensaje","Notas","Fecha","Contactado"];
    const rows = filtered.map((c) => [
      c.nombre, c.apellido, c.email, c.telefono ?? "",
      DISCIPLINAS[c.disciplina]?.label ?? c.disciplina,
      c.mensaje ?? "", c.notas ?? "",
      new Date(c.fecha_envio).toLocaleDateString("es-UY"),
      c.contactado ? "Sí" : "No",
    ]);
    const csv = [head, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })),
      download: `contactos-${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
  }

  const filtered = useMemo(() => {
    let list = contactos;
    if (filter === "pendientes")  list = list.filter((c) => !c.contactado);
    if (filter === "contactados") list = list.filter((c) => c.contactado);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.nombre.toLowerCase().includes(q) || c.apellido.toLowerCase().includes(q)
          || c.email.toLowerCase().includes(q) || (c.telefono ?? "").includes(q),
      );
    }
    return [...list].sort((a, b) => {
      const cmp = String(a[sortBy] ?? "").localeCompare(String(b[sortBy] ?? ""), "es");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [contactos, filter, search, sortBy, sortDir]);

  const stats = useMemo(() => ({
    total:        contactos.length,
    pendientes:   contactos.filter((c) => !c.contactado).length,
    contactados:  contactos.filter((c) => c.contactado).length,
    byDisciplina: Object.fromEntries(
      Object.keys(DISCIPLINAS).map((d) => [d, contactos.filter((c) => c.disciplina === d).length]),
    ),
  }), [contactos]);

  const allSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id));
  function toggleAll() { setSelected(allSelected ? new Set() : new Set(filtered.map((c) => c.id))); }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortBy !== col) return <ChevronUp className="h-3 w-3 opacity-20" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 text-blue-400" /> : <ChevronDown className="h-3 w-3 text-blue-400" />;
  }

  // ─── Auto-refresh cada 60 s mientras está logueado ───────────────────────────
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!authed) return;
    const id = setInterval(() => { refresh(); }, 60_000);
    return () => clearInterval(id);
  }, [authed]);

  // ─── LOGIN ───────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4">
              <Swords className="h-10 w-10 text-blue-400" />
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
            <p className="text-gray-500 mt-1 text-sm">Fighting Spirit Dojo</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-black/60">
            <form onSubmit={(e) => { e.preventDefault(); login(password); }} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Contraseña de acceso
                </label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition"
                  placeholder="••••••••" required autoFocus
                />
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-semibold py-3 rounded-xl transition-all"
              >
                <LogIn className="h-4 w-4" />
                {loading ? "Verificando…" : "Ingresar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">

      {/* Navbar */}
      <header className="sticky top-0 z-20 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Swords className="h-5 w-5 text-blue-400" />
            <span className="font-bold text-white">Dojo Admin</span>
            <span className="hidden md:block text-gray-700">·</span>
            <span className="hidden md:block text-gray-500 text-sm">Fighting Spirit</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={refresh} disabled={loading}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
              title={lastRefresh ? `Última actualización: ${lastRefresh.toLocaleTimeString("es-UY")}` : "Actualizar"}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">
                {lastRefresh ? lastRefresh.toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" }) : "Actualizar"}
              </span>
            </button>
            <button onClick={() => { setAuthed(false); setContactos([]); setPassword(""); }}
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 text-sm transition-colors">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-5">
        {refreshError && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-yellow-400 text-sm">{refreshError}</p>
            <button onClick={() => setRefreshError("")} className="text-yellow-500 hover:text-yellow-300 text-xs shrink-0">✕</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Total"       value={stats.total}       icon={<Users        className="h-3.5 w-3.5" />} color="text-white"      border="" />
          <StatCard label="Pendientes"  value={stats.pendientes}  icon={<Clock        className="h-3.5 w-3.5" />} color="text-yellow-400" border="border-yellow-500/20" />
          <StatCard label="Contactados" value={stats.contactados} icon={<CheckCircle2 className="h-3.5 w-3.5" />} color="text-green-400"  border="border-green-500/20" />
          {(["boxeo","muay-thai","k1","jiu-jitsu"] as const).map((d) => (
            <div key={d} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="mb-2"><DisciplinaBadge d={d} /></div>
              <div className="text-3xl font-black text-white">{stats.byDisciplina[d] ?? 0}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
            {(["todos","pendientes","contactados"] as const).map((f) => {
              const counts = { todos: stats.total, pendientes: stats.pendientes, contactados: stats.contactados };
              return (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === f ? "bg-blue-600 text-white shadow" : "text-gray-400 hover:text-white"
                  }`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre, email, teléfono…"
                className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none transition"
              />
            </div>
            <button onClick={exportCSV} title="Exportar CSV"
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white text-sm transition-colors whitespace-nowrap">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 rounded-xl px-4 py-2.5">
            <span className="text-blue-400 text-sm font-semibold">
              {selected.size} seleccionado{selected.size > 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              <button onClick={() => bulkMarcar(true)}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-lg transition-colors">
                Marcar contactados
              </button>
              <button onClick={() => bulkMarcar(false)}
                className="px-3 py-1.5 bg-yellow-600/80 hover:bg-yellow-500 text-white text-xs font-semibold rounded-lg transition-colors">
                Marcar pendientes
              </button>
              <button onClick={bulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/80 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors">
                <Trash2 className="h-3.5 w-3.5" /> Eliminar
              </button>
              <button onClick={() => setSelected(new Set())}
                className="text-gray-500 hover:text-white text-xs transition-colors ml-1">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-14 text-center">
            <Users className="h-10 w-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No hay contactos que coincidan.</p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" checked={allSelected} onChange={toggleAll}
                        className="rounded border-gray-600 bg-gray-800 accent-blue-500" />
                    </th>
                    <Th onClick={() => toggleSort("nombre")}      label="Nombre"      sortIcon={<SortIcon col="nombre" />} />
                    <Th onClick={() => toggleSort("email")}       label="Email"       sortIcon={<SortIcon col="email" />} />
                    <th className="px-4 py-3 text-left hidden md:table-cell font-medium">Teléfono</th>
                    <Th onClick={() => toggleSort("disciplina")}  label="Disciplina"  sortIcon={<SortIcon col="disciplina" />} />
                    <th className="px-4 py-3 text-left hidden lg:table-cell font-medium">Mensaje</th>
                    <Th onClick={() => toggleSort("fecha_envio")} label="Fecha"       sortIcon={<SortIcon col="fecha_envio" />} className="hidden md:table-cell" />
                    <Th onClick={() => toggleSort("contactado")}  label="Estado"      sortIcon={<SortIcon col="contactado" />} className="text-center" />
                    <th className="px-4 py-3 text-center font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {filtered.map((c) => (
                    <>
                      {/* Main row */}
                      <tr key={c.id}
                        className={`group transition-colors ${
                          confirmDelete === c.id
                            ? "bg-red-900/20"
                            : expandedNotes === c.id
                            ? "bg-blue-900/10"
                            : selected.has(c.id)
                            ? "bg-blue-600/5"
                            : "hover:bg-gray-800/40"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={selected.has(c.id)}
                            onChange={() => setSelected((prev) => { const n = new Set(prev); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n; })}
                            className="rounded border-gray-600 bg-gray-800 accent-blue-500" />
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-white">{c.nombre} {c.apellido}</span>
                        </td>
                        <td className="px-4 py-3">
                          <a href={`mailto:${c.email}`} className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 opacity-40" />{c.email}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                          {c.telefono
                            ? <a href={`tel:${c.telefono}`} className="hover:text-white flex items-center gap-1.5 transition-colors"><Phone className="h-3.5 w-3.5 opacity-40" />{c.telefono}</a>
                            : <span className="text-gray-700">—</span>}
                        </td>
                        <td className="px-4 py-3"><DisciplinaBadge d={c.disciplina} /></td>
                        <td className="px-4 py-3 hidden lg:table-cell max-w-[160px]">
                          {c.mensaje
                            ? <div className="flex items-start gap-1.5"><MessageSquare className="h-3.5 w-3.5 text-gray-600 flex-shrink-0 mt-0.5" /><span className="text-gray-400 truncate text-xs">{c.mensaje}</span></div>
                            : <span className="text-gray-700">—</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                          <div className="flex items-center gap-1.5 text-xs whitespace-nowrap">
                            <Calendar className="h-3.5 w-3.5 opacity-40" />
                            {new Date(c.fecha_envio).toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit", year: "numeric" })}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => toggleContactado(c.id, c.contactado)} disabled={updating.has(c.id)}
                            className="mx-auto block disabled:opacity-40 transition-all hover:scale-105"
                            title={c.contactado ? "Marcar como pendiente" : "Marcar como contactado"}>
                            {updating.has(c.id)
                              ? <RefreshCw className="h-4 w-4 animate-spin text-gray-500 mx-auto" />
                              : <EstadoBadge contactado={c.contactado} />}
                          </button>
                        </td>
                        {/* Actions cell */}
                        <td className="px-4 py-3">
                          {confirmDelete === c.id ? (
                            /* Inline delete confirmation */
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="text-red-400 text-xs mr-1 hidden sm:inline whitespace-nowrap">¿Eliminar?</span>
                              <button onClick={() => deleteContacto(c.id)} disabled={deleting.has(c.id)}
                                className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50">
                                {deleting.has(c.id) ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                                Sí
                              </button>
                              <button onClick={() => setConfirmDelete(null)}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-lg transition-colors">
                                <X className="h-3 w-3" /> No
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              {/* Notes button */}
                              <button
                                onClick={() => openNotes(c)}
                                title={c.notas ? "Ver/editar nota" : "Agregar nota"}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  expandedNotes === c.id
                                    ? "bg-blue-600/20 text-blue-400"
                                    : c.notas
                                    ? "text-blue-400/70 hover:text-blue-400 hover:bg-blue-600/10"
                                    : "text-gray-600 hover:text-gray-300 hover:bg-gray-700/50"
                                }`}
                              >
                                <StickyNote className="h-4 w-4" />
                              </button>
                              {/* Delete button */}
                              <button
                                onClick={() => { setConfirmDelete(c.id); setExpandedNotes(null); }}
                                title="Eliminar contacto"
                                className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Notes expansion row */}
                      {expandedNotes === c.id && (
                        <tr key={`notes-${c.id}`} className="bg-blue-950/20 border-b border-gray-800/60">
                          <td colSpan={9} className="px-6 py-3">
                            <div className="flex flex-col sm:flex-row items-start gap-3">
                              <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap pt-2">
                                <StickyNote className="h-3.5 w-3.5" /> Nota interna
                              </div>
                              <textarea
                                value={notesDraft[c.id] ?? ""}
                                onChange={(e) => setNotesDraft((p) => ({ ...p, [c.id]: e.target.value }))}
                                placeholder="Escribe una nota sobre este contacto…"
                                rows={2}
                                className="flex-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none resize-none transition"
                              />
                              <div className="flex items-center gap-2">
                                <button onClick={() => saveNotes(c.id)} disabled={savingNotes.has(c.id)}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap">
                                  {savingNotes.has(c.id) ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                  Guardar
                                </button>
                                <button onClick={() => setExpandedNotes(null)}
                                  className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 border-t border-gray-800 flex items-center justify-between text-xs text-gray-600">
              <span>
                {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                {contactos.length !== filtered.length && ` · ${contactos.length} totales`}
              </span>
              {selected.size > 0 && (
                <span className="text-blue-500">{selected.size} seleccionado{selected.size > 1 ? "s" : ""}</span>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, color, border }: {
  label: string; value: number; icon: React.ReactNode; color: string; border: string;
}) {
  return (
    <div className={`bg-gray-900 border ${border || "border-gray-800"} rounded-xl p-4`}>
      <div className={`flex items-center gap-2 ${color} text-xs font-semibold uppercase tracking-wider mb-2`}>
        {icon} {label}
      </div>
      <div className={`text-3xl font-black ${color}`}>{value}</div>
    </div>
  );
}

function Th({ label, onClick, sortIcon, className = "" }: {
  label: string; onClick: () => void; sortIcon: React.ReactNode; className?: string;
}) {
  return (
    <th className={`px-4 py-3 text-left cursor-pointer select-none font-medium hover:text-gray-300 transition-colors ${className}`} onClick={onClick}>
      <span className="flex items-center gap-1">{label} {sortIcon}</span>
    </th>
  );
}
