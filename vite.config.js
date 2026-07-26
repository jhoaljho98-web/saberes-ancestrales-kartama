import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite.
// base: './' hace que las rutas sean relativas, para poder abrir la app
// desde cualquier carpeta o servidor sencillo (útil para uso sin conexión).
export default defineConfig({
  plugins: [react()],
  base: './',
})
