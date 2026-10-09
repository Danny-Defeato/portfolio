/* =====================================================================
   content.js: ALL THE TEXT ON THE SITE LIVES HERE.

   You never need to touch index.html or main.js to update the site.
   To change a card, edit its entry in `cards` below and push to GitHub.

   Every piece of visible text is written like this:
       { en: "English text", es: "Texto en español" }
   If a language is missing for one piece of text, the site falls back
   to English, so you can add translations whenever you get to them.

   Anything left as "" (empty) is hidden on the page, so you can leave
   things blank until you're ready.

   To ADD A LANGUAGE (for example Vietnamese):
     1. Add it to `languages`:      vi: "Tiếng Việt"
     2. Add a `vi` block to `ui` (copy the `en` block and translate it).
     3. Add `vi: "..."` next to the other languages in the text fields.
   ===================================================================== */

const SITE = {
  name: "John",

  // The language shown when a visitor's browser language isn't listed.
  defaultLanguage: "en",

  // Set to false to turn off all animations. Visitors whose device is set
  // to "reduce motion" never see them either way.
  animations: true,

  // Code (2 letters) : name shown on the language button.
  languages: {
    en: "English",
    es: "Español"
  },

  // ---------- Profile banner (top of the page) ----------

  // One line under your name.
  role: {
    en: "Senior CS student · future game developer",
    es: "Estudiante de último año de informática · futuro desarrollador de videojuegos"
  },

  // What you're working on right now, shown next to the progress bar.
  // Update it as the quarter goes, or set to "" to hide it.
  now: {
    en: "Building Artifact 2",
    es: "Creando el Artefacto 2"
  },

  // ---------- About section ----------

  about: {
    en: "Senior CS student who likes to make cool things. Someday I hope to become a video game developer.",
    es: "Estudiante de último año de informática a quien le gusta crear cosas geniales. Algún día espero ser desarrollador de videojuegos."
  },

  // Languages and tools you use. These are starting guesses: add, remove,
  // or reorder them. Tool names usually don't need translating.
  skills: ["Java", "SQL", "HTML", "CSS", "JavaScript", "Git"],

  // ---------- Contact section ----------
  // A short line inviting people to reach out.
  contactMessage: {
    en: "Want to talk about games, code, or one of my projects? Reach out.",
    es: "¿Quieres hablar de videojuegos, programación o alguno de mis proyectos? Escríbeme."
  },

  // Fill in the ones you want to show; leave the rest as "".
  // Only add things you're fine with anyone on the internet seeing.
  // While all of them are empty, the section shows greyed-out
  // "Not linked yet" slots as a reminder.
  contact: {
    email: "nguyenjohn922@gmail.com",      // e.g. "john@example.com"
    github: "https://github.com/Danny-Defeato",     // e.g. "https://github.com/your-username"
    linkedin: "",   // e.g. "https://www.linkedin.com/in/your-name"
    itch: "",       // itch.io page for your games, e.g. "https://your-name.itch.io"
    discord: ""     // your Discord username, e.g. "john_dev"
  },

  // ---------- Small pieces of interface text ----------
  // {done}, {total} and {title} are filled in automatically.
  ui: {
    en: {
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
      language: "Language",
      darkMode: "Dark mode",
      footer: "Built by hand with HTML, CSS and JavaScript."
    },
    es: {
      eyebrow: "Portafolio",
      continue: "Continuar",
      progress: "{done} / {total} artefactos",
      nowLabel: "Ahora",
      navAbout: "Sobre mí",
      navArtifacts: "Artefactos",
      navContact: "Contacto",
      aboutHeading: "Sobre mí",
      skillsHeading: "Con qué trabajo",
      artifactsHeading: "Mi biblioteca",
      latest: "Lo más reciente",
      done: "terminado",
      wip: "en progreso",
      idea: "idea",
      artifact: "Artefacto",
      stickerNew: "¡NUEVO!",
      stickerWip: "EN CURSO",
      details: "Detalles",
      open: "Ábrelo",
      close: "Cerrar",
      achievement: "Logro desbloqueado",
      achievementText: "Viste {title}",
      xp: "+100 XP",
      contactHeading: "Contacto",
      contactTitle: "Hablemos",
      email: "Correo",
      github: "GitHub",
      linkedin: "LinkedIn",
      itch: "itch.io",
      discord: "Discord",
      copy: "Copiar",
      copied: "¡Copiado!",
      notLinked: "Sin enlazar todavía",
      backToTop: "Volver arriba",
      language: "Idioma",
      darkMode: "Modo oscuro",
      footer: "Hecho a mano con HTML, CSS y JavaScript."
    }
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
                   the card. Leave "" to reuse the reflection.
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
      title: {
        en: "This portfolio",
        es: "Este portafolio"
      },
      reflection: {
        // DRAFT: rewrite this in your own words before you submit.
        en: "My first site deployed with GitHub Pages. I compared a lot of designs before landing on a game launcher style, and kept all the text in one file so updating a card takes a minute.",
        es: "Mi primer sitio publicado con GitHub Pages. Comparé muchos diseños antes de quedarme con un estilo de lanzador de juegos, y puse todo el texto en un solo archivo para que actualizar una tarjeta tome un minuto."
      },
      details: "",
      images: []
    },
    {
      number: 2,
      status: "idea",
      link: "",
      cover: "",
      title: {
        en: "Late-bus alert bot",
        es: "Bot de alerta de autobús"
      },
      reflection: {
        en: "Warns my study group when the bus is running late.",
        es: "Avisa a mi grupo de estudio cuando el autobús viene tarde."
      },
      details: "",
      images: []
    },
    {
      number: 3,
      status: "idea",
      link: "",
      cover: "",
      title: {
        en: "Study-room finder",
        es: "Buscador de salas de estudio"
      },
      reflection: {
        en: "Shows which campus rooms are free right now.",
        es: "Muestra qué salas del campus están libres ahora mismo."
      },
      details: "",
      images: []
    },
    {
      number: 4,
      status: "idea",
      link: "",
      cover: "",
      title: {
        en: "Recipe scaler",
        es: "Escalador de recetas"
      },
      reflection: {
        en: "Type in the number of servings, get the adjusted amounts.",
        es: "Escribe el número de porciones y obtén las cantidades ajustadas."
      },
      details: "",
      images: []
    },
    {
      number: 5,
      status: "idea",
      link: "",
      cover: "",
      title: {
        en: "Something for my family",
        es: "Algo para mi familia"
      },
      reflection: {
        en: "A tool a small local business could actually use.",
        es: "Una herramienta que un pequeño negocio local realmente pueda usar."
      },
      details: "",
      images: []
    }
  ]
};
