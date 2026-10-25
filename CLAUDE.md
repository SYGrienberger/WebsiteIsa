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

Single-page vertical-scrolling site. All content lives in `index.html` with these sections: `#home` (header/branding), `#info` (slideshow + business info), `#contact` (footer: small Google Map in the site colours above the contact details).

**JavaScript files:**
- `js/Script.js` — viewport height calculation, scroll-based corner text (Intersection Observer), and `openMenu()`/`closeMenu()` for the side menu overlay
- `js/Kaart.js` — styled Google Map (Maps JavaScript API, JSON `styles` in the site palette, rust-red marker that opens directions). Loads only when the footer is about a screen away. Falls back to the plain embedded map if the key is missing/rejected (`gm_authFailure`) or the script fails. The API key is restricted in Google Cloud to boterzout.nl (+ the GitHub Pages domain); a key in public source is normal for Maps JS, the referrer restriction is what protects it
- `js/FotoSlideShow.js` — photo carousel (10 images in `Afbeeldingen/`, 3:4 frame): sliding track with clone slides for seamless looping, +/- buttons and touch swipe / mouse drag via pointer events
- `js/Menu.js` — referenced in `index.html` but **does not exist**; menu logic is already in `Script.js`

**CSS files:**
- `css/styles.css` — all site styles (including the slideshow) using CSS custom properties for the color scheme (beige, blue, rust red)

**Assets:**
- `assets/Fonts/` — custom web fonts (SeasonSans-Medium, PPWriter-Regular)
- `Afbeeldingen/` — gallery photo originals (not served); the site loads the resized copies in `Afbeeldingen/klein/` (`fotoN-600.webp` and `fotoN-1000.webp`). For a new photo, add it to `slideImages` in `js/FotoSlideShow.js` and create both sizes, e.g. with Pillow: `python3 -c "from PIL import Image, ImageOps; im=ImageOps.exif_transpose(Image.open('Afbeeldingen/foto11.webp')).convert('RGB'); [im.resize((w, round(im.height*w/im.width)), Image.LANCZOS).save(f'Afbeeldingen/klein/foto11-{w}.webp', quality=78, method=6) for w in (600, 1000)]"`

## Key Notes

- Code comments and variable names are in Dutch
- `.htaccess` caches CSS/JS for a year (HTML is `no-cache`): after changing a CSS or JS file, bump the `?v=` number on its `<link>`/`<script>` tag in `index.html`, otherwise visitors get new HTML with old styles
- Responsive breakpoint at 800px (mobile layout uses `#info-slides` and `#info-text` instead of the desktop side-by-side layout)
- SEO: JSON-LD bakery schema and Open Graph tags (share image `assets/delen.jpg`, 1200×630) are in `index.html`; `robots.txt` points to `sitemap.xml` — update its `<lastmod>` when content changes
- The `<script src="js/Menu.js">` tag in `index.html` references a non-existent file — either remove the tag or create the file
