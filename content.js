/* =====================================================================
   content.js: ALL THE TEXT ON THE SITE LIVES HERE.

   You never need to touch index.html or main.js to update the site.
   To change a card, edit its entry in `cards` below and push to GitHub.

   Every piece of visible text is written like this:
       { en: "English text", es: "Texto en español" }
   If a language is missing for one piece of text, the site falls back
   to English, so you can add translations whenever you get to them.

   To ADD A LANGUAGE (for example Vietnamese):
     1. Add it to `languages`:      vi: "Tiếng Việt"
     2. Add a `vi` block to `ui` (copy the `en` block and translate it).
     3. Add `vi: "..."` next to the other languages in `about` and cards.
   ===================================================================== */

const SITE = {
  name: "John",

  // The language shown when a visitor's browser language isn't listed.
  defaultLanguage: "en",

  // Code (2 letters) : name shown on the language button.
  languages: {
    en: "English",
    es: "Español"
  },

  about: {
    en: "Senior CS student who likes to make cool things. Someday I hope to become a video game developer.",
    es: "Estudiante de último año de informática a quien le gusta crear cosas geniales. Algún día espero ser desarrollador de videojuegos."
  },

  // Small pieces of interface text (headings, labels, buttons).
  ui: {
    en: {
      greeting: "Hey, I'm",
      artifactsHeading: "What I'm building this quarter",
      done: "shipped",
      idea: "idea",
      open: "Open it →",
      language: "Language",
      footer: "Built by hand with HTML, CSS and JavaScript."
    },
    es: {
      greeting: "Hola, soy",
      artifactsHeading: "Lo que estoy creando este trimestre",
      done: "terminado",
      idea: "idea",
      open: "Ábrelo →",
      language: "Idioma",
      footer: "Hecho a mano con HTML, CSS y JavaScript."
    }
  },

  /* -------------------------------------------------------------------
     THE FIVE ARTIFACT CARDS
       number      which artifact this is (1 to 5)
       status      "done" once you've built it, "idea" while it's a placeholder
       link        URL of the artifact; leave as "" for no link
       title       the card's heading
       reflection  for "done" cards: a few sentences on how it went and
                   what you learned. For "idea" cards: your idea.
     Card colors cycle automatically, so you never have to pick one.
     ------------------------------------------------------------------- */
  cards: [
    {
      number: 1,
      status: "done",
      link: "./",
      title: {
        en: "This portfolio",
        es: "Este portafolio"
      },
      reflection: {
        // DRAFT: rewrite this in your own words before you submit.
        en: "My first site deployed with GitHub Pages. I compared four designs before picking this one, added English and Spanish, and kept all the text in one file so updating a card takes a minute.",
        es: "Mi primer sitio publicado con GitHub Pages. Comparé cuatro diseños antes de elegir este, agregué inglés y español, y puse todo el texto en un solo archivo para que actualizar una tarjeta tome un minuto."
      }
    },
    {
      number: 2,
      status: "idea",
      link: "",
      title: {
        en: "Late-bus alert bot",
        es: "Bot de alerta de autobús"
      },
      reflection: {
        en: "Warns my study group when the bus is running late.",
        es: "Avisa a mi grupo de estudio cuando el autobús viene tarde."
      }
    },
    {
      number: 3,
      status: "idea",
      link: "",
      title: {
        en: "Study-room finder",
        es: "Buscador de salas de estudio"
      },
      reflection: {
        en: "Shows which campus rooms are free right now.",
        es: "Muestra qué salas del campus están libres ahora mismo."
      }
    },
    {
      number: 4,
      status: "idea",
      link: "",
      title: {
        en: "Recipe scaler",
        es: "Escalador de recetas"
      },
      reflection: {
        en: "Type in the number of servings, get the adjusted amounts.",
        es: "Escribe el número de porciones y obtén las cantidades ajustadas."
      }
    },
    {
      number: 5,
      status: "idea",
      link: "",
      title: {
        en: "Something for my family",
        es: "Algo para mi familia"
      },
      reflection: {
        en: "A tool a small local business could actually use.",
        es: "Una herramienta que un pequeño negocio local realmente pueda usar."
      }
    }
  ]
};
