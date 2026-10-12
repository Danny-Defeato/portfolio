/* =====================================================================
   content.js: ALL THE TEXT ON THE SITE LIVES HERE.

   You never need to touch index.html or main.js to update the site.
   To change a card, edit its entry in `cards` below and push to GitHub.

   Anything left as "" (empty) is hidden on the page, so you can leave
   things blank until you're ready.
   ===================================================================== */

const SITE = {
  name: "John",

  // Set to false to turn off all animations. Visitors whose device is set
  // to "reduce motion" never see them either way.
  animations: true,

  // ---------- Profile banner (top of the page) ----------

  // One line under your name.
  role: "Senior CS student · future game developer",

  // What you're working on right now, shown next to the progress bar.
  // Update it as the quarter goes, or set to "" to hide it.
  now: "Building Artifact 2",

  // ---------- About section ----------

  about: "Senior CS student who likes to make cool things. Someday I hope to become a video game developer.",

  // Languages and tools you use. These are starting guesses: add, remove,
  // or reorder them.
  skills: ["Java", "SQL", "HTML", "CSS", "JavaScript", "Git"],

  // ---------- Contact section ----------

  // A short line inviting people to reach out.
  contactMessage: "Want to talk about games, code, or one of my projects? Reach out.",

  // Fill in the ones you want to show; leave the rest as "".
  // Only add things you're fine with anyone on the internet seeing.
  // While all of them are empty, the section shows greyed-out
  // "Not linked yet" slots as a reminder.
  contact: {
    email: "",      // e.g. "john@example.com"
    github: "",     // e.g. "https://github.com/your-username"
    linkedin: "",   // e.g. "https://www.linkedin.com/in/your-name"
    itch: "",       // itch.io page for your games, e.g. "https://your-name.itch.io"
    discord: ""     // your Discord username, e.g. "john_dev"
  },

  // ---------- Small pieces of interface text ----------
  // Headings, labels and buttons. {done}, {total} and {title} are
  // filled in automatically.
  ui: {
    eyebrow: "Portfolio",
    continue: "Continue",
    progress: "{done} / {total} artifacts",
    nowLabel: "Now",
    navAbout: "About",
    navArtifacts: "Artifacts",
    navContact: "Contact",
    aboutHeading: "About me",
    skillsHeading: "What I work with",
    artifactsHeading: "My library",
    latest: "Latest",
    done: "shipped",
    wip: "in progress",
    idea: "idea",
    artifact: "Artifact",
    stickerNew: "NEW!",
    stickerWip: "WIP",
    details: "Details",
    open: "Open it",
    close: "Close",
    achievement: "Achievement unlocked",
    achievementText: "Checked out {title}",
    xp: "+100 XP",
    contactHeading: "Contact",
    contactTitle: "Let's connect",
    email: "Email",
    github: "GitHub",
    linkedin: "LinkedIn",
    itch: "itch.io",
    discord: "Discord",
    copy: "Copy",
    copied: "Copied!",
    notLinked: "Not linked yet",
    backToTop: "Back to top",
    darkMode: "Dark mode",
    footer: "Built by hand with HTML, CSS and JavaScript."
  },

  /* -------------------------------------------------------------------
     THE FIVE ARTIFACT CARDS
       number      which artifact this is (1 to 5)
       status      "idea"  - a placeholder (greyed out, like a game you
                             don't own yet)
                   "wip"   - you're building it (gets a WIP sticker)
                   "done"  - finished (full color; the newest one gets
                             a NEW! sticker and the big Latest spot)
       link        URL of the artifact; leave as "" for no link
       cover       optional screenshot for the card's cover, e.g.
                   "images/artifact2.png". Leave "" to use generated art.
       title       the card's heading
       reflection  short version shown on the card. For "done" cards: a
                   few sentences on how it went. For ideas: your idea.
       details     optional longer version shown when someone clicks
                   the card. Leave "" to reuse the reflection. A blank
                   line (\n\n) starts a new paragraph.
       images      optional extra screenshots for the details view,
                   e.g. ["images/a2-menu.png", "images/a2-game.png"]
     Put image files in an `images` folder next to index.html.
     ------------------------------------------------------------------- */
  cards: [
    {
      number: 1,
      status: "done",
      link: "./",
      cover: "",
      title: "This portfolio",
      // DRAFT: rewrite this in your own words before you submit.
      reflection: "My first site deployed with GitHub Pages. I compared a lot of designs before landing on a game launcher style, and kept all the text in one file so updating a card takes a minute.",
      details: "",
      images: []
    },
    {
      number: 2,
      status: "idea",
      link: "",
      cover: "",
      title: "Late-bus alert bot",
      reflection: "Warns my study group when the bus is running late.",
      details: "",
      images: []
    },
    {
      number: 3,
      status: "idea",
      link: "",
      cover: "",
      title: "Study-room finder",
      reflection: "Shows which campus rooms are free right now.",
      details: "",
      images: []
    },
    {
      number: 4,
      status: "idea",
      link: "",
      cover: "",
      title: "Recipe scaler",
      reflection: "Type in the number of servings, get the adjusted amounts.",
      details: "",
      images: []
    },
    {
      number: 5,
      status: "idea",
      link: "",
      cover: "",
      title: "Something for my family",
      reflection: "A tool a small local business could actually use.",
      details: "",
      images: []
    }
  ]
};
