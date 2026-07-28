import { useMemo, useState } from 'react'
import comunidadesData from '../data/comunidades.json'
import modulos from '../data/modulos.json'
import Encabezado from '../componentes/Encabezado.jsx'
import Boton from '../componentes/Boton.jsx'
import { mezclar } from '../utils/mezclar.js'
import { registrarComunidades } from '../utils/almacenamiento.js'

// PANTALLA: UBICAR LAS COMUNIDADES EN SU ZONA (Módulo 2 · Territorio)
// La persona toca una comunidad y luego la zona (Arkía, Moragá o Amaspache)
// donde va. Al "Comprobar", las correctas quedan fijas y las incorrectas se
// marcan para corregir. Datos tomados del gobierno propio 2025–2026.
// Props: moduloId, onVolver, onAvance
export default function Comunidades({ moduloId, onVolver, onAvance }) {
  const modulo = modulos.find((m) => m.id === moduloId)
  const { zonas } = comunidadesData
  const zonaPorId = Object.fromEntries(zonas.map((z) => [z.id, z]))

  // Orden barajado de las comunidades (una sola vez).
  const comunidades = useMemo(() => mezclar(comunidadesData.comunidades), [])
  const total = comunidades.length
  const zonaCorrecta = Object.fromEntries(comunidades.map((c) => [c.nombre, c.zona]))

  const [asignaciones, setAsignaciones] = useState({}) // nombre -> zonaId
  const [bloqueadas, setBloqueadas] = useState(() => new Set()) // correctas fijadas
  const [seleccion, setSeleccion] = useState(null) // nombre seleccionado
  const [veredicto, setVeredicto] = useState({}) // nombre -> 'bien' | 'mal'

  const enPool = comunidades.filter((c) => !asignaciones[c.nombre])
  const correctas = bloqueadas.size
  const completo = correctas === total

  function elegirChip(nombre) {
    if (bloqueadas.has(nombre)) return // ya está fija y correcta
    setSeleccion((s) => (s === nombre ? null : nombre))
  }

  function asignarAZona(zonaId) {
    if (!seleccion) return
    setAsignaciones((a) => ({ ...a, [seleccion]: zonaId }))
    setVeredicto((v) => {
      const n = { ...v }
      delete n[seleccion]
      return n
    })
    setSeleccion(null)
  }

  function devolverAlPool() {
    if (!seleccion || !asignaciones[seleccion]) {
      setSeleccion(null)
      return
    }
    setAsignaciones((a) => {
      const n = { ...a }
      delete n[seleccion]
      return n
    })
    setVeredicto((v) => {
      const n = { ...v }
      delete n[seleccion]
      return n
    })
    setSeleccion(null)
  }

  function comprobar() {
    const nuevoVeredicto = {}
    const nuevasBloqueadas = new Set(bloqueadas)
    Object.entries(asignaciones).forEach(([nombre, zonaId]) => {
      if (bloqueadas.has(nombre)) return
      if (zonaCorrecta[nombre] === zonaId) {
        nuevoVeredicto[nombre] = 'bien'
        nuevasBloqueadas.add(nombre)
      } else {
        nuevoVeredicto[nombre] = 'mal'
      }
    })
    setVeredicto(nuevoVeredicto)
    setBloqueadas(nuevasBloqueadas)
    registrarComunidades(moduloId, nuevasBloqueadas.size, total)
    onAvance?.()
  }

  function reiniciar() {
    setAsignaciones({})
    setBloqueadas(new Set())
    setSeleccion(null)
    setVeredicto({})
  }

  // Ficha de comunidad (en el pool o dentro de una zona).
  function Chip({ nombre }) {
    const fija = bloqueadas.has(nombre)
    const estado = veredicto[nombre]
    const sel = seleccion === nombre
    let clase = 'border-bosque/20 bg-white text-tierra'
    if (fija) clase = 'border-transparent bg-musgo text-white'
    else if (estado === 'mal') clase = 'border-red-500 bg-red-50 text-red-700'
    else if (sel) clase = 'border-tierra bg-crema ring-2 ring-tierra'
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          elegirChip(nombre)
        }}
        disabled={fija}
        className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold shadow-sm transition active:scale-95 ${clase}`}
      >
        {nombre}
        {fija && ' ✓'}
        {estado === 'mal' && ' ✗'}
      </button>
    )
  }

  return (
    <div className="min-h-screen">
      <Encabezado
        titulo={`Comunidades · ${modulo.titulo}`}
        onVolver={onVolver}
      />

      <div className="mx-auto max-w-2xl px-4 pb-28">
        <p className="mb-4 text-center text-sm text-tierra/70">
          Toca una <strong>comunidad</strong> y luego la <strong>zona</strong> donde
          va. Las 22 comunidades del resguardo se reparten en tres zonas.
        </p>

        {completo && (
          <div className="mb-4 rounded-2xl bg-musgo/25 p-4 text-center font-bold text-bosque">
            🌟 ¡Ubicaste todas las comunidades en su zona!
          </div>
        )}

        {/* Pool de comunidades sin ubicar */}
        <div
          onClick={devolverAlPool}
          className="mb-5 min-h-[64px] rounded-2xl border-2 border-dashed border-bosque/25 bg-white/60 p-3"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-tierra/50">
            Por ubicar ({enPool.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {enPool.length === 0 ? (
              <span className="text-sm text-tierra/40">
                Todas ubicadas. Toca “Comprobar”.
              </span>
            ) : (
              enPool.map((c) => <Chip key={c.nombre} nombre={c.nombre} />)
            )}
          </div>
        </div>

        {/* Zonas */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {zonas.map((z) => {
            const dentro = comunidades.filter((c) => asignaciones[c.nombre] === z.id)
            return (
              <div
                key={z.id}
                onClick={() => asignarAZona(z.id)}
                className={`rounded-2xl border-2 bg-white p-3 shadow-sm transition ${
                  seleccion ? 'cursor-pointer border-dashed' : 'border-solid'
                }`}
                style={{ borderColor: z.color }}
              >
                <div
                  className="-mx-3 -mt-3 mb-3 rounded-t-xl px-3 py-2 text-white"
                  style={{ backgroundColor: z.color }}
                >
                  <p className="text-base font-bold">{z.nombre}</p>
                  <p className="text-xs text-white/85">{z.cardinal}</p>
                </div>
                <div className="flex min-h-[56px] flex-wrap gap-2">
                  {dentro.map((c) => (
                    <Chip key={c.nombre} nombre={c.nombre} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Barra inferior fija con marcador y acciones */}
      <div className="fixed inset-x-0 bottom-0 border-t border-bosque/15 bg-crema/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <span className="text-sm font-semibold text-tierra/70">
            {correctas} / {total} correctas
          </span>
          <button
            type="button"
            onClick={reiniciar}
            className="ml-auto rounded-full bg-bosque/10 px-4 py-2 text-sm font-semibold text-bosque active:scale-95"
          >
            🔄 Reiniciar
          </button>
          <div className="w-40">
            <Boton onClick={comprobar} variante="principal" disabled={Object.keys(asignaciones).length === 0}>
              Comprobar
            </Boton>
          </div>
        </div>
      </div>
    </div>
  )
}
