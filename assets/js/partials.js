/* ============================================================
   BINAI — Shared partials injected on every page
   (sprite, header, mobile menu, mobile bar, footer)
   Runs before main.js. Uses data-page on <body> for active nav.
   BASE is resolved so it works from / and /legal/ alike.
   ============================================================ */
(function () {
  "use strict";

  // Resolve base path: pages in /legal/ need "../"
  var depth = (location.pathname.match(/\/(legal|blog)\//)) ? "../" : "";
  var BASE = document.documentElement.getAttribute("data-base") || depth;
  var page = document.body.getAttribute("data-page") || "";

  var TEL = "943612831";
  var MOV = "685757042";
  var WA = "34685757042";
  var MAPS = "https://www.google.com/maps/dir/?api=1&destination=Jose+Eguino+2+Irun+20302";

  function cur(name) { return page === name ? ' aria-current="page"' : ""; }

  /* ---- SVG sprite (inline so CSS animations + same-doc <use> work) ---- */
  var SPRITE =
'<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">' +
'<symbol id="i-mark" viewBox="0 0 100 80"><path d="M50 14c-9-10-22-12-30-6C9 16 6 30 12 46c4 11 9 22 14 22 6 0 6-12 12-12s7 12 13 12c5 0 10-12 14-23 6-15 3-29-8-37-8-6-21-3-30 6Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/></symbol>' +
'<symbol id="i-implante" viewBox="0 0 64 64"><path d="M22 8h20l-2 8H24l-2-8Z" fill="currentColor"/><rect x="28" y="14" width="8" height="6" fill="currentColor"/><path d="M30 20h4l-1 10h-2l-1-10Z" fill="currentColor"/><path d="M28 30h8l-1 8h-6l-1-8ZM29 38h6l-1 8h-4l-1-8ZM30 46h4l-2 12-2-12Z" fill="currentColor"/><g opacity="0.55"><path d="M26 22h12M27 26h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></g></symbol>' +
'<symbol id="i-ortodoncia" viewBox="0 0 64 64"><path d="M12 26c0-6 9-10 20-10s20 4 20 10c0 10-8 22-20 22S12 36 12 26Z" fill="none" stroke="currentColor" stroke-width="3"/><path class="svg-draw" pathLength="1" d="M18 28h28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><g fill="currentColor"><rect x="20" y="24" width="5" height="8" rx="1.5"/><rect x="29.5" y="24" width="5" height="8" rx="1.5"/><rect x="39" y="24" width="5" height="8" rx="1.5"/></g></symbol>' +
'<symbol id="i-estetica" viewBox="0 0 64 64"><path d="M32 12c-6-6-14-7-19-3-7 6-9 16-5 26 3 7 6 15 9 15 4 0 4-8 8-8s4 8 8 8c3 0 6-8 9-15 4-10 2-20-5-26-5-4-13-3-19 3Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><g fill="currentColor"><path class="svg-sparkle" d="M48 14l1.6 4 4 1.6-4 1.6L48 27l-1.6-5.8-4-1.6 4-1.6L48 14Z"/><path class="svg-sparkle s2" d="M22 20l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1 1-2.6Z"/><circle class="svg-sparkle s3" cx="40" cy="30" r="2"/></g></symbol>' +
'<symbol id="i-protesis" viewBox="0 0 64 64"><rect x="12" y="14" width="40" height="36" rx="4" fill="none" stroke="currentColor" stroke-width="3"/><path d="M22 40c0-7 4-12 10-12s10 5 10 12" fill="none" stroke="currentColor" stroke-width="3"/><g fill="currentColor"><circle cx="26" cy="34" r="2"/><circle cx="32" cy="32" r="2"/><circle cx="38" cy="34" r="2"/></g><rect class="svg-scan" x="14" y="18" width="36" height="3" rx="1.5" fill="currentColor" opacity="0.5"/></symbol>' +
'<symbol id="i-padi" viewBox="0 0 64 64"><path d="M32 8l20 7v14c0 13-9 22-20 27-11-5-20-14-20-27V15l20-7Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><path class="svg-heart" d="M32 42c-7-5-11-9-11-15 0-3.5 2.6-6 6-6 2.4 0 4 1.4 5 3 1-1.6 2.6-3 5-3 3.4 0 6 2.5 6 6 0 6-4 10-11 15Z" fill="currentColor"/></symbol>' +
'<symbol id="i-general" viewBox="0 0 64 64"><path d="M32 12c-6-6-14-7-19-3-7 6-9 16-5 26 3 7 6 15 9 15 4 0 4-8 8-8s4 8 8 8c3 0 6-8 9-15 4-10 2-20-5-26-5-4-13-3-19 3Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><path class="svg-draw" pathLength="1" d="M25 30l5 6 10-12" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>' +
'<symbol id="i-radio" viewBox="0 0 64 64"><circle cx="32" cy="32" r="5" fill="currentColor"/><circle class="svg-ripple" cx="32" cy="32" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle class="svg-ripple r2" cx="32" cy="32" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle class="svg-ripple r3" cx="32" cy="32" r="4" fill="none" stroke="currentColor" stroke-width="2"/></symbol>' +
'<symbol id="i-phone" viewBox="0 0 24 24"><path d="M6.6 2.4l3 .6c.5.1.9.5 1 1l.7 3a1.3 1.3 0 01-.4 1.3L9.2 11a13 13 0 005.8 5.8l1.7-1.7c.4-.4.9-.5 1.3-.4l3 .7c.5.1.9.5 1 1l.6 3a1.3 1.3 0 01-1.3 1.6A18 18 0 013.7 4.7 1.3 1.3 0 015.3 3.4z" fill="currentColor"/></symbol>' +
'<symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2zm5.8 14.2c-.2.7-1.4 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.6-.6-2.9-1.3-4.8-4.2-4.9-4.4-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.3c-.2.2-.3.4-.1.7.2.3.9 1.5 2 2.4 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.7-.1l.9-1c.2-.2.4-.2.6-.1l2 1c.3.1.4.2.5.3.1.2.1.7-.1 1.4z" fill="currentColor"/></symbol>' +
'<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" fill="currentColor"/></symbol>' +
'<symbol id="i-mail" viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 7L4 7v1l8 5 8-5V7l-8 5z" fill="currentColor"/></symbol>' +
'<symbol id="i-clock" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10V6h-2v7h6v-2h-4z" fill="currentColor"/></symbol>' +
'<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>' +
'<symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12l4 5 10-12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></symbol>' +
'<symbol id="i-star" viewBox="0 0 24 24"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9.1l6.9-.8L12 2z" fill="currentColor"/></symbol>' +
'<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></symbol>' +
'<symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></symbol>' +
'<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.5 12l2.5 2.5L16 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>' +
'<symbol id="i-lab" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></symbol>' +
'<symbol id="i-tooth" viewBox="0 0 24 24"><path d="M12 4c-2-2-5-2.4-7-1C2.5 5 1.8 9 3.5 13c1.2 2.8 2 6 3.5 6 1.5 0 1.4-4 2.5-4s1 4 2.5 4c1.5 0 2.3-3.2 3.5-6 1.7-4 1-8-1.5-10-2-1.4-5-1-7 1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>' +
'</svg>';

  function logo() {
    return '<a class="brand-logo" href="' + BASE + 'index.html" aria-label="Clínica Dental Binai — inicio">' +
      '<svg viewBox="0 0 100 80" aria-hidden="true"><use href="#i-mark"/></svg>' +
      '<span class="brand-logo__text"><span class="brand-logo__name">BINAI</span>' +
      '<span class="brand-logo__sub">Centro Odontológico</span></span></a>';
  }

  var HEADER =
    '<a class="skip-link" href="#main">Saltar al contenido</a>' +
    '<header class="site-header"><div class="container container--wide site-header__inner">' +
      logo() +
      '<nav class="nav" aria-label="Principal"><div class="nav__links">' +
        '<a class="nav__link" href="' + BASE + 'index.html"' + cur("inicio") + '>Inicio</a>' +
        '<a class="nav__link" href="' + BASE + 'tratamientos.html"' + cur("tratamientos") + '>Tratamientos</a>' +
        '<a class="nav__link" href="' + BASE + 'la-clinica.html"' + cur("clinica") + '>La Clínica</a>' +
        '<a class="nav__link" href="' + BASE + 'opiniones.html"' + cur("opiniones") + '>Opiniones</a>' +
        '<a class="nav__link" href="' + BASE + 'blog.html"' + cur("blog") + '>Blog</a>' +
        '<a class="nav__link" href="' + BASE + 'contacto.html"' + cur("contacto") + '>Contacto</a>' +
      '</div>' +
      '<div class="lang-switch desktop-only"><a href="' + BASE + 'index.html" aria-current="true" hreflang="es">ES</a>' +
        '<a href="' + BASE + 'index.html" hreflang="eu" aria-disabled="true" title="Euskara — próximamente">EU</a></div>' +
      '<a class="btn btn--call nav__cta" href="tel:+34' + TEL + '"><svg aria-hidden="true"><use href="#i-phone"/></svg>Pedir cita</a>' +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Abrir menú">' +
        '<svg aria-hidden="true"><use href="#i-menu"/></svg></button>' +
      '</nav></div></header>' +
    '<div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>' +
      '<nav aria-label="Móvil"><a href="' + BASE + 'index.html"' + cur("inicio") + '>Inicio</a>' +
      '<a href="' + BASE + 'tratamientos.html"' + cur("tratamientos") + '>Tratamientos</a>' +
      '<a href="' + BASE + 'la-clinica.html"' + cur("clinica") + '>La Clínica</a>' +
      '<a href="' + BASE + 'opiniones.html"' + cur("opiniones") + '>Opiniones</a>' +
      '<a href="' + BASE + 'blog.html"' + cur("blog") + '>Blog</a>' +
      '<a href="' + BASE + 'contacto.html"' + cur("contacto") + '>Contacto</a>' +
      '<a class="btn" href="tel:+34' + TEL + '">Llamar 943 612 831</a></nav></div>';

  var MOBILEBAR =
    '<nav class="mobile-bar" aria-label="Acciones rápidas">' +
      '<a href="tel:+34' + TEL + '"><svg aria-hidden="true"><use href="#i-phone"/></svg>Llamar</a>' +
      '<a href="https://wa.me/' + WA + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-whatsapp"/></svg>WhatsApp</a>' +
      '<a href="' + MAPS + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-pin"/></svg>Cómo llegar</a>' +
    '</nav>';

  var FOOTER =
    '<footer class="site-footer"><div class="container container--wide"><div class="footer-grid">' +
      '<div class="footer-col footer-brand">' + logo() +
        '<p>Centro odontológico y laboratorio de prótesis dental propio en Irun, junto al Ambulatorio de Elitxu. Tu salud bucal en buenas manos.</p></div>' +
      '<div class="footer-col"><h4>Tratamientos</h4><ul>' +
        '<li><a href="' + BASE + 'tratamientos.html#implantologia">Implantología</a></li>' +
        '<li><a href="' + BASE + 'tratamientos.html#ortodoncia">Ortodoncia · Invisalign</a></li>' +
        '<li><a href="' + BASE + 'tratamientos.html#estetica">Estética dental</a></li>' +
        '<li><a href="' + BASE + 'tratamientos.html#protesis">Laboratorio de prótesis</a></li>' +
        '<li><a href="' + BASE + 'tratamientos.html#padi">P.A.D.I. Osakidetza</a></li>' +
      '</ul></div>' +
      '<div class="footer-col"><h4>Enlaces</h4><ul>' +
        '<li><a href="' + BASE + 'index.html">Inicio</a></li>' +
        '<li><a href="' + BASE + 'la-clinica.html">La Clínica</a></li>' +
        '<li><a href="' + BASE + 'opiniones.html">Opiniones</a></li>' +
        '<li><a href="' + BASE + 'blog.html">Blog</a></li>' +
        '<li><a href="' + BASE + 'contacto.html">Contacto</a></li>' +
        '<li><a href="' + BASE + 'legal/aviso-legal.html">Aviso Legal</a></li>' +
        '<li><a href="' + BASE + 'legal/politica-de-privacidad.html">Política de Privacidad</a></li>' +
        '<li><a href="' + BASE + 'legal/politica-de-cookies.html">Política de Cookies</a></li>' +
      '</ul></div>' +
      '<div class="footer-col"><h4>Contacto</h4><ul>' +
        '<li><a href="tel:+34' + TEL + '">943 612 831</a></li>' +
        '<li><a href="tel:+34' + MOV + '">685 757 042</a></li>' +
        '<li><a href="mailto:clinicabinai@gmail.com">clinicabinai@gmail.com</a></li>' +
        '<li>José Eguino, 2 - 1ºA<br>20302 Irun (Gipuzkoa)</li>' +
        '<li>L-V 8:30-13:30 / 15:00-20:00<br>S 9:00-14:00</li>' +
      '</ul></div>' +
    '</div><div class="footer-bottom">' +
      '<span>© <span data-year>2026</span> Clínica Dental Binai · Centro Odontológico Binai S.L. — Todos los derechos reservados</span>' +
      '<span>Diseñado por <a href="https://unaxaller.com" target="_blank" rel="noopener">unaxaller.com</a></span>' +
    '</div></div></footer>';

  function inject(sel, html, where) {
    var el = document.querySelector(sel);
    if (el) el.insertAdjacentHTML(where || "afterbegin", html);
  }

  // Sprite + header at top of body, footer + bar at end
  document.body.insertAdjacentHTML("afterbegin", SPRITE + HEADER);
  document.body.insertAdjacentHTML("beforeend", FOOTER + MOBILEBAR);
})();
