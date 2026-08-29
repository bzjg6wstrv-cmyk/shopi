/* Horizontale Produktreihe: Pfeile, Fortschrittslinie, Tastaturbedienung.
   Das Scrollen selbst macht der Browser (CSS Scroll Snap) – dieses Skript
   ergänzt nur Bedienelemente und ist vollständig optional. */
(function () {
  'use strict';

  document.querySelectorAll('[data-product-row]').forEach(function (row) {
    var track = row.querySelector('[data-row-track]');
    var progress = row.querySelector('[data-row-progress]');
    var progressBar = row.querySelector('[data-row-progress-bar]');
    /* Die Steuerung steht im Abschnittskopf, also ausserhalb der Bahn –
       gesucht wird deshalb im umgebenden Abschnitt und nicht im ganzen
       Dokument. Sonst greift eine zweite Reihe auf derselben Seite (etwa
       die Produktgalerie) auf fremde Pfeile zu. */
    var scope = row.closest('.shopify-section') || document;
    var arrows = scope.querySelector('[data-row-arrows]');
    var prev = scope.querySelector('[data-row-prev]');
    var next = scope.querySelector('[data-row-next]');
    if (!track) return;

    var items = Array.prototype.slice.call(track.children);
    if (items.length < 2) return;

    if (arrows) arrows.hidden = false;

    /* Zähler und Vorschauen der Produktgalerie. Beide sind optional: Fehlt
       die Auszeichnung, läuft der Rest unverändert weiter. */
    var count = row.querySelector('[data-row-count]');
    var countValue = row.querySelector('[data-row-count-current]');
    var thumbs = row.querySelector('[data-media-thumbs]');
    var thumbButtons = thumbs
      ? Array.prototype.slice.call(thumbs.querySelectorAll('[data-media-target]'))
      : [];
    var aktiv = -1;

    /* Fortschrittslinie: Der helle Balken entspricht dem sichtbaren
       Ausschnitt der Reihe und wandert mit dem Scrollen. Passt alles ohne
       Scrollen hinein, bleibt die Linie ausgeblendet. */
    function fortschritt() {
      if (!progress || !progressBar) return;
      var gesamt = track.scrollWidth;
      var sichtbar = track.clientWidth;
      if (gesamt <= sichtbar + 2) {
        progress.hidden = true;
        return;
      }
      progress.hidden = false;
      var anteil = Math.max(0.08, Math.min(1, sichtbar / gesamt));
      progressBar.style.width = (anteil * 100).toFixed(2) + '%';
      var weg = track.scrollLeft / (gesamt - sichtbar);
      progressBar.style.transform = 'translateX(' + (weg * (100 / anteil - 100)).toFixed(2) + '%)';
    }

    /* Welches Bild liegt im Blick? Der Abstand vom linken Rand der Bahn zum
       linken Rand jedes Bildes, geteilt durch eine Schrittbreite. */
    function stand() {
      if (!count && !thumbButtons.length) return;
      var breite = step();
      if (!breite) return;
      var index = Math.round(track.scrollLeft / breite);
      if (index < 0) index = 0;
      if (index > items.length - 1) index = items.length - 1;
      if (index === aktiv) return;
      aktiv = index;
      if (countValue) countValue.textContent = String(index + 1);
      thumbButtons.forEach(function (button, i) {
        var an = i === index;
        button.classList.toggle('is-active', an);
        if (an) {
          button.setAttribute('aria-current', 'true');
        } else {
          button.removeAttribute('aria-current');
        }
      });
    }

    thumbButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var ziel = track.querySelector(
          '[data-media-id="' + button.getAttribute('data-media-target') + '"]'
        );
        if (!ziel) return;
        ziel.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      });
    });

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

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateArrows();
        fortschritt();
        stand();
        ticking = false;
      });
    }, { passive: true });
    window.addEventListener('resize', function () {
      updateArrows();
      fortschritt();
      aktiv = -1;
      stand();
    });
    updateArrows();
    fortschritt();
    stand();

    /* Fokus per Tastatur scrollt die Kachel in den Blick. */
    track.addEventListener('focusin', function (event) {
      var item = event.target.closest('li');
      if (item && typeof item.scrollIntoView === 'function') {
        item.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      }
    });
  });
})();
