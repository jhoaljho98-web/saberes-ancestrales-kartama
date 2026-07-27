// Generador de sopas de letras.
// Recibe una lista de { palabra, pista } y arma una cuadrícula cuadrada donde
// las palabras quedan escondidas en 8 direcciones (horizontal, vertical,
// diagonal, y también invertidas). Las casillas sobrantes se rellenan con
// letras al azar. Es determinista por módulo (usa una semilla), así la misma
// sopa se ve igual entre sesiones.
//
// Devuelve:
// {
//   size,
//   grid: [[ "A", "B", ... ], ...],              // letras de cada casilla
//   colocaciones: [ { palabra, pista, celdas:[{r,c}, ...] } ]
// }

// Generador de números pseudoaleatorios con semilla (mulberry32).
function rngDesde(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Hash sencillo (FNV-1a) para convertir un texto en semilla.
function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Quita tildes y deja solo letras A–Z (y Ñ).
function limpiar(palabra) {
  return palabra
    .toUpperCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-ZÑ]/g, '')
}

// Las 8 direcciones: incluye diagonales y sentidos invertidos (dificultad alta).
const DIRS = [
  [0, 1], [0, -1], [1, 0], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
]
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function generarSopa(entradas, semillaTexto = 'sopa') {
  const palabras = entradas
    .map((e) => ({ palabra: limpiar(e.palabra), pista: e.pista }))
    .filter((p) => p.palabra.length > 1)
    .sort((a, b) => b.palabra.length - a.palabra.length)

  if (palabras.length === 0) return { size: 0, grid: [], colocaciones: [] }

  const masLarga = palabras[0].palabra.length
  const rand = rngDesde(hash(semillaTexto))

  // Intenta armar la cuadrícula; si alguna palabra no cabe, agranda y reintenta.
  let size = Math.max(masLarga, 12)
  for (let intento = 0; intento < 8; intento++, size++) {
    const armado = intentarArmar(palabras, size, rand)
    if (armado) return rellenar(armado, size, rand)
  }
  // Último recurso: cuadrícula grande (no debería llegar aquí).
  const armado = intentarArmar(palabras, masLarga + palabras.length, rand)
  return rellenar(armado || { grid: vacia(masLarga + palabras.length), colocaciones: [] }, masLarga + palabras.length, rand)
}

function vacia(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null))
}

// Intenta colocar todas las palabras en una cuadrícula de lado "size".
function intentarArmar(palabras, size, rand) {
  const grid = vacia(size)
  const colocaciones = []

  function cabe(texto, r, c, dr, dc) {
    for (let i = 0; i < texto.length; i++) {
      const rr = r + dr * i
      const cc = c + dc * i
      if (rr < 0 || cc < 0 || rr >= size || cc >= size) return false
      const actual = grid[rr][cc]
      if (actual && actual !== texto[i]) return false
    }
    return true
  }

  for (const { palabra, pista } of palabras) {
    let puesta = false
    for (let t = 0; t < 200 && !puesta; t++) {
      const [dr, dc] = DIRS[Math.floor(rand() * DIRS.length)]
      const r = Math.floor(rand() * size)
      const c = Math.floor(rand() * size)
      if (!cabe(palabra, r, c, dr, dc)) continue
      const celdas = []
      for (let i = 0; i < palabra.length; i++) {
        const rr = r + dr * i
        const cc = c + dc * i
        grid[rr][cc] = palabra[i]
        celdas.push({ r: rr, c: cc })
      }
      colocaciones.push({ palabra, pista, celdas })
      puesta = true
    }
    if (!puesta) return null // no cupo: pedir cuadrícula más grande
  }
  return { grid, colocaciones }
}

// Rellena las casillas vacías con letras al azar.
function rellenar({ grid, colocaciones }, size, rand) {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = LETRAS[Math.floor(rand() * LETRAS.length)]
    }
  }
  return { size, grid, colocaciones }
}
