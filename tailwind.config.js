/** @type {import('tailwindcss').Config} */
// Configuración de Tailwind CSS.
// Paleta FOREST & MOSS del pueblo Ẽbẽra Kartama. Si la comunidad quiere
// cambiar un color, solo edita el valor aquí y se actualiza en toda la app.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bosque: '#2C5F2D', // verde bosque — color principal
        musgo: '#97BC62', // musgo — acentos y avance
        ocre: '#9A6600', // ocre — detalles y énfasis
        crema: '#F4F1E8', // crema — fondo cálido
        tierra: '#3A2E1F', // marrón oscuro — texto
      },
      fontFamily: {
        // Fuente amplia y legible; el sistema elige la disponible.
        sans: ['"Segoe UI"', 'system-ui', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
