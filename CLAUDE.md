# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a static personal portfolio website for Aidan Nguyen (UCLA Statistics & Data Science). It is a plain HTML/CSS/JS site with no build tools, package manager, or framework — changes are visible directly by opening `index.html` in a browser.

Deployed at: https://aidannguyen23.github.io/Personal-Portfolio/

## Development

No build step required. Open `index.html` in a browser to preview locally. Changes are immediately visible on page refresh.

## Architecture

The site is a single-page layout (`index.html`) with four anchor-linked sections: `#profile`, `#about`, `#projects`, and `#contact`.

**File layout:**
- `index.html` — main page; all content (projects, bio, contact) lives here
- `style.css` — all desktop styles
- `mediaqueries.css` — responsive breakpoints (1400px, 1200px, 600px); hamburger nav activates at ≤1200px; sun widget hidden at ≤600px
- `script.js` — single function `toggleMenu()` for the hamburger nav
- `aboutsun/` — an interactive sun widget: a CSS-styled sun face that tracks the mouse cursor via `aboutsun.js`; its styles (`aboutsun.css`) are imported in `index.html`
- `assets/` — images and icons used throughout the page

**Sun widget (`aboutsun/`):** The `#sun` div is placed outside `<body>` (before the opening tag) in `index.html`. `aboutsun.js` listens to `mousemove` on `window` and repositions `#sun-face` within the circular boundary of `#sun` using polar coordinate clamping.

## Design Tokens

- Primary blue: `#1e30ff`
- Background gradient: `#fefed8` → `#f8e1fe` (bottom-right)
- Card/detail background: `#fefed8`
- Project title / accent red: `#ff1d1e`
- Button default bg: `#fdff9e`
- Fonts: `Mulish` (body), `Sometype Mono` (nav, headings, mono elements), `Handjet` (imported but unused)

## Adding a New Project

Projects are arranged in rows of three using `.about-containers` flex rows inside `.experience-details-container`. Each project card follows this structure:

```html
<div class="details-container color-container">
  <div class="article-container">
    <img src="./assets/your-image.png" class="project-img">
  </div>
  <h2 class="experience-sub-title project-title">Project Title</h2>
  <br>
  <p>Description here.</p>
  <br>
  <div class="btn-container">
    <button class="btn btn-color-2 project-btn" onclick="location.href='URL'">
      Label
    </button>
  </div>
</div>
```

New projects should be added at the top comment marker in `index.html`: `<!-- paste new projects here, here are where new projects are -->`.
