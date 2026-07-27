import himnos from '../data/himnos.json'
import Encabezado from '../componentes/Encabezado.jsx'

// PANTALLA DE HIMNOS
// Reproduce los himnos del pueblo. Los videos NO se descargan hasta que la
// persona toca reproducir (preload="none"), para no gastar datos de quien no
// los ve. Funcionan sin conexión una vez cargada la app.
// Props: onVolver
export default function Himnos({ onVolver }) {
  return (
    <div className="min-h-screen">
      <Encabezado titulo="Himnos" onVolver={onVolver} etiquetaVolver="Inicio" />

      <div className="mx-auto max-w-2xl px-4 pb-12">
        <p className="mb-6 text-center text-sm text-tierra/60">
          Nuestros cantos. Toca ▶ para reproducir cada himno.
        </p>

        <div className="flex flex-col gap-8">
          {himnos.map((h) => (
            <section key={h.id} className="rounded-3xl bg-white p-4 shadow-md">
              <video
                controls
                playsInline
                preload="none"
                poster={h.poster}
                className="w-full rounded-2xl bg-black"
              >
                <source src={h.video} type="video/mp4" />
                Tu navegador no puede reproducir este video.
              </video>

              <div className="mt-3">
                <h2 className="text-xl font-bold text-bosque">{h.titulo}</h2>
                <p className="text-sm font-semibold text-ocre">{h.creditos}</p>
                <p className="mt-1 text-sm text-tierra/70">{h.descripcion}</p>
              </div>
            </section>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-tierra/50">
          Los videos se descargan solo al reproducirlos, para cuidar tus datos.
        </p>
      </div>
    </div>
  )
}
