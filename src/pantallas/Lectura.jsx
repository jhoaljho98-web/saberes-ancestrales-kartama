import lecturas from '../data/lecturas.json'
import modulos from '../data/modulos.json'
import Encabezado from '../componentes/Encabezado.jsx'
import Boton from '../componentes/Boton.jsx'
import { marcarLecturaLeida } from '../utils/almacenamiento.js'

// Resalta en negrita el término inicial de una viñeta (lo que va antes del
// primer ":"), cuando ese término es corto. Ej.: "Ruda: alivia dolores..."
function resaltarLead(texto) {
  const i = texto.indexOf(':')
  if (i > 0 && i < 40) {
    return (
      <>
        <strong className="text-bosque">{texto.slice(0, i)}</strong>
        {texto.slice(i)}
      </>
    )
  }
  return texto
}

// PANTALLA DE LECTURA
// Muestra el texto del módulo, formateado para leer cómodo en el celular.
// El Módulo 1 trae la lectura completa; los demás muestran una introducción
// mientras se termina de digitalizar su lectura.
// Props: moduloId, onVolver, onLeida
export default function Lectura({ moduloId, onVolver, onLeida }) {
  const modulo = modulos.find((m) => m.id === moduloId)
  const lectura = lecturas[moduloId]

  function finalizar() {
    marcarLecturaLeida(moduloId)
    onLeida?.()
    onVolver()
  }

  return (
    <div className="min-h-screen">
      <Encabezado titulo={`Lectura · ${modulo.titulo}`} onVolver={onVolver} />

      <article className="mx-auto max-w-2xl px-5 pb-12">
        {/* Título de la lectura */}
        <header className="mb-6 border-b border-bosque/15 pb-4">
          <h1 className="text-2xl font-extrabold leading-tight text-bosque">
            {lectura.titulo}
          </h1>
          {lectura.subtitulo && (
            <p className="mt-1 text-lg italic text-ocre">{lectura.subtitulo}</p>
          )}
          {lectura.meta && (
            <p className="mt-2 text-xs font-medium text-tierra/50">{lectura.meta}</p>
          )}
        </header>

        {/* Intro */}
        {lectura.intro && (
          <p className="mb-6 rounded-2xl bg-crema/70 p-4 text-tierra/85">
            {lectura.intro}
          </p>
        )}

        {/* --- Lectura completa (Módulo 1) --- */}
        {lectura.completa &&
          lectura.secciones.map((sec, i) => (
            <section key={i} className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-bosque">{sec.titulo}</h2>

              {sec.parrafos?.map((p, j) => (
                <p key={j} className="mb-4 leading-relaxed text-tierra/90">
                  {p}
                </p>
              ))}

              {/* Viñetas, si la sección las tiene */}
              {sec.bullets && (
                <ul className="my-4 flex flex-col gap-2">
                  {sec.bullets.map((b, k) => (
                    <li key={k} className="flex gap-2 leading-relaxed text-tierra/90">
                      <span className="mt-1 text-musgo">●</span>
                      <span>{resaltarLead(b)}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Cita destacada, si la sección la tiene */}
              {sec.cita && (
                <blockquote className="my-4 border-l-4 border-ocre bg-ocre/5 py-3 pl-4 pr-3 text-lg italic text-tierra/85">
                  “{sec.cita}”
                </blockquote>
              )}

              {/* Lista de principios, si la sección los tiene */}
              {sec.principios && (
                <ul className="my-4 flex flex-col gap-3">
                  {sec.principios.map((pr, k) => (
                    <li
                      key={k}
                      className="rounded-2xl border-l-4 border-musgo bg-white p-4 shadow-sm"
                    >
                      <p className="font-bold text-bosque">
                        {pr.titulo}{' '}
                        <span className="text-sm font-normal italic text-ocre">
                          ({pr.embera})
                        </span>
                      </p>
                      <p className="mt-1 text-tierra/85">{pr.texto}</p>
                    </li>
                  ))}
                </ul>
              )}

              {sec.cierre && (
                <p className="mt-4 leading-relaxed text-tierra/90">{sec.cierre}</p>
              )}
            </section>
          ))}

        {/* Preguntas para reflexionar */}
        {lectura.reflexion && (
          <section className="mb-8 rounded-2xl bg-bosque/5 p-5">
            <h2 className="mb-3 text-xl font-bold text-bosque">Para reflexionar</h2>
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-tierra/90">
              {lectura.reflexion.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </section>
        )}

        {/* Referencias */}
        {lectura.referencias && (
          <section className="mb-8">
            <h2 className="mb-2 text-base font-bold text-tierra/70">Referencias</h2>
            <ul className="flex flex-col gap-2 text-sm text-tierra/60">
              {lectura.referencias.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Aviso para módulos con lectura pendiente */}
        {!lectura.completa && (
          <div className="mb-8 rounded-2xl border-2 border-dashed border-ocre/40 bg-ocre/5 p-5 text-center">
            <p className="text-2xl">📝</p>
            <p className="mt-2 font-semibold text-ocre">
              La lectura completa de este módulo estará disponible pronto.
            </p>
            <p className="mt-1 text-sm text-tierra/60">
              Mientras tanto, puedes hacer el quiz, el crucigrama y ver la galería.
            </p>
          </div>
        )}

        {/* Botón para marcar como leída */}
        <Boton onClick={finalizar} variante="principal">
          {lectura.completa ? '✓ Terminé la lectura' : '✓ Entendido, volver al módulo'}
        </Boton>
      </article>
    </div>
  )
}
