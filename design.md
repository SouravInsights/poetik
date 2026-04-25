# Poetik — Design Document

> _"A tool made for feeling, not for function."_

---

## Philosophy

This is not a notes app. Not a text editor. Not a social media tool with a publish button.

It is a **quiet room** — one you enter to sit with a feeling long enough to give it words. The product earns trust by disappearing. Every design decision must answer the question: _does this get out of the way?_

The competition is not other apps. The competition is a blank paper notebook and a ballpoint pen. We must be at least as intimate.

---

## Personality

If this app were a person, they would be:

- Someone who reads Faiz Ahmad Faiz at 2am with the lights low
- Who owns three fountain pens and knows why each writes differently
- Who lets silence sit in a conversation without filling it
- Unhurried. Deliberate. Quietly confident.

Not precious. Not pretentious. Just — considered.

---

## Aesthetic Direction

**Refined Melancholic Minimalism (Cinematic).**

The visual language draws from old literary journals, handwritten manuscript pages, and the quiet drama of Urdu mushairas held in dimly lit rooms. We treat the digital canvas not as an app screen, but as a physical environment complete with atmospheric acoustics (rain, fireplace), parallax layers, and physics-based interactions.

The app should feel like it was designed by someone who cared too much — and then removed everything they could.

---

## Color

The palette is near-monochromatic. Color is used for _feeling_, not decoration.

```css
--ink:          #1A1714   /* primary text — warm black, never pure */
--paper:        #F5F0E8   /* default surface — cream, not white */
--paper-deep:   #EDE7D9   /* slightly darker surface variant */
--mist:         #C8BFB0   /* secondary text, borders, UI chrome */
--ash:          #8C8278   /* tertiary — placeholders, labels */
--void:         #0D0B09   /* backgrounds for dark mode/void */
--accent:       #C5A059   /* soft gold — the sole accent color */
```

**Rules:**

- The accent color (`--accent`) appears sparingly. It is the elegant soft gold caret, the text selection background, and active UI indicators.
- No blues. No purples. No greens. They are wrong for this.
- Dark mode is not "black background with white text." It is near-black (`--void`) with warm cream text. The warmth is essential.
- Backgrounds feature a permanent, subtle grain overlay (`.grain`) to mimic analog imperfection.

---

## Typography

Four core fonts for poetry. Each is a mood. Never mixed within one shayari.

| Name                   | Weight            | Use                                | Character                                                                     |
| ---------------------- | ----------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| **Cormorant Garamond** | Light 300, Italic | Ghazal, delicate longing           | Whisper-thin, aristocratic. The white space inside each letter breathes.      |
| **IM Fell English**    | Regular, Italic   | Nazm, classical, earthy            | Feels like ink pressed into old paper. Slightly imperfect.                    |
| **Playfair Display**   | Regular, Italic   | Bold statements, Instagram-forward | High stroke contrast. The most legible on busy backgrounds.                   |
| **Lora**               | Regular, Italic   | Warm, everyday shayari             | Calligraphy-influenced curves. The most human of the four.                    |

*Note: UI elements utilize **Jost** for technical/ghost-links and **Italiana** for premium CTAs like the export button, keeping them strictly distinct from the poetry itself.*

**Sizing:**

```css
--text-poem:    clamp(26px, 7.5vw, 52px)  /* the writing itself */
--text-ui:      9px to 12px               /* heavily tracked out uppercase Jost */
```

**Layout Rules:**
- **Line height for poem text:** `1.6` — generous. Poetry breathes vertically.
- **Letter spacing for poem text:** `0.01em` / `0.03em`. Just enough.
- **Alignment:** Left by default. Center as an option. Never justified.
- **Italic is the default for all four poetry fonts.** Upright is absent. Italic is the soul.

---

## Layout & Architecture

### The Canvas (Primary)

The writing surface is `100dvh` — full device height, no chrome stealing space. It features a Parallax background.

```text
[  top bar: transient, fades on typing  ]
[                                       ]
[       writing area — center pivot     ]
[       (ghost div + invisible area)    ]
[                                       ]
[  bottom toolbar & doodles: transient  ]
```

The text is **vertically centered** on the canvas. An invisible `<textarea>` handles exact cursor positioning and native typing, while a "Ghost Div" visually renders the poetry. This allows us to implement "Focus Fade", where inactive lines gently dim to `opacity: 30%`.

### Export Dimensions (9:16)

```text
1080 × 1920px — Instagram Stories / Reels
```

This is the _only_ export aspect ratio. The export flow supports both high-fidelity JPEG and **Cinematic Video overlays** (5 to 30 seconds duration).

---

## Interaction & Cinematic Principles

**1. The editor is always in focus.**
You open the app and you write. No onboarding. "arz kiya hai..." softly appears, then vanishes when you type.

**2. UI chrome is transient.**
The top bar, font picker, and bottom toolbar all fade away when writing or clearing. The poem never competes with UI.

**3. Physical Erase Mechanics.**
Clearing the canvas triggers physics-based wipe animations (randomized variants per clear). Letters flutter away rather than instantly blinking out of existence.

**4. Tactile Haptics.**
Every keystroke triggers a subtle `trigger(15)` web haptic. The app should feel physically responsive.

**5. Atmospheric Audio & Subliminal Lighting.**
Users can enable "Rain" or "Fireplace" atmospheres. These inject looping cinematic audio and absolute bottom-anchored/lens radial gradients (subliminal lighting) to alter the room's mood.

**6. Poster Bridges.**
Video backgrounds show a cached thumbnail (poster frame) instantly during src swaps to ensure zero black frames while buffering.

**7. Author Signatures & Doodles.**
A curated selection of hand-drawn vector doodles (botanicals, birds, fire) and a discrete author handle can be appended to the bottom of the canvas, rendered at low opacity.

---

## Backgrounds ("Papers" & "Tones")

We embrace richness in the background. They are curated, not user-uploaded.

**Categories:**

- **Tones:** Solid/gradient moods (Void, Night, Dusk, Slate, Paper, Cream, Linen).
- **Papers:** High-res image textures (aged paper, raw linen, crumpled silk).
- **Videos:** Cinematic motion backgrounds (rain-wet windows, candlelight).

**Rules:**
- All image/video backgrounds sit behind a `opacity: 20%` overlay (black or white depending on dark/light mode) to ensure text legibility.
- Backgrounds shift with device tilt via the `useParallax` hook.

---

## Things We Will Never Add

These are active refusals:

- ❌ A feed or gallery of other people's shayaris
- ❌ Likes, comments, followers, or any social layer
- ❌ AI generation or "complete my shayari" suggestions
- ❌ More than the core 4 poetry fonts
- ❌ Custom color pickers (the palette is strictly fixed)
- ❌ Stickers, tacky effects, or frames
- ❌ A logo watermark on the user's export
- ❌ Landscape mode
- ❌ Generic loading spinners (we use deliberate boot sequences)

---

## Voice & Copy

There is almost no copy in this app.

- No exclamation points. Ever.
- No instructional placeholder text like "Start writing your shayari here..."
- Error messages are quiet.
- Labels are aggressively minimized (e.g., lowercase `duration`, `save to phone`).

---

## What Success Feels Like

A writer opens the app. They don't notice the app. They hear the faint crackle of a fireplace. They write two lines, feeling a gentle tap with each letter. They choose a deep night wall, save the 15-second video to their phone, and close the app. 

They didn't think about the interface at all.

That is the goal.

---

_Updated to reflect Poetik App Architecture._
