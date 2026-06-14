# Design

## Theme

**Clínica de luz.** Una clínica dental real de Irun es luminosa, limpia, con luz fría de gabinete sobre superficies blancas y reflejos de instrumental cromado. Ese es el mundo visual. Fondo blanco-hielo (no gris, no beige), turquesa de marca como acento que respira, y un turquesa profundo casi petróleo para texto y profundidad. Sensación: entrar a un gabinete impecable a media mañana con luz natural. Limpio pero con presencia — fotos reales grandes, mucho aire, motion sereno.

Color strategy: **Committed.** El turquesa de marca aparece de forma decidida (heros teñidos, acentos, líneas vivas, fondos de sección teal-drench puntuales), no como acento tímido del 5%. Identidad preservada del logo existente.

## Color Palette

OKLCH. Ancla = teal de marca `#019fab` (del logo BINAI).

| Rol | Token | Hex aprox | OKLCH | Uso |
|---|---|---|---|---|
| Brand / primary | `--brand` | `#019fab` | oklch(0.66 0.10 200) | Acentos vivos, líneas, iconos, hover |
| Brand deep | `--brand-deep` | `#0a6b76` | oklch(0.49 0.08 205) | Texto sobre claro, profundidad, heros |
| Brand ink | `--brand-ink` | `#08363c` | oklch(0.30 0.05 205) | Titulares, texto fuerte |
| Brand tint | `--brand-tint` | `#82d0d6` | oklch(0.81 0.07 200) | Detalles, brillos SVG, gradientes |
| Surface ice | `--bg` | `#f4fafb` | oklch(0.98 0.008 205) | Fondo de página (hielo, no blanco puro) |
| Surface | `--surface` | `#ffffff` | oklch(1 0 0) | Tarjetas, secciones elevadas |
| Surface sunk | `--surface-2` | `#eaf4f5` | oklch(0.96 0.012 205) | Bandas alternas, sunken |
| Ink | `--ink` | `#0e2a2e` | oklch(0.27 0.03 200) | Cuerpo de texto (≥4.5:1 sobre bg) |
| Ink muted | `--ink-muted` | `#3f5c60` | oklch(0.45 0.02 205) | Texto secundario (verificado ≥4.5:1) |
| Line | `--line` | `#d4e6e8` | oklch(0.91 0.012 205) | Bordes, separadores |
| Accent warm | `--accent` | `#ffb648` | oklch(0.81 0.13 70) | CTA secundario, PADI/familia, calidez puntual |

Reglas de contraste: cuerpo usa `--ink`/`--ink-muted` (nunca turquesa claro sobre blanco para texto). Sobre heros teñidos oscuros, texto blanco con line-height +0.06.

## Typography

Voz: cercano · clínico · de confianza. Físicamente: la señalética limpia de una clínica moderna + un titular humano y redondeado que no intimida.

- **Display / Headings:** **Bricolage Grotesque** — grotesca contemporánea con carácter, ligeramente humanista, no es Inter/DM/Space (reflex-reject evitados). Transmite modernidad clínica sin frialdad. Pesos 600/700/800. `letter-spacing: -0.03em` en display, `text-wrap: balance`.
- **Body / UI:** **Hanken Grotesk** — grotesca neutra muy legible, abierta, excelente para público de edad amplia. Pesos 400/500/600. Pareja por contraste de rol (display con personalidad + body neutra), misma familia grotesca pero distinta voz — verificado que no son "dos geométricas iguales": Bricolage es expresiva/quirky, Hanken es neutra/funcional.
- Escala fluida `clamp()`, ratio ~1.25. Display hero: `clamp(2.6rem, 6vw, 5.5rem)` (techo < 6rem). Line-length cuerpo 60-72ch.
- Self-hosted (woff2) en `/assets/fonts/`. `font-display: swap`.

## Components

- **Botón primario:** turquesa sólido, radio 999px (pill), micro-transform en hover (lift + glow turquesa suave), icono que se desplaza. Variante "llamar" con icono teléfono animado (ring).
- **Botón fantasma:** borde turquesa, fondo transparente, rellena en hover.
- **Tarjeta de tratamiento:** foto real + título + descripción; NO grid de cards idénticas — layout variado (bento/alternado). Hover: imagen zoom suave + línea turquesa que se dibuja.
- **SVG animados (en vez de emojis):** diente con "respiración", implante que se asienta, bracket/alineador, escudo PADI, gota de limpieza, ondas de radiografía. Todos en `currentColor` turquesa, loop suave SMIL/GSAP, pausan en reduced-motion.
- **Barra de contacto sticky (móvil):** Llamar | WhatsApp | Cómo llegar — siempre accesible.
- **Header:** logo BINAI + nav (Inicio · Clínica Dental · Dónde estamos) + selector idioma (ES, futuro EU) + CTA "Pedir cita". Transparente sobre hero, sólido al hacer scroll.
- **Footer:** tratamientos, contacto completo, mapa, horario, enlaces legales, © con "Diseñado por unaxaller.com" enlazado.

## Layout

- Anchos contenedor coherentes (`--container: 1200px`, `--container-narrow: 760px`). **Cero orphaned rows:** grids con `auto-fit minmax` o recuentos que cierran fila (servicios = 5 → layout bento intencional, no grid de 3+2 huérfano). Móvil: "ver más" para listas largas.
- Heros full-bleed con vídeo/foto real y overlay teal. Secciones con ritmo de spacing variable (`clamp`).
- Bandas alternas bg/surface/teal-drench para narrativa.

## Motion

GSAP + ScrollTrigger. Lenis para scroll suave. Energía: **serena**. Ease-out (expo/quint), sin bounce. 
- Page loader **solo primera visita** (sessionStorage): logo BINAI que se dibuja + onda turquesa, una vez.
- Reveal por sección variado (no el mismo fade uniforme): titulares con SplitText por palabra, fotos con clip-path reveal, contadores, parallax suave en heros.
- Microinteracciones: botones, hover de tarjetas, cursor-reactive en hero (luz que sigue el ratón sutil), SVG en loop.
- Precarga total al entrar a inicio → navegación entre subpáginas fluida.
- `prefers-reduced-motion`: todo a crossfade/instant, SVG estáticos.

## Imagery

Fotos reales de la clínica ya disponibles (gabinete, tratamientos, Invisalign, implantes, instrumental) + Unsplash verificado para rellenar a ≥6 por página (sonrisas, familia/PADI, detalle instrumental, recepción). Vídeos MP4 reales (odontología, estética, implantología) en heros. Alt text descriptivo con keywords locales ("Tratamiento de ortodoncia Invisalign en Clínica Dental Binai, Irun").
