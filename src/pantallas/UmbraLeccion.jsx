import { useState } from 'react'
import lecciones from '../data/umbra.json'
import actividades from '../data/umbra-actividades.json'
import Encabezado from '../componentes/Encabezado.jsx'
import UmbraQuiz from '../componentes/UmbraQuiz.jsx'
import UmbraFlashcards from '../componentes/UmbraFlashcards.jsx'
import UmbraEmparejar from '../componentes/UmbraEmparejar.jsx'
import { useGuiaUmbra, RenderMarkdown } from '../utils/markdown.jsx'

export default function UmbraLeccion({ leccionId, onVolver }) {
  const lec = lecciones.find((l) => l.id === leccionId)
  const { contenido, cargando } = useGuiaUmbra(leccionId)
  const [actividadAbierta, setActividadAbierta] = useState(null)

  const datos = actividades[leccionId] || {}
  const tieneQuiz = !!datos.quiz
  const tieneFlashcards = !!datos.flashcards
  const tieneEmparejar = !!datos.emparejar

  const hayActividades = tieneQuiz || tieneFlashcards || tieneEmparejar

  function alternar(nombre) {
    setActividadAbierta((prev) => (prev === nombre ? null : nombre))
  }

  return (
    <div className="min-h-screen">
      <Encabezado
        titulo={`Lección ${lec.numero}`}
        onVolver={onVolver}
        etiquetaVolver="Umbra"
      />

      <article className="mx-auto max-w-2xl px-5 pb-12">
        <header className="mb-6 border-b border-bosque/15 pb-4">
          <div className="mb-2 flex items-center gap-3">
            <span className="text-3xl">{lec.icono}</span>
            <div>
              <h1 className="text-xl font-extrabold leading-tight text-bosque">
                {lec.titulo}
              </h1>
              <p className="text-sm text-tierra/60">{lec.descripcion}</p>
            </div>
          </div>
        </header>

        {cargando && (
          <div className="flex flex-col items-center gap-3 py-16 text-tierra/50">
            <span className="text-4xl animate-pulse">📜</span>
            <p className="font-semibold">Cargando lección...</p>
          </div>
        )}

        {!cargando && !contenido && (
          <div className="rounded-2xl border-2 border-dashed border-ocre/40 bg-ocre/5 p-6 text-center">
            <p className="text-2xl">🔧</p>
            <p className="mt-2 font-semibold text-ocre">
              Esta lección estará disponible pronto.
            </p>
          </div>
        )}

        {!cargando && contenido && <RenderMarkdown texto={contenido} />}

        {!cargando && contenido && hayActividades && (
          <section className="mt-10 border-t-2 border-bosque/15 pt-8">
            <h2 className="mb-1 text-center text-xl font-extrabold text-bosque">
              Practica lo aprendido
            </h2>
            <p className="mb-5 text-center text-sm text-tierra/60">
              Pon a prueba lo que aprendiste en esta lección
            </p>

            <div className="flex flex-col gap-3">
              {tieneQuiz && (
                <div>
                  <button
                    type="button"
                    onClick={() => alternar('quiz')}
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left font-bold transition active:scale-[0.99]
                      ${actividadAbierta === 'quiz'
                        ? 'border-bosque bg-bosque text-crema'
                        : 'border-bosque/15 bg-white text-bosque shadow-md'
                      }`}
                  >
                    <span className="text-2xl">🎯</span>
                    <div className="flex-1">
                      <span className="text-base">Quiz</span>
                      <p className="text-xs font-normal opacity-75">
                        {datos.quiz.length} preguntas de opción múltiple
                      </p>
                    </div>
                    <span className="text-xl">{actividadAbierta === 'quiz' ? '▾' : '›'}</span>
                  </button>
                  {actividadAbierta === 'quiz' && (
                    <div className="mt-3 rounded-2xl bg-crema/50 p-4">
                      <UmbraQuiz key={leccionId + '_quiz'} preguntas={datos.quiz} />
                    </div>
                  )}
                </div>
              )}

              {tieneEmparejar && (
                <div>
                  <button
                    type="button"
                    onClick={() => alternar('emparejar')}
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left font-bold transition active:scale-[0.99]
                      ${actividadAbierta === 'emparejar'
                        ? 'border-bosque bg-bosque text-crema'
                        : 'border-bosque/15 bg-white text-bosque shadow-md'
                      }`}
                  >
                    <span className="text-2xl">🔗</span>
                    <div className="flex-1">
                      <span className="text-base">Emparejar</span>
                      <p className="text-xs font-normal opacity-75">
                        Conecta cada término con su significado
                      </p>
                    </div>
                    <span className="text-xl">{actividadAbierta === 'emparejar' ? '▾' : '›'}</span>
                  </button>
                  {actividadAbierta === 'emparejar' && (
                    <div className="mt-3 rounded-2xl bg-crema/50 p-4">
                      <UmbraEmparejar key={leccionId + '_emp'} pares={datos.emparejar} />
                    </div>
                  )}
                </div>
              )}

              {tieneFlashcards && (
                <div>
                  <button
                    type="button"
                    onClick={() => alternar('flashcards')}
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left font-bold transition active:scale-[0.99]
                      ${actividadAbierta === 'flashcards'
                        ? 'border-bosque bg-bosque text-crema'
                        : 'border-bosque/15 bg-white text-bosque shadow-md'
                      }`}
                  >
                    <span className="text-2xl">📚</span>
                    <div className="flex-1">
                      <span className="text-base">Tarjetas de vocabulario</span>
                      <p className="text-xs font-normal opacity-75">
                        {datos.flashcards.length} tarjetas para memorizar
                      </p>
                    </div>
                    <span className="text-xl">{actividadAbierta === 'flashcards' ? '▾' : '›'}</span>
                  </button>
                  {actividadAbierta === 'flashcards' && (
                    <div className="mt-3 rounded-2xl bg-crema/50 p-4">
                      <UmbraFlashcards key={leccionId + '_fc'} tarjetas={datos.flashcards} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}
