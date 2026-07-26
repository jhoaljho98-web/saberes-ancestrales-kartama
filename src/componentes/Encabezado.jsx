// Barra superior con botón de "volver" y un título.
// Se usa en las pantallas internas (lectura, quiz, crucigrama, galería, módulo).
// Props:
// - titulo: texto del centro
// - onVolver: función para regresar
// - etiquetaVolver: texto del botón (por defecto "Volver")
export default function Encabezado({ titulo, onVolver, etiquetaVolver = 'Volver' }) {
  return (
    <div className="sticky top-0 z-10 mb-4 flex items-center gap-3 border-b border-bosque/15 bg-crema/95 px-4 py-3 backdrop-blur">
      <button
        type="button"
        onClick={onVolver}
        className="flex items-center gap-1 rounded-full bg-bosque/10 px-3 py-2 font-semibold text-bosque transition active:scale-95"
      >
        <span className="text-xl leading-none">‹</span>
        <span className="text-sm">{etiquetaVolver}</span>
      </button>
      <h1 className="flex-1 truncate text-center text-lg font-bold text-bosque">
        {titulo}
      </h1>
      {/* Espaciador para centrar el título */}
      <span className="w-[72px]" aria-hidden="true" />
    </div>
  )
}
