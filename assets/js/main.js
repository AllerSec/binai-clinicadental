/* ============================================================
   BINAI · Centro Odontológico — Interactions
   GSAP + ScrollTrigger + Lenis (loaded via CDN before this file)
   ============================================================ */
(function () {
  "use strict";

  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) root.classList.add("reduced");

  const hasGSAP = typeof window.gsap !== "undefined";
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* -------------------------------------------------
     1 · Page loader — only the first visit per session
  -------------------------------------------------- */
  function initLoader() {
    const loader = document.querySelector(".loader");
    if (!loader) return;
    const seen = sessionStorage.getItem("binai_loaded");

    // Skip entirely on repeat visits or reduced motion. Does NOT depend on GSAP.
    if (seen || reduced) {
      loader.remove();
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";

    // The draw + fill animation is pure CSS. JS only releases the page.
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      sessionStorage.setItem("binai_loaded", "1");
      loader.classList.add("is-done");
      document.body.style.overflow = "";
      setTimeout(() => { if (loader.parentNode) loader.remove(); }, 700);
    };
    // Normal path: hide after the CSS animation (~2.2s). Failsafe identical timing,
    // so a missing GSAP/CDN can never trap the page.
    setTimeout(release, 2200);
  }

  /* -------------------------------------------------
     2 · Lenis smooth scroll synced with ScrollTrigger
  -------------------------------------------------- */
  function initSmoothScroll() {
    // Native scroll only — reliable on every device and never hijacks the page.
    // (Lenis was removed: smooth-scroll libraries are a common source of
    //  "can't scroll" issues, especially on mobile/older devices.)
    // CSS `scroll-behavior: smooth` + `scroll-margin-top` handle anchor jumps.
    return null;
  }

  /* -------------------------------------------------
     3 · Header scroll state
  -------------------------------------------------- */
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------------------------------------------------
     4 · Mobile nav
  -------------------------------------------------- */
  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const panel = document.querySelector("[data-mobile-menu]");
    if (!toggle || !panel) return;
    const close = () => { toggle.setAttribute("aria-expanded", "false"); panel.hidden = true; document.body.style.overflow = ""; };
    const open = () => { toggle.setAttribute("aria-expanded", "true"); panel.hidden = false; document.body.style.overflow = "hidden"; };
    toggle.addEventListener("click", () =>
      toggle.getAttribute("aria-expanded") === "true" ? close() : open()
    );
    panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* -------------------------------------------------
     5 · Reveal animations (varied, not one uniform fade)
  -------------------------------------------------- */
  function initReveals() {
    if (!hasGSAP || !window.ScrollTrigger) {
      document.querySelectorAll(".reveal").forEach((el) => (el.style.opacity = 1));
      return;
    }
    if (reduced) {
      gsap.set(".reveal", { opacity: 1, y: 0, clearProps: "all" });
      document.querySelectorAll(".clip-reveal").forEach((el) => (el.style.clipPath = "inset(0 0 0 0)"));
      return;
    }

    // generic upward reveals with subtle stagger by group
    gsap.utils.toArray(".reveal").forEach((el) => {
      const delay = parseFloat(el.dataset.delay || 0);
      gsap.fromTo(el, { autoAlpha: 0, y: 34 }, {
        autoAlpha: 1, y: 0, duration: 0.9, delay, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%", once: true },
      });
    });

    // staggered children
    gsap.utils.toArray("[data-stagger]").forEach((group) => {
      const items = group.children;
      gsap.fromTo(items, { autoAlpha: 0, y: 40 }, {
        autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: group, start: "top 82%", once: true },
      });
    });

    // image clip reveals
    gsap.utils.toArray(".clip-reveal").forEach((el) => {
      gsap.fromTo(el, { clipPath: "inset(0 100% 0 0)" }, {
        clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power3.inOut",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });

    // hero entrance
    const heroTL = gsap.timeline({ delay: reduced ? 0 : 0.15 });
    const heroWords = document.querySelectorAll("[data-hero-line]");
    if (heroWords.length) {
      heroTL.fromTo(heroWords, { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power4.out", stagger: 0.12 });
    }
    heroTL.fromTo("[data-hero-fade]", { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 }, "-=0.6");

    // parallax on hero media + subpage banners
    gsap.utils.toArray("[data-parallax]").forEach((el) => {
      gsap.to(el, {
        yPercent: 12, ease: "none",
        scrollTrigger: { trigger: el.closest("section") || el, start: "top top", end: "bottom top", scrub: true },
      });
    });

    // SAFETY NET: content must never stay invisible. If ScrollTrigger fails to
    // fire for any element (hidden tab, headless, render quirk), force every
    // reveal visible shortly after load so no section ships blank.
    const forceVisible = () => {
      document.querySelectorAll(".reveal, [data-stagger] > *").forEach((el) => {
        if (getComputedStyle(el).visibility === "hidden" || parseFloat(getComputedStyle(el).opacity) < 0.05) {
          gsap.set(el, { autoAlpha: 1, y: 0, clearProps: "transform" });
        }
      });
      document.querySelectorAll(".clip-reveal").forEach((el) => {
        if (getComputedStyle(el).clipPath.indexOf("100%") > -1) el.style.clipPath = "inset(0 0 0 0)";
      });
    };
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
      setTimeout(forceVisible, 1200);
    });
  }

  /* -------------------------------------------------
     6 · Animated counters
  -------------------------------------------------- */
  function initCounters() {
    const nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    nums.forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      // Don't count years (1900+) or tiny values (≤2): they look broken animating.
      const skip = target >= 1900 || target <= 2;
      if (reduced || !hasGSAP || skip) { el.textContent = target + suffix; return; }
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: "power2.out",
        onUpdate() { el.textContent = Math.round(obj.v) + suffix; },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });
  }

  /* -------------------------------------------------
     7 · Cursor-reactive hero glow
  -------------------------------------------------- */
  function initHeroGlow() {
    const glow = document.querySelector(".hero__glow");
    const hero = document.querySelector(".hero");
    if (!glow || !hero || reduced || matchMedia("(pointer: coarse)").matches) return;
    let raf = null;
    hero.addEventListener("pointermove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        glow.style.left = e.clientX - r.left + "px";
        glow.style.top = e.clientY - r.top + "px";
        raf = null;
      });
    });
  }

  /* -------------------------------------------------
     8 · "Abierto ahora" — opening hours status
  -------------------------------------------------- */
  function initOpenStatus() {
    const el = document.querySelector("[data-open-status]");
    if (!el) return;
    // L-V 8:30-13:30 & 15:00-20:00 ; S 9:00-14:00 ; D cerrado
    const now = new Date();
    const day = now.getDay(); // 0 dom .. 6 sab
    const mins = now.getHours() * 60 + now.getMinutes();
    const within = (a, b) => mins >= a && mins < b;
    let open = false;
    if (day >= 1 && day <= 5) open = within(510, 810) || within(900, 1200);
    else if (day === 6) open = within(540, 840);
    el.textContent = open ? "Abierto ahora" : "Cerrado ahora";
    el.classList.add(open ? "is-open" : "is-closed");
    el.dataset.state = open ? "open" : "closed";
  }

  /* -------------------------------------------------
     8b · current year
  -------------------------------------------------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* -------------------------------------------------
     Boot
  -------------------------------------------------- */
  function boot() {
    initLoader();
    initSmoothScroll();
    initHeader();
    initMobileNav();
    initReveals();
    initCounters();
    initHeroGlow();
    initOpenStatus();
    initYear();
    if (hasGSAP && window.ScrollTrigger) {
      window.addEventListener("load", () => ScrollTrigger.refresh());
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
