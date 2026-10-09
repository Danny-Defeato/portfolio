/* =====================================================================
   main.js: builds the page from the data in content.js.
   You shouldn't need to edit this file to update your cards.
   ===================================================================== */

(function () {
  const STORAGE_KEY = "portfolio-lang";

  // Decide which language to show, in this order:
  // 1. ?lang=es in the URL   2. the visitor's last choice
  // 3. the browser's language   4. SITE.defaultLanguage
  function pickLanguage() {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl && SITE.languages[fromUrl]) return fromUrl;

    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // Some private browsing modes block storage; that's fine.
    }
    if (saved && SITE.languages[saved]) return saved;

    const browser = (navigator.language || "").slice(0, 2);
    if (SITE.languages[browser]) return browser;

    return SITE.defaultLanguage;
  }

  // Get the text for one language, falling back to the default language.
  function t(value, lang) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    return value[lang] || value[SITE.defaultLanguage] || "";
  }

  // Look up a piece of interface text like "greeting" or "open".
  function ui(key, lang) {
    const strings = SITE.ui[lang] || {};
    const fallback = SITE.ui[SITE.defaultLanguage] || {};
    return strings[key] || fallback[key] || "";
  }

  function makeCard(card, lang) {
    const article = document.createElement("article");
    article.className = "card";
    article.dataset.status = card.status;

    const tag = document.createElement("p");
    tag.className = "tag";
    tag.textContent = "#" + card.number + " · " + ui(card.status, lang);

    const title = document.createElement("h3");
    title.textContent = t(card.title, lang);

    const reflection = document.createElement("p");
    reflection.className = "reflection";
    reflection.textContent = t(card.reflection, lang);

    article.append(tag, title, reflection);

    if (card.link) {
      const link = document.createElement("a");
      link.className = "card-link";
      link.href = card.link;
      link.textContent = ui("open", lang);
      article.append(link);
    }

    return article;
  }

  function makeLanguageButtons(current) {
    const nav = document.getElementById("lang-switch");
    nav.replaceChildren();
    nav.setAttribute("aria-label", ui("language", current));

    // Hide the switcher entirely if there's only one language.
    nav.hidden = Object.keys(SITE.languages).length < 2;

    Object.entries(SITE.languages).forEach(function ([code, label]) {
      const button = document.createElement("button");
      button.type = "button";
      button.lang = code;
      button.textContent = label;
      button.setAttribute("aria-pressed", String(code === current));
      button.addEventListener("click", function () {
        try {
          localStorage.setItem(STORAGE_KEY, code);
        } catch (e) {}
        render(code);
      });
      nav.append(button);
    });
  }

  function render(lang) {
    document.documentElement.lang = lang;
    document.title = SITE.name + " · Portfolio";

    document.getElementById("greeting").textContent = ui("greeting", lang);
    document.getElementById("name").textContent = SITE.name + ".";
    document.getElementById("about").textContent = t(SITE.about, lang);
    document.getElementById("artifacts-heading").textContent = ui("artifactsHeading", lang);
    document.getElementById("footer-text").textContent = ui("footer", lang);

    const grid = document.getElementById("cards");
    grid.replaceChildren();
    SITE.cards
      .slice()
      .sort(function (a, b) { return a.number - b.number; })
      .forEach(function (card) { grid.append(makeCard(card, lang)); });

    makeLanguageButtons(lang);
  }

  render(pickLanguage());
})();
