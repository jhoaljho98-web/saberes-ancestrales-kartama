import { useEffect, useMemo, useRef, useState } from 'react'
import crucigramas from '../data/crucigramas.json'
import modulos from '../data/modulos.json'
import Encabezado from '../componentes/Encabezado.jsx'
import { generarCrucigrama } from '../utils/crucigrama.js'
import { registrarCrucigrama } from '../utils/almacenamiento.js'

// PANTALLA DE CRUCIGRAMA
// Arma una cuadrícula jugable a partir de las palabras y pistas del módulo.
// La persona escribe letra por letra; cuando una palabra queda completa y
// correcta, se pinta de verde musgo. Al completar todas, se guarda el logro.
// Props: moduloId, onVolver, onAvance
export default function Crucigrama({ moduloId, onVolver, onAvance }) {
  const modulo = modulos.find((m) => m.id === moduloId)
  const juego = useMemo(() => generarCrucigrama(crucigramas[moduloId]), [moduloId])

  // Letras escritas por el usuario: { "r,c": "A" }
  const [letras, setLetras] = useState({})
  // Palabra activa (para saber en qué dirección avanzar al escribir).
  const idInicial = juego.palabras[0] ? juego.palabras[0].numero + juego.palabras[0].dir : null
  const [activa, setActiva] = useState(idInicial)
  // Espejo síncrono de "activa": los eventos (onFocus, onChange) lo leen sin
  // esperar al re-render de React, evitando que el foco cambie la palabra elegida.
  const activaRef = useRef(idInicial)
  const inputs = useRef({}) // refs de cada celda para mover el foco

  const clave = (r, c) => r + ',' + c

  // Cambia la palabra activa (estado + espejo síncrono).
  function activar(id) {
    activaRef.current = id
    setActiva(id)
  }

  // Devuelve la palabra por su id ("numero+dir").
  function palabraPorId(id) {
    return juego.palabras.find((p) => p.numero + p.dir === id)
  }

  // ¿Está una palabra completa y correcta?
  function palabraCorrecta(p) {
    for (let i = 0; i < p.respuesta.length; i++) {
      const rr = p.dir === 'V' ? p.r + i : p.r
      const cc = p.dir === 'H' ? p.c + i : p.c
      if ((letras[clave(rr, cc)] || '') !== p.respuesta[i]) return false
    }
    return true
  }

  const palabrasBien = juego.palabras.filter(palabraCorrecta)
  const encontradas = palabrasBien.length
  const total = juego.palabras.length
  const completo = encontradas === total

  // Celdas que pertenecen a una palabra ya resuelta (para pintarlas de verde).
  const celdasBien = new Set()
  palabrasBien.forEach((p) => {
    for (let i = 0; i < p.respuesta.length; i++) {
      const rr = p.dir === 'V' ? p.r + i : p.r
      const cc = p.dir === 'H' ? p.c + i : p.c
      celdasBien.add(clave(rr, cc))
    }
  })

  // Guardar avance cada vez que cambia el número de palabras encontradas.
  useEffect(() => {
    registrarCrucigrama(moduloId, encontradas, total)
    onAvance?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encontradas])

  // Celdas de la palabra activa (para resaltarla).
  const celdasActivas = new Set()
  const palabraActiva = juego.palabras.find((p) => p.numero + p.dir === activa)
  if (palabraActiva) {
    for (let i = 0; i < palabraActiva.respuesta.length; i++) {
      const rr = palabraActiva.dir === 'V' ? palabraActiva.r + i : palabraActiva.r
      const cc = palabraActiva.dir === 'H' ? palabraActiva.c + i : palabraActiva.c
      celdasActivas.add(clave(rr, cc))
    }
  }

  // Al escribir en una celda: guardar letra y avanzar el foco por la palabra activa.
  function escribir(r, c, valor) {
    const letra = valor.slice(-1).toUpperCase().replace(/[^A-ZÑ]/g, '')
    setLetras((prev) => ({ ...prev, [clave(r, c)]: letra }))
    const pa = palabraPorId(activaRef.current)
    if (letra && pa) {
      const dr = pa.dir === 'V' ? 1 : 0
      const dc = pa.dir === 'H' ? 1 : 0
      const sig = inputs.current[clave(r + dr, c + dc)]
      if (sig) sig.focus()
    }
  }

  // Retroceder con "borrar" si la celda ya estaba vacía.
  function teclas(e, r, c) {
    const pa = palabraPorId(activaRef.current)
    if (e.key === 'Backspace' && !letras[clave(r, c)] && pa) {
      const dr = pa.dir === 'V' ? 1 : 0
      const dc = pa.dir === 'H' ? 1 : 0
      const prev = inputs.current[clave(r - dr, c - dc)]
      if (prev) prev.focus()
    }
  }

  // Al enfocar una celda, elegir la palabra en esa dirección.
  // Si la palabra activa ya pasa por aquí, se mantiene (así el foco que avanza
  // al escribir no cambia de dirección). Si no, se toma la primera que pase.
  function seleccionarCelda(r, c) {
    const enCelda = juego.palabras.filter((p) => {
      for (let i = 0; i < p.respuesta.length; i++) {
        const rr = p.dir === 'V' ? p.r + i : p.r
        const cc = p.dir === 'H' ? p.c + i : p.c
        if (rr === r && cc === c) return true
      }
      return false
    })
    if (enCelda.length === 0) return
    const actualEnCelda = enCelda.find((p) => p.numero + p.dir === activaRef.current)
    const elegida = actualEnCelda || enCelda[0]
    activar(elegida.numero + elegida.dir)
  }

  const horizontales = juego.palabras.filter((p) => p.dir === 'H')
  const verticales = juego.palabras.filter((p) => p.dir === 'V')

  // Tamaño de celda (px). La cuadrícula puede desplazarse en horizontal.
  const CELDA = 34

  return (
    <div className="min-h-screen">
      <Encabezado titulo={`Crucigrama · ${modulo.titulo}`} onVolver={onVolver} />

      <div className="mx-auto max-w-2xl px-4 pb-12">
        {/* Marcador */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-tierra/60">
            {encontradas} de {total} palabras
          </p>
          <button
            type="button"
            onClick={() => setLetras({})}
            className="rounded-full bg-bosque/10 px-3 py-1.5 text-sm font-semibold text-bosque active:scale-95"
          >
            🔄 Borrar
          </button>
        </div>

        {completo && (
          <div className="mb-4 rounded-2xl bg-musgo/25 p-4 text-center font-bold text-bosque">
            🌟 ¡Crucigrama completo! Descubriste todas las palabras.
          </div>
        )}

        {/* Cuadrícula (con scroll horizontal si es ancha) */}
        <div className="mb-6 overflow-x-auto rounded-2xl bg-white p-3 shadow-md">
          <div
            className="relative mx-auto"
            style={{
              width: juego.ancho * CELDA,
              height: juego.alto * CELDA,
            }}
          >
            {Array.from({ length: juego.alto }).map((_, r) =>
              Array.from({ length: juego.ancho }).map((_, c) => {
                const info = juego.celdas[clave(r, c)]
                if (!info) return null // celda vacía (sin letra)
                const k = clave(r, c)
                const bien = celdasBien.has(k)
                const activaCelda = celdasActivas.has(k)
                return (
                  <div
                    key={k}
                    className="absolute"
                    style={{ left: c * CELDA, top: r * CELDA, width: CELDA, height: CELDA }}
                  >
                    {info.numero && (
                      <span className="pointer-events-none absolute left-0.5 top-0 z-10 text-[9px] font-bold text-tierra/60">
                        {info.numero}
                      </span>
                    )}
                    <input
                      ref={(el) => (inputs.current[k] = el)}
                      value={letras[k] || ''}
                      onChange={(e) => escribir(r, c, e.target.value)}
                      onKeyDown={(e) => teclas(e, r, c)}
                      onFocus={() => seleccionarCelda(r, c)}
                      maxLength={1}
                      inputMode="text"
                      autoCapitalize="characters"
                      className={`h-full w-full rounded-sm border text-center text-base font-bold uppercase outline-none transition
                        ${bien ? 'border-musgo bg-musgo/30 text-bosque' : 'border-bosque/25 text-tierra'}
                        ${activaCelda && !bien ? 'bg-ocre/10' : ''}
                        focus:border-bosque focus:bg-crema`}
                    />
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Pistas */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Pistas
            titulo="Horizontales"
            palabras={horizontales}
            activa={activa}
            correcta={palabraCorrecta}
            onElegir={(p) => {
              activar(p.numero + p.dir)
              inputs.current[clave(p.r, p.c)]?.focus()
            }}
          />
          <Pistas
            titulo="Verticales"
            palabras={verticales}
            activa={activa}
            correcta={palabraCorrecta}
            onElegir={(p) => {
              activar(p.numero + p.dir)
              inputs.current[clave(p.r, p.c)]?.focus()
            }}
          />
        </div>
      </div>
    </div>
  )
}

// Lista de pistas de una dirección (horizontales o verticales).
function Pistas({ titulo, palabras, activa, correcta, onElegir }) {
  return (
    <div>
      <h3 className="mb-2 text-lg font-bold text-bosque">{titulo}</h3>
      <ul className="flex flex-col gap-1.5">
        {palabras.map((p) => {
          const bien = correcta(p)
          const esActiva = p.numero + p.dir === activa
          return (
            <li key={p.numero + p.dir}>
              <button
                type="button"
                onClick={() => onElegir(p)}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm transition
                  ${esActiva ? 'bg-ocre/15' : 'hover:bg-crema'}
                  ${bien ? 'text-bosque line-through decoration-musgo' : 'text-tierra/85'}`}
              >
                <span className="font-bold">{p.numero}.</span> {p.pista}
                {bien && <span className="ml-1">✓</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
