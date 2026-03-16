# ROBOT-IS-CHILL Discord Bot — Command Reference

Quick reference for generating Baba Is You style assets for this portfolio.

---

## Basic Tile Render

```
=t [flags] <tiles>
```

## Text Rendering

- `text_<word>` renders a word as a Baba-style text sprite
- Comma shorthand: `text_baba,is,you` = three text tiles in a row ("BABA IS YOU")
- Custom words auto-generate letter sprites (e.g., `text_projects` works even though "PROJECTS" isn't a game word)
- Text >3 chars auto-splits top/bottom — add `:oneline` variant to prevent

### Text Layout
- Spaces between tiles: use `~` or `\ ` (escaped space)
- Line breaks: use `/` — e.g., `text_hello/world`
- Empty tiles: use `-`

---

## Key Flags

| Flag | Effect |
|------|--------|
| `-f=png` | PNG output with true transparency |
| `-f=gif` | GIF output (default) |
| `-b=<color>` | Set background color (overrides transparency) |
| `-m=<n>` | Post-render upscale multiplier |
| `-speed=<n>` | Animation speed adjustment |
| `-co` | Remove wobble variation between tiles |

---

## Color Variants

Apply with `:<color>` after the tile name:

```
text_word:pink      — pink (#e8547a style)
text_word:red       — red
text_word:blue      — blue
text_word:gold      — gold/yellow
text_word:green     — green
text_word:grey      — grey
text_word:#RGB      — hex color
text_word:#RRGGBB   — hex color
```

First color overrides default. Subsequent colors multiply onto the sprite.

---

## Other Useful Variants

| Variant | Effect |
|---------|--------|
| `:left`, `:right`, `:down` | Directional facing |
| `:scale<n>` | Scale sprite (e.g., `:scale2`) |
| `:rot<angle>` | Rotate sprite |
| `:oneline` | Prevent auto-splitting long text |
| `:letter` | Use letter-style text (like AB, KE) |
| `:prop` | Add a Baba-style block/border around the text |
| `:asleep` / `:s` | Asleep state |

---

## Commands for This Portfolio

**IMPORTANT: Flags go IMMEDIATELY after `=t`, BEFORE tile names.**

### Map Labels (save to `assets/baba/` as .gif)

Default output is animated GIF with the classic Baba wobble.
Add `-b=#0d0d0d` if the default background clashes with the site.

```
=t text_projects:pink
=t text_about:blue
=t text_contact:gold
=t text_resume:olive
```

### Name Text

```
=t text_aidan:pink text_is text_you:pink
```

Or separate:
```
=t text_aidan:pink
=t text_nguyen:pink
```

### Back Navigation

```
=t text_map,is,back
```

### Character Sprites (optional map decorations)

```
=t baba
=t flag
=t keke
=t me
```

---

## Saving Assets

1. Run command in Discord (ROBOT-IS-CHILL bot)
2. Bot outputs an animated GIF — right-click → Save As
3. Save to `assets/baba/` with descriptive name:
   - `projects.gif`, `about.gif`, `contact.gif`, `resume.gif`
   - `name.gif` or `aidan_is_you.gif`
   - `back.gif`
   - `baba.gif`, `flag.gif` (sprites)
4. Map: already cropped at `assets/baba/map.png`
