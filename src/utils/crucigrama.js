// Generador de crucigramas.
// Recibe una lista de { palabra, pista } y arma una cuadrícula donde las
// palabras se cruzan entre sí (como un crucigrama de verdad). Es determinista:
// con los mismos datos siempre produce la misma cuadrícula, así el juego es
// estable entre sesiones.
//
// Devuelve:
// {
//   ancho, alto,
//   celdas: { "fila,col": { letra: "A", numero: 1|null } },  // solo celdas activas
//   palabras: [ { numero, dir: "H"|"V", r, c, respuesta, pista } ]
// }

// Quita tildes y deja solo letras A–Z (por si una palabra trae acentos).
function limpiar(palabra) {
  return palabra
    .toUpperCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-ZÑ]/g, '')
}

export function generarCrucigrama(entradas) {
  const palabras = entradas
    .map((e) => ({ texto: limpiar(e.palabra), pista: e.pista }))
    .filter((p) => p.texto.length > 1)
    // Las más largas primero: cruzan mejor y dan una cuadrícula más compacta.
    .sort((a, b) => b.texto.length - a.texto.length)

  if (palabras.length === 0) {
    return { ancho: 0, alto: 0, celdas: {}, palabras: [] }
  }

  const grid = new Map() // "r,c" -> letra
  const colocadas = [] // { texto, pista, r, c, dir }
  const clave = (r, c) => r + ',' + c
  const celda = (r, c) => grid.get(clave(r, c))

  // ¿Cabe "texto" empezando en (r,c) hacia dir ("H" u "V") sin conflictos?
  function puedeColocar(texto, r, c, dir) {
    const dr = dir === 'V' ? 1 : 0
    const dc = dir === 'H' ? 1 : 0
    // La celda justo antes y justo después deben estar vacías (no pegar palabras).
    if (celda(r - dr, c - dc)) return false
    if (celda(r + dr * texto.length, c + dc * texto.length)) return false

    for (let i = 0; i < texto.length; i++) {
      const rr = r + dr * i
      const cc = c + dc * i
      const actual = celda(rr, cc)
      if (actual) {
        // Cruce: la letra debe coincidir.
        if (actual !== texto[i]) return false
      } else {
        // Celda nueva: sus vecinos perpendiculares deben estar vacíos,
        // para no formar palabras pegadas por accidente.
        const pr = dir === 'H' ? 1 : 0
        const pc = dir === 'H' ? 0 : 1
        if (celda(rr - pr, cc - pc) || celda(rr + pr, cc + pc)) return false
      }
    }
    return true
  }

  function colocar(texto, pista, r, c, dir) {
    const dr = dir === 'V' ? 1 : 0
    const dc = dir === 'H' ? 1 : 0
    for (let i = 0; i < texto.length; i++) {
      grid.set(clave(r + dr * i, c + dc * i), texto[i])
    }
    colocadas.push({ texto, pista, r, c, dir })
  }

  // Primera palabra, horizontal, en el origen.
  colocar(palabras[0].texto, palabras[0].pista, 0, 0, 'H')

  // El resto intenta cruzarse con alguna letra ya colocada.
  for (let k = 1; k < palabras.length; k++) {
    const { texto, pista } = palabras[k]
    let puesta = false
    for (const col of colocadas) {
      if (puesta) break
      const dir = col.dir === 'H' ? 'V' : 'H' // cruzamos en perpendicular
      for (let i = 0; i < col.texto.length && !puesta; i++) {
        const rG = col.dir === 'V' ? col.r + i : col.r
        const cG = col.dir === 'H' ? col.c + i : col.c
        for (let j = 0; j < texto.length && !puesta; j++) {
          if (texto[j] !== col.texto[i]) continue
          const dr = dir === 'V' ? 1 : 0
          const dc = dir === 'H' ? 1 : 0
          const r = rG - dr * j
          const c = cG - dc * j
          if (puedeColocar(texto, r, c, dir)) {
            colocar(texto, pista, r, c, dir)
            puesta = true
          }
        }
      }
    }
    // Si no logró cruzar, la ponemos aparte debajo para no perder la palabra.
    if (!puesta) {
      let maxR = 0
      for (const k2 of grid.keys()) {
        const rr = +k2.split(',')[0]
        if (rr > maxR) maxR = rr
      }
      colocar(texto, pista, maxR + 2, 0, 'H')
    }
  }

  // Normalizar coordenadas para que empiecen en (0,0).
  let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity
  for (const k of grid.keys()) {
    const [r, c] = k.split(',').map(Number)
    minR = Math.min(minR, r)
    minC = Math.min(minC, c)
    maxR = Math.max(maxR, r)
    maxC = Math.max(maxC, c)
  }
  const offR = -minR
  const offC = -minC
  const alto = maxR - minR + 1
  const ancho = maxC - minC + 1

  const celdas = {}
  for (const [k, letra] of grid.entries()) {
    const [r, c] = k.split(',').map(Number)
    celdas[r + offR + ',' + (c + offC)] = { letra, numero: null }
  }

  // Numerar las celdas donde empieza alguna palabra (izq→der, arriba→abajo).
  const norm = colocadas.map((p) => ({ ...p, r: p.r + offR, c: p.c + offC }))
  const inicios = [...new Set(norm.map((p) => p.r + ',' + p.c))]
  inicios.sort((a, b) => {
    const [ar, ac] = a.split(',').map(Number)
    const [br, bc] = b.split(',').map(Number)
    return ar - br || ac - bc
  })
  const numeroDe = new Map()
  inicios.forEach((pos, idx) => {
    numeroDe.set(pos, idx + 1)
    celdas[pos].numero = idx + 1
  })

  const palabrasOut = norm
    .map((p) => ({
      numero: numeroDe.get(p.r + ',' + p.c),
      dir: p.dir,
      r: p.r,
      c: p.c,
      respuesta: p.texto,
      pista: p.pista,
    }))
    .sort((a, b) => a.numero - b.numero || (a.dir === 'H' ? -1 : 1))

  return { ancho, alto, celdas, palabras: palabrasOut }
}
