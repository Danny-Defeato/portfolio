/* =====================================================================
   main.js: builds the page from the data in content.js.
   You shouldn't need to edit this file to update your content.
   ===================================================================== */

(function () {
  // If content.js has a typo (a missing comma or quote is the usual
  // culprit), the browser can't read it and SITE never exists. Rather than
  // a blank page, show a note saying where to look.
  if (typeof SITE === "undefined" || !SITE || !Array.isArray(SITE.cards)) {
    const root = document.documentElement;
    root.classList.remove("intro");
    const note = document.createElement("div");
    note.setAttribute("role", "alert");
    note.style.cssText = "margin:24px auto;max-width:640px;padding:18px 22px;border-radius:14px;background:#2a1520;color:#ffd8dc;font:16px/1.5 system-ui,sans-serif;box-shadow:0 0 0 2px #ff5f6d";
    note.innerHTML = "<strong>The site couldn't read content.js.</strong><br>There's probably a typo in it, often a missing comma, quote or bracket near your latest edit. " +
      "Open the browser console (F12, or right-click → Inspect → Console) to see which line.";
    document.body.prepend(note);
    return;
  }

  const THEME_KEY = "portfolio-theme";
  const ACCENT_KEY = "portfolio-accent";
  const CUSTOM_KEY = "portfolio-custom-color";
  const INTRO_KEY = "portfolio-intro-seen";
  const GUIDE_KEY = "portfolio-guide-done";

  // Color choices for the color picker. The actual colors for each one
  // live in styles.css under [data-accent="..."].
  const ACCENTS = [
    { id: "sunset", label: "Sunset" },
    { id: "ocean", label: "Ocean" },
    { id: "lime", label: "Lime" },
    { id: "ember", label: "Ember" }
  ];

  // Animations run unless they're turned off in content.js or the
  // visitor's device asks for reduced motion.
  const motionOn =
    SITE.animations !== false &&
    !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // The tilt effect only make sense with a mouse or trackpad,
  // so they're skipped on touch screens.
  const finePointer = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  const tiltOn = motionOn && finePointer;


  // ---------- Small helpers ----------

  // Read and write browser storage without crashing in private mode.
  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function save(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // Storage is blocked (some private modes). The site still works;
      // it just won't remember choices between visits.
    }
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
    // Long names get a smaller font so they fit on phones.
    el.classList.toggle("is-long", SITE.name.length > 16);
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
    const latest = latestDone();
    const go = document.getElementById("continue");
    go.href = latest ? "#card-" + latest.number : "#artifacts";
    // Scroll to the library (heading and all), and slide the row of cards
    // over so the latest one is in view.
    go.onclick = function (e) {
      const card = latest && document.getElementById("card-" + latest.number);
      e.preventDefault();
      document.getElementById("artifacts").scrollIntoView({ block: "start" });
      if (card) {
        const row = card.parentElement;
        const left = Math.max(0, card.offsetLeft - row.offsetLeft - 20);
        row.scrollTo({ left: left });
        // If the cards haven't been dealt out yet, the deal finishes the slide.
        if (!row.classList.contains("can-snap")) row.dataset.slideTo = String(left);
        // Keyboard users land on the card itself. (Mouse and touch users
        // don't, so the cards still get dealt out.)
        if (e.detail === 0) card.querySelector(".card-open").focus({ preventScroll: true });
      }
    };
    setText("continue-text", ui("continue"));
  }

  // ---------- Card details pop-up ----------

  function cardTag(card) {
    return ui("artifact") + " " + card.number + " · " + ui(card.status);
  }

  function fillDetail(card) {
    const art = document.getElementById("detail-art");
    art.replaceChildren(makeArt(card, "art"));

    setText("detail-tag", cardTag(card));
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
    fillDetail(card);
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      // Older browsers: show it ourselves (styled by .no-modal in styles.css).
      dialog.setAttribute("open", "");
      dialog.classList.add("no-modal");
      document.getElementById("detail-close").focus();
    }
  }

  function closeDetail() {
    const dialog = document.getElementById("detail");
    if (typeof dialog.close === "function") {
      dialog.close();
    } else if (dialog.hasAttribute("open")) {
      dialog.removeAttribute("open");
      dialog.classList.remove("no-modal");
      // Browsers without <dialog> never send the "close" event, so do its job here.
      dialog.dispatchEvent(new Event("close"));
    }
  }

  function setupDetail() {
    const dialog = document.getElementById("detail");
    document.getElementById("detail-close").addEventListener("click", closeDetail);
    // Clicking the dark area outside the pop-up closes it.
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeDetail();
    });
    // Escape and clicking outside close the pop-up in older browsers too.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && dialog.classList.contains("no-modal")) closeDetail();
    });
    document.addEventListener("click", function (e) {
      if (dialog.classList.contains("no-modal") && !dialog.contains(e.target) && !e.target.closest(".card-open")) {
        closeDetail();
      }
    });
  }

  // ---------- Cards ----------

  // isLatest: this is the newest finished artifact (it gets the NEW! sticker).
  function makeCard(card, isLatest, index) {
    const article = document.createElement("article");
    article.className = "card";
    article.id = "card-" + card.number;
    article.dataset.status = card.status;
    article.dataset.number = String(card.number);
    article.dataset.reveal = "";
    // Cards pop in one after another; --i sets each card's delay.
    article.style.setProperty("--i", index);

    article.append(makeArt(card, "card-art"));

    // Holo effect: the card tilts toward the mouse and a shine follows it.
    if (tiltOn) {
      const glare = document.createElement("div");
      glare.className = "card-glare";
      glare.setAttribute("aria-hidden", "true");
      article.append(glare);
      const maxTilt = 9;
      article.addEventListener("pointermove", function (e) {
        const r = article.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        article.classList.add("is-tilting");
        article.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
        article.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
        article.style.transform = "perspective(900px) rotateX(" + ((0.5 - y) * maxTilt * 2).toFixed(2) + "deg) rotateY(" +
          ((x - 0.5) * maxTilt * 2).toFixed(2) + "deg) translateY(-4px)";
      });
      article.addEventListener("pointerleave", function () {
        article.classList.remove("is-tilting");
        article.style.transform = "";
      });
    }

    // Stickers: NEW! on your latest finished artifact, WIP on ones in progress.
    let stickerText = "";
    if (isLatest) stickerText = ui("stickerNew");
    else if (card.status === "wip") stickerText = ui("stickerWip");
    if (stickerText) {
      const sticker = document.createElement("span");
      sticker.className = "sticker" + (isLatest ? "" : " sticker-wip");
      sticker.textContent = stickerText;
      article.append(sticker);
    }

    const body = document.createElement("div");
    body.className = "card-body";

    const tag = document.createElement("p");
    tag.className = "tag";
    tag.textContent = cardTag(card);

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
      actions.append(link);
    }
    body.append(actions);

    article.append(body);
    return article;
  }

  // All the cards, the same size, in one row in number order.
  function renderCards() {
    const latest = latestDone();
    const row = document.getElementById("cards");
    row.replaceChildren();
    sortedCards().forEach(function (card, i) { row.append(makeCard(card, card === latest, i)); });
    // Tabbing to a card on a narrow screen slides the whole card into view,
    // not just its title.
    if (!row.dataset.focusWatch) {
      row.dataset.focusWatch = "1";
      row.addEventListener("focusin", function (e) {
        const card = e.target.closest(".card");
        if (!card) return;
        const r = card.getBoundingClientRect();
        const box = row.getBoundingClientRect();
        if (r.left < box.left || r.right > box.right) {
          row.scrollBy({ left: r.left < box.left ? r.left - box.left - 20 : r.right - box.right + 20 });
        }
      });
    }
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
      document.dispatchEvent(new Event("portfolio:theme"));
    });

    sync();
  }

  // ---------- Color picker ----------

  // Color math for the custom color. The chosen color becomes the middle
  // of the banner gradient, with a lighter and a darker shade of it on
  // either side. Link colors are nudged lighter or darker until they're
  // easy to read on both themes.
  function hexToHsl(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h = (h * 60 + 360) % 360;
    }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
  }

  function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    const k = function (n) { return (n + h / 30) % 12; };
    const a = s * Math.min(l, 1 - l);
    const f = function (n) { return l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); };
    return [f(0), f(8), f(4)];
  }

  function luminance(rgb) {
    const c = rgb.map(function (v) { return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  function contrast(rgbA, rgbB) {
    const a = luminance(rgbA), b = luminance(rgbB);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }

  function hsl(h, s, l) {
    return "hsl(" + Math.round((h + 360) % 360) + " " + Math.round(s) + "% " + Math.round(l) + "%)";
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // Readable text needs a contrast of 4.5 or more against the background.
  function readableAccent(h, s, darkMode) {
    const backgrounds = darkMode ? [[0.137, 0.169, 0.251], [0.102, 0.125, 0.188]] : [[0.918, 0.933, 0.969], [1, 1, 1]];
    let l = darkMode ? 62 : 46;
    for (let tries = 0; tries < 60; tries++) {
      const rgb = hslToRgb(h, s, l);
      if (backgrounds.every(function (bg) { return contrast(rgb, bg) >= 4.6; })) return hsl(h, s, l);
      l += darkMode ? 1 : -1;
    }
    return darkMode ? "#ffffff" : "#141a2b";
  }

  // Everything the page needs for one chosen color.
  function customPalette(hex) {
    const c = hexToHsl(hex);
    const h = c[0], s = c[1];
    // Greys stay grey; colors keep a little extra punch in their shades.
    const shadeS = s < 8 ? s : clamp(s + 6, 0, 100);
    // Very dark picks are lifted a little, and very bright ones (neon green,
    // yellow, white) are darkened just enough that the white text on the
    // banner stays readable.
    function readableOnWhite(hh, ss, ll, minContrast) {
      while (ll > 18 && contrast(hslToRgb((hh + 360) % 360, ss, ll), [1, 1, 1]) < minContrast) ll--;
      return ll;
    }
    const l = readableOnWhite(h, s, Math.max(c[2], 28), 3);
    const hotH = s < 8 ? h : h - 16;
    return {
      hex: hex,
      mid: hsl(h, s, l),
      hot: hsl(hotH, shadeS, readableOnWhite(hotH, shadeS, clamp(l + 12, 40, 78), 2.5)),
      a2: hsl(s < 8 ? h : h + 20, shadeS, clamp(l - 12, 20, 56)),
      glow: "hsl(" + h + " " + s + "% " + l + "% / 0.6)",
      soft: "hsl(" + h + " " + s + "% " + l + "% / 0.25)",
      dark: readableAccent(h, Math.min(s, 85), true),
      light: readableAccent(h, Math.min(s, 85), false)
    };
  }

  // The saved color is applied early by the small script in index.html;
  // this builds the dots and handles clicks.
  function setupAccentPicker() {
    const root = document.documentElement;
    const group = document.getElementById("accent-picker");
    group.setAttribute("aria-label", ui("colorPicker"));
    const known = ACCENTS.map(function (a) { return a.id; }).concat(["custom"]);
    if (known.indexOf(root.getAttribute("data-accent")) === -1) root.setAttribute("data-accent", "sunset");

    ACCENTS.forEach(function (accent) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "accent-dot";
      dot.dataset.swatch = accent.id;
      dot.title = accent.label;
      dot.setAttribute("aria-label", ui("colorPicker") + ": " + accent.label);
      dot.addEventListener("click", function () {
        const changed = root.getAttribute("data-accent") !== accent.id;
        root.setAttribute("data-accent", accent.id);
        save(ACCENT_KEY, accent.id);
        sync();
        if (changed) document.dispatchEvent(new Event("portfolio:color"));
      });
      group.append(dot);
    });

    // The rainbow dot: a color input hidden inside it opens the
    // browser's own color chooser.
    const custom = document.createElement("label");
    custom.className = "accent-custom";
    custom.title = ui("customColor");
    const input = document.createElement("input");
    input.type = "color";
    input.id = "accent-custom-input";
    input.setAttribute("aria-label", ui("customColor"));
    input.value = "#c64bff";
    let saved = null;
    try {
      saved = JSON.parse(load(CUSTOM_KEY) || "null");
      if (saved && /^#[0-9a-f]{6}$/i.test(saved.hex)) input.value = saved.hex.toLowerCase();
      else saved = null;
    } catch (e) {
      // Saved color was damaged; keep the default.
    }
    custom.append(input);
    group.append(custom);

    function applyCustom(hex) {
      const p = customPalette(hex);
      [["--c-mid", p.mid], ["--c-hot", p.hot], ["--c-a2", p.a2], ["--c-glow", p.glow],
        ["--c-soft", p.soft], ["--acc-d", p.dark], ["--acc-l", p.light]].forEach(function (pair) {
        root.style.setProperty(pair[0], pair[1]);
      });
      root.setAttribute("data-accent", "custom");
      sync();
      return p;
    }

    function keep(hex) {
      save(CUSTOM_KEY, JSON.stringify(applyCustom(hex)));
      save(ACCENT_KEY, "custom");
    }

    // Colors saved by older versions of the site are redone with the
    // newer, truer color math.
    if (saved && root.getAttribute("data-accent") === "custom") keep(input.value);

    // While dragging in the chooser the page updates live; the choice is
    // saved once the visitor settles on a color.
    input.addEventListener("input", function () { applyCustom(input.value); });
    input.addEventListener("change", function () {
      keep(input.value);
      document.dispatchEvent(new Event("portfolio:color"));
    });
    // Clicking the rainbow dot switches straight back to the last custom
    // color, even if the visitor then closes the chooser without changing it.
    input.addEventListener("click", function () {
      if (root.getAttribute("data-accent") !== "custom") {
        keep(input.value);
        document.dispatchEvent(new Event("portfolio:color"));
      }
    });

    function sync() {
      const current = root.getAttribute("data-accent");
      group.querySelectorAll(".accent-dot").forEach(function (dot) {
        dot.setAttribute("aria-pressed", String(dot.dataset.swatch === current));
      });
      custom.classList.toggle("is-active", current === "custom");
    }
    sync();
  }

  // ---------- Resume button ----------

  function setupResume() {
    const link = document.getElementById("resume-btn");
    const file = text(SITE.resume);
    link.hidden = !file;
    if (file) {
      link.href = file;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = ui("resume") + " ↗";
    }
  }

  // ---------- Local time ----------

  function setupClock() {
    const box = document.getElementById("local-time");
    const zone = text(SITE.timeZone);
    if (!zone) return;

    function tick() {
      let time;
      try {
        time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: zone });
      } catch (e) {
        // An unknown time zone name: hide the clock rather than show a wrong time.
        box.hidden = true;
        return false;
      }
      const label = text(SITE.timeZoneLabel);
      setText("local-time-value", label ? time + " (" + label + ")" : time);
      return true;
    }

    setText("local-time-label", ui("localTime"));
    if (tick()) {
      box.hidden = false;
      setInterval(tick, 20000);
    }
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

  // ---------- Fan-then-spread reveal ----------

  // The library cards start as a neat stack. When a visitor scrolls to
  // them, they fan out like a hand of cards and then spread into their
  // normal places. Plays once per visit.
  function setupFanReveal() {
    if (!motionOn || SITE.cardReveal === false) {
      // No deal to wait for: the row can snap right away.
      document.getElementById("cards").classList.add("can-snap");
      return;
    }

    const EASE = "cubic-bezier(.65,0,.35,1)";
    const groups = [
      { section: document.getElementById("artifacts"), find: function () { return document.querySelectorAll("#cards .card"); }, spread: 9 }
    ];

    function poseString(x, y, rot, scale) {
      return "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) rotate(" + rot.toFixed(2) + "deg) scale(" + scale.toFixed(3) + ")";
    }

    // Work out where each item sits normally, then its stacked and fanned
    // positions as offsets from there.
    function measure(items, spread) {
      // Measure each item in its normal spot. Its hover transition is
      // switched off first, or it would be measured mid-slide.
      items.forEach(function (it) {
        it.style.transition = "none";
        it.classList.remove("is-packed");
      });
      const rects = items.map(function (it) { return it.getBoundingClientRect(); });
      items.forEach(function (it) { it.style.transition = ""; });
      const left = Math.min.apply(null, rects.map(function (r) { return r.left; }));
      const right = Math.max.apply(null, rects.map(function (r) { return r.right; }));
      const top = Math.min.apply(null, rects.map(function (r) { return r.top; }));
      const bottom = Math.max.apply(null, rects.map(function (r) { return r.bottom; }));
      // Stacked cards are shrunk to the size of the smallest one, and on
      // phones to under half the screen width, so the fan fits on screen.
      const baseW = Math.min(window.innerWidth * 0.42, Math.min.apply(null, rects.map(function (r) { return r.width; })));
      const baseH = Math.min.apply(null, rects.map(function (r) { return r.height * Math.min(1, baseW / r.width); }));
      // The stack sits in the middle of the section, but never lower than
      // a third of the screen, so it's visible when the section arrives.
      // (Kept on screen: on narrow screens the row runs off the right edge.)
      const cx = Math.min((left + right) / 2, window.innerWidth / 2);
      const cy = top + Math.min((bottom - top) / 2, window.innerHeight * 0.32);
      // The circle is capped so the fan stays on screen.
      const radius = Math.min(Math.max(baseW, baseH) * 1.5, 360);
      const n = items.length;
      return items.map(function (it, i) {
        const r = rects[i];
        const ix = r.left + r.width / 2, iy = r.top + r.height / 2;
        const scale = Math.min(1, baseW / r.width);
        const angle = (i - (n - 1) / 2) * spread;
        const rad = angle * Math.PI / 180;
        const fx = cx + Math.sin(rad) * radius, fy = cy + radius - Math.cos(rad) * radius;
        return {
          stack: poseString(cx + i * 1.5 - ix, cy - i * 1.5 - iy, (i - (n - 1) / 2) * 1.2, scale),
          fan: poseString(fx - ix, fy - iy, angle, scale),
          lift: poseString((fx - ix) / 2, (fy - iy) / 2 - 26, angle / 2, (scale + 1) / 2)
        };
      });
    }

    groups.forEach(function (group) {
      const items = Array.prototype.slice.call(group.find());
      if (!items.length) return;
      let played = false;

      // These items get this reveal instead of the regular fade-in.
      items.forEach(function (it) { delete it.dataset.reveal; });

      // On narrow screens the row normally clips whatever is outside it;
      // while the cards are being dealt, nothing is clipped.
      const row = items[0].parentElement;
      function done() {
        row.classList.remove("is-revealing");
        row.classList.add("can-snap");
        // Continue was pressed before the deal: now slide to the latest card.
        if (row.dataset.slideTo) {
          row.scrollTo({ left: Number(row.dataset.slideTo), behavior: motionOn ? "smooth" : "auto" });
          delete row.dataset.slideTo;
        }
      }

      function pack() {
        if (played) return;
        const poses = measure(items, group.spread);
        items.forEach(function (it, i) {
          it.style.setProperty("--pack", poses[i].stack);
          it.style.zIndex = 10 + i;
          it.classList.add("is-packed");
        });
      }

      function play() {
        if (played) return;
        played = true;
        observer.disconnect();
        row.classList.add("is-revealing");
        const poses = measure(items, group.spread);
        let left = items.length;
        setTimeout(done, 4000); // just in case an animation gets cancelled
        items.forEach(function (it, i) {
          it.style.zIndex = 10 + i;
          it.classList.add("is-dealing");
          // 1. The stack fans out, all together.
          const fan = it.animate([{ transform: poses[i].stack }, { transform: poses[i].fan }],
            { duration: 650, delay: i * 25, easing: EASE, fill: "both" });
          // 2. Each card lays itself down in its spot, one after another.
          fan.finished.then(function () {
            const spread = it.animate(
              [{ transform: poses[i].fan }, { transform: poses[i].lift, offset: 0.5 }, { transform: "none" }],
              { duration: 760, delay: 120 + i * 95, easing: EASE, fill: "backwards" });
            fan.cancel();
            spread.finished.then(function () {
              it.classList.remove("is-dealing");
              it.style.zIndex = "";
              if (--left === 0) done();
            });
          }).catch(function () {
            // Cancelled; nothing to clean up.
          });
          it.style.removeProperty("--pack");
        });
      }

      const observer = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) play();
      }, { rootMargin: "0px 0px -35% 0px" });

      // Someone tabbing in with the keyboard shouldn't wait for an animation.
      group.section.addEventListener("focusin", function () {
        if (!played) {
          played = true;
          observer.disconnect();
          items.forEach(function (it) { it.classList.remove("is-packed"); it.style.zIndex = ""; });
          done();
        }
      });

      pack();
      let resizeTimer = null;
      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(pack, 150);
      });

      // Wait until the intro is over before watching for the section.
      if (document.documentElement.classList.contains("intro")) {
        document.addEventListener("portfolio:intro-done", function () { observer.observe(group.section); }, { once: true });
      } else {
        observer.observe(group.section);
      }
    });
  }

  // ---------- Pixel, the guide robot ----------

  // Pixel's drawing. Several faces are drawn on top of each other and
  // styles.css shows one at a time (happy, mad, dizzy, asleep).
  const PIXEL_SVG =
    '<svg class="pix-svg" viewBox="0 0 52 56" aria-hidden="true"><g class="pix-body">' +
    '<path class="pix-flame" d="M19 52q7 16 14 0z" fill="#ffd36e" stroke="#ff7a59" stroke-width="1.5"/>' +
    '<line x1="26" y1="2" x2="26" y2="10" stroke="currentColor" stroke-width="2"/>' +
    '<circle cx="26" cy="3" r="3" class="guide-light"/>' +
    '<rect x="6" y="10" width="40" height="30" rx="9" class="guide-shell"/>' +
    '<rect x="13" y="18" width="26" height="14" rx="5" fill="#0c0f19"/>' +
    '<g class="pix-eyes"><rect class="guide-eye" x="17" y="22" width="5" height="6" rx="2"/><rect class="guide-eye" x="30" y="22" width="5" height="6" rx="2"/></g>' +
    '<g class="pix-face pix-face-happy" stroke-width="2.2" stroke-linecap="round"><path d="M17 27q2.5-4.5 5 0M30 27q2.5-4.5 5 0"/></g>' +
    '<g class="pix-face pix-face-mad"><path d="M16 21l7 3.5V29h-6.5zM36 21l-7 3.5V29h6.5z"/></g>' +
    '<g class="pix-face pix-face-dizzy" stroke-width="2" stroke-linecap="round"><path d="M17 22l5 6M22 22l-5 6M30 22l5 6M35 22l-5 6"/></g>' +
    '<g class="pix-face pix-face-sleep" stroke-width="2" stroke-linecap="round"><path d="M17 26h5M30 26h5"/></g>' +
    '<g class="pix-shades"><rect x="12" y="20" width="12" height="8" rx="3" fill="#0b0b0b"/><rect x="28" y="20" width="12" height="8" rx="3" fill="#0b0b0b"/>' +
    '<path d="M24 23h4" stroke="#0b0b0b" stroke-width="2"/><path d="M14 22h4M30 22h4" stroke="#ffffff66" stroke-width="1.4"/></g>' +
    '<rect x="14" y="42" width="24" height="10" rx="4" class="guide-shell"/>' +
    "</g></svg>";

  const PIXEL_KEY = "portfolio-pixel"; // "off" once a visitor sends Pixel away

  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  // Is Pixel switched on in content.js, and has this visitor kept him?
  function pixelWanted() {
    return !!(SITE.guide && SITE.guide !== false) && load(PIXEL_KEY) !== "off";
  }

  function setupPixel() {
    const box = document.getElementById("guide");
    const toggle = document.getElementById("pixel-toggle");
    const guide = SITE.guide;
    if (!guide) {
      box.remove();
      toggle.remove();
      return;
    }

    const home = document.getElementById("pixel-home");
    const bot = document.getElementById("pixel-bot");
    const sayBox = document.getElementById("pixel-say");
    const bubble = document.getElementById("guide-bubble");
    const typed = document.getElementById("guide-typed");
    const nextButton = document.getElementById("guide-next");
    const name = text(guide.name) || "Pixel";
    const first = text(SITE.name).split(" ")[0] || "my";
    const fill = function (line) { return text(line).split("{name}").join(first); };
    const lines = function (key, fallback) {
      const list = (guide[key] || []).map(fill).filter(Boolean);
      return list.length ? list : fallback;
    };

    bot.innerHTML = PIXEL_SVG;
    bot.setAttribute("aria-label", ui("pixelBot", { name: name }));
    toggle.hidden = false;
    toggle.setAttribute("aria-label", ui("pixelToggle", { name: name }));
    toggle.title = ui("pixelToggle", { name: name });
    setText("guide-name", name);
    setText("guide-next", ui("guideNext"));
    setText("guide-close", ui("guideClose"));
    box.setAttribute("aria-label", name);

    let shown = false;
    let busy = false; // leaving, arriving, being thrown or walking home
    let transit = false; // flying off or coming back
    let tipsOpen = false;
    let playing = false; // bug game
    let asleep = false;
    let sayTimer = null;
    let typing = null;
    let tipTyping = null;
    let tipIndex = 0;

    // ----- small helpers -----

    function mood(m) { box.dataset.mood = m || "norm"; }

    // A quick one-liner over his head. Screen readers get it from a hidden
    // copy, all at once.
    function say(line, ms) {
      clearTimeout(sayTimer);
      clearInterval(typing);
      if (!line) {
        sayBox.classList.remove("is-on");
        return;
      }
      setText("pixel-said", line);
      sayBox.classList.add("is-on");
      if (!motionOn) {
        sayBox.textContent = line;
      } else {
        let n = 0;
        sayBox.textContent = "";
        typing = setInterval(function () {
          n++;
          sayBox.textContent = line.slice(0, n);
          if (n >= line.length) clearInterval(typing);
        }, 20);
      }
      sayTimer = setTimeout(function () { sayBox.classList.remove("is-on"); }, ms || 3200);
    }

    // Restart a one-time animation class (hop, shake, land).
    function fx(cls, ms) {
      box.classList.remove(cls);
      void box.offsetWidth;
      box.classList.add(cls);
      setTimeout(function () { box.classList.remove(cls); }, ms || 600);
    }

    // Where Pixel's middle is on screen right now.
    function center() {
      const r = bot.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r };
    }

    // A temporary effect element (z's, dust, paint) placed on the page.
    function effect(cls, x, y, ms) {
      const el = document.createElement("span");
      el.className = "pix-fx " + cls;
      el.setAttribute("aria-hidden", "true");
      el.style.left = x + "px";
      el.style.top = y + "px";
      document.body.append(el);
      setTimeout(function () { el.remove(); }, ms);
      return el;
    }

    // Where Pixel's corner spot is on screen, ignoring any throw or walk
    // in progress (the corner box itself never moves).
    function homeSpot() {
      const r = box.getBoundingClientRect();
      return { left: r.left + home.offsetLeft, top: r.top + home.offsetTop, width: bot.offsetWidth, height: bot.offsetHeight };
    }

    function setOffset(x, y, rot) {
      home.style.setProperty("--tx", x + "px");
      home.style.setProperty("--ty", y + "px");
      bot.style.setProperty("--tr", (rot || 0) + "deg");
      // Keep his speech bubble on screen, based on where he's headed
      // (not where he is mid-walk, or it would stay flipped once he's home).
      // At home (or while hidden) it always sits in its normal spot.
      if (box.hidden || (x === 0 && y === 0)) {
        box.classList.remove("say-below", "say-left");
        return;
      }
      const spot = homeSpot();
      box.classList.toggle("say-below", spot.top + y < 120);
      box.classList.toggle("say-left", spot.left + x + spot.width / 2 > window.innerWidth - 200);
    }

    function canChat() { return shown && !busy && !playing; }

    // ----- tips (first visit) -----

    const tips = (guide.tips || []).map(fill).filter(Boolean);

    function showTip() {
      clearInterval(tipTyping);
      const tip = tips[tipIndex];
      setText("guide-said", tip);
      nextButton.hidden = tipIndex >= tips.length - 1;
      if (!motionOn) {
        typed.textContent = tip;
        return;
      }
      let n = 0;
      typed.textContent = "";
      tipTyping = setInterval(function () {
        n++;
        typed.textContent = tip.slice(0, n);
        if (n >= tip.length) clearInterval(tipTyping);
      }, 24);
    }

    function openTips() {
      if (!tips.length || load(GUIDE_KEY) === "done") return false;
      tipsOpen = true;
      tipIndex = 0;
      bubble.hidden = false;
      showTip();
      return true;
    }

    // "Got it" ends the tips, but Pixel stays.
    function closeTips(quiet) {
      if (!tipsOpen) return;
      tipsOpen = false;
      clearInterval(tipTyping);
      save(GUIDE_KEY, "done");
      box.classList.add("is-closing");
      setTimeout(function () {
        bubble.hidden = true;
        box.classList.remove("is-closing");
      }, motionOn ? 300 : 0);
      if (!quiet) {
        mood("happy");
        say(pick(lines("afterTips", ["Okay! I'll hang out down here."])), 3200);
        setTimeout(function () { if (box.dataset.mood === "happy") mood("norm"); }, 3200);
      }
    }

    nextButton.addEventListener("click", function () {
      tipIndex = Math.min(tipIndex + 1, tips.length - 1);
      showTip();
    });
    document.getElementById("guide-close").addEventListener("click", function () {
      closeTips(false);
      bot.focus({ preventScroll: true });
    });

    // ----- showing, leaving and coming back -----

    function syncToggle() { toggle.setAttribute("aria-pressed", String(shown)); }

    // Show Pixel without any fuss (page load).
    let appeared = false;
    function appear(greet) {
      if (appeared) return;
      appeared = true;
      shown = true;
      syncToggle();
      box.hidden = false;
      box.classList.add("is-arriving");
      setTimeout(function () { box.classList.remove("is-arriving"); }, 600);
      if (!openTips() && greet) {
        mood("happy");
        say(pick(lines("welcomeBack", ["Welcome back!"])), 2600);
        setTimeout(function () { if (box.dataset.mood === "happy") mood("norm"); }, 2600);
      }
    }

    // The visitor sends him away: a goodbye line, then he jetpacks off.
    function leave() {
      transit = true;
      stopThrow();
      busy = true;
      shown = false;
      syncToggle();
      toggle.disabled = true;
      wake(true);
      closeTips(true);
      mood("happy");
      say(pick(lines("leaveLines", ["Okay, I'll give you some space. Bye!"])), 1600);
      save(PIXEL_KEY, "off");
      setTimeout(function () {
        function done() {
          box.hidden = true;
          box.classList.remove("is-flying", "is-away");
          home.style.transform = "";
          // Back to his corner, ready for next time.
          home.classList.remove("is-walking");
          setOffset(0, 0, 0);
          say("");
          mood("norm");
          // A break does him good: he comes back calm.
          anger = 0;
          wasAngry = false;
          showTemper();
          busy = false;
          transit = false;
          toggle.disabled = false;
        }
        if (!motionOn) {
          done();
          return;
        }
        say("");
        box.classList.add("is-flying");
        const lift = -(center().r.bottom + 60);
        home.animate([{ transform: "translateY(0)" }, { transform: "translateY(6px)", offset: 0.15 }, { transform: "translateY(" + lift + "px)" }],
          { duration: 900, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" })
          .finished.then(function (a) { done(); a.cancel(); }, done);
      }, 1500);
    }

    // The visitor calls him back: he flies down and lands with a bounce.
    function comeBack() {
      appeared = true;
      transit = true;
      busy = true;
      shown = true;
      syncToggle();
      toggle.disabled = true;
      save(PIXEL_KEY, "on");
      box.hidden = false;
      mood("happy");
      function landed() {
        box.classList.remove("is-flying");
        busy = false;
        transit = false;
        toggle.disabled = false;
        if (motionOn) {
          fx("is-landing", 500);
          const c = center();
          [-1, 1].forEach(function (side) {
            const d = effect("pix-dust", c.x - 7 + side * 18, c.r.bottom - 10, 700);
            d.style.setProperty("--dx", side * 22 + "px");
          });
        }
        say(pick(lines("returnLines", ["I'm back! Did you miss me?"])), 3000);
        setTimeout(function () { if (box.dataset.mood === "happy") mood("norm"); }, 3000);
      }
      if (!motionOn) {
        landed();
        return;
      }
      box.classList.add("is-flying");
      const drop = -(center().r.bottom + 60);
      home.animate([{ transform: "translateY(" + drop + "px)" }, { transform: "translateY(0)" }],
        { duration: 900, easing: "cubic-bezier(.2,.8,.3,1)" })
        .finished.then(landed, landed);
    }

    toggle.addEventListener("click", function () {
      if (transit) return;
      if (shown) leave();
      else comeBack();
    });

    // ----- poking him (and the bug squash game) -----

    // ----- his temper -----

    // An anger meter from 0 to 100. Pokes and throws fill it; it drains
    // when he's left alone for a few seconds. It moves him through five
    // stages, each with its own lines and look, and when it's full he
    // snaps and starts the bug game.
    const temper = guide.temper || {};
    const STAGES = [
      { key: "calm", below: 25, mood: "happy", fallback: "Hi!" },
      { key: "annoyed", below: 45, mood: "norm", fallback: "Okay, you can stop now." },
      { key: "grumpy", below: 65, mood: "norm", fallback: "Seriously?" },
      { key: "angry", below: 85, mood: "mad", fallback: "HEY." },
      { key: "furious", below: 100, mood: "mad", fallback: "ONE. MORE. TIME." }
    ];
    const POKE = 7; // about 15 quick pokes from calm to snapping
    const THROW = 14; // plus a bit more for a hard landing: about 4-5 rough throws
    const HARD_LANDING = 10;
    let anger = 0;
    let lastProvoked = 0;
    let wasAngry = false;
    const turns = {};

    function temperLines(key, fallback) {
      const list = (temper[key] || []).map(fill).filter(Boolean);
      return list.length ? list : [fallback];
    }
    // Lines take turns instead of repeating.
    function nextLine(key, fallback) {
      const list = temperLines(key, fallback);
      turns[key] = ((turns[key] === undefined ? -1 : turns[key]) + 1) % list.length;
      return list[turns[key]];
    }
    // The throw lines come in three levels: happy, grumpy, angry.
    function tierLine(key, fallback) {
      const list = temperLines(key, fallback);
      const level = stageIndex() <= 1 ? 0 : stageIndex() <= 2 ? 1 : 2;
      return list[Math.min(level, list.length - 1)];
    }
    function stageIndex() {
      for (let i = 0; i < STAGES.length; i++) if (anger < STAGES[i].below) return i;
      return STAGES.length - 1;
    }
    // His shell slowly turns red as he gets angrier (see styles.css).
    function showTemper() {
      box.dataset.anger = String(stageIndex());
    }
    function provoke(points) {
      anger = Math.min(100, anger + points);
      lastProvoked = Date.now();
      if (stageIndex() >= 3) wasAngry = true;
      showTemper();
    }
    function steam() {
      if (!motionOn) return;
      const c = center();
      [-1, 1].forEach(function (side, i) {
        setTimeout(function () {
          effect("pix-steam", c.x - 6 + side * 16, c.r.top + 4, 1000);
        }, i * 120);
      });
    }

    // Cooling off: after three quiet seconds the meter drains (but not
    // while he's still being thrown or walking back), and if he had been
    // properly angry, he says so once he's calm again.
    setInterval(function () {
      if (busy) lastProvoked = Date.now();
      if (anger <= 0 || playing || Date.now() - lastProvoked < 3000) return;
      anger = Math.max(0, anger - 3);
      showTemper();
      if (wasAngry && anger < 25) {
        wasAngry = false;
        if (canChat() && !tipsOpen && !asleep) {
          mood("happy");
          say(nextLine("calmDown", "...Okay. I'm calm."), 2800);
          setTimeout(function () { if (box.dataset.mood === "happy") mood("norm"); }, 2800);
        }
      }
    }, 500);

    // The meter is full: he snaps, then starts the game.
    function snap() {
      const lines2 = temperLines("snap", "THAT'S IT!");
      closeTips(true);
      playing = true; // stop other chatter while the game gets ready
      mood("mad");
      fx("is-shaking", 650);
      steam();
      say(lines2[0], 1600);
      setTimeout(function () {
        if (!stillHere()) return;
        if (lines2[1]) say(lines2[1], 1600);
        setTimeout(function () { if (stillHere()) startBugGame(); }, lines2[1] ? 1500 : 200);
      }, 1500);
    }

    // If he's sent away while working up to the game, the game is off.
    function stillHere() {
      if (shown && !transit) return true;
      playing = false;
      return false;
    }

    function poke() {
      if (!canChat()) return;
      if (asleep) {
        wake();
        return;
      }
      // While his tips are showing he just hops happily, so his one-liners
      // never land on top of the tips bubble.
      if (tipsOpen) {
        mood("happy");
        fx("is-hopping", 500);
        setTimeout(function () { if (tipsOpen) mood("norm"); }, 700);
        return;
      }
      provoke(POKE);
      if (anger >= 100) {
        snap();
        return;
      }
      const stage = STAGES[stageIndex()];
      mood(stage.mood);
      say(nextLine(stage.key, stage.fallback), 2600);
      if (stageIndex() >= 2) fx("is-shaking", 650);
      else fx("is-hopping", 500);
      if (stageIndex() >= 4) steam();
    }

    const BUG_SVG = '<svg viewBox="0 0 30 24" aria-hidden="true"><g stroke="#ff5f6d" stroke-width="1.6" stroke-linecap="round"><path d="M10 7L6 3M10 17l-4 4M15 6V2M15 18v4M20 7l4-4M20 17l4 4"/></g><ellipse cx="15" cy="12" rx="8" ry="6" fill="#ff5f6d"/><path d="M15 6v12" stroke="#7a1f2a" stroke-width="1.2"/><circle cx="24" cy="12" r="3.4" fill="#7a1f2a"/></svg>';
    const CODE =
      '<span class="k">function</span> <span class="f">renderCards</span>() {\n' +
      '  <span class="k">const</span> latest = <span class="f">latestDone</span>();\n' +
      '  grid.<span class="f">replaceChildren</span>();\n' +
      '  <span class="k">if</span> (latest) slot.<span class="f">append</span>(card);\n' +
      '  <span class="k">return</span> <span class="s">"looks fine to me"</span>;\n' +
      '}\n' +
      '<span class="f">render</span>();\n' +
      '<span class="s">// TODO: no bugs (lol)</span>';

    function startBugGame() {
      const NEED = 8;
      const LENGTH = 12000;
      let squashed = 0;
      let start = 0;
      let frame = null;
      let spawner = null;
      let over = false;

      const game = document.createElement("div");
      game.className = "bug-game";
      game.setAttribute("role", "dialog");
      game.setAttribute("aria-modal", "true");
      game.setAttribute("aria-labelledby", "bug-title");
      game.innerHTML =
        '<div class="bug-window"><div class="bug-bar"><i></i><i></i><i></i><h2 id="bug-title"></h2><button class="bug-quit" type="button"></button></div>' +
        '<div class="bug-hud"><span class="bug-score" aria-live="polite"></span><span class="bug-timer" aria-hidden="true"><b></b></span></div>' +
        '<div class="bug-code"><div aria-hidden="true">' + CODE + '</div><div class="bug-end" hidden><p></p><div><button type="button" class="bug-again"></button><button type="button" class="bug-close"></button></div></div></div></div>';
      game.querySelector("#bug-title").textContent = ui("bugTitle");
      game.querySelector(".bug-quit").textContent = ui("bugQuit");
      game.querySelector(".bug-again").textContent = ui("bugAgain");
      game.querySelector(".bug-close").textContent = ui("bugClose");
      const code = game.querySelector(".bug-code");
      const score = game.querySelector(".bug-score");
      const bar = game.querySelector(".bug-timer b");
      const end = game.querySelector(".bug-end");
      document.body.append(game);

      // The rest of the page sits behind the game until it closes.
      const behind = document.querySelectorAll(".topbar, .page");
      behind.forEach(function (el) { el.inert = true; });
      document.documentElement.classList.add("is-gaming");
      box.classList.add("is-playing");
      mood("norm");

      function spawn() {
        const w = code.clientWidth;
        const h = code.clientHeight;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "bug";
        b.setAttribute("aria-label", ui("bugSquash"));
        b.innerHTML = BUG_SVG;
        code.append(b);
        const y = 6 + Math.random() * (h - 50);
        let anim;
        if (motionOn) {
          // Bugs crawl across the code.
          anim = b.animate([{ transform: "translate(-46px," + y + "px)" },
            { transform: "translate(" + (w + 4) + "px," + (y + Math.random() * 40 - 20) + "px)" }],
            { duration: 3400 + Math.random() * 2600, easing: "linear" });
          anim.finished.then(function () { b.remove(); }, function () {});
        } else {
          // Without motion, bugs pop up in place and vanish after a moment.
          b.style.transform = "translate(" + Math.random() * (w - 40) + "px," + y + "px)";
          setTimeout(function () { b.remove(); }, 1600);
        }
        b.squash = function () {
          if (over || !b.isConnected) return;
          const r = b.getBoundingClientRect();
          const cr = code.getBoundingClientRect();
          const splat = document.createElement("i");
          splat.className = "bug-splat";
          splat.style.left = r.left - cr.left + r.width / 2 - 15 + "px";
          splat.style.top = r.top - cr.top + r.height / 2 - 15 + "px";
          code.append(splat);
          setTimeout(function () { splat.remove(); }, 1300);
          if (anim) anim.cancel();
          const next = b.nextElementSibling;
          const hadFocus = document.activeElement === b;
          b.remove();
          squashed++;
          score.textContent = squashed + " / " + NEED;
          mood("happy");
          fx("is-hopping", 500);
          if (squashed % 3 === 1) say(pick(ui("bugCheers").split("|")), 1200);
          // Keyboard players keep their place.
          if (hadFocus) (next && next.classList.contains("bug") ? next : game.querySelector(".bug-quit")).focus();
        };
        // Mouse and touch squash on press (see the code area below);
        // this click is for keyboard players pressing Enter or Space.
        b.addEventListener("click", function (e) {
          if (e.detail === 0) b.squash();
        });
      }

      // Squash on press rather than on click: bugs keep moving, so by the
      // time a click is finished the pointer may already be off the bug.
      // Near misses count too: the closest bug within reach is squashed.
      code.addEventListener("pointerdown", function (e) {
        if (over) return;
        let best = null;
        let bestDist = 40;
        code.querySelectorAll(".bug").forEach(function (bug) {
          const r = bug.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          if (d < bestDist) {
            best = bug;
            bestDist = d;
          }
        });
        if (best) {
          e.preventDefault();
          best.squash();
        }
      });

      function tick() {
        const left = 1 - (performance.now() - start) / LENGTH;
        bar.style.transform = "scaleX(" + Math.max(0, left) + ")";
        if (left <= 0) {
          finish();
          return;
        }
        frame = requestAnimationFrame(tick);
      }

      function begin() {
        over = false;
        squashed = 0;
        score.textContent = "0 / " + NEED;
        end.hidden = true;
        start = performance.now();
        tick();
        spawn();
        spawner = setInterval(spawn, 620);
        game.querySelector(".bug-quit").focus();
      }

      function finish() {
        over = true;
        cancelAnimationFrame(frame);
        clearInterval(spawner);
        code.querySelectorAll(".bug").forEach(function (b) { b.remove(); });
        const won = squashed >= NEED;
        end.querySelector("p").textContent = ui(won ? "bugWin" : "bugLose", { count: squashed });
        end.hidden = false;
        mood(won ? "happy" : "norm");
        say(won ? ui("pixelGameWin") : ui("pixelGameLose"), 3000);
        game.querySelector(".bug-again").focus();
      }

      function close() {
        over = true;
        cancelAnimationFrame(frame);
        clearInterval(spawner);
        document.removeEventListener("keydown", onKey);
        behind.forEach(function (el) { el.inert = false; });
        document.documentElement.classList.remove("is-gaming");
        box.classList.remove("is-playing");
        game.remove();
        playing = false;
        // Squashing bugs together calms him right down.
        anger = 0;
        wasAngry = false;
        showTemper();
        mood("norm");
        bot.focus({ preventScroll: true });
      }

      function onKey(e) { if (e.key === "Escape") close(); }

      game.querySelector(".bug-quit").addEventListener("click", close);
      game.querySelector(".bug-close").addEventListener("click", close);
      game.querySelector(".bug-again").addEventListener("click", begin);
      document.addEventListener("keydown", onKey);
      begin();
    }

    // ----- throwing him around -----

    let drag = null;
    let dragged = false;
    let flight = null;
    let walkTimer = null;

    // How far he can go from his corner before hitting the screen edges.
    function limits() {
      const s = homeSpot();
      return { minX: -s.left, maxX: window.innerWidth - s.width - s.left, minY: -s.top, maxY: window.innerHeight - s.height - s.top - 4 };
    }

    let walkEnd = null;

    // Cancel any throw, fall or walk home (used when he's sent away mid-air).
    function stopThrow() {
      cancelAnimationFrame(flight);
      flight = null;
      clearTimeout(walkTimer);
      clearTimeout(walkEnd);
      if (drag) {
        window.removeEventListener("pointermove", onDragMove);
        window.removeEventListener("pointerup", release);
        window.removeEventListener("pointercancel", release);
        drag = null;
      }
      bot.classList.remove("is-dragging");
    }

    function walkHome() {
      busy = true;
      home.classList.add("is-walking");
      setOffset(0, 0, 0);
      fx("is-hopping", 500);
      walkEnd = setTimeout(function () {
        home.classList.remove("is-walking");
        box.classList.remove("is-away");
        busy = false;
      }, 950);
    }

    function fly(vx, vy) {
      let x = parseFloat(home.style.getPropertyValue("--tx")) || 0;
      let y = parseFloat(home.style.getPropertyValue("--ty")) || 0;
      let rot = 0;
      let spin = vx * 0.5;
      let last = performance.now();
      let hard = false;
      const GRAVITY = 1800;
      provoke(THROW);
      mood(stageIndex() >= 3 ? "mad" : "happy");
      say(tierLine("launched", "Wheee!"), 1500);

      function step(t) {
        const dt = Math.min(0.033, (t - last) / 1000);
        last = t;
        let hit = 0;
        // Checked every frame, in case the window changes size mid-flight.
        const lim = limits();
        vy += GRAVITY * dt;
        x += vx * dt;
        y += vy * dt;
        rot += spin * dt;
        if (x < lim.minX) { x = lim.minX; hit = Math.abs(vx); vx = -vx * 0.62; spin = -spin * 0.6; }
        if (x > lim.maxX) { x = lim.maxX; hit = Math.abs(vx); vx = -vx * 0.62; spin = -spin * 0.6; }
        if (y < lim.minY) { y = lim.minY; hit = Math.max(hit, Math.abs(vy)); vy = -vy * 0.6; }
        if (y > lim.maxY) {
          y = lim.maxY;
          hit = Math.max(hit, Math.abs(vy));
          vy = -vy * 0.5;
          vx *= 0.82;
          spin *= 0.7;
          if (Math.abs(vy) < 60) vy = 0;
        }
        if (hit > 1100 && !hard) {
          hard = true;
          mood("dizzy");
          say(ui("pixelOw"), 1200);
        }
        const resting = y >= lim.maxY - 0.5 && vy === 0;
        if (resting) {
          vx *= 0.9;
          rot *= 0.85;
          spin = 0;
        }
        setOffset(x, y, rot);
        if (resting && Math.abs(vx) < 8 && Math.abs(rot) < 1) {
          setOffset(x, y, 0);
          flight = null;
          land(hard);
          return;
        }
        flight = requestAnimationFrame(step);
      }
      flight = requestAnimationFrame(step);
    }

    function land(hard) {
      if (hard) provoke(HARD_LANDING);
      // Thrown one time too many: he snaps once he's back in his corner.
      if (anger >= 100) {
        mood("mad");
        say(temperLines("snap", "THAT'S IT!")[0], 1500);
        walkTimer = setTimeout(function () {
          walkHome();
          walkTimer = setTimeout(function () {
            if (!shown || transit) return;
            closeTips(true);
            playing = true;
            const lines2 = temperLines("snap", "THAT'S IT!");
            if (lines2[1]) say(lines2[1], 1600);
            setTimeout(function () { if (stillHere()) startBugGame(); }, 1300);
          }, 1000);
        }, 1400);
        return;
      }
      const angry = stageIndex() >= 3;
      if (hard) {
        mood("dizzy");
        say(ui("pixelDizzy"), 1800);
        walkTimer = setTimeout(function () {
          mood(angry ? "mad" : "norm");
          say(tierLine("afterDizzy", "Please don't do that again."), 2400);
          walkTimer = setTimeout(walkHome, 1800);
        }, 1800);
      } else {
        mood(angry ? "mad" : stageIndex() >= 1 ? "norm" : "happy");
        say(tierLine("landed", "Again! Again!"), 2000);
        walkTimer = setTimeout(function () {
          if (!angry) mood("norm");
          walkHome();
        }, 2000);
      }
    }

    // Dragging only starts after the pointer moves a little, so a plain
    // click is still a poke. Throwing is skipped with reduced motion.
    let trail = [];
    bot.addEventListener("pointerdown", function (e) {
      if (!motionOn || !canChatOrAway() || e.button > 0) return;
      drag = { x: e.clientX, y: e.clientY, startX: parseFloat(home.style.getPropertyValue("--tx")) || 0, startY: parseFloat(home.style.getPropertyValue("--ty")) || 0, id: e.pointerId, moving: false };
      dragged = false;
      trail = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
      // Follow the pointer anywhere on the page, since a quick flick can
      // leave Pixel behind before the drag starts.
      window.addEventListener("pointermove", onDragMove);
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", release);
    });
    function canChatOrAway() { return shown && !transit && !playing && !home.classList.contains("is-walking"); }

    function onDragMove(e) {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (!drag.moving) {
        if (Math.hypot(dx, dy) < 8) return;
        drag.moving = true;
        dragged = true;
        busy = true;
        wake(true);
        cancelAnimationFrame(flight);
        clearTimeout(walkTimer);
        bot.setPointerCapture(e.pointerId);
        bot.classList.add("is-dragging");
        box.classList.add("is-away");
        mood(stageIndex() >= 3 ? "mad" : "dizzy");
        say(tierLine("grabbed", "Hey! Put me down!"), 2000);
      }
      const lim = limits();
      const x = Math.max(lim.minX, Math.min(lim.maxX, drag.startX + dx));
      const y = Math.max(lim.minY, Math.min(lim.maxY, drag.startY + dy));
      setOffset(x, y, Math.max(-25, Math.min(25, (e.movementX || 0) * 2)));
      trail.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (trail.length > 6) trail.shift();
    }

    function release(e) {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      window.removeEventListener("pointermove", onDragMove);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      const wasMoving = drag.moving;
      drag = null;
      if (!wasMoving) return;
      bot.classList.remove("is-dragging");
      // Letting go over a link or button shouldn't click it.
      function swallow(ev) {
        ev.stopPropagation();
        ev.preventDefault();
      }
      window.addEventListener("click", swallow, { capture: true, once: true });
      setTimeout(function () {
        window.removeEventListener("click", swallow, { capture: true });
        dragged = false;
      }, 80);
      const a = trail[0];
      const b = trail[trail.length - 1];
      const dt = Math.max(16, b.t - a.t) / 1000;
      const cap = 2600;
      fly(Math.max(-cap, Math.min(cap, (b.x - a.x) / dt)), Math.max(-cap, Math.min(cap, (b.y - a.y) / dt)));
    }

    bot.addEventListener("click", function () {
      // The click that ends a drag isn't a poke.
      if (dragged) {
        dragged = false;
        return;
      }
      poke();
    });

    // Keep him on screen if the window shrinks while he's away from home.
    window.addEventListener("resize", function () {
      if (!busy && box.classList.contains("is-away")) walkHome();
    });

    // ----- watching the mouse, and commenting on cards -----

    if (motionOn && finePointer) {
      const eyes = bot.querySelector(".pix-eyes");
      let pointer = null;
      let frameId = null;
      window.addEventListener("pointermove", function (e) {
        pointer = e;
        if (frameId || box.hidden) return;
        frameId = requestAnimationFrame(function () {
          frameId = null;
          const c = center();
          const dx = pointer.clientX - c.x;
          const dy = pointer.clientY - (c.y - 3);
          const d = Math.hypot(dx, dy) || 1;
          const k = Math.min(1, d / 140);
          eyes.style.transform = "translate(" + (dx / d * 3.2 * k).toFixed(2) + "px," + (dy / d * 2.2 * k).toFixed(2) + "px)";
        });
      }, { passive: true });

      const saidAt = {};
      let hoverTimer = null;
      document.addEventListener("pointerover", function (e) {
        const card = e.target.closest && e.target.closest(".card");
        if (!card || card.contains(e.relatedTarget)) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () {
          const number = Number(card.dataset.number);
          if (!canChat() || tipsOpen || asleep || Date.now() - (saidAt[number] || 0) < 20000) return;
          const data = SITE.cards.find(function (c) { return c.number === number; });
          if (!data) return;
          saidAt[number] = Date.now();
          const fallback = ui("pixelCard_" + data.status, { title: text(data.title) });
          mood("happy");
          say(fill(data.pixel) || fallback, 3000);
          setTimeout(function () { if (box.dataset.mood === "happy" && !busy) mood("norm"); }, 3000);
        }, 450);
      });
      document.addEventListener("pointerout", function (e) {
        const card = e.target.closest && e.target.closest(".card");
        if (card && !card.contains(e.relatedTarget)) clearTimeout(hoverTimer);
      });
    }

    // ----- napping when the visitor is idle -----

    const napAfter = Math.max(5, Number(guide.napSeconds) || 30) * 1000;
    let idleTimer = null;
    let zTimer = null;
    let wakeCount = 0;

    function snooze() {
      if (!canChat() || tipsOpen || asleep || document.hidden) {
        restartIdle();
        return;
      }
      asleep = true;
      say("");
      mood("sleep");
      if (motionOn) {
        const z = function () {
          const c = center();
          const el = effect("pix-zzz", c.x + 14, c.r.top - 6, 2500);
          el.textContent = "z";
          el.style.fontSize = 12 + Math.random() * 8 + "px";
        };
        z();
        zTimer = setInterval(z, 1100);
      }
    }

    function wake(silent) {
      if (!asleep) return;
      asleep = false;
      clearInterval(zTimer);
      if (silent) {
        mood("norm");
        return;
      }
      mood("dizzy");
      fx("is-hopping", 500);
      say(ui("pixelAwake"), 1100);
      const excuse = ui(wakeCount++ % 2 ? "pixelExcuse2" : "pixelExcuse1");
      setTimeout(function () {
        if (asleep) return;
        mood("happy");
        say(excuse, 2800);
        setTimeout(function () { if (box.dataset.mood === "happy") mood("norm"); }, 2800);
      }, 1100);
    }

    function restartIdle() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(snooze, napAfter);
    }

    ["pointermove", "pointerdown", "keydown", "scroll", "touchstart", "wheel"].forEach(function (type) {
      window.addEventListener(type, function () {
        if (asleep) wake();
        restartIdle();
      }, { passive: true });
    });

    // ----- reacting to dark mode and color changes -----

    let colorLine = 0;
    document.addEventListener("portfolio:theme", function () {
      if (!canChat() || tipsOpen) return;
      wake(true);
      const light = document.documentElement.getAttribute("data-theme") === "light";
      fx("is-hopping", 500);
      mood(light ? "norm" : "happy");
      say(ui(light ? "pixelLight" : "pixelDark"), 2800);
    });
    document.addEventListener("portfolio:color", function () {
      if (!canChat() || tipsOpen) return;
      wake(true);
      if (motionOn) {
        const c = center();
        effect("pix-paint", c.x - 38, c.y - 38, 650);
      }
      fx("is-hopping", 500);
      mood("happy");
      const list = ui("pixelPaint").split("|");
      say(list[colorLine++ % list.length], 2600);
      setTimeout(function () { if (box.dataset.mood === "happy") mood("norm"); }, 2600);
    });

    // ----- first appearance -----

    mood("norm");
    syncToggle();
    if (load(PIXEL_KEY) === "off") return;
    shown = true;
    syncToggle();
    restartIdle();
    const returning = load(GUIDE_KEY) === "done";
    if (document.documentElement.classList.contains("intro")) {
      // He shows up as the screen powers on after kicking it (or once a
      // skipped intro fades away), then starts his tips.
      let started = false;
      const begin = function () {
        if (started) return;
        started = true;
        box.hidden = false;
      };
      document.addEventListener("portfolio:power-on", begin, { once: true });
      document.addEventListener("portfolio:intro-done", function () {
        if (!started) {
          begin();
          appear(false);
          return;
        }
        setTimeout(function () {
          if (!openTips()) {
            mood("happy");
            say(pick(lines("afterKick", ["Much better. Welcome!"])), 3000);
          }
        }, 500);
      }, { once: true });
    } else {
      shown = false;
      setTimeout(function () { appear(returning); }, returning ? 1200 : 1600);
    }
  }

  // ---------- Click ripples ----------

  function setupButtonFeel() {
    if (!motionOn) return;

    // Ripple: a soft circle spreads out from where the button was clicked.
    document.addEventListener("click", function (e) {
      const button = e.target.closest(".play, .nav-pill, .ghost, .guide-btn, .copy-btn");
      if (!button) return;
      const r = button.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      // Keyboard presses have no mouse position, so ripple from the middle.
      const x = e.clientX || r.left + r.width / 2;
      const y = e.clientY || r.top + r.height / 2;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (x - r.left - size / 2) + "px";
      ripple.style.top = (y - r.top - size / 2) + "px";
      button.append(ripple);
      ripple.addEventListener("animationend", function () { ripple.remove(); });
    });
  }

  // ---------- The impact frame ----------

  // When Pixel's kick connects, a handful of single frames flash by, the
  // way impact frames do in anime fight scenes: pure white, then a black
  // silhouette on white, then inverted, then red, then cracks. The whole
  // thing lasts about a quarter of a second. It's meant to be felt more
  // than seen, so the jokes inside it (Pixel's X-ray, the very precise
  // measurements) are Easter eggs. Add ?impact=slow to the address to
  // watch it frame by frame.
  //
  // Then real time comes back hard: the screen shakes with a color split,
  // a crack races out from the hit, shards of the error screen fly off,
  // and BONK.

  // A jagged star outline around (cx, cy).
  function starPath(cx, cy, points, outer, inner, rand) {
    let d = "";
    for (let i = 0; i < points * 2; i++) {
      const r = (i % 2 ? inner : outer) * (0.75 + rand() * 0.5);
      const a = (Math.PI * i) / points + rand() * 0.15;
      d += (i ? "L" : "M") + (cx + Math.cos(a) * r).toFixed(1) + " " + (cy + Math.sin(a) * r).toFixed(1);
    }
    return d + "Z";
  }

  // Thin wedges bursting out from (cx, cy): the classic speed lines.
  function radialLines(cx, cy, count, reach, rand, color) {
    let d = "";
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + rand() * 0.08;
      const width = 0.006 + rand() * 0.03;
      const start = 40 + rand() * 160;
      const p = function (ang, r) { return (cx + Math.cos(ang) * r).toFixed(1) + " " + (cy + Math.sin(ang) * r).toFixed(1); };
      d += "M" + p(a, start) + "L" + p(a - width, reach) + "L" + p(a + width, reach) + "Z";
    }
    return '<path d="' + d + '" fill="' + color + '"/>';
  }

  // Pixel mid-kick, as one flat shape (for the silhouettes).
  function kickSilhouette(x, y, s, fill, stroke) {
    return '<g transform="translate(' + x + " " + y + ") scale(" + s + ') rotate(-14 26 30)" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (2.4 / s * 2).toFixed(2) + '" stroke-linejoin="round">' +
      '<path d="M26 2L22 10" stroke-width="3"/><circle cx="26" cy="2.5" r="3.6"/>' +
      '<rect x="6" y="10" width="40" height="30" rx="9"/>' +
      '<rect x="14" y="42" width="24" height="10" rx="4"/>' +
      // The leg nobody knew he had, mid-strike.
      '<path d="M34 48L52 46L74 34" fill="none" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M70 28l12 3-4 10-11-3z"/>' +
      "</g>";
  }

  function playImpact(layer, at, done) {
    const slow = /[?&]impact=slow/.test(location.search) ? 10 : 1;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const reach = Math.hypot(W, H);
    // The flash frames are framed like a camera cut, with the hit near the
    // middle of the screen; the aftermath happens where the foot really hit.
    const portrait = H > W;
    const ix = W * (portrait ? 0.62 : 0.6);
    const iy = H * (portrait ? 0.42 : 0.46);
    const hx = at[0];
    const hy = at[1];
    let seed = 7;
    const rand = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const big = Math.min(W * 0.7, H) / 105; // size of the giant silhouette
    // Placed so his foot lands right on the impact point.
    const sx = ix - 80 * big;
    const sy = iy - 22 * big;

    function frame(bg, inner) {
      return '<svg class="impact-frame" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none" style="background:' + bg + '">' + inner + "</svg>";
    }

    // The X-ray Easter egg: what's really inside Pixel.
    const xray = '<g transform="translate(' + sx + " " + sy + ") scale(" + big + ') rotate(-14 26 30)" fill="none" stroke="#000" stroke-width="0.9">' +
      '<circle cx="26" cy="25" r="10"/><path d="M26 15v20M16 25h20M19 18l14 14M33 18L19 32"/>' +
      '<ellipse cx="26" cy="27.5" rx="4" ry="2.6" fill="#000"/><circle cx="29" cy="25.6" r="1" fill="#000"/><path d="M23 30l-1 2M28 30l1 2"/>' +
      '<rect x="18" y="44" width="16" height="6" rx="1"/><path d="M34 46h1.5v2H34"/><text x="26" y="48.6" font-size="3.4" text-anchor="middle" fill="#000" stroke="none" font-family="monospace">AA</text>' +
      '<path d="M41 14c-1.5-2-4-1-3.5 1 .4 1.6 3.5 3.5 3.5 3.5s3.1-1.9 3.5-3.5c.5-2-2-3-3.5-1z" fill="#000"/>' +
      "</g>";

    // The "very precise measurements" Easter egg, flashed for one frame.
    const fine = ["FORCE 9,001 N", "34.7 m/s", "KICK ANGLE 47.3°", "CONFIDENCE 100%", "WARRANTY: VOID", "SCREEN INTEGRITY 0%"];
    let notes = "";
    fine.forEach(function (t, i) {
      const a = -2.4 + i * 0.95;
      const r = 150 + (i % 2) * 70;
      notes += '<text x="' + (ix + Math.cos(a) * r).toFixed(0) + '" y="' + (iy + Math.sin(a) * r).toFixed(0) + '" fill="#fff" font-size="13" font-family="monospace" font-weight="700" text-anchor="middle">' + t + "</text>";
    });

    // Cracks shooting out from a point.
    function crackPath(ox, oy) {
      let out = "";
      for (let i = 0; i < 9; i++) {
        let a = rand() * Math.PI * 2;
        let x = ox;
        let y = oy;
        let d = "M" + x.toFixed(0) + " " + y.toFixed(0);
        const steps = 4 + Math.floor(rand() * 4);
        for (let k = 0; k < steps; k++) {
          a += (rand() - 0.5) * 0.9;
          const len = (reach / steps) * (0.4 + rand() * 0.6);
          x += Math.cos(a) * len;
          y += Math.sin(a) * len;
          d += "L" + x.toFixed(0) + " " + y.toFixed(0);
        }
        out += d;
      }
      return out;
    }
    const cutCracks = crackPath(ix, iy);
    const cracks = crackPath(hx, hy);

    const frames = [
      // [how long, picture]
      [33, frame("#ffffff", "")],
      [50, frame("#ffffff", radialLines(ix, iy, 90, reach, rand, "#000") +
        '<path d="' + starPath(ix, iy, 16, 120, 50, rand) + '" fill="#000"/>' +
        kickSilhouette(sx, sy, big, "#000", "#000"))],
      [33, frame("#000000", radialLines(ix, iy, 70, reach, rand, "#fff") +
        '<circle cx="' + ix + '" cy="' + iy + '" r="' + Math.min(W, H) * 0.42 + '" fill="none" stroke="#ff2a3d" stroke-width="18"/>' +
        '<path d="' + starPath(ix, iy, 12, 150, 60, rand) + '" fill="#fff"/>' +
        kickSilhouette(sx, sy, big, "#fff", "#fff") + xray)],
      [33, frame("#e3122b", radialLines(ix, iy, 60, reach, rand, "#000") +
        '<path d="' + starPath(ix, iy, 18, 210, 80, rand) + '" fill="#000"/>' +
        '<path d="' + starPath(ix, iy, 10, 90, 40, rand) + '" fill="#fff"/>' +
        kickSilhouette(sx, sy, big, "#000", "#fff") + notes)],
      [33, frame("#000000", '<path d="' + cutCracks + '" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="bevel"/>' +
        '<path d="' + starPath(ix, iy, 9, 70, 30, rand) + '" fill="#fff"/>')],
      [17, frame("#ffffff", "")]
    ];

    const box = document.createElement("div");
    box.className = "intro-impact";
    box.setAttribute("aria-hidden", "true");
    box.innerHTML = frames.map(function (f) { return f[1]; }).join("");
    layer.append(box);
    const pics = box.children;

    // Show one frame at a time, each nudged and zoomed a little differently
    // so the sequence jolts rather than fades.
    let i = -1;
    let until = 0;
    function step(now) {
      if (now >= until) {
        if (i >= 0) pics[i].style.display = "none";
        i++;
        if (i >= frames.length) {
          box.remove();
          aftermath();
          return;
        }
        const pic = pics[i];
        pic.style.display = "block";
        pic.style.transform = "translate(" + ((rand() - 0.5) * 24).toFixed(0) + "px," + ((rand() - 0.5) * 24).toFixed(0) + "px) scale(" + (1.18 - i * 0.02).toFixed(2) + ")"; // (zoomed enough that the nudge never shows an edge)
        until = now + frames[i][0] * slow;
      }
      requestAnimationFrame(step);
    }

    // Real time again, with the hit's full weight.
    function aftermath() {
      // A crack races out from where the foot hit.
      const crack = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      crack.setAttribute("class", "intro-crack-live");
      crack.setAttribute("viewBox", "0 0 " + W + " " + H);
      crack.setAttribute("aria-hidden", "true");
      crack.innerHTML = '<path d="' + cracks + '" pathLength="1"/>' + '<path class="crack-glint" d="' + cracks + '" pathLength="1"/>';
      layer.append(crack);
      crack.querySelectorAll("path").forEach(function (p) {
        p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 140 * slow, easing: "cubic-bezier(.1,.8,.2,1)", fill: "forwards" });
      });

      // Shards of the screen fly off and fall.
      for (let n = 0; n < 22; n++) {
        const shard = document.createElement("i");
        shard.className = "intro-shard";
        const size = 6 + rand() * 18;
        shard.style.width = size + "px";
        shard.style.height = size * (0.5 + rand()) + "px";
        shard.style.left = hx + "px";
        shard.style.top = hy + "px";
        shard.style.background = n % 3 ? "#1530a6" : "#ffffff";
        layer.append(shard);
        const a = rand() * Math.PI * 2;
        const v = 250 + rand() * 650;
        const vx = Math.cos(a) * v;
        const vy = Math.sin(a) * v - 300;
        const spin = (rand() - 0.5) * 1440;
        const keys = [];
        for (let k = 0; k <= 8; k++) {
          const t = (k / 8) * 1.1;
          keys.push({ transform: "translate(" + (vx * t).toFixed(0) + "px," + (vy * t + 900 * t * t).toFixed(0) + "px) rotate(" + (spin * t).toFixed(0) + "deg)", opacity: k === 8 ? 0 : 1 });
        }
        shard.animate(keys, { duration: 1100 * slow, easing: "linear", fill: "forwards" });
        setTimeout(function () { shard.remove(); }, 1150 * slow);
      }

      // BONK slams in.
      const bonk = document.createElement("span");
      bonk.className = "intro-bonk";
      bonk.textContent = "BONK!";
      bonk.style.left = Math.min(Math.max(hx, 110), W - 110) + "px";
      bonk.style.top = Math.max(hy - 190, 40) + "px";
      layer.append(bonk);

      // The screen shakes hard, then settles, with the colors splitting
      // apart for the first moments.
      layer.classList.add("is-split");
      // Fill the gaps the shake opens at the screen edges, so the real site
      // doesn't peek through early.
      layer.style.boxShadow = "0 0 0 80px #1530a6";
      const start = performance.now();
      const length = 650 * slow;
      function shake(now) {
        const t = (now - start) / length;
        if (t >= 1) {
          layer.style.transform = "";
          layer.style.boxShadow = "";
          layer.classList.remove("is-split");
          if (done) done();
          return;
        }
        if (t > 0.3) layer.classList.remove("is-split");
        const amp = 26 * Math.pow(1 - t, 2.2);
        layer.style.transform = "translate(" + ((rand() - 0.5) * 2 * amp).toFixed(1) + "px," + ((rand() - 0.5) * 2 * amp).toFixed(1) + "px) rotate(" + ((rand() - 0.5) * amp * 0.08).toFixed(2) + "deg)";
        requestAnimationFrame(shake);
      }
      requestAnimationFrame(shake);
    }

    requestAnimationFrame(step);
  }

  // ---------- Crash-and-reboot intro ----------

  // index.html decides whether to show the intro (first visit, not
  // reduced motion, or ?intro=on). This runs it and cleans up after.
  function runIntro() {
    const root = document.documentElement;
    if (!root.classList.contains("intro")) return;

    const layer = document.getElementById("intro");
    const skipButton = document.getElementById("intro-skip");
    let ended = false;
    const timers = [];

    // Keep keyboard focus out of the real page until the intro is over.
    const behind = document.querySelectorAll(".topbar, .page");
    behind.forEach(function (el) { el.inert = true; });

    // Schedule an intro step. Once the intro has ended (finished or
    // skipped), late steps are ignored, since the intro screen is gone.
    function later(fn, ms) {
      if (ended) return;
      timers.push(setTimeout(function () { if (!ended) fn(); }, ms));
    }

    function end() {
      if (ended) return;
      ended = true;
      timers.forEach(clearTimeout);
      save(INTRO_KEY, "1");
      document.removeEventListener("keydown", onKey);
      behind.forEach(function (el) { el.inert = false; });
      layer.classList.add("is-leaving");
      setTimeout(function () {
        root.classList.remove("intro");
        layer.remove();
        revealOnScroll();
        document.dispatchEvent(new Event("portfolio:intro-done"));
      }, 450);
    }

    // When the intro plays all the way through, the real page switches on
    // like an old monitor instead of just fading in. (Skipping still fades,
    // so it stays quick.)
    function powerOn() {
      if (ended) return;
      ended = true;
      timers.forEach(clearTimeout);
      save(INTRO_KEY, "1");
      document.removeEventListener("keydown", onKey);
      behind.forEach(function (el) { el.inert = false; });
      const fx = document.createElement("div");
      fx.className = "power-fx";
      fx.setAttribute("aria-hidden", "true");
      fx.innerHTML = '<i class="pf-top"></i><i class="pf-bot"></i><b class="pf-flash"></b><b class="pf-line"></b><b class="pf-scan"></b>';
      document.body.append(fx);
      root.classList.add("powering");
      root.classList.remove("intro");
      layer.remove();
      document.dispatchEvent(new Event("portfolio:power-on"));
      // The banner starts its entrance as the screen opens up.
      setTimeout(function () { root.classList.remove("powering"); }, 450);
      setTimeout(function () {
        fx.remove();
        revealOnScroll();
        document.dispatchEvent(new Event("portfolio:intro-done"));
      }, 1150);
    }

    // After Pixel's kick: a fake browser refresh. The screen goes blank, a
    // loading bar crawls across the top with a spinning reload icon, then
    // the real site paints in, top to bottom.
    function refreshInto() {
      if (ended) return;
      ended = true;
      timers.forEach(clearTimeout);
      save(INTRO_KEY, "1");
      document.removeEventListener("keydown", onKey);
      behind.forEach(function (el) { el.inert = false; });
      const fx = document.createElement("div");
      fx.className = "fake-refresh";
      fx.setAttribute("aria-hidden", "true");
      fx.innerHTML = '<i class="fr-bar"></i><svg class="fr-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/></svg>';
      document.body.append(fx);
      root.classList.add("powering");
      root.classList.remove("intro");
      layer.remove();
      setTimeout(function () {
        fx.classList.add("is-done");
        root.classList.remove("powering");
        root.classList.add("refreshing");
        document.dispatchEvent(new Event("portfolio:power-on"));
      }, 950);
      setTimeout(function () {
        fx.remove();
        root.classList.remove("refreshing");
        revealOnScroll();
        document.dispatchEvent(new Event("portfolio:intro-done"));
      }, 1700);
    }

    function onKey(e) { if (e.key === "Escape") end(); }

    if (SITE.intro === false) {
      behind.forEach(function (el) { el.inert = false; });
      root.classList.remove("intro");
      layer.remove();
      // Pixel and the card deal wait for this signal, so send it even though
      // no intro played (otherwise they'd wait forever).
      setTimeout(function () { document.dispatchEvent(new Event("portfolio:intro-done")); }, 0);
      return;
    }

    // Fill in the plain page with the real name and today's date.
    const first = text(SITE.name).split(" ")[0] || "My";
    setText("intro-title", first + "'s Homepage");
    setText("intro-hang-title", first + "'s Homepage (Not Responding)");
    setText("intro-date", new Date().toLocaleDateString("en-US"));
    setText("intro-skip", ui("skipIntro") + " ›");

    skipButton.addEventListener("click", end);
    layer.addEventListener("click", end);
    document.addEventListener("keydown", onKey);
    skipButton.focus({ preventScroll: true });

    // 1. The plain page sits there for a moment, then freezes.
    later(function () {
      document.getElementById("intro-hang").hidden = false;
      layer.classList.add("is-frozen");
    }, 1400);

    // 2. Fake error screen. The counter gets stuck, because this page
    //    is never going to load on its own.
    later(function () {
      document.getElementById("intro-err").hidden = false;
      [0, 20, 40, 40].forEach(function (pct, i) {
        later(function () { setText("intro-pct", pct + "%"); }, i * 160);
      });
    }, 2400);

    if (pixelWanted()) pixelFixesIt();
    else bootScreen();

    // 3a. Pixel walks onto the error screen and kicks it back to life.
    function pixelFixesIt() {
      const pix = document.getElementById("intro-pixel");
      pix.innerHTML = PIXEL_SVG + '<span class="pix-say"></span>';
      pix.dataset.mood = "norm";
      const bubble = pix.querySelector(".pix-say");
      const lines = (SITE.guide.intro || []).map(function (l) { return text(l).split("{name}").join(first); });
      function place(x, y, instant) {
        // Near the middle, his bubble centers over him so it fits on
        // narrow phones; near the right edge it opens to the left.
        pix.classList.toggle("say-center", x < window.innerWidth * 0.6);
        pix.style.transition = instant ? "none" : "";
        pix.style.setProperty("--x", x + "px");
        pix.style.setProperty("--y", y + "px");
      }
      function talk(line) {
        bubble.textContent = line || "";
        bubble.classList.toggle("is-on", !!line);
      }
      const w = window.innerWidth;
      const h = window.innerHeight;
      // He stands above the Skip button, a bit bigger than usual.
      const floor = h - 84 - Math.max(80, h * 0.12);
      later(function () {
        place(w + 30, floor, true);
        pix.hidden = false;
        later(function () { place(w - 110, floor); }, 30);
      }, 2900);
      later(function () { pix.dataset.mood = "dizzy"; talk(lines[0] || "Whoa. That's the wrong website!"); }, 3500);
      later(function () { pix.dataset.mood = "norm"; talk(lines[1] || "Hang on, I've got this."); }, 5000);
      later(function () { talk(""); place(w / 2 - 39, floor); }, 6300);
      // Wind up... and strike.
      later(function () { pix.classList.add("is-windup"); }, 7000);
      later(function () {
        pix.classList.remove("is-windup");
        pix.classList.add("is-strike");
      }, 7260);
      // Contact! A split-second hit-stop, then the impact frames.
      later(function () {
        pix.dataset.mood = "dizzy";
        playImpact(layer, [w / 2 + 45, floor + 52], function () {
          pix.classList.remove("is-strike");
          errorPile();
        });
      }, 7330);

      // 4. Kicking it made things worse: error windows pile up. Pixel decides
      //    a refresh will fix it, and the fake refresh takes over. Visitors
      //    can close the windows themselves to move things along.
      function errorPile() {
        const texts = (SITE.guide.crashErrors || []).map(text).filter(Boolean);
        if (!texts.length) texts.push("The screen has been kicked.");
        let open = 0;
        let refreshing = false;
        function goRefresh(delay) {
          if (refreshing) return;
          refreshing = true;
          later(function () {
            layer.querySelectorAll(".intro-dialog").forEach(function (d, i, all) {
              setTimeout(function () { d.remove(); }, (all.length - 1 - i) * 70);
            });
            talk("");
            skipButton.hidden = true;
          }, delay);
          later(refreshInto, delay + 260);
        }
        texts.forEach(function (msg, i) {
          later(function () {
            const d = document.createElement("div");
            d.className = "intro-dialog";
            d.setAttribute("role", "alertdialog");
            d.style.setProperty("--i", i);
            d.innerHTML = '<div class="intro-dialog-bar"><span></span><button type="button" class="intro-dialog-x" aria-label="Close">×</button></div>' +
              '<div class="intro-dialog-body"><i aria-hidden="true">×</i><p></p></div><button type="button" class="intro-dialog-ok">OK</button>';
            d.querySelector(".intro-dialog-bar span").textContent = ui("crashTitle") || "Screen.exe";
            d.querySelector("p").textContent = msg;
            // Closing a window shouldn't count as "skip the intro".
            d.addEventListener("click", function (e) {
              e.stopPropagation();
              if (e.target.closest("button")) {
                d.remove();
                open--;
                if (open === 0) goRefresh(250);
              }
            });
            layer.append(d);
            open++;
            pix.dataset.mood = i === texts.length - 1 ? "dizzy" : pix.dataset.mood;
          }, 200 + i * 130);
        });
        later(function () {
          pix.dataset.mood = "norm";
          talk(lines[2] || "Okay... maybe a refresh will fix it.");
        }, 900);
        later(function () { goRefresh(0); }, 2300);
      }
    }

    // 3b. Without Pixel: a boot screen, one line at a time, with real
    //     numbers from your cards.
    function bootScreen() {
      later(function () {
        const boot = document.getElementById("intro-boot");
        document.getElementById("intro-err").hidden = true;
        boot.hidden = false;
        const done = SITE.cards.filter(function (c) { return c.status === "done"; }).length;
        const os = first.toUpperCase().replace(/[^A-Z0-9]/g, "") || "PORTFOLIO";
        const lines = [
          [os + "-OS v1.0", ""],
          ["Checking artifacts ...... ", done + " / " + SITE.cards.length + " OK"],
          ["Loading library ......... ", "OK"],
          ["Applying colors ......... ", "OK"],
          ["Starting portfolio", ""]
        ];
        lines.forEach(function (line, i) {
          later(function () {
            const row = document.createElement("div");
            row.textContent = line[0];
            if (line[1]) {
              const ok = document.createElement("span");
              ok.className = "intro-ok";
              ok.textContent = line[1];
              row.append(ok);
            }
            if (i === lines.length - 1) row.className = "intro-cursor";
            boot.append(row);
          }, i * 170);
        });
      }, 3450);

      // 4. The screen goes black, then the real site powers on.
      later(function () {
        document.getElementById("intro-boot").replaceChildren();
        skipButton.hidden = true;
      }, 4600);
      later(powerOn, 4800);
    }
  }

  // Turn on the animation styles in styles.css (they all start with .motion).
  if (motionOn) document.documentElement.classList.add("motion");

  // Section headings and blocks that pop in as you scroll.
  document
    .querySelectorAll(".section > h2, .about-body, .contact-panel, .foot-row")
    .forEach(function (el) { el.dataset.reveal = ""; });

  // Start at the top (see the note in index.html), including when the
  // browser brings the page back from its back/forward cache.
  window.scrollTo(0, 0);
  window.addEventListener("pageshow", function (e) { if (e.persisted) window.scrollTo(0, 0); });

  // A safety net while the page opens: if anything other than the visitor
  // scrolls the page (a browser restoring an old position, a browser quirk,
  // or the page being shown inside another site), put it back at the top.
  // It stops for good the moment the visitor scrolls, taps, clicks or
  // presses a key, and switches off about a second after the page is ready.
  (function keepTopWhileOpening() {
    let visitorActed = false;
    const inputs = ["wheel", "touchstart", "pointerdown", "keydown"];
    function acted() {
      visitorActed = true;
      stop();
    }
    function check() {
      if (!visitorActed && window.scrollY !== 0) window.scrollTo(0, 0);
    }
    function stop() {
      window.removeEventListener("scroll", check);
      inputs.forEach(function (t) { window.removeEventListener(t, acted, true); });
    }
    inputs.forEach(function (t) { window.addEventListener(t, acted, { capture: true, passive: true }); });
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("load", check);
    const stopSoon = function () { setTimeout(stop, 1200); };
    if (document.documentElement.classList.contains("intro")) {
      document.addEventListener("portfolio:intro-done", stopSoon, { once: true });
      setTimeout(stop, 20000); // in case the intro never reports back
    } else {
      stopSoon();
    }
  })();

  trackNavHeight();
  setupThemeToggle();
  setupAccentPicker();
  setupResume();
  setupDetail();
  render();
  setupClock();
  setupFanReveal();
  setupPixel();
  setupButtonFeel();
  // Scroll animations start after the intro, so they aren't wasted behind it.
  if (document.documentElement.classList.contains("intro") && SITE.intro !== false) runIntro();
  else { runIntro(); revealOnScroll(); }
})();
