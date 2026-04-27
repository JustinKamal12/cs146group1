// site.js — shared JS for all pages
// All interactions use event listeners and DOM manipulation. No inline JS.

// ─────────────────────────────────────────────
// 1. DICE ROLLER (index.html — home page)
//    Floating dice button in the corner that rolls
//    a d20 and shows the result with a brief animation.
// ─────────────────────────────────────────────

function initDiceRoller() {
  const btn = document.getElementById("dice-btn");
  const result = document.getElementById("dice-result");
  if (!btn || !result) return;

  btn.addEventListener("click", () => {
    const roll = Math.floor(Math.random() * 20) + 1;

    // DOM manipulation — update result text and style
    result.textContent = roll;
    result.className = "dice-result-display"; // reset animation
    void result.offsetWidth;                  // force reflow
    result.classList.add("dice-pop");

    if (roll === 20) {
      result.classList.add("critical");
      btn.textContent = "NAT 20! 🎉";
      setTimeout(() => { btn.textContent = "🎲 Roll d20"; }, 2000);
    } else if (roll === 1) {
      result.classList.add("fumble");
      btn.textContent = "Critical fail 💀";
      setTimeout(() => { btn.textContent = "🎲 Roll d20"; }, 2000);
    } else {
      result.classList.remove("critical", "fumble");
    }
  });
}

// ─────────────────────────────────────────────
// 2. KEYWORD SEARCH FILTER (keywords.html)
//    Live search box that hides terms that don't
//    match, with a "no results" message.
// ─────────────────────────────────────────────

function initKeywordSearch() {
  const searchBox = document.getElementById("keyword-search");
  const noResults = document.getElementById("kw-no-results");
  if (!searchBox) return;

  const dl = document.querySelector(".keyword-list");
  const terms = dl ? dl.querySelectorAll("dt") : [];

  searchBox.addEventListener("input", () => {
    const query = searchBox.value.trim().toLowerCase();
    let visibleCount = 0;

    terms.forEach(dt => {
      const dd = dt.nextElementSibling;
      const matches =
        dt.textContent.toLowerCase().includes(query) ||
        (dd && dd.textContent.toLowerCase().includes(query));

      // DOM manipulation — show/hide each term+definition pair
      dt.style.display = matches ? "" : "none";
      if (dd) dd.style.display = matches ? "" : "none";
      if (matches) visibleCount++;
    });

    // DOM manipulation — toggle "no results" message
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? "block" : "none";
    }
  });
}

// ─────────────────────────────────────────────
// 3. SECTION ACCORDION (how-to-play.html)
//    Clicking an article heading collapses/expands
//    the body of that section.
// ─────────────────────────────────────────────

function initAccordion() {
  const articles = document.querySelectorAll(".info-box.how-to-play");
  if (articles.length === 0) return;

  articles.forEach(article => {
    const heading = article.querySelector("h3");
    if (!heading) return;

    // DOM manipulation — add toggle indicator and ARIA attributes
    const indicator = document.createElement("span");
    indicator.className = "accordion-indicator";
    indicator.textContent = " ▲";
    heading.appendChild(indicator);
    heading.style.cursor = "pointer";
    article.setAttribute("aria-expanded", "true");

    heading.addEventListener("click", () => {
      const expanded = article.getAttribute("aria-expanded") === "true";

      // DOM manipulation — show/hide content inside the article
      const children = [...article.children].filter(el => el !== heading);
      children.forEach(child => {
        child.style.display = expanded ? "none" : "";
      });

      article.setAttribute("aria-expanded", expanded ? "false" : "true");
      indicator.textContent = expanded ? " ▼" : " ▲";
    });
  });
}

// ─────────────────────────────────────────────
// 4. STAT ROLLER (generated-character.html)
//    Button that randomly fills in the six ability
//    score boxes using 4d6-drop-lowest (standard
//    D&D method), with a smooth update animation.
// ─────────────────────────────────────────────

function roll4d6DropLowest() {
  const dice = [0, 0, 0, 0].map(() => Math.floor(Math.random() * 6) + 1);
  dice.sort((a, b) => a - b);
  return dice.slice(1).reduce((sum, n) => sum + n, 0); // drop lowest
}

function initStatRoller() {
  const rollBtn = document.getElementById("roll-stats-btn");
  if (!rollBtn) return;

  const scoreBoxes = document.querySelectorAll(".score .box");
  if (scoreBoxes.length === 0) return;

  rollBtn.addEventListener("click", () => {
    scoreBoxes.forEach(box => {
      const value = roll4d6DropLowest();

      // DOM manipulation — write the rolled value into the box
      box.textContent = value;
      box.classList.remove("stat-pop");
      void box.offsetWidth;
      box.classList.add("stat-pop");

      // Color-code: low = red tint, high = green tint
      box.style.background = value >= 15 ? "#e8f5e9"
                           : value <= 8  ? "#ffebee"
                           : "#ffffff";
    });

    rollBtn.textContent = "🎲 Reroll Stats";
  });
}

// ─────────────────────────────────────────────
// 5. CHARACTER CREATOR PLACEHOLDER (create-character.html)
//    If the teammate's quiz JS isn't loaded yet,
//    this at minimum wires up the start button to
//    show a name-based greeting — won't clash with
//    the full quiz if it IS present.
// ─────────────────────────────────────────────

function initCreateCharacter() {
  const startBtn = document.getElementById("start-btn");
  const nameInput = document.getElementById("player-name");
  const quizScreen = document.getElementById("quiz-screen");
  const setupScreen = document.getElementById("setup-screen");

  // Only run if the teammate's quiz hasn't already wired this up
  if (!startBtn || !nameInput || typeof quizStarted !== "undefined") return;

  startBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) {
      // DOM manipulation — inject an error message
      let err = document.getElementById("name-error");
      if (!err) {
        err = document.createElement("p");
        err.id = "name-error";
        err.style.cssText = "color:#c0392b;margin-top:0.4rem;font-size:0.85rem;";
        nameInput.after(err);
      }
      err.textContent = "Please enter a character name.";
      return;
    }

    if (quizScreen && setupScreen) {
      setupScreen.classList.add("hidden");
      quizScreen.classList.remove("hidden");
    }
  });
}

// ─────────────────────────────────────────────
// INIT — run the right function(s) for this page
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  initDiceRoller();
  initKeywordSearch();
  initAccordion();
  initStatRoller();
  initCreateCharacter();
});

// ─────────────────────────────────────────────
// 6. DARK MODE TOGGLE (all pages)
//    Persists preference via localStorage so it
//    carries across page navigation.
// ─────────────────────────────────────────────

function initDarkMode() {
  const btn = document.getElementById("dark-mode-btn");
  if (!btn) return;

  // Restore saved preference
  if (localStorage.getItem("dnd-dark") === "1") {
    document.body.classList.add("dark");
    btn.textContent = "☀️ Light Mode";
  }

  btn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    btn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("dnd-dark", isDark ? "1" : "0");
  });
}

// Re-run init to include dark mode (DOMContentLoaded already fired if this appended late,
// so call directly and also hook DOMContentLoaded as fallback)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDarkMode);
} else {
  initDarkMode();
}
