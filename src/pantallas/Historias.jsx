import { useState } from 'react'
import historiasData from '../data/historias.json'
import modulos from '../data/modulos.json'
import Encabezado from '../componentes/Encabezado.jsx'

// PANTALLA: HISTORIAS DE ORIGEN (Módulo 3 · Cultura)
// Aloja los mitos y leyendas del pueblo, presentados de forma vistosa: portadas
// con degradado y motivo espiral (Kipara), y un lector con capitular y cita.
// Props: moduloId, onVolver
export default function Historias({ moduloId, onVolver }) {
  const modulo = modulos.find((m) => m.id === moduloId)
  const { intro, historias } = historiasData
  const [abierta, setAbierta] = useState(null) // historia en lectura

  // Motivo espiral (evoca el Kipara), decorativo.
  const Espiral = ({ className = '', color = '#ffffff', opacity = 0.18 }) => (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{ opacity }}
      fill="none"
      stroke={color}
      strokeWidth="4"
      aria-hidden="true"
    >
      <path d="M50 50 m0 0 a5 5 0 1 1 8 3 a12 12 0 1 1 -20 -6 a20 20 0 1 1 33 10 a28 28 0 1 1 -46 -14" />
    </svg>
  )

  // --- Lector de una historia ---
  if (abierta) {
    const h = abierta
    return (
      <div className="min-h-screen">
        <Encabezado
          titulo="Historias de origen"
          onVolver={() => setAbierta(null)}
          etiquetaVolver="Historias"
        />
        <article className="mx-auto max-w-2xl pb-16">
          {/* Portada de la historia */}
          <header
            className="relative overflow-hidden px-6 py-10 text-center text-white"
            style={{ background: `linear-gradient(135deg, ${h.color}, ${h.color2})` }}
          >
            <Espiral className="absolute -right-8 -top-8 h-40 w-40" />
            <Espiral className="absolute -bottom-10 -left-10 h-40 w-40" />
            <div className="relative">
              <div className="text-5xl">{h.emoji}</div>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight">{h.titulo}</h1>
              <p className="mt-1 text-lg text-white/90">{h.subtitulo}</p>
            </div>
          </header>

          {/* Cuerpo de la historia */}
          <div className="px-6 pt-6">
            {h.parrafos.map((p, i) => (
              <p key={i} className="mb-4 text-[1.05rem] leading-relaxed text-tierra/90">
                {i === 0 ? (
                  <>
                    <span
                      className="float-left mr-2 mt-1 text-6xl font-extrabold leading-[0.8]"
                      style={{ color: h.color }}
                    >
                      {p.charAt(0)}
                    </span>
                    {p.slice(1)}
                  </>
                ) : (
                  p
                )}
              </p>
            ))}

            {/* Cita destacada */}
            {h.cita && (
              <blockquote
                className="my-6 rounded-2xl border-l-4 p-4 text-lg italic"
                style={{ borderColor: h.color, backgroundColor: h.color + '12', color: h.color }}
              >
                “{h.cita}”
              </blockquote>
            )}

            {/* Fuente */}
            <p className="mt-6 border-t border-bosque/10 pt-4 text-xs text-tierra/55">
              {h.fuente}
            </p>
          </div>
        </article>
      </div>
    )
  }

  // --- Lista de historias ---
  return (
    <div className="min-h-screen">
      <Encabezado titulo={`Historias de origen · ${modulo.titulo}`} onVolver={onVolver} />

      <div className="mx-auto max-w-2xl px-4 pb-12">
        <p className="mb-6 rounded-2xl bg-crema/70 p-4 text-center text-sm text-tierra/80">
          {intro}
        </p>

        <div className="flex flex-col gap-4">
          {historias.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => {
                setAbierta(h)
                window.scrollTo(0, 0)
              }}
              className="relative overflow-hidden rounded-3xl p-6 text-left text-white shadow-lg transition active:scale-[0.99]"
              style={{ background: `linear-gradient(135deg, ${h.color}, ${h.color2})` }}
            >
              <Espiral className="absolute -right-6 -top-6 h-32 w-32" />
              <div className="relative flex items-center gap-4">
                <span className="text-5xl drop-shadow">{h.emoji}</span>
                <div className="flex-1">
                  <h2 className="text-xl font-extrabold leading-tight">{h.titulo}</h2>
                  <p className="text-sm text-white/90">{h.subtitulo}</p>
                  <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                    Leer historia →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-tierra/50">
          Narrativas sagradas del pueblo Ẽbẽra Kartama · transmitidas por los mayores.
        </p>
      </div>
    </div>
  )
}
