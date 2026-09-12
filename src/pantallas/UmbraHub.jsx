import lecciones from '../data/umbra.json'
import Encabezado from '../componentes/Encabezado.jsx'

export default function UmbraHub({ onAbrirLeccion, onVolver }) {
  return (
    <div className="min-h-screen">
      <Encabezado titulo="Lengua Umbra" onVolver={onVolver} etiquetaVolver="Inicio" />

      <div className="mx-auto max-w-xl px-4 pb-10">
        <div className="mb-6 rounded-3xl bg-bosque p-6 text-center text-crema shadow-lg">
          <div className="text-5xl">🏛️</div>
          <h2 className="mt-2 text-2xl font-extrabold">Lengua y Cultura Umbra</h2>
          <p className="text-lg italic text-musgo">ĩ xũnxũrai Umbra</p>
          <p className="mt-3 text-sm text-crema/85">
            Diez lecciones para conocer la lengua ancestral del occidente de
            Caldas: historia, fonología, vocabulario, gramática y cultura.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {lecciones.map((lec) => (
            <button
              key={lec.id}
              type="button"
              onClick={() => onAbrirLeccion(lec.id)}
              className="flex items-center gap-4 rounded-2xl border-2 border-bosque/15 bg-white p-4 text-left shadow-md transition hover:border-musgo active:scale-[0.99]"
            >
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-crema text-2xl">
                <span>{lec.icono}</span>
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-bosque text-xs font-bold text-white">
                  {lec.numero}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold leading-tight text-bosque">{lec.titulo}</h3>
                <p className="mt-1 text-sm text-tierra/70">{lec.descripcion}</p>
              </div>
              <span className="text-2xl text-bosque/30">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
