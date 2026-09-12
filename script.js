(function () {
  "use strict";

  var body = document.body;
  var YEAR = document.getElementById("year");
  if (YEAR) YEAR.textContent = new Date().getFullYear();

  /* ---------------- Theme toggle ---------------- */
  var themeToggle = document.getElementById("themeToggle");
  function getStoredTheme() {
    try { return localStorage.getItem("rm-theme"); } catch (e) { return null; }
  }
  function storeTheme(v) {
    try { localStorage.setItem("rm-theme", v); } catch (e) { /* ignore */ }
  }
  var savedTheme = getStoredTheme();
  if (savedTheme === "light" || savedTheme === "dark") {
    body.setAttribute("data-theme", savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    body.setAttribute("data-theme", "light");
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = body.getAttribute("data-theme") === "light" ? "light" : "dark";
      var next = current === "light" ? "dark" : "light";
      body.setAttribute("data-theme", next);
      storeTheme(next);
    });
  }

  /* ---------------- Sticky nav shrink ---------------- */
  var nav = document.getElementById("siteNav");
  function onScrollNav() {
    if (window.scrollY > 12) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------------- Mobile nav toggle ---------------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Scroll-spy active link ---------------- */
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var navSections = navAnchors
    .map(function (a) {
      var id = a.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    })
    .filter(Boolean);

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    var currentId = navSections[0] ? navSections[0].id : null;
    navSections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    navAnchors.forEach(function (a) {
      var id = a.getAttribute("href").replace("#", "");
      a.classList.toggle("active", id === currentId);
    });
  }
  updateActiveNav();
  window.addEventListener("scroll", updateActiveNav, { passive: true });

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- Generic filter setup (certificates + projects) ---------------- */
  function setupFilters(containerSelector, itemSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;
    var btns = container.querySelectorAll(".filter-btn");
    var items = document.querySelectorAll(itemSelector);
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var filter = btn.getAttribute("data-filter");
        items.forEach(function (item) {
          var match = filter === "all" || item.getAttribute("data-cat") === filter;
          item.classList.toggle("hidden", !match);
        });
      });
    });
  }
  setupFilters("#certFilters", ".cert-card");
  setupFilters("#projectFilters", ".project-card, #featuredProject");

  /* ---------------- Certificate modal ---------------- */
  var certCards = document.querySelectorAll(".cert-card");
  var modal = document.getElementById("certModal");
  var modalImg = document.getElementById("modalImg");
  var modalTitle = document.getElementById("modalTitle");
  var modalOrg = document.getElementById("modalOrg");
  var modalDate = document.getElementById("modalDate");
  var modalVerify = document.getElementById("modalVerify");
  var modalClose = document.getElementById("modalClose");
  var lastFocused = null;

  function openModal(card) {
    var img = card.getAttribute("data-img");
    var title = card.getAttribute("data-title");
    var org = card.getAttribute("data-org");
    var date = card.getAttribute("data-date");
    var verify = card.getAttribute("data-verify");

    if (img) {
      modalImg.src = img;
      modalImg.alt = title + " certificate";
      modalImg.style.display = "block";
    } else {
      modalImg.style.display = "none";
      modalImg.src = "";
    }
    modalTitle.textContent = title;
    modalOrg.textContent = org;
    modalDate.textContent = date;

    if (verify) {
      modalVerify.href = verify;
      modalVerify.style.display = "inline-flex";
    } else {
      modalVerify.style.display = "none";
    }

    lastFocused = document.activeElement;
    modal.classList.add("open");
    modalClose.focus();
    document.addEventListener("keydown", onModalKeydown);
  }

  function closeModal() {
    modal.classList.remove("open");
    document.removeEventListener("keydown", onModalKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onModalKeydown(e) {
    if (e.key === "Escape") closeModal();
  }

  certCards.forEach(function (card) {
    card.addEventListener("click", function () { openModal(card); });
  });
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  /* ---------------- Terminal ---------------- */
  var termBody = document.getElementById("termBody");
  var termInput = document.getElementById("term-input");

  var termData = {
    about: "Third-year B.Tech CSE student at Lovely Professional University, minoring in Data Science. From Balrampur, Uttar Pradesh. I like building complete, working things more than perfect ones.",
    skills: "Languages: C, C++, Java, Python, SQL\nWeb: HTML, CSS, JavaScript\nData: Pandas, NumPy, Matplotlib, Seaborn, EDA, ML fundamentals\nTools: Git, GitHub, VS Code, Linux, MongoDB",
    projects: "1. Library Management System — Java, Swing, Data Structures\n2. Marketing Sales Data Analysis — Python, Pandas\n3. Banker's Algorithm — HTML/CSS/JS, OS\n4. Dhunn — Music Play — HTML/CSS/JS\n5. EcoSphere — HTML/CSS/JS\n6. Shopzone — HTML/CSS\nScroll to the Projects section to see details.",
    certificates: "7 certificates earned so far — spanning C, C++, DSA, React.js, communication skills, DBMS, and Oracle AI Foundations. See the Certificates section for full details.",
    education: "B.Tech CSE, Lovely Professional University (2024 – Present), minor in Data Science.\nIntermediate & Matriculation — ASMP Public School, Balrampur, UP.",
    contact: "Email: rishabhcse123@gmail.com\nGitHub: github.com/Rishabh21-CSE\nLinkedIn: linkedin.com/in/rishabhmishra04"
  };

  var helpText =
    "Available commands:\n" +
    "  about         — quick bio\n" +
    "  skills        — what I work with\n" +
    "  projects      — what I've built\n" +
    "  certificates  — what I've completed\n" +
    "  education     — where I've studied\n" +
    "  contact       — how to reach me\n" +
    "  clear         — clear the terminal\n" +
    "  help          — show this list";

  function appendLine(html) {
    var div = document.createElement("div");
    div.className = "term-line";
    div.innerHTML = html;
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  }

  function runCommand(raw) {
    var cmd = raw.trim().toLowerCase();
    appendLine('<span class="term-prompt">guest@rishabh:~$</span> <span class="term-cmd">' + escapeHtml(raw) + "</span>");

    if (!cmd) return;

    if (cmd === "clear") {
      termBody.innerHTML = "";
      return;
    }
    if (cmd === "help") {
      appendLine('<span class="term-hint">' + escapeHtml(helpText).replace(/\n/g, "<br>") + "</span>");
      return;
    }
    if (termData[cmd]) {
      appendLine(escapeHtml(termData[cmd]).replace(/\n/g, "<br>"));
      return;
    }
    appendLine('<span class="term-hint">command not found: ' + escapeHtml(cmd) + '. Type </span><span class="term-accent">help</span>');
  }

  if (termInput) {
    termInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var val = termInput.value;
        termInput.value = "";
        runCommand(val);
      }
    });
  }

  /* ---------------- Back to top ---------------- */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    function toggleBackToTop() {
      backToTop.classList.toggle("visible", window.scrollY > 480);
    }
    toggleBackToTop();
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
