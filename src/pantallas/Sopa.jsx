import { useMemo, useRef, useState } from 'react'
import crucigramas from '../data/crucigramas.json'
import modulos from '../data/modulos.json'
import Encabezado from '../componentes/Encabezado.jsx'
import { generarSopa } from '../utils/sopa.js'
import { registrarSopa } from '../utils/almacenamiento.js'

// Paleta de colores para las palabras encontradas. Cada palabra recibe un color
// distinto (en orden), para que no se confundan cuando ya hay muchas marcadas.
// Son tonos medianos-oscuros, todos legibles con texto blanco.
const PALETA = [
  '#2C5F2D', '#1F6F8B', '#8E44AD', '#C0392B', '#B9770E', '#16A085',
  '#2E86C1', '#CB4335', '#6C3483', '#117A65', '#A04000', '#1A5276',
  '#7D6608', '#943126', '#0E6655', '#5B2C6F',
]
const colorPalabra = (indice) => PALETA[indice % PALETA.length]

// PANTALLA DE SOPA DE LETRAS
// Usa las mismas palabras del crucigrama del módulo, escondidas en 8 direcciones.
// La persona arrastra el dedo (o el mouse) sobre una línea de letras; si forma
// una palabra de la lista, queda marcada. Funciona en celular y en computador.
// Props: moduloId, onVolver, onAvance
export default function Sopa({ moduloId, onVolver, onAvance }) {
  const modulo = modulos.find((m) => m.id === moduloId)
  const sopa = useMemo(
    () => generarSopa(crucigramas[moduloId], 'sopa_' + moduloId),
    [moduloId]
  )

  // Palabras ya encontradas (por su texto) y las casillas que ocupan.
  const [encontradas, setEncontradas] = useState([])
  // Selección en curso mientras se arrastra: lista de {r,c}.
  const [seleccion, setSeleccion] = useState([])
  const seleccionRef = useRef([]) // espejo síncrono (los eventos lo leen al instante)
  const arrastrando = useRef(false)
  const inicio = useRef(null)
  const gridRef = useRef(null)

  // Actualiza selección (estado para pintar + ref para evaluar sin esperar render).
  function fijarSeleccion(celdas) {
    seleccionRef.current = celdas
    setSeleccion(celdas)
  }

  const clave = (r, c) => r + ',' + c

  // Color asignado a cada palabra encontrada (por su orden de aparición) y a
  // cada casilla que ocupa. Si dos palabras cruzan en una casilla, se muestra
  // el color de la última encontrada.
  const colorDePalabra = {}
  const colorDeCelda = {}
  encontradas.forEach((e, i) => {
    const color = colorPalabra(i)
    colorDePalabra[e.palabra] = color
    e.celdas.forEach((cd) => {
      colorDeCelda[clave(cd.r, cd.c)] = color
    })
  })
  const celdasSeleccion = new Set(seleccion.map((cd) => clave(cd.r, cd.c)))

  // Dada una casilla objetivo, calcula la línea recta desde el inicio (si es
  // válida: misma fila, misma columna o diagonal perfecta).
  function lineaHasta(r, c) {
    const a = inicio.current
    if (!a) return []
    const dr = Math.sign(r - a.r)
    const dc = Math.sign(c - a.c)
    const largoF = Math.abs(r - a.r)
    const largoC = Math.abs(c - a.c)
    const esRecta = a.r === r || a.c === c || largoF === largoC
    if (!esRecta) return [a]
    const largo = Math.max(largoF, largoC)
    const celdas = []
    for (let i = 0; i <= largo; i++) celdas.push({ r: a.r + dr * i, c: a.c + dc * i })
    return celdas
  }

  // Encuentra la casilla (r,c) bajo un punto de la pantalla (sirve para el táctil).
  function celdaEnPunto(x, y) {
    const el = document.elementFromPoint(x, y)
    if (!el) return null
    const cd = el.closest?.('[data-celda]')
    if (!cd) return null
    const [r, c] = cd.getAttribute('data-celda').split(',').map(Number)
    return { r, c }
  }

  function alBajar(e) {
    const cd = celdaEnPunto(e.clientX, e.clientY)
    if (!cd) return
    arrastrando.current = true
    inicio.current = cd
    fijarSeleccion([cd])
    try {
      gridRef.current?.setPointerCapture?.(e.pointerId)
    } catch {
      /* algunos navegadores no permiten capturar en ciertos casos; no pasa nada */
    }
  }

  function alMover(e) {
    if (!arrastrando.current) return
    const cd = celdaEnPunto(e.clientX, e.clientY)
    if (!cd) return
    fijarSeleccion(lineaHasta(cd.r, cd.c))
  }

  function alSoltar() {
    if (!arrastrando.current) return
    arrastrando.current = false
    evaluar(seleccionRef.current)
    fijarSeleccion([])
    inicio.current = null
  }

  // Comprueba si la selección coincide con una palabra no encontrada aún
  // (en el sentido en que se marcó o al revés).
  function evaluar(celdas) {
    if (celdas.length < 2) return
    const dir = celdas.map((cd) => clave(cd.r, cd.c)).join('>')
    const inv = [...celdas].reverse().map((cd) => clave(cd.r, cd.c)).join('>')
    for (const col of sopa.colocaciones) {
      if (encontradas.some((e) => e.palabra === col.palabra)) continue
      const objetivo = col.celdas.map((cd) => clave(cd.r, cd.c)).join('>')
      if (objetivo === dir || objetivo === inv) {
        const nuevas = [...encontradas, col]
        setEncontradas(nuevas)
        registrarSopa(moduloId, nuevas.length, sopa.colocaciones.length)
        onAvance?.()
        return
      }
    }
  }

  const total = sopa.colocaciones.length
  const listas = encontradas.length
  const completo = listas === total

  return (
    <div className="min-h-screen">
      <Encabezado titulo={`Sopa de letras · ${modulo.titulo}`} onVolver={onVolver} />

      <div className="mx-auto max-w-2xl px-4 pb-12">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-tierra/60">
            {listas} de {total} palabras
          </p>
          <button
            type="button"
            onClick={() => {
              setEncontradas([])
              registrarSopa(moduloId, 0, total)
              onAvance?.()
            }}
            className="rounded-full bg-bosque/10 px-3 py-1.5 text-sm font-semibold text-bosque active:scale-95"
          >
            🔄 Reiniciar
          </button>
        </div>

        {completo && (
          <div className="mb-4 rounded-2xl bg-musgo/25 p-4 text-center font-bold text-bosque">
            🌟 ¡Encontraste todas las palabras!
          </div>
        )}

        {/* Cuadrícula de letras (se ajusta al ancho de la pantalla) */}
        <div className="mb-6 rounded-2xl bg-white p-2 shadow-md">
          <div
            ref={gridRef}
            onPointerDown={alBajar}
            onPointerMove={alMover}
            onPointerUp={alSoltar}
            onPointerCancel={alSoltar}
            className="grid touch-none select-none"
            style={{
              gridTemplateColumns: `repeat(${sopa.size}, minmax(0, 1fr))`,
              gap: '2px',
            }}
          >
            {sopa.grid.map((fila, r) =>
              fila.map((letra, c) => {
                const k = clave(r, c)
                const color = colorDeCelda[k]
                const sel = celdasSeleccion.has(k)
                return (
                  <div
                    key={k}
                    data-celda={k}
                    style={color ? { backgroundColor: color } : undefined}
                    className={`flex aspect-square items-center justify-center rounded-[3px] text-[min(3.4vw,1rem)] font-bold uppercase
                      ${color ? 'text-white' : sel ? 'bg-ocre text-white' : 'bg-crema text-tierra'}`}
                  >
                    {letra}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Lista de palabras a buscar (con su pista) */}
        <h3 className="mb-2 text-lg font-bold text-bosque">Palabras a buscar</h3>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {sopa.colocaciones.map((col) => {
            const color = colorDePalabra[col.palabra]
            const hallada = !!color
            return (
              <li
                key={col.palabra}
                className={`rounded-xl px-3 py-2 text-sm ${hallada ? '' : 'bg-crema/60'}`}
                style={hallada ? { backgroundColor: color + '22' } : undefined}
              >
                <span className="flex items-center gap-2">
                  {/* Punto de color que coincide con la palabra en la cuadrícula */}
                  <span
                    className="inline-block h-3 w-3 shrink-0 rounded-full border"
                    style={{
                      backgroundColor: hallada ? color : 'transparent',
                      borderColor: hallada ? color : '#c9c2ae',
                    }}
                  />
                  <span
                    className="font-bold"
                    style={hallada ? { color, textDecoration: 'line-through' } : undefined}
                  >
                    {col.palabra}
                  </span>
                  {hallada && <span style={{ color }}>✓</span>}
                </span>
                <span className="ml-5 block text-xs text-tierra/60">{col.pista}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
