import { useMemo, useState } from 'react'
import { mezclar } from '../utils/mezclar.js'

export default function UmbraFlashcards({ tarjetas }) {
  const mezcladas = useMemo(() => mezclar(tarjetas), [tarjetas])
  const [indice, setIndice] = useState(0)
  const [volteada, setVolteada] = useState(false)

  const tarjeta = mezcladas[indice]
  const total = mezcladas.length

  function avanzar() {
    setVolteada(false)
    setIndice((n) => (n + 1) % total)
  }

  function retroceder() {
    setVolteada(false)
    setIndice((n) => (n - 1 + total) % total)
  }

  return (
    <div>
      <div className="mb-3 text-center text-sm font-semibold text-tierra/60">
        {indice + 1} de {total}
      </div>

      <button
        type="button"
        onClick={() => setVolteada(!volteada)}
        className="mx-auto block w-full max-w-sm rounded-2xl border-2 border-bosque/15 bg-white p-8 shadow-lg transition active:scale-[0.98]"
        style={{ minHeight: 180 }}
      >
        {!volteada ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl font-extrabold text-bosque">{tarjeta.umbra}</span>
            <span className="text-sm text-tierra/50">Toca para ver la respuesta</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-semibold text-ocre">{tarjeta.pronunciacion}</span>
            <span className="text-2xl font-bold text-bosque">{tarjeta.espanol}</span>
            <span className="mt-1 text-xs text-tierra/40">Toca para ocultar</span>
          </div>
        )}
      </button>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={retroceder}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-bosque/10 text-lg font-bold text-bosque active:scale-90"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={avanzar}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-bosque/10 text-lg font-bold text-bosque active:scale-90"
        >
          ›
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-1">
        {mezcladas.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${i === indice ? 'bg-bosque' : 'bg-bosque/20'}`}
          />
        ))}
      </div>
    </div>
  )
}
