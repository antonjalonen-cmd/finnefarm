(function () {
  "use strict";

  var root = document.documentElement;

  var STRINGS = {
    title: {
      fi: "FinneFarm – Luomuvihanneksia ja yrttejä Sulvasta",
      sv: "FinneFarm – Ekologiska grönsaker och örter från Solf",
      en: "FinneFarm – Organic Vegetables and Herbs from Solf"
    },
    desc: {
      fi: "FinneFarm viljelee vihanneksia, yrttejä, kuminaa ja viljaa Sulvassa, Mustasaaressa. Perheyritys, jota pyörittävät puutarhurit Christer ja Rosmarie Finne.",
      sv: "FinneFarm odlar grönsaker, örter, kummin och spannmål i Solf, Korsholm. Ett familjeföretag som drivs av trädgårdsmästarna Christer och Rosmarie Finne.",
      en: "FinneFarm grows vegetables, herbs, caraway and grain in Solf, Korsholm. A family business run by trained gardeners Christer and Rosmarie Finne."
    }
  };

  function setLanguage(lang) {
    if (["fi", "sv", "en"].indexOf(lang) === -1) lang = "fi";
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    document.title = STRINGS.title[lang];
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", STRINGS.desc[lang]);

    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      var active = btn.getAttribute("data-lang-btn") === lang;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    try { localStorage.setItem("finnefarm-lang", lang); } catch (e) {}
  }

  function initLanguage() {
    /* Finnish is always the default on a first-time visit.
       Only an explicit prior choice via the switcher changes that. */
    var stored = null;
    try { stored = localStorage.getItem("finnefarm-lang"); } catch (e) {}
    setLanguage(stored || "fi");
  }

  document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLanguage(btn.getAttribute("data-lang-btn"));
      var nav = document.querySelector("[data-nav]");
      var toggle = document.querySelector("[data-nav-toggle]");
      if (nav && nav.classList.contains("open")) { nav.classList.remove("open"); toggle.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  });

  initLanguage();

  var header = document.querySelector("[data-header]");
  function onScroll() {
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
