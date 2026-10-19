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

## 2026-10-09: Contact section

**Asked:** An area for contact info.

**What changed**
- The contact links used to hide until I filled them in. Now there's a full **Contact** section that's always on the page, with a "Let's connect" heading and a short message (`contactMessage` in `content.js`).
- It has spots for **email, GitHub, LinkedIn, itch.io** (for games I publish), and **Discord**. Each one shows an icon and the address.
- Email and Discord have **Copy** buttons, since a lot of people don't have an email app set up and Discord usernames aren't links.
- Until I fill any of them in, it shows greyed-out "Not linked yet" slots for email, GitHub and LinkedIn as a reminder.
- Long addresses wrap after the @ on phones instead of mid-word.

**To do**
- Fill in the `contact` fields in `content.js` with the ones I'm comfortable making public.

## 2026-10-09: Renamed the log

**Asked:** Change NOTES to LOGS.

**What changed:** Renamed this file from `NOTES.md` to `LOGS.md` and updated the README to match.

## 2026-10-09: Fix for two-word names

**Asked:** How to add my last name.

**What changed:** Found and fixed a bug before changing the name. With animations on, the space between a first and last name disappeared, and long names could break mid-word on phones. Letters are now grouped by word in `main.js`, so the name wraps between words.

## 2026-10-09: Bug sweep

**Asked:** Do more bug checks.

**How it was tested:** Claude loaded the site in a test browser at 5 screen widths (320px phone to 1440px desktop), in light and dark mode, English and Spanish, with animations on and off (80 combinations). It also tested different card setups (in progress, finished with a link, nothing finished), the details pop-up, achievements, Copy buttons, keyboard-only use, the nav links, blocked browser storage, and the 404 page. Then it read through the code for problems that only show up on older browsers.

**Bugs found and fixed**
- **Blank page on older iPhones:** the email-wrapping code used a feature Safari only added in 2023, which would stop the whole script on older iPhones. Rewrote it so it works everywhere.
- **Headings hidden under the nav on phones:** the nav wraps to two rows on phones, so jumping to a section put its heading underneath. The page now measures the nav's real height.
- **Broken image icons:** a typo in a `cover` or `images` path showed a broken picture. Now a missing cover falls back to the generated art, and missing screenshots are skipped.
- **See-through nav and pop-up on older browsers:** added solid fallback colors.
- **Status typos:** `"Done"` or `" wip "` now work the same as `"done"` and `"wip"`. Anything unrecognized counts as an idea.

**Passed with no changes needed:** no sideways scrolling at any width, nothing stuck invisible after scroll animations, everything reachable by keyboard, achievements show once and only for finished artifacts, the pop-up switches language while open, and the page works even when browser storage is blocked.

## 2026-10-09: English only

**Asked:** Remove Spanish and keep everything in English, then brainstorm ideas to use in its place.

**What changed**
- Removed the English/Español switch from the nav bar.
- `content.js` is simpler now: every piece of text is a plain string like `title: "This portfolio"` instead of `{ en: "...", es: "..." }`, and `ui` is a single list of labels.
- Removed the language code from `main.js` and the Spanish text from `404.html`.
- Claude built a preview page of ideas to fill the empty spot in the nav (see the next entry once I pick).

## 2026-10-09: Achievements, resume, colors and local time

**Asked:** From the nav ideas page, I picked the Achievements button and the Resume button, plus Local time and Pick your color.

**What changed**
- **Achievements button** in the nav: a ★ counter (like "0 / 8") that opens a list of every achievement.
  - One achievement per artifact. It unlocks when a visitor opens that artifact. Unfinished artifacts show "isn't finished yet."
  - Three bonus achievements visitors can earn now: *Explorer* (reach Contact), *Light switch* (toggle light/dark), and *Style points* (pick a new color). Their names are in `bonusAchievements` in `content.js`.
  - A "Reset progress" link at the bottom, so I can test it again.
- **Resume button** in the nav. It stays hidden until I add a resume PDF and set `resume: "resume.pdf"` in `content.js`.
- **Color picker:** four dots in the nav (Sunset, Ocean, Lime, Ember) that recolor the banner, hover glows, links and contact icons. The visitor's choice is remembered. Each color has a darker version in light mode so links stay readable.
- **Local time** in the Contact section ("My local time: 8:05 PM (Pacific Time)"), so people know when I'm likely to reply. Claude put it there instead of the nav so the nav wouldn't wrap to three rows on phones. Set with `timeZone` and `timeZoneLabel` in `content.js`.

**Tested:** all 40 combinations of screen size, light/dark and animations, plus the card scenarios, keyboard use, and each new feature. Every color stays readable on the banner in both modes.

**To do**
- Add `resume.pdf` and set `resume` in `content.js` when my resume is ready.

## 2026-10-09: Second bug sweep

**Asked:** Do more testing and bug searching/fixing.

**New tools this round**
- An accessibility checker (axe-core), run in light and dark mode, all 4 colors, desktop and phone, with the achievements list and card pop-up open.
- An HTML validator, a JavaScript linter, and browser-compatibility checkers for the JavaScript and CSS (targeting Safari/iOS 15+, Firefox 100+, Chrome/Edge 100+). The Firefox and Safari test browsers couldn't be downloaded in Claude's environment, so the compatibility data stood in for them.
- Edge cases: damaged saved data, a bad time zone or saved color, empty fields, very long names and words, HTML typed into a title, a short landscape phone screen, rapid clicking, the achievements list and pop-up open together, JavaScript turned off, and a browser without pop-up support.

**Bugs found and fixed**
- **Locked achievements and empty contact slots were too faint to read** (they failed the contrast check). They now use readable grey text instead of fading the whole row.
- **iOS 15.0–15.3 would show the card pop-up stuck at the bottom of the page** (those versions don't support the pop-up element). Added a fallback that hides it until opened, then shows it centered over a dark overlay, closable with Escape, the Close button, or clicking outside.
- **Long names got cut off on phones.** The banner now wraps long names and shrinks the font for names over 16 characters.
- **With JavaScript off, the nav showed a broken "0 / 0" counter.** Controls that need JavaScript now hide without it.
- Cleanup: the Resume and "Open it" links now get their new-tab settings at the same time as their address, and empty error handlers have comments explaining them.

**Checked and fine:** damaged saved data resets safely, a bad time zone hides the clock, HTML in a title shows as plain text (it can't run as code), rapid clicking causes no errors, and everything fits on a 360px-tall landscape screen.

**Known and left as-is:** the validator prefers an uppercase `<!DOCTYPE>` and a different progress-bar element; both are style preferences, not bugs.

## 2026-10-12: Crash-and-reboot intro and custom colors

**Asked:** Claude showed six "fakeout" intros (a plain homepage that breaks and reveals the real site). I picked **Crash and reboot**. I also asked for more color choices, and for more ideas to make the site interactive.

**Crash-and-reboot intro**
- On someone's first visit, the site starts as a plain 1990s-style "John's Homepage." It freezes ("Not Responding"), shows a fake FATAL ERROR screen ("Reason: too plain"), boots up "JOHN-OS," and then fades into the real site. About 5 seconds.
- The boot screen uses real numbers, like "Checking artifacts ... 1 / 5 OK," so it updates as I finish artifacts.
- Plays **once per visitor**, then never again in that browser.
- Skippable at any time: the "Skip intro" button, a click anywhere, or Escape.
- Skipped automatically for visitors who turn off motion on their device, and for browsers that block saved data (so they don't see it every visit).
- Add `?intro=on` to the address to watch it again, or `?intro=off` to skip it. Turn it off completely with `intro: false` in `content.js`.
- The real page can't be reached by keyboard while the intro plays, and the banner's entrance animation waits until the intro ends.

**Custom color**
- A rainbow dot next to the four color presets opens the browser's color chooser, so visitors can pick any color. The page updates live while they drag.
- The site builds a full banner gradient from the chosen color, and adjusts link colors so they stay readable in light and dark mode (tested with 9 very different colors, including yellow, white and black).
- The choice is remembered and counts toward the "Style points" achievement.

**Also fixed:** with the extra dot, the nav bar wrapped to three rows on phones. Tighter spacing on small screens keeps it at two rows down to 320px wide.

**Tested:** the full suite again (40 size/theme/motion combinations, card scenarios, features, edge cases, accessibility, HTML validation and code lint) plus new intro and color tests. All pass.

## 2026-10-12: Holo cards, Pixel the guide, magnetic buttons

**Asked:** From Claude's page of interactive ideas, I liked Group 3 ("feel and personality"). I asked for those, plus more ideas in that style.

**What changed**
- **Holo cards:** artifact cards tilt in 3D toward the mouse, with a shine that follows it, like a rare trading card. The big Latest card tilts more gently. Mouse and trackpad only, since tilting makes no sense on a touch screen.
- **Pixel, the guide robot:** a small robot in the bottom-left corner greets first-time visitors with tips that type out like game dialogue. It waits until the crash intro finishes. "Got it" makes it disappear for good. The tips are in `guide` in `content.js` (`{name}` becomes my first name), and `guide: false` turns it off. Screen readers get each whole tip at once instead of letter by letter.
- **Magnetic buttons:** Continue, Resume and Open it lean toward the mouse when it gets close. Most buttons also send out a soft ripple when clicked.
- **Phones:** achievement pop-ups now drop in from the top on small screens so they never cover Pixel at the bottom.
- All three respect the reduced-motion setting: no tilt, no magnet, no ripples, and Pixel's tips appear instantly.

**Tested:** the full suite again plus new tests for Pixel (after the intro, last tip, closing for good, phone layout next to a pop-up), tilt and its reset, the magnet and its release, ripples, touch screens, and reduced motion. All pass, including the accessibility check with Pixel open.

## 2026-10-12: Fan-then-spread card reveal

**Asked:** Claude made five scroll animations for the cards and contact links (loot crate, deal the deck, chest into inventory, fan then spread, level map). The first version followed the scroll position, which felt clunky, so I asked for each one to play the whole animation once when you reach it. I picked **Fan, then spread**, and asked for more animation ideas.

**What changed**
- Before a visitor reaches the library, the five cards wait in a neat stack. When the section is on screen, they fan out like a hand of cards, then lay themselves down into their places one after another (about 2 seconds). The contact links do the same when Contact is reached.
- Plays once per visit and waits for the crash intro to finish first.
- Cards can't be clicked while they're moving, and keyboard users who tab into a section skip straight to the finished layout.
- The stack shrinks on phones so the fan fits on screen, and the page never scrolls sideways while cards are moving.
- Turn it off with `cardReveal: false` in `content.js`. Visitors who reduce motion never see it.

**Fixed while building it:** the first version measured each card while its hover transition was still running, so the big Latest card stayed full size and swung off screen. Measuring with the transition paused fixed it.

**Testing note:** one test sometimes lost the last second of saved progress when it reloaded the page. That only happens when the files are opened straight from disk in the test browser; over a real web server (like GitHub Pages) it passed 6 out of 6 times.

## 2026-10-12: Power-on, color fix, trimming features

**Asked:** I wanted the whole page to power on after the crash intro, no more magnetic buttons, achievements removed, and the spread effect taken off the Contact links. I also noticed the color chooser wasn't working properly.

**What changed**
- **Power-on:** when the intro's boot screen finishes, the screen goes black, a bright line flashes across the middle like an old monitor, and the real page opens up and down from it while faint scanlines fade out (about one second). The banner's entrance starts as the screen opens. Pressing Skip still just fades, so skipping stays quick.
- **Achievements removed:** the ★ counter, its list, the pop-up and the `bonusAchievements` setting are all gone. Pixel's tip about achievements now points out dark mode instead, and the boot screen says "Loading library" instead of "Loading achievements".
- **Magnetic buttons removed.** Click ripples are still there.
- **Contact links** no longer fan out; they fade in with the rest of the section. The library cards still fan and spread.

**Fixed: the color chooser**
- It only kept the *hue* of the color you picked and threw away how light or saturated it was. So black, white and grey all turned purple, and brown came out bright orange. Now the banner uses the actual color you pick, with a lighter and a darker shade of it on either side.
- Very bright picks (neon green, yellow, white) are darkened just enough that the white text on the banner stays readable.
- Clicking the rainbow dot after choosing a preset didn't switch back to your custom color unless you picked a different one. Now it switches back right away.
- Colors saved by the old version are upgraded automatically the next time the page loads.

**Tested:** a new test for this round (removed features, color picker with eight tricky colors on both themes, reload, old and damaged saved colors, power-on at three screen sizes, skip and Escape, and accessibility in four color/theme combinations), plus the size sweep, intro, Pixel and tilt tests. All pass.

## 2026-10-12: Pixel joins for good

**Asked:** From Claude's page of Pixel ideas, I picked: Pixel kicking the screen during the intro, the bug squash game, throwing him around, him watching what you do, napping when you're idle, and reacting to settings. I also wanted him to stay on screen after his tips, with a toggle to send him away, and dialogue plus a small animation when he leaves and comes back.

**What changed**
- **Intro:** the error screen's progress gets stuck at 40%. Pixel walks on ("Whoa. That's the wrong website!"), kicks the screen (it shakes, cracks and goes BONK), and the real page powers on. If Pixel is turned off, the old boot screen plays instead.
- **He stays:** "Got it" ends the tips, but Pixel stays in his corner.
- **Nav toggle:** a robot button next to dark mode. Sending him away: a goodbye line, then he jetpacks off the top of the screen. Calling him back: he flies down, lands with a squish and a puff of dust, and says hi. Visitors' choice is remembered.
- **Poke him:** a few quick clicks wind him up ("Hi!" → "Bored? Same." → angry red eyes) until he opens a **bug squash** game: squash 8 bugs crawling through code in 12 seconds. Escape or Quit closes it.
- **Throw him:** drag and let go. He yells "Wheee!", bounces off the screen edges, gets dizzy from hard landings, then walks back to his corner.
- **Watching:** his eyes follow the mouse, and he comments on artifact cards you hover (each card's line is `pixel` in `content.js`).
- **Naps:** after 30 seconds of nobody touching the page he falls asleep with floating z's, and jolts awake when you come back.
- **Settings:** sunglasses in light mode, and a paint splash plus a comment when the color changes.
- All of his lines can be edited in `content.js`.

**Accessibility:** Pixel is a real button (Enter pokes him), the game traps focus and gives it back when it closes, bugs can be squashed with the keyboard, and screen readers hear his lines. With reduced motion there's no throwing, no flying, and bugs pop up in place instead of crawling.

**Fixed along the way**
- My last update accidentally deleted the phone nav-bar rules along with the achievement styles. They're back.
- A quick flick could leave Pixel behind before a throw started; drags now follow the pointer anywhere on the page.
- Letting go of Pixel over a link no longer clicks the link.
- If the window shrinks while he's mid-air, he now stays inside the new edges.
- The crack in the screen didn't appear at first (SVG images ignore the usual way of un-hiding things).

**Tested:** new tests for Pixel (Pixel turned off, sent away before the intro, skipping the intro, reduced motion, keyboard play, throwing over a link, resizing mid-throw, three phone widths, accessibility with tips open and during the game), plus last round's tests and the 20-combination size sweep. All pass.

## 2026-10-12: Bug sweep and the impact frame

**Asked:** Bugs were hard to squash (it took many clicks to get one), and Pixel's speech bubble got messed up after throwing him or sending him away mid-throw. I asked for a bug sweep of the whole portfolio, plus an overly detailed impact frame when Pixel kicks the screen, for comedy.

**Impact frame:** the instant Pixel's kick lands, the intro freezes for about two and a half seconds on a dramatic anime-style shot. It's red, black and white, with speed lines, shockwave rings, flying debris and film grain. Pixel appears huge in silhouette, revealing a previously undocumented leg. Labels point at everything: impact velocity (measured by vibes), force (it's over 9,000), kick angle, his confidence, screen integrity, a WARRANTY VOID stamp, a camera readout, and a "Fig. 1: The Kick" caption. Then it snaps back to the shaking, cracking screen and the power-on. Phones get a taller layout with bigger labels.

**Fixed**
- **Bug squash was hard:** bugs only counted a full click, but they keep moving, so the release often landed off the bug. Now a bug squashes the moment you press, near misses count (the closest bug within reach), the targets are bigger, and bugs crawl a little slower. In testing, a player reacting a tenth of a second late hit every bug on desktop and phone.
- **Pixel's bubble after a throw:** after landing on the right side of the screen, he kept "open the bubble to the left" when he walked home, so his next line ran off the left edge. The bubble direction now follows where he's headed, and resets at home.
- **Sending him away mid-throw:** the robot button was ignored while he was in the air. Now it cancels the throw, he says goodbye from wherever he is, flies off, and comes back to his corner with a normal bubble.
- **Poking Pixel during his tips** made his one-liner cover the tips bubble. During tips he just hops now.
- **A typo in content.js** used to leave a broken page with no explanation. Now the page shows a note saying content.js probably has a typo, and how to find the line.
- **Phones:** long-pressing Pixel no longer pops up the "save image" menu, and fast taps on bugs no longer zoom the page.
- **Bug game:** the page behind it no longer scrolls while it's open.

**Tested:** a new "monkey test" did 1,200+ random clicks, drags, key presses, scrolls and resizes across every feature (7 runs, desktop and phone), checking after each step that nothing crashed, got stuck, or ended up off screen. All clean. Also: real touch drags and taps, 11 content variations (everything finished, nothing finished, broken image paths, very long name, all contact info filled, resume set, no tips, bad time zone, empty sections, animations off, card reveal off), blocked browser storage, the 404 page, skipping the intro mid-freeze-frame, the impact frame at five screen sizes, and all the earlier suites. All pass.

## 2026-10-12: Real impact frames

**Asked:** The first impact frame was just a still image with no weight. Real impact frames are a few high-contrast frames flashed at the moment of a hit: swapped or inverted colors, silhouettes, starbursts and radial lines, sometimes skeletons or hidden Easter eggs. They're meant to be felt, not studied.

**What changed:** I replaced the freeze-frame with a proper impact sequence:
1. **Wind-up and strike:** Pixel leans back, snaps forward, and holds for a split second on contact (a "hit-stop").
2. **Six flash frames in about a quarter of a second:** pure white → black speed lines and a black Pixel silhouette on white → inverted, white on black with a red ring and an X-ray of Pixel (Easter egg: he runs on a hamster wheel and an AA battery) → red with black lines and a burst (Easter egg: the over-precise measurements, visible for one frame) → white cracks on black → white. Each frame is nudged and zoomed slightly differently, so the sequence jolts.
3. **Aftermath:** the screen shakes hard and settles, with the colors splitting apart at first. A crack races out from where the foot hit, shards of the error screen fly off and fall, and BONK slams in.

Add `?impact=slow&intro=on` to the address to watch it at one-tenth speed.

**Fixed:** skipping the intro while the screen was still shaking caused an error (late intro steps tried to update the screen after it was gone). Intro steps are now ignored once the intro has ended. Tested skipping at nine points from start to finish.

**Tested:** every frame at desktop and phone sizes in slow motion, a full-speed timing check (frames take about 0.23 seconds and the whole intro about 10.4), the previous Pixel and intro suites, and another monkey-test run. All pass.

## 2026-10-12: Always open at the top

**Asked:** The site was opening partway down at the artifacts instead of at the top with the About section.

**Why it happened:** two normal browser habits. After a reload, browsers jump back to wherever you'd scrolled. And clicking Artifacts, Contact or Continue adds `#artifacts` (or similar) to the address, so opening the site again with that address jumped straight to that section.

**Fix:** the page now always opens at the top. It turns off the browser's scroll memory, removes any `#section` from the address when the page loads, and scrolls to the top on back/forward too. The nav links still jump to their sections as usual while you're on the page.

**Tested:** fresh load, reload after scrolling, opening with #artifacts, #contact or #featured in the address, back button, first visit with the intro, desktop and phone. All start at the top. The earlier Pixel and intro suites still pass.

## 2026-10-12: Cards in one row, error windows and a fake refresh

**Asked:** Make the artifact cards equal sizes, in one row from left to right. And after Pixel bonks the screen, show an error screen before a fake refresh into the real site.

**Cards**
- The big "Latest" card is gone. All five cards are now the same size, in one row, in order 1 to 5. The newest finished one still gets the NEW! sticker.
- Wide screens fit all five side by side. Narrower screens (tablets, phones) scroll the row sideways, each card snaps into place, and the next card peeks in from the edge as a hint.
- The fan-and-spread deal still plays, including on phones.
- Continue now scrolls to the library and slides the row over to your latest card.

**Intro**
- After the BONK, three old-school error windows pile up: "The screen has been kicked." / "Cause: one (1) small robot." / "The small robot says this is fine." Pixel says "Okay... maybe a refresh will fix it."
- Then a fake browser refresh: the screen goes blank, a loading bar crawls across the top (with a stall, like a real slow load) next to a spinning reload icon, and the site paints in from the top down.
- Visitors can close the windows themselves (OK or ×) to move things along. Skip still works at any point.
- The error messages are `crashErrors` in `guide` in `content.js`.
- With Pixel turned off, the old boot screen and monitor power-on still play.

**Fixed while building it:** during the deal on narrow screens, the full width of the card row stretched the whole page (banner included) to about 1,330px for a couple of seconds. The row is now kept from widening the page. Also, the error windows hung off the left edge of phones, and Pixel's line got cut off and hidden behind them on small phones; both fixed.

**Tested:** the card row at seven screen widths (equal sizes, order, one row, nothing sticking out), Continue at every width, the error windows and refresh on desktop and phones, closing the windows by hand, skipping at seven points during the new part, plus the size sweep, Pixel, intro, content-variation and monkey tests. All pass.

## 2026-10-12: Opening mid-page (again) and another bug sweep

**Asked:** The site was opening in the middle of the page again instead of at the top. I asked for another bug sweep too.

**Why it happened:** I couldn't make it happen in the test browser (Chrome) at any size, inside a frame or not. The likely cause is new since last time: the sideways card row "snapped" cards into place while they were still moving in the deal animation. Some browsers (Safari especially) can drag the whole page down to a snapping row when that happens, which lands you right at the library.

**Fixes**
- The card row only starts snapping after the cards have been dealt out, and it snaps more gently.
- A safety net while the page opens: if anything other than the visitor scrolls the page (a browser quirk, a browser restoring an old spot, or the page being shown inside another site like a preview), it goes back to the top. It switches off for good the moment the visitor scrolls, taps, clicks or presses a key, and about a second after the page is ready.

**Other bugs found in the sweep**
- With `intro: false` in content.js, a first-time visitor never saw Pixel, and the library cards stayed stuck in their stack forever (both were waiting for an intro that never played). Fixed.
- Pressing Continue before the cards had been dealt slid the row to the latest card, but then the deal reset it back to card 1 (so on a phone, Artifact 5 ended up off-screen). The deal now finishes the slide.
- Tabbing to a card on a narrow screen only scrolled far enough to show its title; now the whole card slides into view.

**Tested:** unwanted jumps undone at three widths (first and returning visits) while real scrolling is never blocked; keyboard order and focus through the card row; Continue with every card finished on a phone; accessibility at three widths in both themes; intro turned off; plus the size sweep, Pixel, intro, content-variation and monkey tests. All pass.

## 2026-10-13: Pixel's temper

**Asked:** Three clicks was enough to make Pixel angry. I wanted it to take many clicks (or throwing him around too much), with him getting angrier step by step and dialogue that builds up.

**What changed**
- Pixel now has an **anger meter**. Each poke adds a little, each throw adds more, and a hard landing adds extra. When he's left alone for a few seconds it drains again (but not while he's still flying or walking home).
- **Five stages**, each with its own lines that take turns:
  - Happy: "Hi!", "Hehe, that tickles.", "Yes? Can I help you?", "Boop."
  - Annoyed: "Okay, you can stop now.", "I'm trying to work here."...
  - Grumpy (starts shaking): "Seriously?", "Do you poke every robot you meet?", "I'm counting, you know."
  - Angry (red eyes): "HEY.", "My patience module is overheating.", "Stop. Poking. Me."
  - Furious (glowing red, steaming): "ONE. MORE. TIME.", "I am warning you!", "Don't. You. Dare."
- His shell turns gradually from his normal color to pink to red as he gets angrier.
- **The snap:** about 15 quick pokes (or about 5 rough throws) fill the meter: "THAT'S IT! If you've got this much energy..." / "...you can help me squash these bugs!" Then the bug game starts. If he's thrown into it, he walks back to his corner first.
- Throw lines change with his mood too: "Wheee!" → "Not again!" → "AAAAAAAAH!", and landings go from "Again! Again!" to "I am NOT a frisbee!"
- If he cools off after getting properly angry: "...Okay. I'm calm. I'm calm."
- Squashing bugs together, or sending him on a break, resets him to calm.
- Slow, occasional pokes never make him snap.
- All his lines are in `temper` inside `guide` in content.js.

**Tested:** poke-by-poke stages (15 pokes to snap), slow pokes never snapping, cooling off and the calm-down line, throws adding up (5 rough throws to snap, game after he walks home), sending him away mid-snap (no game, page not stuck), coming back calm, both themes, plus all earlier suites and a monkey run. All pass.

## 2026-10-18: Professor feedback, new card ideas

**Feedback:** the game-launcher design suits me, and comparing many designs before settling was a good use of time. But the bus-alert and family-business ideas were the examples from the assignment sheet, so I needed ideas of my own.

**What changed**
- Artifact 2 is now **Dungeon map editor**: a browser tool for drawing dungeon room layouts and exporting them for my TCSS 360 team's Dungeon Adventure game.
- Artifact 5 is now **Pixel's arcade**: all of Pixel's mini-games on their own page, so people can play without making him angry first.
- Pixel's hover comments for both cards were updated to match.

**Tested:** all five cards still the same size in one row on desktop and phone, Pixel's new card lines, no errors.

## 2026-10-18: Artifact 2 card (Time Tracker)

**Asked:** add my finished Artifact 2, the Time Tracker, to the portfolio.

**What changed**
- Artifact 2 is now **Time Tracker** (shipped), linking to the repository (github.com/Danny-Defeato/time-tracker), whose README links to the live app and whose LOG.md is the build log.
- Its cover is a screenshot of the app's timer, and the details view shows a full screenshot (both in `images/`). The screenshots use sample data, not my real tracked time.
- The Dungeon map editor idea moved to Artifact 3, replacing the Study-room finder placeholder.
- The banner's "Now" line says "Planning Artifact 3".
- The reflection is a DRAFT to rewrite in my own words before submitting.

**Tested:** all five cards the same size in one row, NEW! sticker on Artifact 2, cover and screenshot loading, the details view on desktop and phone.
