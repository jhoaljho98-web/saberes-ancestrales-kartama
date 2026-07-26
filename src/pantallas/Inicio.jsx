import modulos from '../data/modulos.json'

// PANTALLA DE INICIO
// Muestra el escudo, el título del curso y la lista de los 5 módulos con su
// progreso (cuántas actividades ha completado la persona en cada uno).
// Props:
// - progreso: objeto con el avance guardado
// - onAbrirModulo: función que recibe el id del módulo elegido
export default function Inicio({ progreso, onAbrirModulo }) {
  // Cuenta cuántas de las 4 actividades del módulo están completas.
  function actividadesHechas(id) {
    const m = progreso.modulos?.[id] || {}
    let n = 0
    if (m.lecturaLeida) n++
    if (m.quiz) n++
    if (m.crucigrama?.resuelto) n++
    if (m.galeriaVista) n++ // (opcional; la galería no bloquea el progreso)
    return n
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      {/* Encabezado con el escudo */}
      <header className="mb-8 text-center">
        <img
          src="./logo.png"
          alt="Escudo del pueblo Ẽbẽra Kartama"
          className="mx-auto mb-4 h-28 w-28 object-contain drop-shadow"
        />
        <h1 className="text-3xl font-extrabold leading-tight text-bosque">
          Saberes Ancestrales
        </h1>
        <p className="mt-1 text-lg font-semibold text-ocre">
          Pueblo Ẽbẽra Kartama
        </p>
        <p className="mt-3 text-base text-tierra/70">
          Cinco módulos para reconocernos: unidad, territorio, cultura,
          autonomía y espiritualidad.
        </p>
      </header>

      {/* Lista de módulos */}
      <div className="flex flex-col gap-4">
        {modulos.map((modulo) => {
          const hechas = actividadesHechas(modulo.id)

          return (
            <button
              key={modulo.id}
              type="button"
              onClick={() => onAbrirModulo(modulo.id)}
              className="flex items-center gap-4 rounded-2xl border-2 border-bosque/15 bg-white p-5 text-left shadow-md transition hover:border-musgo active:scale-[0.99]"
            >
              {/* Ícono del módulo con su número */}
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-crema text-3xl">
                <span>{modulo.icono}</span>
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-bosque text-sm font-bold text-white">
                  {modulo.numero}
                </span>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-bosque">{modulo.titulo}</h2>
                <p className="text-sm italic text-ocre">{modulo.embera}</p>
                <p className="mt-1 text-sm text-tierra/70">{modulo.descripcion}</p>

                {/* Puntos de progreso: 4 actividades */}
                <div className="mt-2 flex items-center gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={`h-2.5 w-2.5 rounded-full ${
                        i < hechas ? 'bg-musgo' : 'bg-bosque/15'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs font-semibold text-tierra/50">
                    {hechas}/4
                  </span>
                </div>
              </div>

              <span className="text-2xl text-bosque/30">›</span>
            </button>
          )
        })}
      </div>

      <p className="mt-8 text-center text-sm text-tierra/50">
        Curso Saberes Ancestrales · Resguardo Indígena Ẽbẽra Chamí de Cartama
      </p>
    </div>
  )
}
