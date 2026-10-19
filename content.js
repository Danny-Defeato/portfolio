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

  // The "crash and reboot" intro that plays on someone's first visit.
  // Set to false to turn it off. To watch it again yourself, add
  // ?intro=on to the end of your site's address.
  intro: true,

  // The library cards start stacked, fan out like a hand of cards, then
  // spread into place when visitors scroll to them.
  // Set to false to turn it off.
  cardReveal: true,

  // ---------- Profile banner (top of the page) ----------

  // One line under your name.
  role: "Senior CS student · future game developer",

  // What you're working on right now, shown next to the progress bar.
  // Update it as the quarter goes, or set to "" to hide it.
  now: "Planning Artifact 3",

  // ---------- Pixel, the guide robot ----------
  // A little robot who lives in the bottom corner. On someone's first
  // visit he kicks the crashed fake page back to life, then gives a few
  // tips. After that he stays around: visitors can poke him and throw him
  // (do it enough and he gets angrier and angrier, then starts a
  // bug-squashing game), and send him away or call him back with the robot
  // button in the nav bar.
  // Edit any of his lines below. {name} becomes your first name.
  // Set guide to false to remove Pixel completely.
  guide: {
    name: "Pixel",

    // Tips for first-time visitors. Once someone clicks "Got it", they
    // won't see the tips again, but Pixel stays.
    tips: [
      "Hi! I'm Pixel. Welcome to {name}'s portfolio.",
      "Click any card in the library to see the full story behind it.",
      "Try the color dots up top. The rainbow one lets you pick any color.",
      "You can pick me up and throw me. Please be gentle.",
      "Want me gone? The robot button up top sends me on a break."
    ],

    // What he says during the crash intro, before kicking the screen.
    intro: ["Whoa. That's the wrong website!", "Hang on, I've got this.", "Okay... maybe a refresh will fix it."],
    // The error windows that pile up after his kick, one per line.
    crashErrors: ["The screen has been kicked.", "Cause: one (1) small robot.", "The small robot says this is fine."],
    // Right after the real site powers on (for visitors who already saw the tips).
    afterKick: ["Much better. Welcome!"],
    // After "Got it".
    afterTips: ["Okay! I'll hang out down here.", "Got it. I'll be right here if you need me."],
    // When a returning visitor arrives.
    welcomeBack: ["Welcome back!", "Oh hey, you're back!"],
    // When a visitor sends him away, and when they call him back.
    leaveLines: ["Okay, I'll give you some space. Bye!", "Coffee break time. Call me if you need me!", "Fine, I'll be in the server room."],
    returnLines: ["I'm back! Did you miss me?", "Reporting for duty!", "Hi again! What did I miss?"],

    // Seconds with nobody touching the page before he dozes off.
    napSeconds: 30,

    // His temper. Poking him and throwing him around fills up an anger
    // meter, and it cools off again when he's left alone. He gets
    // grumpier step by step; when the meter is full, he snaps and starts
    // the bug-squashing game. Rewrite any of these lines (each list takes
    // turns).
    temper: {
      // What he says when poked, from happy to furious:
      calm: ["Hi!", "Hehe, that tickles.", "Yes? Can I help you?", "Boop."],
      annoyed: ["Okay, you can stop now.", "I'm trying to work here.", "That's plenty of poking."],
      grumpy: ["Seriously?", "Do you poke every robot you meet?", "I'm counting, you know."],
      angry: ["HEY.", "My patience module is overheating.", "Stop. Poking. Me."],
      furious: ["ONE. MORE. TIME.", "I am warning you!", "Don't. You. Dare."],
      // When the meter fills up (said one after the other):
      snap: ["THAT'S IT! If you've got this much energy...", "...you can help me squash these bugs!"],
      // When he's cooled off after being angry:
      calmDown: ["...Okay. I'm calm. I'm calm.", "Deep breaths. Deep robot breaths."],
      // Being thrown, by how annoyed he is (happy, grumpy, angry):
      launched: ["Wheee!", "Not again!", "AAAAAAAAH!"],
      grabbed: ["Hey! Put me down!", "Where are we going now?", "PUT. ME. DOWN."],
      landed: ["Again! Again!", "Okay, that's enough flying.", "I am NOT a frisbee!"],
      afterDizzy: ["Please don't do that again.", "My circuits are rattled.", "You're on thin ice, buddy."]
    }
  },

  // ---------- Nav bar extras ----------

  // Your resume PDF. Put the file next to index.html and write its name
  // here, e.g. "resume.pdf". While this is "", the Resume button is hidden.
  resume: "",

  // ---------- About section ----------

  about: "Senior CS student who likes to make cool things. Someday I hope to become a video game developer.",

  // Languages and tools you use. These are starting guesses: add, remove,
  // or reorder them.
  skills: ["Java", "SQL", "HTML", "CSS", "JavaScript", "Git"],

  // ---------- Contact section ----------

  // A short line inviting people to reach out.
  contactMessage: "Want to talk about games, code, or one of my projects? Reach out.",

  // Your time zone, so visitors can see your local time and know when
  // you're likely to reply. Set timeZone to "" to hide the clock.
  // Other examples: "America/New_York" (Eastern), "America/Chicago" (Central).
  timeZone: "America/Los_Angeles",
  timeZoneLabel: "Pacific Time",

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
    resume: "Resume",
    colorPicker: "Color",
    customColor: "Pick your own color",
    skipIntro: "Skip intro",
    pixelToggle: "Show or hide {name}",
    pixelBot: "{name}. Click to poke him, or drag him around.",
    pixelOw: "OW!",
    pixelDizzy: "Everything is spinning...",
    pixelAwake: "I'M AWAKE!",
    pixelExcuse1: "I was just... resting my pixels.",
    pixelExcuse2: "I wasn't sleeping. I was buffering.",
    pixelLight: "Whoa, bright! Good thing I brought shades.",
    pixelDark: "Ahh, much better. Shades off.",
    // Lines separated by | take turns.
    pixelPaint: "Ooh, new paint!|Do I look faster? I feel faster.|This color really brings out my eyes.|Fresh.",
    // What he says about a card you hover, if the card has no `pixel` line.
    pixelCard_done: "{title}! One of my favorites.",
    pixelCard_wip: "{title} is still being built. Exciting!",
    pixelCard_idea: "{title} is just an idea for now.",
    pixelGameWin: "We make a great team!",
    pixelGameLose: "Eh, close enough.",
    crashTitle: "Screen.exe",
    bugTitle: "main.js · Bug hunt",
    bugQuit: "Quit",
    bugAgain: "Play again",
    bugClose: "Close",
    bugSquash: "Squash bug",
    bugCheers: "Got one!|Squashed!|Nice!",
    bugWin: "Ship it! {count} bugs squashed.",
    bugLose: "{count} bugs squashed. The rest are now features.",
    guideNext: "Next tip",
    guideClose: "Got it",
    guideLabel: "Tips",
    localTime: "My local time",
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
                             a NEW! sticker)
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
       pixel       optional line Pixel says when someone hovers the card.
                   Leave "" for a default line based on the status.
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
      images: [],
      pixel: "Hey, that's where I live!"
    },
    {
      number: 2,
      status: "done",
      link: "https://github.com/Danny-Defeato/time-tracker",
      cover: "images/artifact2-cover.png",
      title: "Time Tracker",
      // DRAFT: rewrite this in your own words before you submit.
      reflection: "A web app I use to track how long I spend on studying, coding and everything else. My first project built with Claude Code: I planned it in phases, tested each feature myself before committing, and kept a log of every request and decision.",
      details: "A time tracker that runs in the browser: start a timer for whatever you're working on, and see time per task for today, any past day and the last 7 days. It also handles time you forgot to track, daily goals, themes, and Excel export. Everything stays in your own browser.\n\nTry it: danny-defeato.github.io/time-tracker. The repository's LOG.md records what I asked for, what changed, and what I decided or dropped.",
      images: ["images/artifact2-today.png"],
      pixel: "Your time tracker! It says I've been thrown around for 3 hours today."
    },
    {
      number: 3,
      status: "idea",
      link: "",
      cover: "",
      title: "Dungeon map editor",
      reflection: "A browser tool for drawing dungeon room layouts and exporting them for my team's Dungeon Adventure game.",
      details: "",
      images: [],
      pixel: "A dungeon editor? Put a snack room in it for me."
    },
    {
      number: 4,
      status: "idea",
      link: "",
      cover: "",
      title: "Recipe scaler",
      reflection: "Type in the number of servings, get the adjusted amounts.",
      details: "",
      images: [],
      pixel: "Math, but make it tasty."
    },
    {
      number: 5,
      status: "idea",
      link: "",
      cover: "",
      title: "Pixel's arcade",
      reflection: "All of Pixel's mini-games on their own page, so people can play without making him angry first.",
      details: "",
      images: [],
      pixel: "My arcade! Finally, people can play without poking me."
    }
  ]
};
