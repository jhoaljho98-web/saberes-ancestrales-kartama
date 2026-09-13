import { useMemo, useState } from 'react'
import { mezclar } from '../utils/mezclar.js'

export default function UmbraQuiz({ preguntas }) {
  const mezcladas = useMemo(() => mezclar(preguntas), [preguntas])
  const [indice, setIndice] = useState(0)
  const [elegida, setElegida] = useState(null)
  const [aciertos, setAciertos] = useState(0)
  const [terminado, setTerminado] = useState(false)

  const pregunta = mezcladas[indice]
  const respondida = elegida !== null

  function elegir(i) {
    if (respondida) return
    setElegida(i)
    if (i === pregunta.correcta) setAciertos((n) => n + 1)
  }

  function siguiente() {
    if (indice + 1 >= mezcladas.length) {
      setTerminado(true)
    } else {
      setIndice((n) => n + 1)
      setElegida(null)
    }
  }

  function reiniciar() {
    setIndice(0)
    setElegida(null)
    setAciertos(0)
    setTerminado(false)
  }

  if (terminado) {
    const pct = Math.round((aciertos / mezcladas.length) * 100)
    const bien = pct >= 60
    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow-md">
        <div className="text-5xl">{bien ? '🌟' : '🌱'}</div>
        <h3 className="mt-3 text-xl font-extrabold text-bosque">
          {aciertos} de {mezcladas.length} correctas
        </h3>
        <p className="mt-1 text-sm text-tierra/70">
          {bien
            ? '¡Excelente! Dominas los saberes de esta lección.'
            : 'Buen intento. Repasa la lección y vuelve a probar.'}
        </p>
        <div className="mx-auto mt-3 h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-crema">
          <div className="h-full bg-musgo transition-all" style={{ width: `${pct}%` }} />
        </div>
        <button
          type="button"
          onClick={reiniciar}
          className="mt-4 rounded-xl bg-bosque/10 px-5 py-2.5 text-sm font-bold text-bosque active:scale-95"
        >
          🔄 Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-tierra/60">
        <span>Pregunta {indice + 1} de {mezcladas.length}</span>
        <span>{aciertos} ✓</span>
      </div>
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-bosque/10">
        <div
          className="h-full bg-bosque transition-all"
          style={{ width: `${((indice + (respondida ? 1 : 0)) / mezcladas.length) * 100}%` }}
        />
      </div>

      <h3 className="mb-4 text-lg font-bold leading-snug text-bosque">
        {pregunta.pregunta}
      </h3>

      <div className="flex flex-col gap-2.5">
        {pregunta.opciones.map((opcion, i) => {
          const esCorrecta = i === pregunta.correcta
          let clase = 'border-bosque/20 bg-white text-tierra'
          if (respondida) {
            if (esCorrecta) clase = 'border-musgo bg-musgo/20 text-bosque'
            else if (i === elegida) clase = 'border-ocre bg-ocre/15 text-ocre'
            else clase = 'border-bosque/10 bg-white text-tierra/40'
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => elegir(i)}
              disabled={respondida}
              className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left text-base font-medium shadow-sm transition active:scale-[0.99] ${clase}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-crema text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opcion}</span>
              {respondida && esCorrecta && <span>✓</span>}
              {respondida && i === elegida && !esCorrecta && <span>✗</span>}
            </button>
          )
        })}
      </div>

      {respondida && (
        <button
          type="button"
          onClick={siguiente}
          className="mt-4 w-full rounded-xl bg-bosque py-3 text-base font-bold text-crema shadow-md active:scale-[0.98]"
        >
          {indice + 1 >= mezcladas.length ? 'Ver resultado' : 'Siguiente'}
        </button>
      )}
    </div>
  )
}
