/* =====================================================================
   main.js: builds the page from the data in content.js.
   You shouldn't need to edit this file to update your content.
   ===================================================================== */

(function () {
  const THEME_KEY = "portfolio-theme";
  const ACHIEVEMENTS_KEY = "portfolio-achievements";

  // Animations run unless they're turned off in content.js or the
  // visitor's device asks for reduced motion.
  const motionOn =
    SITE.animations !== false &&
    !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  let openCardNumber = null;

  // ---------- Small helpers ----------

  // Read and write browser storage without crashing in private mode.
  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  // Turn any value from content.js into text ("" if it's missing).
  function text(value) {
    return value == null ? "" : String(value);
  }

  // Look up a piece of interface text from SITE.ui, filling in {placeholders}.
  function ui(key, fill) {
    let result = text((SITE.ui || {})[key]);
    Object.keys(fill || {}).forEach(function (name) {
      result = result.split("{" + name + "}").join(fill[name]);
    });
    return result;
  }

  // Put text into the element with this id.
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // Forgive small typos in a card's status ("Done", " wip ").
  // Anything unrecognized counts as an idea.
  SITE.cards.forEach(function (card) {
    const status = String(card.status || "").trim().toLowerCase();
    card.status = status === "done" || status === "wip" ? status : "idea";
  });

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

  // The nav bar wraps to two rows on phones. Keep track of its real
  // height so jumping to a section never hides the heading under it.
  function trackNavHeight() {
    const nav = document.querySelector(".topbar");
    function update() {
      document.documentElement.style.setProperty("--nav-offset", nav.offsetHeight + "px");
    }
    update();
    window.addEventListener("resize", update);
    if ("ResizeObserver" in window) new ResizeObserver(update).observe(nav);
  }

  // ---------- Cover art ----------

  // A screenshot if the card has one, otherwise generated art in the card's colors.
  function makeArt(card, className) {
    const art = document.createElement("div");
    art.className = className;
    art.dataset.art = String(((card.number - 1) % 5) + 1);
    if (card.cover) {
      const img = document.createElement("img");
      img.alt = "";
      img.loading = "lazy";
      // If the screenshot can't be found (for example a typo in the
      // path), fall back to the generated art instead of a broken image.
      img.addEventListener("error", function () {
        img.remove();
        art.classList.remove("has-cover");
      });
      img.src = card.cover;
      art.classList.add("has-cover");
      art.append(img);
    }
    return art;
  }

  // ---------- Name ----------

  // Split the name into letters so each one can hop on hover. Letters are
  // grouped by word, so a long name wraps between words, never mid-word.
  function renderName() {
    const el = document.getElementById("name");
    el.replaceChildren();
    el.setAttribute("aria-label", SITE.name);
    let i = 0;
    SITE.name.split(" ").filter(Boolean).forEach(function (word, w) {
      if (w > 0) {
        el.append(" ");
        i++;
      }
      const wordSpan = document.createElement("span");
      wordSpan.className = "name-word";
      Array.from(word).forEach(function (ch) {
        const span = document.createElement("span");
        span.className = "name-letter";
        span.setAttribute("aria-hidden", "true");
        span.style.setProperty("--i", i++);
        span.textContent = ch;
        wordSpan.append(span);
      });
      el.append(wordSpan);
    });
  }

  // ---------- Progress bar ----------

  function renderProgress() {
    const total = SITE.cards.length;
    const done = SITE.cards.filter(function (c) { return c.status === "done"; }).length;
    const bar = document.getElementById("xp-bar");
    document.getElementById("xp-fill").style.width = (total ? (done / total) * 100 : 0) + "%";
    bar.setAttribute("aria-valuemax", String(total));
    bar.setAttribute("aria-valuenow", String(done));
    const label = ui("progress", { done: done, total: total });
    bar.setAttribute("aria-label", label);
    setText("xp-count", label);

    const nowText = text(SITE.now);
    setText("now-label", ui("nowLabel"));
    setText("now-text", nowText);
    document.getElementById("now").hidden = !nowText;

    // "Continue" jumps to your latest finished artifact.
    document.getElementById("continue").href = latestDone() ? "#featured" : "#artifacts";
    setText("continue-text", ui("continue"));
  }

  // ---------- Achievements ----------

  let toastTimer = null;

  function showToast(title) {
    const toast = document.getElementById("toast");
    // When the details pop-up is open it covers the whole page, so the
    // toast moves inside it to stay visible on top.
    const dialog = document.getElementById("detail");
    if (dialog.open) dialog.append(toast);
    else if (toast.parentElement !== document.body) document.body.append(toast);
    setText("toast-label", ui("achievement"));
    setText("toast-title", ui("achievementText", { title: title }));
    setText("toast-xp", ui("xp"));
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
    showToast(text(card.title));
  }

  // ---------- Card details pop-up ----------

  function cardTag(card, featured) {
    let tag = ui("artifact") + " " + card.number + " · " + ui(card.status);
    if (featured) tag = ui("latest") + " · " + tag;
    return tag;
  }

  function fillDetail(card) {
    const art = document.getElementById("detail-art");
    art.replaceChildren(makeArt(card, "art"));

    setText("detail-tag", cardTag(card, false));
    setText("detail-title", text(card.title));

    // Blank lines in the details text start new paragraphs.
    const textBox = document.getElementById("detail-text");
    textBox.replaceChildren();
    const longText = text(card.details) || text(card.reflection);
    longText.split(/\n\s*\n/).forEach(function (para) {
      const p = document.createElement("p");
      p.textContent = para.trim();
      textBox.append(p);
    });

    const images = document.getElementById("detail-images");
    images.replaceChildren();
    (card.images || []).forEach(function (src, i) {
      const img = document.createElement("img");
      img.alt = text(card.title) + " screenshot " + (i + 1);
      // Skip screenshots that can't be found instead of showing a broken image.
      img.addEventListener("error", function () {
        img.remove();
        if (!images.children.length) images.hidden = true;
      });
      img.src = src;
      images.append(img);
    });
    images.hidden = !(card.images && card.images.length);

    const link = document.getElementById("detail-link");
    link.hidden = !card.link;
    if (card.link) {
      link.href = card.link;
      link.textContent = ui("open") + " ↗";
      if (isExternal(card.link)) {
        link.target = "_blank";
        link.rel = "noopener";
      } else {
        link.removeAttribute("target");
      }
    }
    setText("detail-close", ui("close"));
  }

  function openDetail(card) {
    const dialog = document.getElementById("detail");
    openCardNumber = card.number;
    fillDetail(card);
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

  function makeCard(card, featured, index) {
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
    if (featured) stickerText = ui("stickerNew");
    else if (card.status === "wip") stickerText = ui("stickerWip");
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
    tag.textContent = cardTag(card, featured);

    // The title is a button that opens the details pop-up. A CSS trick
    // stretches it over the whole card so the entire card is clickable.
    const title = document.createElement("h3");
    const open = document.createElement("button");
    open.type = "button";
    open.className = "card-open";
    open.textContent = text(card.title);
    open.addEventListener("click", function () { openDetail(card); });
    title.append(open);

    const reflection = document.createElement("p");
    reflection.className = "reflection";
    reflection.textContent = text(card.reflection);

    body.append(tag, title, reflection);

    const actions = document.createElement("div");
    actions.className = "card-actions";
    const more = document.createElement("span");
    more.className = "card-more";
    more.setAttribute("aria-hidden", "true");
    more.textContent = ui("details") + " →";
    actions.append(more);

    if (card.link) {
      const link = document.createElement("a");
      link.className = "card-link";
      link.href = card.link;
      link.textContent = ui("open") + " ↗";
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

  function renderCards() {
    const latest = latestDone();

    const featuredSlot = document.getElementById("featured");
    featuredSlot.replaceChildren();
    if (latest) featuredSlot.append(makeCard(latest, true, 0));

    const grid = document.getElementById("cards");
    grid.replaceChildren();
    sortedCards()
      .filter(function (c) { return c !== latest; })
      .forEach(function (card, i) { grid.append(makeCard(card, false, i)); });
  }

  // ---------- About ----------

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

  // ---------- Contact ----------

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
  function copyText(value, button) {
    function done() {
      button.textContent = ui("copied");
      setTimeout(function () { button.textContent = ui("copy"); }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(done, function () { selectFallback(button); });
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

  function makeContactItem(kind, value) {
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

    const label = document.createElement("small");
    label.textContent = ui(kind);
    const shown = document.createElement("span");
    shown.className = "contact-value";
    const display = kind === "email" || kind === "discord" ? value : shortUrl(value);
    // On narrow screens, long addresses wrap after the @ or a slash
    // instead of in the middle of a word. (Built letter by letter so it
    // works on older phones too.)
    let chunk = "";
    Array.from(display).forEach(function (ch) {
      chunk += ch;
      if (ch === "@" || ch === "/") {
        shown.append(chunk, document.createElement("wbr"));
        chunk = "";
      }
    });
    if (chunk) shown.append(chunk);

    const textBox = document.createElement("span");
    textBox.className = "contact-text";
    textBox.append(label, shown);

    main.append(icon, textBox);
    li.append(main);

    // Email and Discord get a Copy button.
    if (kind === "email" || kind === "discord") {
      const copy = document.createElement("button");
      copy.type = "button";
      copy.className = "copy-btn";
      copy.textContent = ui("copy");
      copy.setAttribute("aria-label", ui("copy") + " " + ui(kind));
      copy.addEventListener("click", function () { copyText(value, copy); });
      li.append(copy);
    }

    return li;
  }

  function renderContact() {
    setText("contact-heading", ui("contactHeading"));
    setText("contact-title", ui("contactTitle"));
    const message = text(SITE.contactMessage);
    setText("contact-message", message);
    document.getElementById("contact-message").hidden = !message;

    const list = document.getElementById("contact-list");
    list.replaceChildren();
    const contact = SITE.contact || {};
    const kinds = ["email", "github", "linkedin", "itch", "discord"];

    kinds.forEach(function (kind) {
      if (contact[kind]) list.append(makeContactItem(kind, contact[kind]));
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
        li.querySelector("small").textContent = ui(kind);
        li.querySelector(".contact-value").textContent = ui("notLinked");
        list.append(li);
      });
    }
  }

  // ---------- Dark mode button ----------

  // The starting theme is picked by the small script in index.html;
  // this button just flips it and remembers the choice.
  function setupThemeToggle() {
    const root = document.documentElement;
    const button = document.getElementById("theme-toggle");
    const meta = document.querySelector('meta[name="theme-color"]');

    button.setAttribute("aria-label", ui("darkMode"));
    button.title = ui("darkMode");

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

    // When animations are off, just show everything right away.
    if (!motionOn || !("IntersectionObserver" in window)) {
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

  function render() {
    document.title = SITE.name + " · Portfolio";

    // Nav
    setText("brand", SITE.name);
    setText("nav-about", ui("navAbout"));
    setText("nav-artifacts", ui("navArtifacts"));
    setText("nav-contact", ui("navContact"));

    // Profile banner
    setText("eyebrow", ui("eyebrow"));
    renderName();
    setText("role", text(SITE.role));
    renderProgress();

    // About
    setText("about-heading", ui("aboutHeading"));
    setText("about-text", text(SITE.about));
    setText("skills-heading", ui("skillsHeading"));
    renderSkills();

    // Artifacts
    setText("artifacts-heading", ui("artifactsHeading"));
    renderCards();

    // Contact section and footer
    renderContact();
    setText("footer-text", ui("footer"));
    setText("back-to-top", ui("backToTop") + " ↑");
  }

  // Turn on the animation styles in styles.css (they all start with .motion).
  if (motionOn) document.documentElement.classList.add("motion");

  // Section headings and blocks that pop in as you scroll.
  document
    .querySelectorAll(".section > h2, .about-body, .contact-panel, .foot-row")
    .forEach(function (el) { el.dataset.reveal = ""; });

  trackNavHeight();
  setupThemeToggle();
  setupDetail();
  render();
  revealOnScroll();
})();
