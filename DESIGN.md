---
name: Priscila Cueva — Landing Page
description: Landing personal de estrategia digital, automatización y contenido, en clave editorial dorada sobre casi-negro.
colors:
  ebano-calido: "#0b0a08"
  ebano-profundo: "#111009"
  oro-envejecido: "#cda86a"
  oro-brillante: "#e8c07f"
  oro-titulo: "#f2d9ad"
  marfil-calido: "#f2ece1"
  crema-titulo: "#f5efe4"
  crema-titulo-alt: "#f7f1e6"
  texto-atenuado: "#c6bcaa"
  texto-atenuado-alt: "#cfc6b8"
  texto-tenue: "#8a7f6d"
  texto-tenue-oscuro: "#665c4c"
  borde-divisor: "#241f16"
  borde-sutil: "#3a3122"
  borde-sutil-alt: "#2c2618"
  panel-bg: "#0f0d09"
  chip-bg: "#17140d"
  whatsapp-verde: "#3f8f6b"
  whatsapp-verde-hover: "#4ba57e"
  focus-azul: "#6f93c9"
typography:
  display:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2.375rem)"
    fontWeight: 600
    lineHeight: 1.28
    letterSpacing: "normal"
  headline:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(1.5rem, 3vw, 2.625rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  title:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "'Manrope', sans-serif"
    fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "'Manrope', sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.24em"
rounded:
  xs: "2px"
  sm: "4px"
  md: "16px"
  pill: "20px"
  full: "50%"
spacing:
  section-x: "clamp(24px, 6vw, 80px)"
  section-y: "clamp(60px, 8vw, 110px)"
  card-padding: "18px"
  panel-padding: "clamp(28px, 4vw, 44px)"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.marfil-calido}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.oro-envejecido}"
    textColor: "{colors.ebano-calido}"
  button-filled:
    backgroundColor: "{colors.oro-envejecido}"
    textColor: "{colors.ebano-calido}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: "16px 36px"
  button-whatsapp:
    backgroundColor: "{colors.whatsapp-verde}"
    textColor: "{colors.ebano-calido}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: "14px"
  pill-service:
    backgroundColor: "linear-gradient(135deg, #241a12 0%, #3a2617 55%, #6b4426 100%)"
    textColor: "{colors.oro-titulo}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "40px"
    width: "220px"
  card-image:
    backgroundColor: "{colors.ebano-calido}"
    rounded: "{rounded.sm}"
  card-resource:
    backgroundColor: "{colors.chip-bg}"
    rounded: "{rounded.sm}"
    padding: "18px"
---

# Design System: Priscila Cueva — Landing Page

## 1. Overview

**Creative North Star: "La Hora Dorada" (The Golden Hour)**

La página vive en el momento justo antes de que el sol se ponga: casi todo es sombra cálida, y lo que sí recibe luz — el dorado envejecido — se usa con moderación porque es precioso, no decorativo. Nada aquí grita para conseguir atención; el sistema entero está construido para que un visitante sienta que entró a una conversación en confianza, no a una vitrina de ventas. La tipografía editorial (Playfair Display) y la calidez del dorado sobre casi-negro comunican sofisticación humana y estratégica — nunca fría, nunca urgente.

El sistema rechaza explícitamente las plantillas SaaS genéricas (tarjetas iconográficas repetidas, gradientes vistosos, look de startup intercambiable), las landings tipo "gurú" con urgencia falsa o countdowns, y cualquier estética de sitio corporativo impersonal. Cada superficie debe sentirse hecha a medida — igual que la promesa de negocio detrás de ella.

**Key Characteristics:**
- Fondo casi negro (#0b0a08) como lienzo constante; el dorado aparece solo donde importa.
- Serif editorial (Playfair Display) para todo titular; sans humanista (Manrope) para todo lo demás.
- Sin sombras grises tradicionales — la profundidad se comunica con brillo (glow) dorado, no con box-shadow oscuro.
- Botones de esquina casi recta (2px) para acciones serias; píldoras totalmente redondeadas (20px) para opciones exploratorias.
- Un único acento saturado (verde WhatsApp) reservado exclusivamente para el paso de conversión final.

## 2. Colors

Paleta "Committed": el dorado envejecido carga la identidad visual sobre un fondo casi negro dominante; los neutros cálidos sostienen la lectura sin competir con el acento.

### Primary
- **Oro Envejecido** (#cda86a): el acento de marca. Bordes de botones, texto de eyebrow/labels, selección de texto, números de servicio, línea divisoria del hero. Aparece en menos del 10% de cualquier vista — su escasez es lo que lo hace sentir precioso.
- **Oro Brillante** (#e8c07f): variante de hover/focus del dorado — badge "PC", ícono de sonido activo, títulos de recurso.
- **Oro Título** (#f2d9ad): reservado para el nombre "Priscila Cueva" en el hero y texto de píldoras de servicio — el dorado más claro, casi crema.

### Neutral
- **Ébano Cálido** (#0b0a08): fondo base de todo el sitio. No es negro puro — tiene calidez, no frialdad de pantalla.
- **Ébano Profundo** (#111009): fondo alterno de secciones intercaladas ("Cómo trabajamos", "Sobre mí"), crea ritmo vertical sin usar bordes duros.
- **Marfil Cálido** (#f2ece1): color de texto por defecto sobre fondo oscuro.
- **Crema Título** (#f5efe4 / #f7f1e6): headings — un peldaño más brillante que el texto de cuerpo para dar jerarquía sin cambiar de familia tipográfica.
- **Texto Atenuado** (#c6bcaa / #cfc6b8): cuerpo de párrafo largo — nunca gris puro, siempre con la misma calidez del fondo.
- **Texto Tenue** (#8a7f6d / #665c4c): labels en mayúscula, footer, metadatos — el nivel más bajo de la jerarquía, todavía legible.
- **Borde Divisor / Borde Sutil** (#241f16 / #3a3122 / #2c2618): únicos separadores del sistema — líneas de 1px, nunca stripes de color.
- **Panel / Chip** (#0f0d09 / #17140d): fondos de superficies elevadas (panel lateral, chips informativos dentro del panel).

### Functional (fuera del rol Primary/Neutral, con propósito único)
- **Verde WhatsApp** (#3f8f6b, hover #4ba57e): reservado exclusivamente para el botón de continuar por WhatsApp — es el único verde en todo el sistema, y por eso señala inequívocamente "este es el paso de conversión".
- **Azul de Foco** (#6f93c9): anillo de foco de teclado en todos los elementos interactivos — nunca se usa como color decorativo.

### Named Rules
**La Regla del Único Verde.** El verde WhatsApp aparece en un solo lugar: el botón de continuar la conversación tras solicitar un servicio. Si aparece en cualquier otro contexto, deja de significar "acción de conversión" y pierde su fuerza.

**La Regla de la Escasez Dorada.** El dorado envejecido nunca cubre una superficie grande. Vive en bordes de 1px, texto de acento y brillos sutiles — nunca como fondo sólido de una sección completa.

## 3. Typography

**Display Font:** 'Playfair Display', Georgia, serif
**Body Font:** 'Manrope', sans-serif

**Character:** Un serif editorial de peso medio-alto (600) frente a un sans humanista de peso variable — el mismo contraste que separa una revista de lujo de su copy funcional. El itálico de Playfair Display se reserva para el nombre propio ("Priscila Cueva") como firma, nunca para énfasis genérico.

### Hierarchy
- **Display** (600, `clamp(1.5rem, 2.6vw, 2.375rem)`, line-height 1.28): titular del hero — la única vez que el tamaño de texto compite por atención con el video de fondo.
- **Headline** (600, `clamp(1.5rem, 3vw, 2.625rem)`, line-height 1.3): título de cada sección (`h2`) — "Cómo trabajamos", "Sobre mí", "Preguntas frecuentes", etc. `text-wrap: balance` recomendado para evitar líneas huérfanas.
- **Title** (600, `clamp(1.25rem, 2.2vw, 1.75rem)`, line-height 1.3): título del panel lateral de servicio (`h3`) — un peldaño por debajo del headline de sección.
- **Body** (400, `clamp(0.9375rem, 1.1vw, 1.0625rem)`, line-height 1.75, máximo ~65–75ch): párrafos largos ("Sobre mí", descripciones de servicio). `text-wrap: pretty` recomendado.
- **Label** (700, 11px, letter-spacing 0.24em, mayúsculas): eyebrows de sección ("PROCESO", "SOBRE MÍ"), botones ES/EN, badges de estado.

### Named Rules
**La Regla del Itálico Reservado.** El itálico de Playfair Display se usa solo para el nombre "Priscila Cueva" como firma personal — nunca como recurso de énfasis en el copy general.

## 4. Elevation

El sistema es plano en reposo. No hay una escala de sombras grises tradicional — la profundidad se comunica con brillo dorado (glow) que responde a selección/hover, y con dos sombras estructurales reservadas para elementos que literalmente flotan sobre el contenido: el panel lateral de detalle y la foto del "Sobre mí".

### Shadow Vocabulary
- **Brillo de píldora en reposo** (`box-shadow: 0 0 8px rgba(216,168,78,0.18)`): estado por defecto de las píldoras de servicio — apenas perceptible, indica interactividad sin gritar.
- **Brillo de píldora seleccionada** (`box-shadow: 0 0 14px rgba(216,168,78,0.45)`): al seleccionar un servicio, el glow se intensifica — es la única señal de "estado activo" además del borde.
- **Sombra de panel lateral** (`box-shadow: -20px 0 60px rgba(0,0,0,0.5)` desktop / `0 -20px 60px rgba(0,0,0,0.5)` mobile): el panel de detalle de servicio es la única superficie que se comporta como un objeto físico flotando sobre el resto.
- **Sombra de retrato** (`box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6)`): la foto en "Sobre mí" recibe una sombra profunda y difusa para separarla del fondo oscuro sin usar un borde brillante.

### Named Rules
**La Regla del Brillo, No la Sombra.** La jerarquía visual entre elementos interactivos se comunica con intensidad de glow dorado, no con sombras grises apiladas. Una sombra gris tradicional en un botón o píldora es un error.

## 5. Components

### Buttons
- **Shape:** esquinas casi rectas (radius 2px) — deliberadamente distinto de las píldoras totalmente redondeadas, para separar "acción seria" de "opción exploratoria".
- **Primary (outline):** fondo transparente, borde 1px `#cda86a`, texto `#f0e4cc`, padding `14px 28px`. Es el CTA por defecto del hero ("Explorar servicios").
- **Primary Filled:** fondo `#cda86a` sólido, texto `#0b0a08`, padding `16px 36px`. Reservado para el CTA de cierre de página — el único botón dorado sólido del sitio, marca el final del recorrido.
- **Hover/Focus:** el outline se llena de dorado (`background: #cda86a; color: #0b0a08`) en transición de 0.3s; el foco de teclado usa el anillo azul (`2px solid #6f93c9`, offset 2px) en todos los botones, nunca el dorado.
- **WhatsApp (conversión):** fondo `#3f8f6b` sólido, texto `#0b0a08`, ancho completo dentro del panel — el único botón verde del sistema.

### Pills (Servicios)
- **Style:** fondo en gradiente diagonal ámbar-a-cobre (`linear-gradient(135deg, #241a12 0%, #3a2617 55%, #6b4426 100%)`), borde 1px `#D8A84E` (`#f2c775` si está seleccionada), radius 20px, texto `#F8EED8`.
- **State:** en reposo, opacidad completa con glow suave; al aparecer, entran con `translateY(14px) scale(0.95)` → estado final, nunca abruptas. Seleccionada: `scale(1.04)` + glow intensificado. No seleccionada mientras otra está activa: opacidad 0.5 (efecto "dim").

### Cards / Containers
- **Corner Style:** radius 4px en tarjetas (retrato, recurso) — más suave que los botones, más contenido que las píldoras.
- **Background:** la tarjeta de retrato no lleva fondo propio (es la imagen); la tarjeta de recurso usa `#17140d` sobre borde `#3a3122`.
- **Shadow Strategy:** ver Elevation — solo el retrato recibe sombra profunda; el resto es plano con borde.
- **Border:** 1px `#3a3122` en todas las tarjetas y chips.
- **Internal Padding:** 18px estándar.

### Navigation
- Fija en la parte superior, fondo con gradiente de oscuro a transparente (`linear-gradient(180deg, rgba(9,7,5,0.75), transparent)`) para no competir con el video del hero.
- Toggle de idioma ES/EN: texto plano sin fondo, color dorado si está activo, `#8a7f6d` si no, separados por un divisor vertical sutil.

### Panel lateral (Signature Component)
El panel de detalle de servicio es la pieza más distintiva del sistema: se desliza desde la derecha en desktop (`translateX`) o desde abajo en mobile (`translateY`, esquinas superiores redondeadas a 16px), con un backdrop semitransparente (`rgba(0,0,0,0.55)`) detrás. Dentro, usa una jerarquía de labels en mayúscula (`Posibilidades`, `Proceso general`, `Limitaciones`) para organizar información densa sin recurrir a tarjetas anidadas. La transición usa `cubic-bezier(.22,.9,.3,1)` — una curva de salida marcada, sin rebote.

## 6. Do's and Don'ts

### Do:
- **Do** mantener el fondo casi negro (#0b0a08 / #111009) como base en el 90%+ de cada vista; el dorado se reserva para acentos.
- **Do** usar Playfair Display exclusivamente en titulares (`h1`–`h3` y firma de nombre); Manrope para todo lo demás.
- **Do** comunicar estado interactivo con intensidad de glow dorado (`box-shadow` con `rgba(216,168,78,...)`), no con sombras grises.
- **Do** usar el verde WhatsApp (#3f8f6b) únicamente en el botón de conversión final — es la señal de "este es el siguiente paso".
- **Do** usar el anillo de foco azul (#6f93c9) en todo elemento interactivo para accesibilidad de teclado (WCAG AA).
- **Do** mantener los botones de acción principal en esquina casi recta (2px) y las píldoras de opción en radius 20px — la distinción de forma es intencional.

### Don't:
- **Don't** usar tarjetas iconográficas repetidas, gradientes vistosos de fondo completo, ni ningún look intercambiable de plantilla SaaS.
- **Don't** introducir countdowns, testimonios exagerados o urgencia falsa — no hay presión de precio ni tácticas agresivas en ninguna sección.
- **Don't** dejar que el sitio se sienta como un sitio corporativo frío o impersonal — siempre debe leerse como una persona real ofreciendo un proceso a medida.
- **Don't** usar `border-left` o `border-right` de color como acento decorativo en tarjetas o callouts.
- **Don't** aplicar gradiente sobre texto (`background-clip: text`) para énfasis — el énfasis viene de peso o tamaño tipográfico, nunca de gradiente.
- **Don't** usar el dorado como color de fondo sólido en una sección completa — rompe la Regla de la Escasez Dorada.
- **Don't** usar el verde WhatsApp fuera del botón de conversión — diluye su significado como señal única.
