import { useMemo, useState } from 'react'
import { mezclar } from '../utils/mezclar.js'

export default function UmbraEmparejar({ pares }) {
  const columnaIzq = useMemo(() => mezclar(pares), [pares])
  const columnaDer = useMemo(() => mezclar(pares), [pares])

  const [selIzq, setSelIzq] = useState(null)
  const [resueltos, setResueltos] = useState(new Set())
  const [error, setError] = useState(null)

  const total = pares.length
  const completo = resueltos.size === total

  function elegirIzq(i) {
    if (resueltos.has(columnaIzq[i].izq)) return
    setSelIzq(i)
    setError(null)
  }

  function elegirDer(j) {
    if (selIzq === null) return
    if (resueltos.has(columnaDer[j].izq)) return

    const parIzq = columnaIzq[selIzq]
    const parDer = columnaDer[j]

    if (parIzq.izq === parDer.izq) {
      setResueltos((prev) => new Set([...prev, parIzq.izq]))
      setSelIzq(null)
      setError(null)
    } else {
      setError({ izq: selIzq, der: j })
      setTimeout(() => {
        setError(null)
        setSelIzq(null)
      }, 600)
    }
  }

  function reiniciar() {
    setResueltos(new Set())
    setSelIzq(null)
    setError(null)
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-tierra/60">
          {resueltos.size} de {total} pares
        </span>
        {resueltos.size > 0 && !completo && (
          <button
            type="button"
            onClick={reiniciar}
            className="rounded-full bg-bosque/10 px-3 py-1 text-xs font-bold text-bosque active:scale-95"
          >
            🔄 Reiniciar
          </button>
        )}
      </div>

      {completo && (
        <div className="mb-4 rounded-2xl bg-musgo/25 p-4 text-center font-bold text-bosque">
          🌟 ¡Emparejaste todos los pares!
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          {columnaIzq.map((par, i) => {
            const resuelto = resueltos.has(par.izq)
            const sel = selIzq === i
            const err = error?.izq === i
            return (
              <button
                key={par.izq}
                type="button"
                onClick={() => elegirIzq(i)}
                disabled={resuelto}
                className={`rounded-xl border-2 px-3 py-2.5 text-left text-sm font-bold transition
                  ${resuelto
                    ? 'border-musgo/30 bg-musgo/15 text-musgo line-through opacity-60'
                    : sel
                      ? 'border-bosque bg-bosque/10 text-bosque'
                      : err
                        ? 'border-red-400 bg-red-50 text-red-600'
                        : 'border-bosque/15 bg-white text-tierra active:scale-[0.98]'
                  }`}
              >
                {par.izq}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-2">
          {columnaDer.map((par, j) => {
            const resuelto = resueltos.has(par.izq)
            const err = error?.der === j
            return (
              <button
                key={par.izq + '_r'}
                type="button"
                onClick={() => elegirDer(j)}
                disabled={resuelto || selIzq === null}
                className={`rounded-xl border-2 px-3 py-2.5 text-left text-sm font-medium transition
                  ${resuelto
                    ? 'border-musgo/30 bg-musgo/15 text-musgo line-through opacity-60'
                    : err
                      ? 'border-red-400 bg-red-50 text-red-600'
                      : 'border-bosque/15 bg-white text-tierra active:scale-[0.98]'
                  }`}
              >
                {par.der}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
