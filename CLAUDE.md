# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Multi-page personal portfolio for **Aidan Nguyen** (UCLA Statistics & Data Science, graduating Spring 2026), themed around the indie game **Baba Is You**.

**Concept**: The homepage is a full-screen animated Baba Is You overworld map. Clickable regions navigate to separate pages. Each region has an animated Baba-style pixel text label (wobbling `.webp` from ROBOT-IS-CHILL Discord bot).

**Status**: Feature-complete. Awaiting deployment to GitHub → Vercel (do not push unless explicitly asked).

---

## Always Do This First

**Always invoke the frontend design skill before writing any frontend code, every session, no exceptions.**

---

## Local Development

```bash
npx serve -l 8080          # start local server
node screenshot.js http://localhost:8080 <name>   # desktop + mobile screenshots
node screenshot.js http://localhost:8080/about.html about
```

Screenshots output to `./temp_screenshots/` at 1440×900 (desktop) and 390×844 (mobile). Animated `.webp` labels won't render in static screenshots — ask user to verify in browser.

No build step. Plain HTML/CSS/JS.

---

## File Structure

```
index.html       — Overworld map homepage
projects.html    — 12-project 2-col grid
about.html       — Bio, headshot, education metadata
contact.html     — Email (copy to clipboard), LinkedIn, GitHub
resume.html      — Embedded PDF viewer + download
why.html         — "Why Baba Is You?" explainer page
style.css        — All shared styles and design tokens
mediaqueries.css — Responsive breakpoints (≤1024px, ≤768px, ≤480px)
script.js        — Scroll reveal, Baba custom scrollbar, copy email, drag mode
screenshot.js    — Puppeteer utility
robot-is-chill.md — ROBOT-IS-CHILL Discord bot command reference
```

---

## Architecture

### Map Homepage
- `.map-viewport` (100vw × 100vh, flex center) wraps `.map-container`
- `.map-container` locked to **854:570** aspect ratio via `min()`:
  ```css
  width: min(100vw, calc(100vh * 854 / 570));
  height: min(100vh, calc(100vw * 570 / 854));
  ```
- Labels positioned as **percentages of `.map-container`**, never the viewport — keeps them locked to map features at any resolution
- Map image is `assets/baba/map_animated.webp` — 3-frame animated WebP (854×570, cropped to remove transparent padding from original 857×594 spritesheet frames)
- Map label heights use `clamp()` for smooth fluid scaling — no hard breakpoint jumps:
  - Name: `clamp(22px, 3.5vw, 52px)`
  - Regions: `clamp(16px, 3vw, 42px)`

**Current label positions** (set via `?drag` mode):
| Region | Page | top / left |
|--------|------|-----------|
| Castle area | projects.html | 57.5% / 67.9% |
| Green meadow | about.html | 39.9% / 45.9% |
| Stars/Moon | contact.html | 18.4% / 83.2% |
| Dark pond | resume.html | 69.7% / 33.5% |
| Small island | why.html | 82.4% / 76.5% |
| Name label | — | 16.5% / 1.4% |

Use `?drag` URL param to reposition labels (coordinates logged to console on drop).

### Subpage Pattern
All subpages: `<main class="subpage"> > <div class="subpage-content">`. Max-width 1000px, padding-bottom 40vh (space for Baba scrollbar play). `.reveal` elements fade-in-up via IntersectionObserver. No footers.

### script.js Responsibilities
1. **Scroll reveal** — IntersectionObserver on `.reveal` elements
2. **Baba scrollbar** — custom right-side scrollbar using `baba_down.webp`/`baba_up.webp`, draggable, skipped on map page
3. **Copy email** — `copyEmail()` on contact page, shows "copied! ✓" for 2s
4. **Drag mode** — enabled via `?drag`, prints coordinates on drop

### Projects Page
- 12 projects, uniform 2-col grid (no featured/spanning tiles)
- Tiles use `--img` CSS var for background image via `::before` block at top (`background-size: contain`, `background-repeat: no-repeat`, `background-origin: content-box`, `padding: 12px`)
- Text content sits below image area on solid `--tile` bg
- Project title color: `--pink`. Hover border: `--pink`.
- Titles for Kickback, Zeitios, SWARM Engineering, CourseKata, Savills are hyperlinked to official sites (underlined)
- Tags and links use `Space Mono` (not Press Start 2P)

### About Page
- Side-by-side layout: photo left (`about-photo`, 200px), bio + meta right (`about-right`)
- Header shows `about.webp` + `aidan_nguyen.webp` side by side; `aidan_nguyen.webp` has class `about-name-img` with `margin-left: calc(160px + 3rem)` to align with bio text column (resets to 0 on mobile)
- Photo uses CSS `@keyframes amoeba` — organic morphing `border-radius` animation, `--blue` border
- Meta items are stacked (label image above, value text below); year dates use `.meta-year` class (muted gray, 0.8rem)
- On ≤768px: layout stacks to column, photo shrinks to 140px, `about-name-img` margin resets

### Contact Page
- Bold/spacious layout: `LET'S CONNECT.` heading, 3 large rows (Email, LinkedIn, GitHub)
- Email row is a `<button>` that copies to clipboard, not a mailto link
- `contact-val` font size scales: `1.6rem` → `1.3rem` → `1.1rem` → `0.85rem` across breakpoints

### Resume Page
- Download button appears **below** the view resume PDF button
- PDF: `./assets/Aidan_Nguyen_resume.pdf`

---

## Design Tokens

```css
--bg: #0d0d0d  --surface: #111111  --tile: #1a1f2e  --border: #2a3040
--pink: #e8547a  --gold: #c8a84b  --olive: #6b7c3a  --blue: #4a6fa5
--text: #f0f0e8  --muted: #888880
``` 
---

## Typography

- **`Press Start 2P`** — largely replaced by robot-is-chill images. Still loaded via Google Fonts as fallback.
- **`Space Mono`** — all body text, project descriptions, contact values, tags, links.
- Baba-style headings/labels are pre-rendered `.webp` images from ROBOT-IS-CHILL bot.

---

## Baba Assets (`assets/baba/`)

All text labels are **animated .webp** with Baba wobble. Key assets:
- `map_animated.webp` — 3-frame animated overworld map (854×570, transparent borders cropped)
- `map.png` — static fallback (frame 0)
- `aidan_is_you.webp` — name label (top-left of map)
- `aidan_nguyen.webp` — name label used on about page header
- `baba_down.webp`, `baba_up.webp` — custom scrollbar character
- `baba.png` — favicon
- `map_is_back.webp` — back-to-map nav on all subpages
- Per-page headers: `projects.webp`, `about.webp`, `contact.webp`, `resume.webp`, `question_mark.webp`
- Contact/about labels: `lets_connect.webp`, `email.webp`, `linkedin.webp`, `github.webp`, `education.webp`, `currently.webp`, `location.webp`, `interests.webp`

Pixel art rendering required on all Baba assets (`.baba-text`, `.map-image` classes apply `image-rendering: pixelated`).

---

## Generating New Baba Assets (ROBOT-IS-CHILL Bot)

```
=t text_WORD:COLOR           animated wobble webp
=t text_WORD:COLOR:prop      with block border around text
=r text_WORD:oneline:tw150   larger rendered text
=t baba:down / baba:up       directional Baba character
```

Flags go **immediately after `=t`**, before tile names. See `robot-is-chill.md` for full reference.

---

## Content Reference

- **Email**: aidannguyen27@g.ucla.edu
- **LinkedIn**: linkedin.com/in/nguyenaidan
- **GitHub**: github.com/aidannguyen23
- **Resume**: `./assets/Aidan_Nguyen_resume.pdf`
- **Education**: UCLA 2023–present (Spring 2026) · Bellarmine College Prep 2019–2023
- **Currently**: AI Engineering Intern @ Corsair
- **Interests**: Bouldering, volleyball, video games, board games

---

## Deploying

```bash
# When user asks to deploy:
# 1. Push to GitHub (aidannguyen23 account)
# 2. Netlify auto-deploys from GitHub
# Never push unless explicitly asked.
```
