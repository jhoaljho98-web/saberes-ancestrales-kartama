// Utilidades para guardar el progreso del curso en el propio celular
// usando localStorage. NO se envía nada a internet: sin cuentas, sin rastreo.
//
// Estructura guardada bajo la clave "saberes_progreso":
// {
//   modulos: {
//     m1: {
//       lecturaLeida: true,
//       quiz: { mejorAciertos: 18, total: 20 },
//       crucigrama: { resuelto: true, encontradas: 10, total: 10 }
//     },
//     ...
//   }
// }

const CLAVE = 'saberes_progreso'

// Estado inicial vacío
function estadoVacio() {
  return { modulos: {} }
}

// Lee el progreso guardado. Si no hay nada o está dañado, devuelve vacío.
export function leerProgreso() {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return estadoVacio()
    const datos = JSON.parse(crudo)
    return { ...estadoVacio(), ...datos }
  } catch (e) {
    // Si el navegador bloquea localStorage (modo privado), seguimos sin guardar.
    return estadoVacio()
  }
}

// Guarda el progreso completo.
function guardarProgreso(datos) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos))
  } catch (e) {
    // Silencioso: si no se puede guardar, la app sigue funcionando en memoria.
  }
}

// Devuelve (creando si hace falta) el sub-objeto de un módulo.
function estadoModulo(datos, moduloId) {
  if (!datos.modulos[moduloId]) datos.modulos[moduloId] = {}
  return datos.modulos[moduloId]
}

// Marca la lectura de un módulo como leída.
export function marcarLecturaLeida(moduloId) {
  const datos = leerProgreso()
  estadoModulo(datos, moduloId).lecturaLeida = true
  guardarProgreso(datos)
  return datos
}

// Guarda el resultado de un quiz (conserva el mejor puntaje).
export function registrarQuiz(moduloId, aciertos, total) {
  const datos = leerProgreso()
  const mod = estadoModulo(datos, moduloId)
  const previo = mod.quiz?.mejorAciertos || 0
  mod.quiz = { mejorAciertos: Math.max(previo, aciertos), total }
  guardarProgreso(datos)
  return datos
}

// Marca que se abrió la galería de un módulo.
export function marcarGaleriaVista(moduloId) {
  const datos = leerProgreso()
  estadoModulo(datos, moduloId).galeriaVista = true
  guardarProgreso(datos)
  return datos
}

// Guarda el avance de un crucigrama.
export function registrarCrucigrama(moduloId, encontradas, total) {
  const datos = leerProgreso()
  const mod = estadoModulo(datos, moduloId)
  const previo = mod.crucigrama?.encontradas || 0
  mod.crucigrama = {
    resuelto: encontradas >= total,
    encontradas: Math.max(previo, encontradas),
    total,
  }
  guardarProgreso(datos)
  return datos
}

// Borra todo el progreso (útil para pruebas o para "empezar de nuevo").
export function reiniciarProgreso() {
  try {
    localStorage.removeItem(CLAVE)
  } catch (e) {
    /* sin efecto */
  }
}
