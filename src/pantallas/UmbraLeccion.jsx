import lecciones from '../data/umbra.json'
import Encabezado from '../componentes/Encabezado.jsx'
import { useGuiaUmbra, RenderMarkdown } from '../utils/markdown.jsx'

export default function UmbraLeccion({ leccionId, onVolver }) {
  const lec = lecciones.find((l) => l.id === leccionId)
  const { contenido, cargando } = useGuiaUmbra(leccionId)

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
      </article>
    </div>
  )
}
