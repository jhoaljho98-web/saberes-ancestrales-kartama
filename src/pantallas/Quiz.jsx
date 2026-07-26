import { useMemo, useState } from 'react'
import quizzes from '../data/quizzes.json'
import modulos from '../data/modulos.json'
import Encabezado from '../componentes/Encabezado.jsx'
import Boton from '../componentes/Boton.jsx'
import { mezclar } from '../utils/mezclar.js'
import { registrarQuiz } from '../utils/almacenamiento.js'

// PANTALLA DE QUIZ
// Preguntas de opción múltiple tomadas del Kahoot de cada módulo.
// Da retroalimentación inmediata (verde = correcto, ocre = incorrecto) y al
// final muestra el puntaje, que se guarda como "mejor resultado".
// Props: moduloId, onVolver, onCompletado
export default function Quiz({ moduloId, onVolver, onCompletado }) {
  const modulo = modulos.find((m) => m.id === moduloId)

  // Barajamos el orden de las preguntas una sola vez al abrir el quiz.
  const preguntas = useMemo(() => mezclar(quizzes[moduloId]), [moduloId])

  const [indice, setIndice] = useState(0)
  const [elegida, setElegida] = useState(null) // índice de opción elegida
  const [aciertos, setAciertos] = useState(0)
  const [terminado, setTerminado] = useState(false)

  const pregunta = preguntas[indice]
  const respondida = elegida !== null

  function elegir(i) {
    if (respondida) return
    setElegida(i)
    if (pregunta.correctas.includes(i)) {
      setAciertos((n) => n + 1)
    }
  }

  function siguiente() {
    if (indice + 1 >= preguntas.length) {
      registrarQuiz(moduloId, aciertos, preguntas.length)
      onCompletado?.()
      setTerminado(true)
    } else {
      setIndice((n) => n + 1)
      setElegida(null)
    }
  }

  // --- Pantalla final ---
  if (terminado) {
    const total = preguntas.length
    const pct = Math.round((aciertos / total) * 100)
    const bien = pct >= 60
    return (
      <div className="min-h-screen">
        <Encabezado titulo={`Quiz · ${modulo.titulo}`} onVolver={onVolver} />
        <div className="mx-auto max-w-xl px-5 pb-12 text-center">
          <div className="mt-6 rounded-3xl bg-white p-8 shadow-lg">
            <div className="text-6xl">{bien ? '🌟' : '🌱'}</div>
            <h2 className="mt-4 text-2xl font-extrabold text-bosque">
              {aciertos} de {total} correctas
            </h2>
            <p className="mt-2 text-lg text-tierra/70">
              {bien
                ? '¡Muy bien! Conoces los saberes de este módulo.'
                : 'Buen intento. Repasa la lectura y vuelve a probar.'}
            </p>
            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-crema">
              <div className="h-full bg-musgo" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Boton
              onClick={() => {
                setIndice(0)
                setElegida(null)
                setAciertos(0)
                setTerminado(false)
              }}
              variante="secundario"
            >
              🔄 Intentar de nuevo
            </Boton>
            <Boton onClick={onVolver} variante="principal">
              Volver al módulo
            </Boton>
          </div>
        </div>
      </div>
    )
  }

  // --- Pregunta actual ---
  return (
    <div className="min-h-screen">
      <Encabezado titulo={`Quiz · ${modulo.titulo}`} onVolver={onVolver} />

      <div className="mx-auto max-w-xl px-5 pb-12">
        {/* Progreso */}
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-tierra/60">
          <span>
            Pregunta {indice + 1} de {preguntas.length}
          </span>
          <span>{aciertos} ✓</span>
        </div>
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-bosque/10">
          <div
            className="h-full bg-bosque transition-all"
            style={{ width: `${((indice + (respondida ? 1 : 0)) / preguntas.length) * 100}%` }}
          />
        </div>

        {/* Enunciado */}
        <h2 className="mb-5 text-xl font-bold leading-snug text-bosque">
          {pregunta.pregunta}
        </h2>

        {/* Opciones */}
        <div className="flex flex-col gap-3">
          {pregunta.opciones.map((opcion, i) => {
            const esCorrecta = pregunta.correctas.includes(i)
            let clase =
              'border-bosque/20 bg-white text-tierra hover:border-musgo'
            if (respondida) {
              if (esCorrecta) clase = 'border-musgo bg-musgo/20 text-bosque'
              else if (i === elegida)
                clase = 'border-ocre bg-ocre/15 text-ocre'
              else clase = 'border-bosque/10 bg-white text-tierra/40'
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => elegir(i)}
                disabled={respondida}
                className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left text-lg font-medium shadow-sm transition active:scale-[0.99] ${clase}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crema text-sm font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opcion}</span>
                {respondida && esCorrecta && <span>✓</span>}
                {respondida && i === elegida && !esCorrecta && <span>✗</span>}
              </button>
            )
          })}
        </div>

        {/* Botón siguiente */}
        {respondida && (
          <div className="mt-6">
            <Boton onClick={siguiente} variante="principal">
              {indice + 1 >= preguntas.length ? 'Ver resultado' : 'Siguiente pregunta'}
            </Boton>
          </div>
        )}
      </div>
    </div>
  )
}
