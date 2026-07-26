// Botón grande y reutilizable de la app.
// Props:
// - onClick: qué hacer al tocarlo
// - children: el texto o contenido del botón
// - variante: "principal" | "secundario" | "musgo" | "ocre"
// - disabled: si está desactivado
// - className: clases extra opcionales
export default function Boton({
  onClick,
  children,
  variante = 'principal',
  disabled = false,
  className = '',
  type = 'button',
}) {
  // Estilos según la variante de color (paleta Forest & Moss)
  const estilos = {
    principal: 'bg-bosque text-crema hover:brightness-110',
    secundario: 'bg-crema text-bosque border-2 border-bosque hover:bg-white',
    musgo: 'bg-musgo text-tierra hover:brightness-105',
    ocre: 'bg-ocre text-white hover:brightness-110',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl px-6 py-4 text-xl font-bold shadow-md
        transition active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-50
        ${estilos[variante]} ${className}`}
    >
      {children}
    </button>
  )
}
