# Build Log

What I asked the chat (Claude) for, and what changed as I went.

## 2026-10-09: Planning and first version

**Asked:** Help building a portfolio site for my coding class, with a walkthrough of each step and choice.

**Decisions**
- Starting fresh (no existing portfolio).
- Plain HTML, CSS and JavaScript. No framework, so there's no build step and GitHub Pages can serve the files as-is.

**Asked:** A preview of several color themes and layouts side by side.
- Claude made four options: Index Cards, Terminal, Bold Blocks, and Quarter Timeline.
- I picked **Bold Blocks** (chunky type, a bright color per card, hard drop shadows).

**Asked:** Language support, my about-me text, keep the four placeholder ideas, and cards I can edit any time.

**What changed**
- Built the site as four files:
  - `index.html`: page structure only.
  - `styles.css`: the Bold Blocks look. Colors are variables at the top.
  - `content.js`: every piece of text, including the five cards. **This is the only file I edit to update cards.**
  - `main.js`: reads `content.js` and builds the page.
- Added an English / Español switcher. Text is stored as `{ en: "...", es: "..." }`. The site remembers a visitor's choice, follows their browser language, and supports `?lang=es` links. Missing translations fall back to English.
- Idea cards have dashed borders; finished cards are solid.
- Card colors cycle automatically, so new cards don't need a color.

**To do**
- Rewrite the Artifact 1 reflection in my own words (Claude's draft is in `content.js`).
- Deploy to GitHub Pages.

<!-- Add a new dated section each time you work on the site. -->
