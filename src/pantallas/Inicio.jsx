import modulos from '../data/modulos.json'

// PANTALLA DE INICIO
// Muestra el escudo, el título del curso y la lista de los 5 módulos con su
// progreso (cuántas actividades ha completado la persona en cada uno).
// Props:
// - progreso: objeto con el avance guardado
// - onAbrirModulo: función que recibe el id del módulo elegido
export default function Inicio({ progreso, onAbrirModulo, onAbrirProceso, onAbrirHimnos }) {
  // Cuenta cuántas de las 4 actividades del módulo están completas.
  function actividadesHechas(id) {
    const m = progreso.modulos?.[id] || {}
    let n = 0
    if (m.lecturaLeida) n++
    if (m.quiz) n++
    if (m.crucigrama?.resuelto) n++
    if (m.sopa?.resuelto) n++
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
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={`h-2.5 w-2.5 rounded-full ${
                        i < hechas ? 'bg-musgo' : 'bg-bosque/15'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs font-semibold text-tierra/50">
                    {hechas}/5
                  </span>
                </div>
              </div>

              <span className="text-2xl text-bosque/30">›</span>
            </button>
          )
        })}
      </div>

      {/* Himnos del pueblo */}
      <button
        type="button"
        onClick={onAbrirHimnos}
        className="mt-4 flex w-full items-center gap-4 rounded-2xl bg-bosque p-5 text-left text-white shadow-md transition active:scale-[0.99]"
      >
        <span className="text-3xl">🎵</span>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Himnos</h2>
          <p className="text-sm text-white/85">
            El himno del pueblo Ẽbẽra y el de la Guardia Indígena.
          </p>
        </div>
        <span className="text-2xl text-white/70">›</span>
      </button>

      {/* Galería general del proceso del curso */}
      <button
        type="button"
        onClick={onAbrirProceso}
        className="mt-3 flex w-full items-center gap-4 rounded-2xl bg-ocre p-5 text-left text-white shadow-md transition active:scale-[0.99]"
      >
        <span className="text-3xl">📸</span>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Nuestro proceso</h2>
          <p className="text-sm text-white/85">
            Fotos de los encuentros y la comunidad viviendo el curso.
          </p>
        </div>
        <span className="text-2xl text-white/70">›</span>
      </button>

      {/* Facebook del Resguardo */}
      <a
        href="https://www.facebook.com/share/1DJgUrg9Ch/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center gap-4 rounded-2xl p-5 text-left text-white shadow-md transition active:scale-[0.99]"
        style={{ backgroundColor: '#1877F2' }}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0" fill="currentColor" aria-hidden="true">
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.14 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7C18.34 21.2 22 17.06 22 12.06Z" />
        </svg>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Comunidad Indígena Kartama</h2>
          <p className="text-sm text-white/85">
            Síguenos en Facebook y entérate de lo que vive el Resguardo.
          </p>
        </div>
        <span className="text-2xl text-white/70">›</span>
      </a>

      <p className="mt-8 text-center text-sm text-tierra/50">
        Curso Saberes Ancestrales · Resguardo Indígena Ẽbẽra Chamí de Cartama
      </p>
    </div>
  )
}
