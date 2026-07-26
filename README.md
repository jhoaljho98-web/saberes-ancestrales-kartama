# Saberes Ancestrales — Pueblo Ẽbẽra Kartama

Plataforma web del curso **Saberes Ancestrales del Pueblo Ẽbẽra Kartama**
(Resguardo Indígena Ẽbẽra Chamí de Cartama). Está pensada para leerse en el
celular, funciona sin conexión una vez cargada y no envía datos a internet: el
progreso se guarda solo en el propio dispositivo.

Es una app hermana de `embera-app/` (la app de lengua Ẽbẽra beɗea): mismo stack
y estilo, pero organizada como un **curso de 5 módulos**.

## Los 5 módulos

1. **Unidad y Origen** (Jõmãũra) — ¿quiénes somos?
2. **Territorio y sitios sagrados** (Daidrúa)
3. **Cultura** (Nãbẽrãra kũrĩsía) — los siete hilos
4. **Autonomía** (Mũkũrĩsía Judaubemêa) — el árbol del gobierno propio
5. **Espiritualidad** (Daijauri) — medicina y sitios sagrados

Cada módulo tiene cuatro actividades:

| Actividad | Qué es | Estado |
|-----------|--------|--------|
| 📖 **Lectura** | Texto del módulo, formateado para leer en celular | Completa en Módulo 1; introducción en los demás |
| ❓ **Quiz** | Opción múltiple con las preguntas del Kahoot | Los 5 módulos (20/20/15/15/15 preguntas) |
| 🧩 **Crucigrama** | Cuadrícula jugable generada desde las palabras clave | Los 5 módulos |
| 🖼️ **Galería** | Fotos reales de la comunidad | 8 fotos curadas por módulo |

El progreso (lectura leída, mejor puntaje del quiz, crucigrama resuelto) se
muestra como puntos en el inicio.

## Tecnología

- **React 18 + Vite 5 + Tailwind CSS 3** — sin librería de rutas, para que sea
  ligera y funcione en celulares de gama baja.
- **Sin backend, sin cuentas.** El progreso vive en `localStorage`.
- Paleta **Forest & Moss**: verde bosque `#2C5F2D`, musgo `#97BC62`,
  ocre `#9A6600`, crema `#F4F1E8`.

## Cómo correrla

```bash
cd saberes-app
npm install
npm run dev      # servidor de desarrollo
npm run build    # versión de producción en dist/
npm run preview  # previsualiza el build
```

## Estructura

```
saberes-app/
├── public/
│   ├── logo.png            # escudo de la parcialidad
│   └── media/m1..m5/       # fotos curadas por módulo
└── src/
    ├── App.jsx             # navegación entre pantallas (sin router)
    ├── data/
    │   ├── modulos.json     # metadatos de los 5 módulos
    │   ├── lecturas.json    # lectura completa M1 + intros de M2–M5
    │   ├── quizzes.json     # preguntas de los Kahoots
    │   ├── crucigramas.json # palabras + pistas por módulo
    │   └── galerias.json    # rutas de las fotos por módulo
    ├── pantallas/          # Inicio, Modulo, Lectura, Quiz, Crucigrama, Galeria
    ├── componentes/        # Boton, Encabezado
    └── utils/
        ├── almacenamiento.js  # progreso en localStorage
        ├── crucigrama.js      # generador de cuadrícula (cruces automáticos)
        └── mezclar.js         # barajar preguntas
```

## De dónde sale el contenido

Todo proviene de `Documentos/Cartama/2026/` y de la base audiovisual en
`Documentos/Cartama/Material Audiovisual/`:

- Lecturas y Kahoots: carpetas `Módulo 2`…`Módulo 5` y la raíz de `2026/`.
- Crucigramas: los `.docx` de crucigrama de los módulos 3, 4 y 5; los de los
  módulos 1 y 2 se derivaron de su lectura y su Kahoot.
- Fotos: temas 01, 03, 04, 06 y 08 de la base audiovisual.

## Pendientes (siguientes fases)

- Lecturas completas de los módulos 2 a 5 (hoy muestran una introducción).
- Videos de la base audiovisual (por ahora solo fotos).
- Audio comunitario en las lecturas.
- Optimizar el peso de las fotos (hoy ~21 MB; se pueden reducir a ~1 MB).
