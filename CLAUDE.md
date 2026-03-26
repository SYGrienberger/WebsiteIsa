# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for **Boter + Zout**, a bakery in Arnhem, Netherlands (https://boterzout.nl). No build system, no dependencies — vanilla HTML, CSS, and JavaScript deployed on Apache.

## Running Locally

Open `index.html` in a browser, or serve with any static HTTP server (needed for CORS-restricted custom fonts):

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Deployment

Copy all files to an Apache server with `mod_deflate` and `mod_rewrite` enabled. The `.htaccess` handles HTTPS enforcement, www-redirect removal, gzip compression, and CORS headers for fonts.

## Architecture

Single-page vertical-scrolling site. All content lives in `index.html` with these sections: `#home` (header/branding), `#info` (slideshow + business info), `#contact` (footer).

**JavaScript files:**
- `js/Script.js` — viewport height calculation, scroll-based corner text (Intersection Observer), `openMenu()`/`closeMenu()` for the side menu overlay, and the `openingstijden` constant (single source of truth for opening hours displayed on the page)
- `js/FotoSlideShow.js` — photo carousel (10 WebP images in `Afbeeldingen/`) with manual prev/next navigation and lazy loading

**CSS files:**
- `css/styles.css` — all site styles using CSS custom properties for the color scheme (beige, blue, rust red)
- `css/stylesSlideShow.css` — slideshow-specific styles

**Assets:**
- `assets/Fonts/` — custom web fonts (SeasonSans-Medium, PPWriter-Regular)
- `Afbeeldingen/` — gallery photos (10 WebP images, originals kept as `.jpg`/`.JPG` backups)

## Key Notes

- Code comments and variable names are in Dutch
- Responsive breakpoint at 800px (mobile layout uses `#info-slides` and `#info-text` instead of the desktop side-by-side layout)
- SEO structured data (JSON-LD bakery schema) is embedded in `index.html` — when updating opening hours, change both the `openingstijden` constant in `js/Script.js` **and** the `openingHoursSpecification` in the JSON-LD block in `index.html`
