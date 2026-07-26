import { useEffect, useState } from 'react'
import galerias from '../data/galerias.json'
import modulos from '../data/modulos.json'
import Encabezado from '../componentes/Encabezado.jsx'
import { marcarGaleriaVista } from '../utils/almacenamiento.js'

// PANTALLA DE GALERÍA
// Muestra fotos reales de la comunidad relacionadas con el módulo, en una
// cuadrícula. Al tocar una foto se abre en grande (lightbox sencillo).
// Props: moduloId, onVolver
export default function Galeria({ moduloId, onVolver }) {
  const modulo = modulos.find((m) => m.id === moduloId)
  const fotos = galerias[moduloId] || []
  const [abierta, setAbierta] = useState(null) // índice de la foto ampliada

  // Al abrir la galería, la marcamos como vista (cuenta en el progreso).
  useEffect(() => {
    marcarGaleriaVista(moduloId)
  }, [moduloId])

  return (
    <div className="min-h-screen">
      <Encabezado titulo={`Galería · ${modulo.titulo}`} onVolver={onVolver} />

      <div className="mx-auto max-w-2xl px-4 pb-12">
        <p className="mb-4 text-center text-sm text-tierra/60">
          Imágenes de nuestra comunidad. Toca una foto para verla en grande.
        </p>

        {fotos.length === 0 ? (
          <p className="mt-8 text-center text-tierra/50">
            Aún no hay fotos cargadas para este módulo.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {fotos.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAbierta(i)}
                className="aspect-square overflow-hidden rounded-2xl bg-white shadow-md transition active:scale-[0.98]"
              >
                <img
                  src={src}
                  alt={`Foto ${i + 1} del módulo ${modulo.titulo}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {abierta !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-tierra/90 p-4"
          onClick={() => setAbierta(null)}
        >
          <button
            type="button"
            onClick={() => setAbierta(null)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-2xl text-white"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <img
            src={fotos[abierta]}
            alt={`Foto ${abierta + 1} ampliada`}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
