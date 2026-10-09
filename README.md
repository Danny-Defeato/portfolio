# John's Portfolio

Five things I'm building this quarter, one card each.

## Updating a card

1. Open `content.js`.
2. Find the card by its `number`.
3. Set `status` to `"wip"` while you build it and `"done"` when it's finished. Put the artifact's URL in `link`, and write the `title` and `reflection` (in each language you support).
4. Optional: add a screenshot as `cover`, a longer write-up as `details`, and more screenshots in `images`. Put image files in an `images` folder.
5. Commit and push (or upload the file on GitHub). The live site updates in about a minute.

## Files

| File | What it does | Edit it? |
| --- | --- | --- |
| `content.js` | All text: role, Now badge, about me, skills, contact links, cards, translations | Yes, often |
| `styles.css` | Colors, fonts, layout | When you want a new look |
| `index.html` | Page structure | Rarely |
| `main.js` | Builds the page from `content.js` | Rarely |
| `NOTES.md` | Build log for the class | Every work session |
| `404.html` | Game Over page for broken links | Only to change `HOME` |
| `favicon.svg`, `favicon.png`, `apple-touch-icon.png` | Browser tab and phone icons | Rarely |
| `og-image.png` | Picture shown when your link is shared | Rarely |

## After your first deploy

- In `index.html`, replace `YOUR-USERNAME` in the `og:image` line with your GitHub username.
- In `404.html`, make sure `HOME` matches your repo name (`/portfolio/` by default).

## Previewing locally

Double-click `index.html` to open it in a browser. No server or install needed.
