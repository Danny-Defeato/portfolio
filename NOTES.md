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

## 2026-10-09: Name change

**Asked:** Switch the name on the site from Joe to John.

**What changed:** Updated the name in `content.js` (`name: "John"`), plus the page title and fallback heading in `index.html` and the README title.

## 2026-10-09: New layout inspired by other developer sites

**Asked:** Change the layout using three developer portfolios as inspiration (benscott.dev, sawad.framer.website, aelradi.engineer).

**What I borrowed**
- A sticky top nav bar with my name, jump links (About / Artifacts / Contact), and the language switch.
- A bigger hero: name, a one-line role, and a "Now" badge I update as the quarter goes.
- An About section with skill chips.
- A contact footer with GitHub and email links and a back-to-top link.
- A featured card layout: my newest finished artifact shows as a big "Latest" card, with the rest in a grid below.

**What I skipped and why**
- Stat counters, booking calendars, AI chat widgets, and intro animations didn't fit a class portfolio.
- A contact form, since GitHub Pages can't send email without a third-party service. An email link does the same job.
- Tech tags on cards, to keep the cards simple.

**What changed in the code**
- `content.js` has new fields: `role`, `now`, `skills`, and `contact`. Anything left as `""` is hidden.
- Each card now keeps its own color (card 1 is always yellow, and so on) instead of colors depending on position.

**To do**
- Fill in my GitHub link and email in `content.js` (the contact section stays hidden until I do).
- Check the skill list; it's a starting guess.

## 2026-10-09: Animations

**Asked:** Add some cool animations.

**What changed**
- The hero lines rise in one after another when the page loads.
- Headings, the About block, and cards pop in with a slight bounce as you scroll to them. Cards are staggered so they appear one after another.
- Hovering over my name makes the letters hop in a wave.
- Cards tilt on hover and press into their shadow when clicked, like an arcade button.
- The Now badge has a pulsing "live" dot.
- Skill chips and contact buttons wiggle on hover.

**How to control them**
- `animations: false` in `content.js` turns them all off.
- Visitors whose device is set to reduce motion never see them.
- All the animation CSS is in one labeled section of `styles.css`, numbered 1 to 6, so I can delete any one I don't like.

## 2026-10-09: Dark mode

**Asked:** A dark mode button at the top in case the page is too bright for someone.

**What changed**
- Added a round moon/sun button in the nav bar, next to the language switch.
- The site starts in whatever mode the visitor's device uses, then remembers their choice if they click the button.
- A tiny script in the `<head>` of `index.html` picks the mode before the page draws, so it never flashes white first.
- Dark colors are in `styles.css` under `:root[data-theme="dark"]`. The page turns dark purple, borders and shadows turn cream, and the cards keep their colors but slightly deeper.
- Text on the colored cards and badges stays dark in both modes so it's always readable (`--card-ink`).

## 2026-10-09: Game Launcher redesign and game features

**Asked:** Ideas to make the design more gamelike. Claude made a page of 14 interactive design ideas, and then 10 gamelike themes (retro, modern, and fantasy RPG) side by side.

**Picked:** Theme D, **Game Launcher** (styled like a modern game library app), plus these features:
- **Achievement pop-up:** the first time a visitor opens a finished artifact's details or link, a badge slides in ("Achievement unlocked · +100 XP"). It only shows once per artifact per visitor.
- **Sticker labels:** NEW! on my latest finished artifact, WIP on anything marked `status: "wip"`.
- **Card detail view:** clicking a card opens a pop-up with a longer write-up (`details`) and screenshots (`images`).
- **Game Over 404 page:** `404.html`, shown by GitHub Pages for broken links. It counts down from 10, then goes home. A Wait button stops the countdown.
- **Favicon:** `favicon.svg` plus PNG versions for older browsers and phones.
- **Social preview image:** `og-image.png`, shown when someone shares my link.

**What changed**
- New look: dark by default, with a light "daytime" mode. Font is Sora.
- The hero is now a "Player profile" banner with a Continue button (jumps to my latest artifact) and an XP bar that fills as I finish artifacts.
- Every card has cover art. Ideas are greyed out like games I don't own yet. I can swap in a screenshot with the `cover` field.
- Cards have a new status, `"wip"`, for artifacts I'm building.
- Considered but skipped for now: progress-bar tiers, Konami code, click sparks, doodles, marquee.

**To do**
- In `index.html`, replace `YOUR-USERNAME` in the `og:image` line with my GitHub username so the social preview works.
- In `404.html`, check that `HOME` matches my repo name.

## 2026-10-09: Banner label

**Asked:** Replace "Player profile" with "Portfolio".

**What changed:** The small label above my name now says "Portfolio" ("Portafolio" in Spanish). It's the `eyebrow` line in `ui` in `content.js`. I re-rendered `og-image.png` so the social preview matches.
