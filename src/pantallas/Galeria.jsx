import { useEffect, useState } from 'react'
import Encabezado from '../componentes/Encabezado.jsx'
import { marcarGaleriaVista } from '../utils/almacenamiento.js'

// PANTALLA DE GALERÍA (genérica)
// Muestra un conjunto de fotos en cuadrícula; al tocar una se abre en grande
// (lightbox sencillo). Sirve tanto para la galería de un módulo como para la
// galería general "Nuestro proceso".
// Props:
// - titulo: texto del encabezado
// - fotos: lista de rutas de imagen
// - moduloId: (opcional) si viene, marca la galería del módulo como vista
// - onVolver: regresar
export default function Galeria({ titulo, fotos = [], moduloId, onVolver }) {
  const [abierta, setAbierta] = useState(null) // índice de la foto ampliada

  // Si es la galería de un módulo, la marcamos como vista (cuenta en el progreso).
  useEffect(() => {
    if (moduloId) marcarGaleriaVista(moduloId)
  }, [moduloId])

  return (
    <div className="min-h-screen">
      <Encabezado titulo={titulo} onVolver={onVolver} />

      <div className="mx-auto max-w-2xl px-4 pb-12">
        <p className="mb-4 text-center text-sm text-tierra/60">
          Imágenes de nuestra comunidad. Toca una foto para verla en grande.
        </p>

        {fotos.length === 0 ? (
          <p className="mt-8 text-center text-tierra/50">
            Aún no hay fotos cargadas.
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
                  alt={`Foto ${i + 1}`}
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
