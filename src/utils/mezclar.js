// Devuelve una copia mezclada (barajada) de una lista.
// Se usa para presentar las preguntas u opciones en orden distinto cada vez,
// sin modificar la lista original.
export function mezclar(lista) {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}
