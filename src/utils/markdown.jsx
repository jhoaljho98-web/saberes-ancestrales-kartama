import { useState, useEffect } from 'react'

const MODULO_REGEX = /^## \d+\.\s+Módulo\s+/m

export function useGuiaUmbra(moduloId) {
  const [contenido, setContenido] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    setCargando(true)
    fetch('./umbra/guia.md')
      .then((r) => r.text())
      .then((md) => {
        const seccion = extraerModulo(md, moduloId)
        setContenido(seccion)
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [moduloId])

  return { contenido, cargando }
}

function extraerModulo(md, moduloId) {
  const num = parseInt(moduloId.replace('u', ''), 10)
  const romanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
  const romano = romanos[num - 1]

  const partes = md.split(/(?=^## \d+\.)/m)
  const seccion = partes.find((p) => {
    const match = p.match(/^## \d+\.\s+Módulo\s+(\S+)/)
    return match && match[1] === romano
  })

  return seccion || null
}

export function RenderMarkdown({ texto }) {
  if (!texto) return null
  const lineas = texto.split('\n')
  const elementos = []
  let i = 0

  while (i < lineas.length) {
    const linea = lineas[i]

    if (linea.startsWith('## ')) {
      i++
      continue
    }

    if (linea.startsWith('### ')) {
      const txt = linea.replace(/^###\s+/, '')
      elementos.push(
        <h2 key={i} className="mb-3 mt-8 text-xl font-bold text-bosque">
          {txt}
        </h2>
      )
      i++
      continue
    }

    if (linea.startsWith('> ')) {
      const txt = linea.replace(/^>\s+/, '')
      elementos.push(
        <blockquote
          key={i}
          className="my-4 border-l-4 border-ocre bg-ocre/5 py-3 pl-4 pr-3 text-base italic text-tierra/85"
        >
          <InlineMarkdown texto={txt} />
        </blockquote>
      )
      i++
      continue
    }

    if (linea.startsWith('|')) {
      const filas = []
      while (i < lineas.length && lineas[i].startsWith('|')) {
        filas.push(lineas[i])
        i++
      }
      elementos.push(<TablaMarkdown key={`t${i}`} filas={filas} />)
      continue
    }

    if (linea.match(/^- /)) {
      const items = []
      while (i < lineas.length && lineas[i].match(/^- /)) {
        items.push(lineas[i].replace(/^- /, ''))
        i++
      }
      elementos.push(
        <ul key={`ul${i}`} className="my-3 flex flex-col gap-2">
          {items.map((it, j) => (
            <li key={j} className="flex gap-2 leading-relaxed text-tierra/90">
              <span className="mt-1 text-musgo">●</span>
              <span><InlineMarkdown texto={it} /></span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    if (linea.match(/^\d+\.\s/)) {
      const items = []
      while (i < lineas.length && lineas[i].match(/^\d+\.\s/)) {
        items.push(lineas[i].replace(/^\d+\.\s/, ''))
        i++
      }
      elementos.push(
        <ol key={`ol${i}`} className="my-3 flex list-decimal flex-col gap-2 pl-5 text-tierra/90">
          {items.map((it, j) => (
            <li key={j}><InlineMarkdown texto={it} /></li>
          ))}
        </ol>
      )
      continue
    }

    if (linea.trim() === '---' || linea.trim() === '') {
      i++
      continue
    }

    elementos.push(
      <p key={i} className="mb-3 leading-relaxed text-tierra/90">
        <InlineMarkdown texto={linea} />
      </p>
    )
    i++
  }

  return <>{elementos}</>
}

function InlineMarkdown({ texto }) {
  const partes = []
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  let ultimo = 0
  let m

  while ((m = regex.exec(texto)) !== null) {
    if (m.index > ultimo) {
      partes.push(texto.slice(ultimo, m.index))
    }
    if (m[2]) {
      partes.push(<strong key={m.index} className="font-bold italic text-bosque">{m[2]}</strong>)
    } else if (m[3]) {
      partes.push(<strong key={m.index} className="font-bold text-bosque">{m[3]}</strong>)
    } else if (m[4]) {
      partes.push(<em key={m.index} className="italic text-ocre">{m[4]}</em>)
    } else if (m[5]) {
      partes.push(
        <code key={m.index} className="rounded bg-bosque/10 px-1 py-0.5 font-mono text-sm">
          {m[5]}
        </code>
      )
    }
    ultimo = m.index + m[0].length
  }
  if (ultimo < texto.length) {
    partes.push(texto.slice(ultimo))
  }
  return <>{partes}</>
}

function TablaMarkdown({ filas }) {
  const datos = filas
    .filter((f) => !f.match(/^\|[\s\-:|]+\|$/))
    .map((f) =>
      f.split('|').slice(1, -1).map((c) => c.trim())
    )

  if (datos.length === 0) return null

  const encabezado = datos[0]
  const cuerpo = datos.slice(1)

  return (
    <div className="my-4 overflow-x-auto rounded-2xl border border-bosque/15 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bosque/10">
            {encabezado.map((cel, j) => (
              <th key={j} className="px-3 py-2 text-left font-bold text-bosque">
                <InlineMarkdown texto={cel} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cuerpo.map((fila, i) => (
            <tr key={i} className={i % 2 ? 'bg-crema/50' : 'bg-white'}>
              {fila.map((cel, j) => (
                <td key={j} className="px-3 py-2 text-tierra/85">
                  <InlineMarkdown texto={cel} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
