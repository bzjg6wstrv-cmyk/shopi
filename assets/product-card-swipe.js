/* Horizontale Produktreihe: Pfeile, Fortschrittspunkte, Tastaturbedienung.
   Das Scrollen selbst macht der Browser (CSS Scroll Snap) – dieses Skript
   ergänzt nur Bedienelemente und ist vollständig optional. */
(function () {
  'use strict';

  document.querySelectorAll('[data-product-row]').forEach(function (row) {
    var track = row.querySelector('[data-row-track]');
    var dots = row.querySelector('[data-row-dots]');
    var arrows = document.querySelector('[data-row-arrows]');
    var prev = document.querySelector('[data-row-prev]');
    var next = document.querySelector('[data-row-next]');
    if (!track) return;

    var items = Array.prototype.slice.call(track.children);
    if (items.length < 2) return;

    if (arrows) arrows.hidden = false;

    /* Fortschrittspunkte aufbauen */
    if (dots) {
      items.forEach(function () {
        var dot = document.createElement('span');
        dot.className = 'row-dot';
        dots.appendChild(dot);
      });
    }

    function step() {
      var first = items[0];
      var gap = parseFloat(window.getComputedStyle(track).columnGap || '0');
      return first.getBoundingClientRect().width + gap;
    }

    function updateArrows() {
      if (!prev || !next) return;
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    }

    if (prev) {
      prev.addEventListener('click', function () {
        track.scrollBy({ left: -step(), behavior: 'smooth' });
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        track.scrollBy({ left: step(), behavior: 'smooth' });
      });
    }

    track.addEventListener('scroll', function () {
      window.requestAnimationFrame(updateArrows);
    });
    window.addEventListener('resize', updateArrows);
    updateArrows();

    /* Aktiven Punkt setzen */
    if (dots && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var index = items.indexOf(entry.target);
            Array.prototype.forEach.call(dots.children, function (dot, i) {
              dot.classList.toggle('is-active', i === index);
            });
          });
        },
        { root: track, threshold: 0.6 }
      );
      items.forEach(function (item) {
        observer.observe(item);
      });
    }

    /* Fokus per Tastatur scrollt die Kachel in den Blick. */
    track.addEventListener('focusin', function (event) {
      var item = event.target.closest('li');
      if (item && typeof item.scrollIntoView === 'function') {
        item.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      }
    });
  });
})();
