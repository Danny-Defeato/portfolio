/* =====================================================================
   main.js: builds the page from the data in content.js.
   You shouldn't need to edit this file to update your content.
   ===================================================================== */

(function () {
  const STORAGE_KEY = "portfolio-lang";
  const THEME_KEY = "portfolio-theme";
  const ACHIEVEMENTS_KEY = "portfolio-achievements";

  // Animations run unless they're turned off in content.js or the
  // visitor's device asks for reduced motion.
  const motionOn =
    SITE.animations !== false &&
    !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  let firstRender = true;
  let currentLang = SITE.defaultLanguage;
  let openCardNumber = null;

  // ---------- Small helpers ----------

  // Read and write browser storage without crashing in private mode.
  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  // Decide which language to show, in this order:
  // 1. ?lang=es in the URL   2. the visitor's last choice
  // 3. the browser's language   4. SITE.defaultLanguage
  function pickLanguage() {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl && SITE.languages[fromUrl]) return fromUrl;

    const saved = load(STORAGE_KEY);
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

  // Look up a piece of interface text, filling in {placeholders}.
  function ui(key, lang, fill) {
    const strings = SITE.ui[lang] || {};
    const fallback = SITE.ui[SITE.defaultLanguage] || {};
    let text = strings[key] || fallback[key] || "";
    Object.keys(fill || {}).forEach(function (name) {
      text = text.split("{" + name + "}").join(fill[name]);
    });
    return text;
  }

  // Put text into the element with this id.
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function sortedCards() {
    return SITE.cards.slice().sort(function (a, b) { return a.number - b.number; });
  }

  // The finished card with the highest number.
  function latestDone() {
    const done = sortedCards().filter(function (c) { return c.status === "done"; });
    return done.length ? done[done.length - 1] : null;
  }

  // Links to other websites open in a new tab so the visitor can come back.
  function isExternal(link) {
    return /^https?:\/\//i.test(link);
  }

  // ---------- Cover art ----------

  // A screenshot if the card has one, otherwise generated art in the card's colors.
  function makeArt(card, className) {
    const art = document.createElement("div");
    art.className = className;
    art.dataset.art = String(((card.number - 1) % 5) + 1);
    if (card.cover) {
      const img = document.createElement("img");
      img.src = card.cover;
      img.alt = "";
      img.loading = "lazy";
      art.classList.add("has-cover");
      art.append(img);
    }
    return art;
  }

  // ---------- Name ----------

  // Split the name into letters so each one can hop on hover.
  function renderName() {
    const el = document.getElementById("name");
    el.replaceChildren();
    el.setAttribute("aria-label", SITE.name);
    Array.from(SITE.name).forEach(function (ch, i) {
      const span = document.createElement("span");
      span.className = "name-letter";
      span.setAttribute("aria-hidden", "true");
      span.style.setProperty("--i", i);
      span.textContent = ch;
      el.append(span);
    });
  }

  // ---------- Progress bar ----------

  function renderProgress(lang) {
    const total = SITE.cards.length;
    const done = SITE.cards.filter(function (c) { return c.status === "done"; }).length;
    const bar = document.getElementById("xp-bar");
    document.getElementById("xp-fill").style.width = (total ? (done / total) * 100 : 0) + "%";
    bar.setAttribute("aria-valuemax", String(total));
    bar.setAttribute("aria-valuenow", String(done));
    const label = ui("progress", lang, { done: done, total: total });
    bar.setAttribute("aria-label", label);
    setText("xp-count", label);

    const nowText = t(SITE.now, lang);
    setText("now-label", ui("nowLabel", lang));
    setText("now-text", nowText);
    document.getElementById("now").hidden = !nowText;

    // "Continue" jumps to your latest finished artifact.
    document.getElementById("continue").href = latestDone() ? "#featured" : "#artifacts";
    setText("continue-text", ui("continue", lang));
  }

  // ---------- Achievements ----------

  let toastTimer = null;

  function showToast(title, lang) {
    const toast = document.getElementById("toast");
    // When the details pop-up is open it covers the whole page, so the
    // toast moves inside it to stay visible on top.
    const dialog = document.getElementById("detail");
    if (dialog.open) dialog.append(toast);
    else if (toast.parentElement !== document.body) document.body.append(toast);
    setText("toast-label", ui("achievement", lang));
    setText("toast-title", ui("achievementText", lang, { title: title }));
    setText("toast-xp", ui("xp", lang));
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 3400);
  }

  // Each finished artifact gives its achievement once per visitor.
  function unlockAchievement(card) {
    if (card.status !== "done") return;
    let unlocked = [];
    try { unlocked = JSON.parse(load(ACHIEVEMENTS_KEY) || "[]"); } catch (e) {}
    if (unlocked.indexOf(card.number) !== -1) return;
    unlocked.push(card.number);
    save(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
    showToast(t(card.title, currentLang), currentLang);
  }

  // ---------- Card details pop-up ----------

  function cardTag(card, lang, featured) {
    let text = ui("artifact", lang) + " " + card.number + " · " + ui(card.status, lang);
    if (featured) text = ui("latest", lang) + " · " + text;
    return text;
  }

  function fillDetail(card, lang) {
    const art = document.getElementById("detail-art");
    art.replaceChildren(makeArt(card, "art"));

    setText("detail-tag", cardTag(card, lang, false));
    setText("detail-title", t(card.title, lang));

    // Blank lines in the details text start new paragraphs.
    const textBox = document.getElementById("detail-text");
    textBox.replaceChildren();
    const longText = t(card.details, lang) || t(card.reflection, lang);
    longText.split(/\n\s*\n/).forEach(function (para) {
      const p = document.createElement("p");
      p.textContent = para.trim();
      textBox.append(p);
    });

    const images = document.getElementById("detail-images");
    images.replaceChildren();
    (card.images || []).forEach(function (src, i) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = t(card.title, lang) + " screenshot " + (i + 1);
      img.loading = "lazy";
      images.append(img);
    });
    images.hidden = !(card.images && card.images.length);

    const link = document.getElementById("detail-link");
    link.hidden = !card.link;
    if (card.link) {
      link.href = card.link;
      link.textContent = ui("open", lang) + " ↗";
      if (isExternal(card.link)) {
        link.target = "_blank";
        link.rel = "noopener";
      } else {
        link.removeAttribute("target");
      }
    }
    setText("detail-close", ui("close", currentLang));
  }

  function openDetail(card) {
    const dialog = document.getElementById("detail");
    openCardNumber = card.number;
    fillDetail(card, currentLang);
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    unlockAchievement(card);
  }

  function closeDetail() {
    const dialog = document.getElementById("detail");
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function setupDetail() {
    const dialog = document.getElementById("detail");
    document.getElementById("detail-close").addEventListener("click", closeDetail);
    // Clicking the dark area outside the pop-up closes it.
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeDetail();
    });
    dialog.addEventListener("close", function () {
      openCardNumber = null;
      // Put the achievement toast back on the page so it can still finish.
      const toast = document.getElementById("toast");
      if (toast.parentElement === dialog) document.body.append(toast);
    });
    document.getElementById("detail-link").addEventListener("click", function () {
      const card = SITE.cards.find(function (c) { return c.number === openCardNumber; });
      if (card) unlockAchievement(card);
    });
  }

  // ---------- Cards ----------

  function makeCard(card, lang, featured, index) {
    const article = document.createElement("article");
    article.className = featured ? "card card-featured" : "card";
    article.dataset.status = card.status;
    article.dataset.reveal = "";
    // Cards pop in one after another; --i sets each card's delay.
    article.style.setProperty("--i", index);
    if (featured) article.id = "featured-card";

    article.append(makeArt(card, "card-art"));

    // Stickers: NEW! on your latest finished artifact, WIP on ones in progress.
    let stickerText = "";
    if (featured) stickerText = ui("stickerNew", lang);
    else if (card.status === "wip") stickerText = ui("stickerWip", lang);
    if (stickerText) {
      const sticker = document.createElement("span");
      sticker.className = "sticker" + (featured ? "" : " sticker-wip");
      sticker.textContent = stickerText;
      article.append(sticker);
    }

    const body = document.createElement("div");
    body.className = "card-body";

    const tag = document.createElement("p");
    tag.className = "tag";
    tag.textContent = cardTag(card, lang, featured);

    // The title is a button that opens the details pop-up. A CSS trick
    // stretches it over the whole card so the entire card is clickable.
    const title = document.createElement("h3");
    const open = document.createElement("button");
    open.type = "button";
    open.className = "card-open";
    open.textContent = t(card.title, lang);
    open.addEventListener("click", function () { openDetail(card); });
    title.append(open);

    const reflection = document.createElement("p");
    reflection.className = "reflection";
    reflection.textContent = t(card.reflection, lang);

    body.append(tag, title, reflection);

    const actions = document.createElement("div");
    actions.className = "card-actions";
    const more = document.createElement("span");
    more.className = "card-more";
    more.setAttribute("aria-hidden", "true");
    more.textContent = ui("details", lang) + " →";
    actions.append(more);

    if (card.link) {
      const link = document.createElement("a");
      link.className = "card-link";
      link.href = card.link;
      link.textContent = ui("open", lang) + " ↗";
      if (isExternal(card.link)) {
        link.target = "_blank";
        link.rel = "noopener";
      }
      link.addEventListener("click", function () { unlockAchievement(card); });
      actions.append(link);
    }
    body.append(actions);

    article.append(body);
    return article;
  }

  function renderCards(lang) {
    const latest = latestDone();

    const featuredSlot = document.getElementById("featured");
    featuredSlot.replaceChildren();
    if (latest) featuredSlot.append(makeCard(latest, lang, true, 0));

    const grid = document.getElementById("cards");
    grid.replaceChildren();
    sortedCards()
      .filter(function (c) { return c !== latest; })
      .forEach(function (card, i) { grid.append(makeCard(card, lang, false, i)); });
  }

  // ---------- About and contact ----------

  function renderSkills() {
    const list = document.getElementById("skills");
    list.replaceChildren();
    (SITE.skills || []).forEach(function (skill) {
      const li = document.createElement("li");
      li.textContent = skill;
      list.append(li);
    });
    list.parentElement.hidden = !(SITE.skills && SITE.skills.length);
  }

  // Simple line icons for each kind of contact.
  const CONTACT_ICONS = {
    email: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    github: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>',
    linkedin: '<rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M9 7.5V5.5h6v2M3 12.5h18"/>',
    itch: '<path d="M7 8.5h10a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L14.5 14h-5l-1.1 1.3A3 3 0 0 1 3 13.5v-1a4 4 0 0 1 4-4z"/><path d="M8 10.5v3M6.5 12h3"/><path d="M15.5 11.5h.01M17.5 13h.01"/>',
    discord: '<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M9 10.5h.01M15 10.5h.01"/>'
  };

  // Show a web address without the https:// part.
  function shortUrl(url) {
    return url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
  }

  // Copy text, with a fallback for browsers that block the clipboard.
  function copyText(text, button, lang) {
    function done() {
      button.textContent = ui("copied", lang);
      setTimeout(function () { button.textContent = ui("copy", lang); }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { selectFallback(button); });
    } else {
      selectFallback(button);
    }
  }

  // If copying isn't allowed, select the text so the visitor can copy it.
  function selectFallback(button) {
    const value = button.parentElement.querySelector(".contact-value");
    const range = document.createRange();
    range.selectNodeContents(value);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function makeContactItem(kind, value, lang) {
    const li = document.createElement("li");
    li.className = "contact-item";

    // Email, GitHub, LinkedIn and itch.io are links. Discord is just a
    // username to copy, since there's no simple link to a profile.
    let main;
    if (kind === "discord") {
      main = document.createElement("div");
    } else {
      main = document.createElement("a");
      main.href = kind === "email" ? "mailto:" + value : value;
      if (kind !== "email") {
        main.target = "_blank";
        main.rel = "noopener";
      }
    }
    main.className = "contact-main";

    const icon = document.createElement("span");
    icon.className = "contact-icon";
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + CONTACT_ICONS[kind] + "</svg>";

    const text = document.createElement("span");
    text.className = "contact-text";
    const label = document.createElement("small");
    label.textContent = ui(kind, lang);
    const shown = document.createElement("span");
    shown.className = "contact-value";
    const display = kind === "email" || kind === "discord" ? value : shortUrl(value);
    // On narrow screens, long addresses wrap after the @ or a slash
    // instead of in the middle of a word.
    display.split(/(?<=[@\/])/).forEach(function (part, i) {
      if (i > 0) shown.append(document.createElement("wbr"));
      shown.append(part);
    });
    text.append(label, shown);

    main.append(icon, text);
    li.append(main);

    // Email and Discord get a Copy button.
    if (kind === "email" || kind === "discord") {
      const copy = document.createElement("button");
      copy.type = "button";
      copy.className = "copy-btn";
      copy.textContent = ui("copy", lang);
      copy.setAttribute("aria-label", ui("copy", lang) + " " + ui(kind, lang));
      copy.addEventListener("click", function () { copyText(value, copy, lang); });
      li.append(copy);
    }

    return li;
  }

  function renderContact(lang) {
    setText("contact-heading", ui("contactHeading", lang));
    setText("contact-title", ui("contactTitle", lang));
    const message = t(SITE.contactMessage, lang);
    setText("contact-message", message);
    document.getElementById("contact-message").hidden = !message;

    const list = document.getElementById("contact-list");
    list.replaceChildren();
    const contact = SITE.contact || {};
    const kinds = ["email", "github", "linkedin", "itch", "discord"];

    kinds.forEach(function (kind) {
      if (contact[kind]) list.append(makeContactItem(kind, contact[kind], lang));
    });

    // Nothing filled in yet: show greyed-out slots as a reminder.
    if (list.children.length === 0) {
      ["email", "github", "linkedin"].forEach(function (kind) {
        const li = document.createElement("li");
        li.className = "contact-item is-empty";
        li.innerHTML =
          '<div class="contact-main"><span class="contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          CONTACT_ICONS[kind] +
          '</svg></span><span class="contact-text"><small></small><span class="contact-value"></span></span></div>';
        li.querySelector("small").textContent = ui(kind, lang);
        li.querySelector(".contact-value").textContent = ui("notLinked", lang);
        list.append(li);
      });
    }
  }

  // ---------- Language and theme buttons ----------

  function makeLanguageButtons(current) {
    const group = document.getElementById("lang-switch");
    group.replaceChildren();
    group.setAttribute("aria-label", ui("language", current));

    // Hide the switcher entirely if there's only one language.
    group.hidden = Object.keys(SITE.languages).length < 2;

    Object.entries(SITE.languages).forEach(function ([code, label]) {
      const button = document.createElement("button");
      button.type = "button";
      button.lang = code;
      button.textContent = label;
      button.setAttribute("aria-pressed", String(code === current));
      button.addEventListener("click", function () {
        save(STORAGE_KEY, code);
        render(code);
      });
      group.append(button);
    });
  }

  // The starting theme is picked by the small script in index.html;
  // this button just flips it and remembers the choice.
  function setupThemeToggle() {
    const root = document.documentElement;
    const button = document.getElementById("theme-toggle");
    const meta = document.querySelector('meta[name="theme-color"]');

    function sync() {
      const dark = root.getAttribute("data-theme") !== "light";
      button.setAttribute("aria-pressed", String(dark));
      if (meta) meta.content = dark ? "#10141f" : "#f4f6fb";
    }

    button.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      save(THEME_KEY, next);
      sync();
    });

    sync();
  }

  // ---------- Scroll animations ----------

  // Pop elements marked data-reveal into view as they scroll on screen.
  function revealOnScroll() {
    const items = document.querySelectorAll("[data-reveal]");

    // After the first load (for example when switching language), or when
    // animations are off, just show everything right away.
    if (!motionOn || !firstRender || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(function (el) { observer.observe(el); });
  }

  // ---------- Put it all together ----------

  function render(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.title = SITE.name + " · Portfolio";

    // Nav
    setText("brand", SITE.name);
    setText("nav-about", ui("navAbout", lang));
    setText("nav-artifacts", ui("navArtifacts", lang));
    setText("nav-contact", ui("navContact", lang));

    // Profile banner
    setText("eyebrow", ui("eyebrow", lang));
    renderName();
    setText("role", t(SITE.role, lang));
    renderProgress(lang);

    // About
    setText("about-heading", ui("aboutHeading", lang));
    setText("about-text", t(SITE.about, lang));
    setText("skills-heading", ui("skillsHeading", lang));
    renderSkills();

    // Artifacts
    setText("artifacts-heading", ui("artifactsHeading", lang));
    renderCards(lang);

    // Contact section and footer
    renderContact(lang);
    setText("footer-text", ui("footer", lang));
    setText("back-to-top", ui("backToTop", lang) + " ↑");

    makeLanguageButtons(lang);

    const themeButton = document.getElementById("theme-toggle");
    themeButton.setAttribute("aria-label", ui("darkMode", lang));
    themeButton.title = ui("darkMode", lang);

    // If the details pop-up is open, redraw it in the new language.
    if (openCardNumber !== null) {
      const card = SITE.cards.find(function (c) { return c.number === openCardNumber; });
      if (card) fillDetail(card, lang);
    }

    revealOnScroll();
    firstRender = false;
  }

  // Turn on the animation styles in styles.css (they all start with .motion).
  if (motionOn) document.documentElement.classList.add("motion");

  // Section headings and blocks that pop in as you scroll.
  document
    .querySelectorAll(".section > h2, .about-body, .contact-panel, .foot-row")
    .forEach(function (el) { el.dataset.reveal = ""; });

  setupThemeToggle();
  setupDetail();
  render(pickLanguage());
})();
