import { useState } from 'react'
import gobierno from '../data/gobierno.json'
import modulos from '../data/modulos.json'
import Encabezado from '../componentes/Encabezado.jsx'

// PANTALLA: EL ÁRBOL DEL GOBIERNO PROPIO (Módulo 4 · Autonomía)
// Organigrama visual e interactivo del Dai Bakuru. La comunidad es la raíz;
// de ella crecen las asambleas, las autoridades, la guardia y la justicia.
// Toca cada parte para ver su descripción (y quién la ejerce hoy).
// Props: moduloId, onVolver
export default function Gobierno({ moduloId, onVolver }) {
  const modulo = modulos.find((m) => m.id === moduloId)
  const [abierto, setAbierto] = useState(null) // clave del nodo expandido

  // Conector vertical entre tarjetas, para dar sensación de árbol.
  const Conector = ({ color = '#97BC62' }) => (
    <div className="mx-auto h-6 w-1 rounded-full" style={{ backgroundColor: color }} />
  )

  return (
    <div className="min-h-screen">
      <Encabezado titulo={`Gobierno propio · ${modulo.titulo}`} onVolver={onVolver} />

      <div className="mx-auto max-w-2xl px-4 pb-12">
        {/* Título del árbol */}
        <header className="mb-4 text-center">
          <div className="text-5xl">🌳</div>
          <h1 className="mt-1 text-2xl font-extrabold text-bosque">{gobierno.titulo}</h1>
          <p className="text-lg italic text-ocre">{gobierno.subtitulo}</p>
        </header>

        <p className="mb-6 rounded-2xl bg-crema/70 p-4 text-sm text-tierra/85">
          {gobierno.intro}
        </p>

        {/* Raíz: la comunidad (la máxima autoridad) */}
        <div className="rounded-3xl bg-bosque p-5 text-center text-crema shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-musgo">
            {gobierno.raiz.etiqueta}
          </p>
          <h2 className="mt-1 text-2xl font-extrabold">🌱 {gobierno.raiz.titulo}</h2>
          <p className="mt-2 text-sm text-crema/90">{gobierno.raiz.desc}</p>
        </div>

        {/* Ramas del árbol */}
        {gobierno.ramas.map((rama) => (
          <div key={rama.id}>
            <Conector color={rama.color} />
            <div
              className="overflow-hidden rounded-2xl border-2 bg-white shadow-sm"
              style={{ borderColor: rama.color }}
            >
              {/* Cabecera de la rama */}
              <div
                className="px-4 py-3 text-white"
                style={{ backgroundColor: rama.color }}
              >
                <h3 className="text-lg font-bold">
                  {rama.icono} {rama.titulo}
                </h3>
                {rama.embera && (
                  <p className="text-sm italic text-white/85">{rama.embera}</p>
                )}
                <p className="mt-1 text-sm text-white/90">{rama.desc}</p>
              </div>

              {/* Nodos de la rama (tocar para ver la descripción) */}
              {rama.nodos.length > 0 && (
                <ul className="divide-y divide-bosque/10">
                  {rama.nodos.map((nodo, i) => {
                    const clave = rama.id + '-' + i
                    const expandido = abierto === clave
                    return (
                      <li key={clave}>
                        <button
                          type="button"
                          onClick={() => setAbierto(expandido ? null : clave)}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left transition hover:bg-crema/50"
                        >
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: rama.color }}
                          />
                          <span className="flex-1">
                            <span className="font-bold text-tierra">{nodo.titulo}</span>
                            {nodo.embera && (
                              <span className="ml-1 text-sm italic text-ocre">
                                {nodo.embera}
                              </span>
                            )}
                          </span>
                          <span className="text-bosque/40">{expandido ? '−' : '+'}</span>
                        </button>
                        {expandido && (
                          <div className="px-4 pb-3 pl-9 text-sm text-tierra/80">
                            <p>{nodo.desc}</p>
                            {nodo.actual && (
                              <p className="mt-2 rounded-lg bg-crema/70 px-3 py-1.5 text-xs text-tierra/70">
                                <span className="font-semibold text-bosque">Hoy:</span>{' '}
                                {nodo.actual}
                              </p>
                            )}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        ))}

        {/* Los cinco procesos de la Autonomía */}
        <div className="mt-8 rounded-2xl bg-bosque/5 p-5">
          <h3 className="mb-3 text-base font-bold text-bosque">
            Los cinco procesos de la Autonomía
          </h3>
          <div className="flex flex-wrap gap-2">
            {gobierno.procesos.map((p) => (
              <span
                key={p}
                className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-tierra shadow-sm"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-tierra/50">{gobierno.periodo}</p>
      </div>
    </div>
  )
}
