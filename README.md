# John's Portfolio

Five things I'm building this quarter, one card each.

## Updating a card

1. Open `content.js`.
2. Find the card by its `number`.
3. Set `status` to `"wip"` while you build it and `"done"` when it's finished. Put the artifact's URL in `link`, and write the `title` and `reflection`.
4. Optional: add a screenshot as `cover`, a longer write-up as `details`, and more screenshots in `images`. Put image files in an `images` folder.
5. Commit and push (or upload the file on GitHub). The live site updates in about a minute.

## Files

| File | What it does | Edit it? |
| --- | --- | --- |
| `content.js` | All text: role, Now badge, about me, skills, contact links and cards | Yes, often |
| `styles.css` | Colors, fonts, layout | When you want a new look |
| `index.html` | Page structure | Rarely |
| `main.js` | Builds the page from `content.js` | Rarely |
| `LOGS.md` | Build log for the class | Every work session |
| `404.html` | Game Over page for broken links | Only to change `HOME` |
| `favicon.svg`, `favicon.png`, `apple-touch-icon.png` | Browser tab and phone icons | Rarely |
| `og-image.png` | Picture shown when your link is shared | Rarely |

## Nav bar extras

- **Resume:** put your PDF next to `index.html` and set `resume: "resume.pdf"` in `content.js`. The button stays hidden until you do.
- **Colors:** the four color presets are in `styles.css` under `[data-accent="..."]`. The rainbow dot lets visitors pick any color (very bright picks are darkened a little so the banner text stays readable).

## Intro

First-time visitors see a "crash and reboot" intro: Pixel kicks the crashed page (with anime-style impact frames when the kick lands; add `?impact=slow&intro=on` to your address to watch them frame by frame), error windows pile up, and Pixel fakes a browser refresh into the real site. (If Pixel is turned off, a boot screen plays instead and the page powers on like an old monitor.) The error window messages are `crashErrors` in `guide` in `content.js`. Add `?intro=on` to your site's address to watch it again, or `?intro=off` to skip it. Turn it off for everyone with `intro: false` in `content.js`.

## Library cards

The five artifact cards sit in one row, the same size, in order. On narrower screens the row scrolls sideways. They fan out and spread into place when visitors reach them. Turn it off with `cardReveal: false` in `content.js`.

## Pixel, the guide robot

Pixel lives in the bottom corner. On a first visit he kicks the crashed fake page back to life, then gives a few tips. After "Got it" he stays on screen, and visitors can:

- **Poke him and throw him:** drag and let go to throw him; he bounces around and walks back to his corner. Pokes and throws fill up his anger meter, and he gets grumpier step by step (happy → annoyed → grumpy → angry → furious), turning redder as he goes. About 15 quick pokes or 5 rough throws make him snap and start a bug-squashing game. He cools off if left alone, and comes back calm from a break. His lines for each stage are in `temper` in `guide` in `content.js`.
- **Watch him watch you:** his eyes follow the mouse, and he comments on cards you hover. Set each card's line with `pixel` in `content.js`.
- **Let him nap:** after `napSeconds` with nobody touching the page, he falls asleep.
- **Change settings:** he puts on sunglasses in light mode and admires new colors.
- **Send him away:** the robot button in the nav bar. He says goodbye and jetpacks off, and comes back with a line of his own when called. The choice is remembered.

All his lines are in `guide` and in the `pixel...` and `bug...` entries of `ui` in `content.js`. `{name}` becomes your first name. Set `guide: false` to remove Pixel completely (the intro then uses a boot screen instead).

## Contact info

Fill in `contact` in `content.js` (email, GitHub, LinkedIn, itch.io, Discord). Leave any you don't want public as `""`. Your local time comes from `timeZone` and `timeZoneLabel`.

## If the page shows "couldn't read content.js"

That means there's a typo in `content.js`, usually a missing comma, quote or bracket near your latest edit. Open the browser console (F12, or right-click → Inspect → Console) to see the line number.

## After your first deploy

- In `index.html`, replace `YOUR-USERNAME` in the `og:image` line with your GitHub username.
- In `404.html`, make sure `HOME` matches your repo name (`/portfolio/` by default).

## Previewing locally

Double-click `index.html` to open it in a browser. No server or install needed.
