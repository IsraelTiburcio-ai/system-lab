# System Lab · Laboratorio de Sistemas

**Actividad / Juego 2 · Gimnasio 1 — Introducción a la Teoría de Sistemas · Optimización I**

Aplicación web educativa interactiva para practicar los fundamentos de la Teoría General de Sistemas mediante una experiencia de *laboratorio futurista*: análisis de sistemas reales, construcción de diagramas por arrastre, escáner de elementos y clasificación completa de sistemas.

> Este proyecto es complementario a **OptiQuest** (Juego 1). No es un quiz: es una experiencia visual e interactiva con drag & drop, animaciones, progresión, puntuación y logros.

---

## Contenido académico

1. **Módulo 1 — Anatomía del Sistema**: identifica los componentes de un sistema (Entrada, Proceso, Salida, Retroalimentación y Medio ambiente) en 6 escenarios reales (cafetería, hospital, tienda en línea, universidad, fábrica y granja).
2. **Módulo 2 — Elementos del Sistema**: escáner que clasifica 26 elementos como **Objeto**, **Sujeto** o **Concepto** con rondas aleatorias.
3. **Módulo 3 — Clasificación de Sistemas**: construye el perfil completo de 10 sistemas en 4 ejes (Naturaleza, Representación, Relación con el ambiente y Comportamiento).
4. **Desafío Integrador — Análisis Final**: analiza una biblioteca universitaria en 3 etapas que integran todo lo aprendido.
5. **Resultados**: porcentaje global animado, estadísticas, mejor módulo, módulo a repasar y nivel alcanzado (Explorador → Analista → Especialista → Maestro de Sistemas).

### Puntuación
- Acierto al 1.er intento: **+100 pts**
- 2.º intento: **+70 pts**
- 3.º intento: **+40 pts**
- Usar pista: **−20 pts**

---

## Cómo ejecutarlo

Sin instalación. Abre `index.html` directamente en tu navegador:

```bash
# opcional: servidor local para desarrollo
python3 -m http.server 8000
# abre http://localhost:8000
```

También funciona **sin servidor** (`file://`) porque no usa `fetch()` ni dependencias externas de tiempo de ejecución.

## Estructura del proyecto

```text
system-lab/
├── index.html              # pantallas, modales, barra superior
├── css/
│   ├── variables.css       # paleta y tokens de diseño
│   ├── base.css            # reset, tipografía, fondo
│   ├── components.css      # botones, paneles, diagramas, modales
│   ├── animations.css      # keyframes + reduced-motion
│   └── responsive.css      # desktop / tablet / mobile
├── js/
│   ├── app.js              # orquestación de pantallas y juegos
│   ├── router.js           # transiciones entre pantallas
│   ├── state.js            # estado central + persistencia
│   ├── storage.js          # localStorage
│   ├── dragdrop.js         # motor de arrastre (mouse + touch + teclado)
│   ├── scoring.js          # puntuación
│   ├── achievements.js     # logros
│   ├── audio.js            # efectos de sonido procedurales (WebAudio)
│   └── ui.js               # modales, toasts, iconos, partículas
├── data/
│   ├── systems.js          # metadatos de conceptos y categorías
│   ├── module1.js          # escenarios y tarjetas del Módulo 1
│   ├── module2.js          # elementos del Módulo 2
│   ├── module3.js          # sistemas del Módulo 3
│   └── challenge.js        # etapas del Desafío Final
├── assets/
│   ├── icons/              # (reservado) iconografía personalizada
│   └── audio/              # (reservado) si se agregan sonidos .mp3
└── README.md
```

Tecnologías: **HTML5, CSS3 y JavaScript ES6+** (Vanilla JS), sin backend, sin base de datos, sin librerías externas en ejecución.

---

## Cómo agregar escenarios (Módulo 1)

Edita `data/module1.js` y agrega un objeto a `scenarios`:

```javascript
{
  id: "mi_escenario",                 // identificador único
  name: "Nombre del escenario",
  emoji: "🏗️",
  context: "Descripción breve del sistema a analizar.",
  hint: "Orientación general del escenario.",
  cards: [
    {
      id: "ms_entrada_1",
      text: "Texto visible de la tarjeta",
      category: "entrada",            // entrada | proceso | salida | retroalimentacion | medio_ambiente
      feedback: "Explicación que se muestra al acertar.",
      hint: "Pregunta orientadora para la pista."
    }
    // ... más tarjetas
  ]
}
```

Las categorías válidas son exactamente: `entrada`, `proceso`, `salida`, `retroalimentacion`, `medio_ambiente`.

## Cómo editar preguntas / tarjetas (Módulos 2 y 3)

- **Módulo 2** (`data/module2.js` → `elements`): agrega elementos con `category: "objeto" | "sujeto" | "concepto"` y un `feedback` explicativo. Se muestran 20 aleatorios por ronda (configurable con `elementsPerRun`).
- **Módulo 3** (`data/module3.js` → `systems`): cada sistema usa `profile` con las claves `naturaleza` (`viviente`/`no_viviente`), `representacion` (`abstracto`/`concreto`), `ambiente` (`abierto`/`cerrado`) y `comportamiento` (`estatico`/`dinamico`/`homeostatico`), más una `justification`.

> Al agregar contenido, respeta la terminología académica del curso (no inventes categorías).

## Cómo publicar en GitHub Pages

El proyecto ya está preparado para GitHub Pages con **despliegue automático** (GitHub Actions).

- **Repositorio:** https://github.com/IsraelTiburcio-ai/system-lab
- **Sitio público:** https://israeltiburcio-ai.github.io/system-lab/
- **Workflow:** `.github/workflows/pages.yml`

### Autodeploy

```text
push a main → GitHub Actions → GitHub Pages → sitio actualizado automáticamente
```

El workflow se ejecuta en cada push a `main` (también puede dispararse manualmente desde **Actions → Deploy GitHub Pages → Run workflow**). Publica el contenido de la raíz del repositorio; no se requiere build.

> Para publicar una copia propia: crea un repositorio con estos archivos, activa **Settings → Pages → Source: GitHub Actions** y conserva el workflow `pages.yml`.

## Cómo borrar el progreso

- En la pantalla de inicio: **Reiniciar progreso** (pide confirmación).
- O en la consola del navegador:

```javascript
localStorage.removeItem("systemlab_save_v1");
```

> Si cambias la clave `systemlab_save_v1` (en `js/storage.js`), todo jugador reinicia su progreso.

## Verificación manual sugerida

Flujo: inicio → tutorial → Módulos 1-3 → Desafío → Resultados. Probar drag & drop con mouse y touch (tap de tarjeta + tap de destino), pistas, sonido on/off, teclado (Tab + Enter), `prefers-reduced-motion`, recarga del navegador (continuar partida) y reinicio.

## Notas técnicas

- El audio es **procedural** (WebAudio); no requiere archivos ni servicios externos. Se activa tras la primera interacción (política de navegadores móviles).
- El progreso se guarda automáticamente en `localStorage`.
- Se respeta `prefers-reduced-motion` (desactiva partículas y animaciones).
- Compatible con desktop, tablet y móvil (360px+); en pantallas táctiles el arrastre funciona por *tap + destino*.
