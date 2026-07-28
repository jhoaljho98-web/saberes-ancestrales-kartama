import modulos from '../data/modulos.json'
import lecturas from '../data/lecturas.json'
import Encabezado from '../componentes/Encabezado.jsx'

// PANTALLA HUB DE UN MÓDULO
// Muestra la portada del módulo y sus 4 actividades: Lectura, Quiz,
// Crucigrama y Galería. Cada tarjeta indica si ya está completada.
// Props:
// - moduloId: 'm1'...'m5'
// - progreso: avance guardado
// - onAbrirActividad: recibe 'lectura' | 'quiz' | 'crucigrama' | 'galeria'
// - onVolver: regresar al inicio
export default function Modulo({ moduloId, progreso, onAbrirActividad, onVolver }) {
  const modulo = modulos.find((m) => m.id === moduloId)
  const lectura = lecturas[moduloId]
  const avance = progreso.modulos?.[moduloId] || {}

  // Definición de las 4 actividades con su estado.
  const actividades = [
    {
      clave: 'lectura',
      icono: '📖',
      titulo: 'Lectura',
      descripcion: lectura?.completa
        ? 'Lee la historia del módulo y reflexiona.'
        : 'Introducción al módulo (lectura completa pronto).',
      estado: avance.lecturaLeida ? 'Leída' : null,
    },
    {
      clave: 'quiz',
      icono: '❓',
      titulo: 'Quiz',
      descripcion: 'Pon a prueba lo que aprendiste.',
      estado: avance.quiz ? `Mejor: ${avance.quiz.mejorAciertos}/${avance.quiz.total}` : null,
    },
    {
      clave: 'crucigrama',
      icono: '🧩',
      titulo: 'Crucigrama',
      descripcion: 'Descubre las palabras clave del módulo.',
      estado: avance.crucigrama
        ? avance.crucigrama.resuelto
          ? 'Resuelto ✓'
          : `${avance.crucigrama.encontradas}/${avance.crucigrama.total}`
        : null,
    },
    {
      clave: 'sopa',
      icono: '🔎',
      titulo: 'Sopa de letras',
      descripcion: 'Busca las palabras escondidas en la cuadrícula.',
      estado: avance.sopa
        ? avance.sopa.resuelto
          ? 'Resuelta ✓'
          : `${avance.sopa.encontradas}/${avance.sopa.total}`
        : null,
    },
    // Juego exclusivo del Módulo 2 (Territorio): ubicar las comunidades.
    ...(moduloId === 'm2'
      ? [
          {
            clave: 'comunidades',
            icono: '🗺️',
            titulo: 'Ubica las comunidades',
            descripcion: 'Coloca las 22 comunidades en su zona.',
            estado: avance.comunidades
              ? avance.comunidades.resuelto
                ? 'Resuelto ✓'
                : `${avance.comunidades.aciertos}/${avance.comunidades.total}`
              : null,
          },
        ]
      : []),
    {
      clave: 'galeria',
      icono: '🖼️',
      titulo: 'Galería',
      descripcion: 'Fotos reales de nuestra comunidad.',
      estado: null,
    },
  ]

  return (
    <div className="min-h-screen">
      <Encabezado
        titulo={`Módulo ${modulo.numero}`}
        onVolver={onVolver}
        etiquetaVolver="Inicio"
      />

      <div className="mx-auto max-w-xl px-4 pb-10">
        {/* Portada del módulo */}
        <div className="mb-6 rounded-3xl bg-bosque p-6 text-center text-crema shadow-lg">
          <div className="text-5xl">{modulo.icono}</div>
          <h2 className="mt-2 text-2xl font-extrabold">{modulo.titulo}</h2>
          <p className="text-lg italic text-musgo">{modulo.embera}</p>
          <p className="mt-3 text-sm text-crema/85">{modulo.descripcion}</p>
        </div>

        {/* Tarjetas de actividad */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {actividades.map((act) => (
            <button
              key={act.clave}
              type="button"
              onClick={() => onAbrirActividad(act.clave)}
              className="flex items-start gap-3 rounded-2xl border-2 border-bosque/15 bg-white p-4 text-left shadow-md transition hover:border-musgo active:scale-[0.99]"
            >
              <span className="text-3xl">{act.icono}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-bosque">{act.titulo}</h3>
                  {act.estado && (
                    <span className="rounded-full bg-musgo/25 px-2 py-0.5 text-xs font-semibold text-bosque">
                      {act.estado}
                    </span>
                  )}
                </div>
                <p className="text-sm text-tierra/70">{act.descripcion}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
