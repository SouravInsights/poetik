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

**Refined Melancholic Minimalism.**

The visual language draws from old literary journals, handwritten manuscript pages, and the quiet drama of Urdu mushairas held in dimly lit rooms. Think ink on aged paper. Think the gap between a line of poetry and the next.

The app should feel like it was designed by someone who cared too much — and then removed everything they could.

---

## Color

The palette is near-monochromatic. Color is used for _feeling_, not decoration.

```
--ink:          #1A1714   /* primary text — warm black, never pure */
--paper:        #F5F0E8   /* default surface — cream, not white */
--paper-deep:   #EDE7D9   /* slightly darker surface variant */
--mist:         #C8BFB0   /* secondary text, borders, UI chrome */
--ash:          #8C8278   /* tertiary — placeholders, labels */
--void:         #0D0B09   /* backgrounds for dark wall mode */
--accent:       #8B4513   /* warm rust/sepia — single accent only */
--accent-muted: #8B45131A /* accent at ~10% opacity for hover states */
```

**Rules:**

- The accent color (`--accent`) appears on no more than one element at a time. It is used for the active font selection, the export button, or a single UI affordance. Never two simultaneously.
- No blues. No purples. No greens. They are wrong for this.
- Dark mode is not "black background with white text." It is near-black (`--void`) with warm cream text. The warmth is essential.
- On background wall mode (when a photo/texture is behind the text), the UI chrome disappears entirely. Only the text remains.

---

## Typography

Four fonts. Each is a mood. Never mixed within one shayari.

| Name                   | Weight            | Use                                | Character                                                                     |
| ---------------------- | ----------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| **Cormorant Garamond** | Light 300, Italic | Ghazal, delicate longing           | Whisper-thin, aristocratic. The white space inside each letter breathes.      |
| **IM Fell English**    | Regular, Italic   | Nazm, classical, earthy            | Feels like ink pressed into old paper. Slightly imperfect — that's the point. |
| **Playfair Display**   | Regular, Italic   | Bold statements, Instagram-forward | High stroke contrast. The most legible on busy backgrounds.                   |
| **Lora**               | Regular, Italic   | Warm, everyday shayari             | Calligraphy-influenced curves. The most human of the four.                    |

**Sizing:**

```
--text-poem:    clamp(20px, 5vw, 32px)   /* the writing itself */
--text-label:   12px                      /* font picker labels, UI chrome */
--text-ui:      13px                      /* buttons, menus */
```

**Line height for poem text:** `1.9` — generous. Poetry breathes vertically.

**Letter spacing for poem text:** `0.01em` — barely open. Just enough.

**Alignment:** Left by default. Center as an option. Never justified (it breaks poetry's rhythm).

**Italic is the default for all four fonts.** Upright is an option, but italic is the soul.

---

## Layout

### Mobile Canvas (Primary)

The writing surface is `100dvh` — full device height, no chrome stealing space. The keyboard pushes the canvas up; the canvas shrinks to fit. No scrolling while writing.

```
Screen: 390px wide (iPhone 14 baseline)

[  top bar: 44px, fades on scroll / focus  ]
[                                           ]
[         writing area — flex grow         ]
[         vertically centered text         ]
[                                           ]
[  bottom toolbar: 56px, slides up with    ]
[  keyboard, hides after 2s idle           ]
```

The text is **vertically centered** on the canvas, not top-aligned. A shayari of two couplets should float in the middle of the page — not cling to the top like a todo item.

### Export Canvas (9:16)

```
1080 × 1920px — Instagram Stories / Reels
```

This is the _only_ export size. No options. No confusion.

The poem is centered (horizontally and vertically) on the chosen background wall. Safe zones: 120px from all edges. If text overflows safe zone, font size scales down proportionally — the user is warned, not blocked.

---

## Interaction Principles

**1. The editor is always in focus.**
There is no "edit mode" you enter. You open the app and you write. No onboarding. No empty state illustration asking you to "create your first shayari." Just the cursor, blinking.

**2. UI chrome is transient.**
The top bar, font picker, and bottom toolbar all fade to 0% opacity after 3 seconds of inactivity. They return on any touch. The poem should never compete with UI for attention.

**3. No save button.**
Everything is auto-saved, silently, after every keystroke. The word "Save" should never appear.

**4. Font switching is instant and inline.**
Tapping a font immediately re-renders the current text in that font. No preview modal. No confirmation. The writer sees the feeling change in real time.

**5. The export flow is one gesture.**
Tap export → see full-screen preview on the 9:16 canvas → tap "Save to Camera Roll." Two taps. No social platform chooser, no "share to" sheet beyond the system default.

**6. Background walls are full-bleed, not thumbnails.**
When choosing a background, you swipe between full-screen previews of each wall with your text already rendered on them. You choose what _feels_ right, not what looks like a small square thumbnail.

---

## Micro-interactions

- **Font switch:** Cross-fade between fonts over `280ms` ease-in-out. Not instant. Not slow. Like turning a page.
- **Toolbar appear/disappear:** Opacity `0 → 1` over `180ms`. No slide, no scale. Just presence.
- **Export button:** A very slight scale `1 → 0.97` on press, back over `120ms`. Satisfying without being playful.
- **Background wall swipe:** Momentum-based with gentle spring. Feels physical.
- **Cursor:** Default iOS/Android text cursor. Do not customize it. Customizing the cursor in a writing app is hubris.

---

## Backgrounds ("Walls")

Walls are the only place this app allows richness. They are curated, not user-uploaded.

**Categories (suggested):**

- **Texture** — aged paper, raw linen, dark concrete, crumpled silk
- **Gradient** — deep night, dusk amber, pre-dawn blue-grey, candlelight
- **Photographic** — a rain-wet window, bare winter branches, lamp on a table, open book pages

**Rules for walls:**

- Every wall must be tested with all four fonts in both light and dark text
- Walls are stored in `/public/walls/` as `.jpg` at `1080×1920px`
- File size limit: `400KB` per wall (compressed, progressive JPEG)
- Text overlay always gets a subtle `text-shadow: 0 1px 8px rgba(0,0,0,0.4)` on dark walls, none on light
- No more than **12 walls** in v1. Curation over quantity.

---

## Things We Will Never Add

These are not "future considerations." They are active refusals.

- ❌ A feed or gallery of other people's shayaris
- ❌ Likes, comments, followers, or any social layer
- ❌ AI generation or "complete my shayari" suggestions
- ❌ More than 4 fonts
- ❌ Custom color pickers (the palette is fixed)
- ❌ Stickers, effects, frames, or decorations
- ❌ Cloud sync with visible "syncing..." indicators
- ❌ Notifications of any kind
- ❌ A logo watermark on the export
- ❌ Landscape mode

---

## Voice & Copy

There is almost no copy in this app. What little exists follows these rules:

- No exclamation points. Ever.
- No instructional placeholder text like "Start writing your shayari here..."
- Placeholders, if any, are a single em-dash `—` or completely absent
- Error messages are quiet: "Couldn't save." Not "Oops! Something went wrong 😅"
- The export button says **"Save to photos"** — not "Export," not "Share," not "Download"

---

## What Success Feels Like

A writer opens the app. They don't notice the app. They write two lines. They change the font once. They choose a wall by feel. They save it to their camera roll.

They didn't think about the interface at all.

That is the goal.

---

_Version 1.0 — drafted before a single line of code was written._
