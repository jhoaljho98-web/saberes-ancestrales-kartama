import { useState } from 'react'
import Inicio from './pantallas/Inicio.jsx'
import Modulo from './pantallas/Modulo.jsx'
import Lectura from './pantallas/Lectura.jsx'
import Quiz from './pantallas/Quiz.jsx'
import Crucigrama from './pantallas/Crucigrama.jsx'
import Sopa from './pantallas/Sopa.jsx'
import Galeria from './pantallas/Galeria.jsx'
import Himnos from './pantallas/Himnos.jsx'
import modulos from './data/modulos.json'
import galerias from './data/galerias.json'
import { leerProgreso } from './utils/almacenamiento.js'

// COMPONENTE PRINCIPAL
// Controla qué pantalla se ve. No usamos librería de rutas para mantener la
// app ligera y que funcione bien en celulares de gama baja y sin conexión.
export default function App() {
  // Pantalla actual: 'inicio' | 'modulo' | 'lectura' | 'quiz' | 'crucigrama' | 'galeria'
  const [vista, setVista] = useState('inicio')
  // Módulo abierto actualmente (id: 'm1'...'m5')
  const [moduloId, setModuloId] = useState(null)
  // Progreso del usuario (leído del celular al arrancar)
  const [progreso, setProgreso] = useState(() => leerProgreso())

  // Refresca el progreso desde el almacenamiento (tras completar una actividad).
  function refrescar() {
    setProgreso(leerProgreso())
  }

  // Abrir el hub de un módulo desde el inicio.
  function abrirModulo(id) {
    setModuloId(id)
    setVista('modulo')
  }

  // Abrir una actividad dentro del módulo actual.
  function abrirActividad(actividad) {
    setVista(actividad)
  }

  // Volver al hub del módulo (refrescando el progreso por si cambió).
  function volverAlModulo() {
    refrescar()
    setVista('modulo')
  }

  // Volver al inicio.
  function volverAlInicio() {
    refrescar()
    setVista('inicio')
  }

  // --- Pantallas de actividad (necesitan un módulo activo) ---
  if (vista === 'lectura') {
    return <Lectura moduloId={moduloId} onVolver={volverAlModulo} onLeida={refrescar} />
  }
  if (vista === 'quiz') {
    return <Quiz moduloId={moduloId} onVolver={volverAlModulo} onCompletado={refrescar} />
  }
  if (vista === 'crucigrama') {
    return <Crucigrama moduloId={moduloId} onVolver={volverAlModulo} onAvance={refrescar} />
  }
  if (vista === 'sopa') {
    return <Sopa moduloId={moduloId} onVolver={volverAlModulo} onAvance={refrescar} />
  }
  if (vista === 'galeria') {
    const modulo = modulos.find((m) => m.id === moduloId)
    return (
      <Galeria
        titulo={`Galería · ${modulo.titulo}`}
        fotos={galerias[moduloId]}
        moduloId={moduloId}
        onVolver={volverAlModulo}
      />
    )
  }

  // Galería general del proceso del curso (se abre desde el inicio).
  if (vista === 'proceso') {
    return (
      <Galeria
        titulo="Nuestro proceso"
        fotos={galerias.proceso}
        onVolver={volverAlInicio}
      />
    )
  }

  // Himnos del pueblo (se abre desde el inicio).
  if (vista === 'himnos') {
    return <Himnos onVolver={volverAlInicio} />
  }

  // --- Hub del módulo ---
  if (vista === 'modulo') {
    return (
      <Modulo
        moduloId={moduloId}
        progreso={progreso}
        onAbrirActividad={abrirActividad}
        onVolver={volverAlInicio}
      />
    )
  }

  // --- Vista por defecto: inicio ---
  return (
    <Inicio
      progreso={progreso}
      onAbrirModulo={abrirModulo}
      onAbrirProceso={() => setVista('proceso')}
      onAbrirHimnos={() => setVista('himnos')}
    />
  )
}
