# SYSTEM CATCH · Atrapa la categoría

**Minijuego educativo · Gimnasio 1 — Teoría General de Sistemas · Optimización I**

Un arcade de 60–90 segundos: los elementos caen desde arriba y el jugador debe atraparlos en su categoría correcta: **Objeto**, **Sujeto** o **Concepto**.

> Entrar → entender → jugar → resultado. Sin tutorial, sin módulos, sin campaña.

## Concepto académico

| Categoría | ¿Qué es? |
|---|---|
| **Objeto** | Elemento físico no viviente (Computadora, Libro, Silla…) |
| **Sujeto** | Persona o ser vivo pensante (Profesor, Estudiante, Médico…) |
| **Concepto** | Idea, regla o conocimiento (Reglamento, Objetivo, Método…) |

## Mecánica

- 8 elementos por partida (aleatorios de un banco de 26).
- Cada elemento cae desde arriba en ~3 s; la velocidad sube con cada acierto.
- Toca la categoría correcta antes de que el elemento escape.
- `+100` por acierto · combo por rachas · el error no reinicia la partida.
- Final: `7/8 · COMBO MÁXIMO x4 · 700 PTS` → **JUGAR OTRA VEZ**.

## Cómo ejecutar

Abre `index.html` directamente o con un servidor local:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Estructura

```text
system-lab/
├── index.html          # portada, gameplay y resultado
├── css/game.css        # todo el estilo del arcade
├── js/
│   ├── game.js         # lógica del juego
│   └── data.js         # categorías y banco de elementos
├── .github/workflows/pages.yml
└── README.md
```

## Editar contenido

- **Elementos**: `js/data.js` → `elements` (texto + `category: "objeto" | "sujeto" | "concepto"`).
- **Duración/ritmo**: `js/data.js` → `roundSize`, `fallMs`, `speedUp`, `minFallMs`.
- **Categorías**: `js/data.js` → `categories`.

## GitHub Pages y autodeploy

- Sitio público: **https://israeltiburcio-ai.github.io/system-lab/**
- Repositorio: https://github.com/IsraelTiburcio-ai/system-lab
- Flujo: `push a main → GitHub Actions → GitHub Pages` (`.github/workflows/pages.yml`, también con `workflow_dispatch`).

## Historial

La versión anterior (System Lab v1, juego completo con módulos) está preservada bajo el tag **`legacy-v1`** y la rama **`archive/legacy-v1`**:

```bash
git checkout legacy-v1
```

## Notas

- Sin dependencias, sin build, sin backend. Ruta base compatible con `/system-lab/`.
- Guarda en localStorage solo: mejor puntuación y preferencia de sonido.
- Sonido procedural (WebAudio), se activa con el primer toque. Respeto de `prefers-reduced-motion`, teclado (1/2/3) y contraste.
