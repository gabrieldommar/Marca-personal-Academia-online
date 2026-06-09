# Sistema de Diseño — Marca Personal & Academia

Diseño **minimalista-editorial**. La plataforma mezcla dos mundos (medicina y programación) bajo una misma persona, así que el sistema prioriza **autoridad serena y legibilidad** por encima de adornos. Nada de gradientes genéricos, sombras difusas ni "glassmorphism": jerarquía tipográfica, espacio en blanco y un único acento.

## Tipografía

| Uso | Familia | Por qué |
|-----|---------|---------|
| Títulos / display | **Fraunces** (serif) | Serif moderno con carácter editorial; aporta el lado humano de la *marca personal* y diferencia el sitio de plantillas SaaS genéricas. |
| Cuerpo / UI | **Inter** (sans) | Neutra, altísima legibilidad en pantalla; transmite el lado técnico/académico. |
| Código (si aparece) | `ui-monospace` | Pista de programación sin sumar otra fuente cargada. |

Escala tipográfica (ratio ~1.25, base 16px), expuesta como clases utilitarias de Tailwind (`text-display`, `text-h1`…`text-small`):

```
display 3.05rem / 1.05   (Fraunces, hero)
h1      2.44rem / 1.1
h2      1.95rem / 1.15
h3      1.56rem / 1.2
body    1rem    / 1.6
small   0.875rem/ 1.5
```

## Color

Paleta reducida: un papel cálido, tinta casi negra, neutros y **un solo acento** (verde pino) que evoca lo clínico/confiable sin caer en el azul corporativo cliché.

| Token | Hex | Uso |
|-------|-----|-----|
| `paper` | `#FBFAF8` | Fondo general (blanco cálido, menos clínico que el blanco puro) |
| `surface` | `#FFFFFF` | Tarjetas y superficies elevadas |
| `ink` | `#171614` | Texto principal |
| `muted` | `#6B6862` | Texto secundario / metadatos |
| `line` | `#E7E4DD` | Bordes y separadores (1px) |
| `accent` | `#14564E` | Acción principal, enlaces, foco |
| `accent-soft` | `#E6EFEC` | Fondos sutiles del acento (badges, hover) |

Contraste: `ink` sobre `paper` y `surface` sobre `accent` superan WCAG AA.

## Espaciado y layout

- Escala base **4px** (Tailwind por defecto). Secciones con respiración: `py-20`/`py-24`.
- Ancho de contenido máximo **1120px** (`Container`), centrado, con padding lateral responsive.
- Bordes `rounded-lg` (8px) máximo; nada de cápsulas exageradas salvo en chips.
- Sombras: casi inexistentes. Separación por `line` y espacio, no por sombra.

## Principios

1. Una sola fuente de acento de color — el resto es neutro.
2. El espacio en blanco es un elemento de diseño, no un sobrante.
3. Transiciones discretas (`transition-colors`, 150ms). Sin animaciones llamativas.
4. Mobile-first; jerarquía idéntica en todos los breakpoints.
