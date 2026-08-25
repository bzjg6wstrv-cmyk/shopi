/* ==========================================================================
   VC-DIAGNOSE – TEMPORÄRE TESTDATEI
   Zweck: auf einem echten iPhone beweisen, ob die mobile Beratungsleiste
   im DOM liegt, ob das Theme-Skript läuft und ob sie sichtbar gemacht
   werden kann.

   Diese Datei verändert kein CSS und kein anderes Skript. Sie liest nur den
   Zustand aus und setzt im Testfall Inline-Stile direkt am Element.

   VOR DEM LIVEGANG ENTFERNEN:
     1. assets/vc-diagnose.js löschen
     2. die zugehörige <script>-Zeile in layout/theme.liquid löschen

   Abschalten ohne Löschen: ?vc-diag=0 an die Adresse hängen.
   ========================================================================== */
(function () {
  'use strict';

  /* Läuft als erstes deferred Skript – noch vor theme.js. Dadurch werden
     Fehler aus theme.js hier mitgeschnitten und der Sitzungsspeicher kann
     geleert werden, bevor theme.js ihn ausliest. */

  var fehler = [];
  window.addEventListener('error', function (e) {
    var datei = (e.filename || '?').split('/').pop().split('?')[0];
    fehler.push((e.message || 'Fehler') + ' [' + datei + ':' + (e.lineno || '?') + ']');
  });
  window.addEventListener('unhandledrejection', function (e) {
    fehler.push('Promise: ' + (e.reason && e.reason.message ? e.reason.message : e.reason));
  });

  var aus = window.location.search.indexOf('vc-diag=0') !== -1;
  if (aus) return;

  /* Punkt 9: Ein früherer Test darf die Diagnose nicht blockieren.
     Der Schlüssel wird geleert, bevor theme.js ihn liest. */
  var warAusgeblendet = null;
  try {
    warAusgeblendet = window.sessionStorage.getItem('vc-wa-dismissed');
    window.sessionStorage.removeItem('vc-wa-dismissed');
  } catch (e) {
    warAusgeblendet = 'Zugriff nicht möglich';
  }

  var istMobil = function () {
    return window.matchMedia('(max-width: 989px)').matches;
  };

  /* --- Punkt 8: Vorfahren auf Stacking-/Containment-Eigenschaften prüfen --- */
  function vorfahrenBefund(el) {
    var treffer = [];
    var eigenschaften = ['transform', 'filter', 'perspective', 'contain', 'willChange', 'backdropFilter', 'overflow', 'display', 'visibility', 'contentVisibility'];
    var node = el && el.parentElement;
    while (node) {
      var cs = window.getComputedStyle(node);
      var name = node.tagName.toLowerCase() + (node.id ? '#' + node.id : '') + (node.className && typeof node.className === 'string' ? '.' + node.className.trim().split(/\s+/)[0] : '');
      eigenschaften.forEach(function (p) {
        var v = cs[p];
        if (!v) return;
        if (p === 'transform' && v !== 'none') treffer.push(name + ' transform');
        if (p === 'filter' && v !== 'none') treffer.push(name + ' filter');
        if (p === 'perspective' && v !== 'none') treffer.push(name + ' perspective');
        if (p === 'contain' && v !== 'none' && v !== 'normal') treffer.push(name + ' contain:' + v);
        if (p === 'willChange' && v !== 'auto') treffer.push(name + ' will-change:' + v);
        if (p === 'backdropFilter' && v !== 'none') treffer.push(name + ' backdrop-filter');
        if (p === 'overflow' && v !== 'visible') treffer.push(name + ' overflow:' + v);
        if (p === 'display' && v === 'none') treffer.push(name + ' display:none');
        if (p === 'visibility' && v === 'hidden') treffer.push(name + ' visibility:hidden');
        if (p === 'contentVisibility' && v === 'hidden') treffer.push(name + ' content-visibility:hidden');
      });
      node = node.parentElement;
    }
    return treffer;
  }

  /* --- Zwangsdarstellung: genau die vom Auftrag geforderten Werte --------- */
  var ZWANG = {
    position: 'fixed',
    left: '0px',
    right: '0px',
    bottom: '0px',
    top: 'auto',
    display: 'grid',
    visibility: 'visible',
    opacity: '1',
    transform: 'none',
    'z-index': '2147483647',
    /* Damit die Leiste auch dann lesbar ist, wenn eine Farbvariable fehlt. */
    'background-color': '#141210',
    color: '#F5F2ED',
    'pointer-events': 'auto',
    filter: 'none',
    'clip-path': 'none',
    margin: '0px',
    'max-height': 'none',
    'content-visibility': 'visible'
  };

  function zwangSetzen(bar) {
    Object.keys(ZWANG).forEach(function (k) {
      bar.style.setProperty(k, ZWANG[k], 'important');
    });
  }
  function zwangLoesen(bar) {
    Object.keys(ZWANG).forEach(function (k) {
      bar.style.removeProperty(k);
    });
  }

  /* --- Anzeigefeld -------------------------------------------------------- */
  var feld;
  function feldAufbauen() {
    feld = document.createElement('div');
    feld.setAttribute('data-vc-diagnose', '');
    feld.style.cssText = [
      'position:fixed', 'left:0', 'right:0', 'bottom:74px',
      'z-index:2147483646', 'margin:0', 'padding:8px 10px',
      'background:rgba(0,0,0,.88)', 'color:#7CFC9A',
      'font:11px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace',
      'white-space:pre-wrap', 'max-height:46vh', 'overflow:auto',
      '-webkit-overflow-scrolling:touch', 'pointer-events:auto'
    ].join(';');
    document.body.appendChild(feld);
  }

  function ja(b) { return b ? 'JA' : 'NEIN'; }

  function aktualisieren() {
    var bar = document.querySelector('[data-whatsapp-bar]');
    var hero = document.querySelector('.hero2');
    var heroUnten = hero ? Math.round(hero.getBoundingClientRect().bottom) : null;
    var verlassen = hero ? heroUnten <= 0 : null;
    var zeilen = [];

    zeilen.push('VC-DIAGNOSE  ( ?vc-diag=0 schaltet ab )');
    zeilen.push('1 theme.js gelaufen: ' + ja(typeof window.VC === 'object') +
                '   Leisten-Block: ' + ja(document.body.classList.contains('has-whatsapp-bar')));
    zeilen.push('2 JS-Fehler: ' + (fehler.length ? fehler.join(' | ') : 'keine'));
    zeilen.push('3 [data-whatsapp-bar] im DOM: ' + ja(!!bar));

    if (!bar) {
      zeilen.push('   -> Element fehlt. Entweder rendert das Snippet nicht,');
      zeilen.push('      oder theme.js hat es entfernt (Sitzung/Sticky-ATC).');
      zeilen.push('9 sessionStorage vc-wa-dismissed war: ' + (warAusgeblendet === null ? 'nicht gesetzt' : warAusgeblendet) + ' (geleert)');
      feld.textContent = zeilen.join('\n');
      return;
    }

    var cs = window.getComputedStyle(bar);
    var r = bar.getBoundingClientRect();
    var vh = window.innerHeight;
    var vv = window.visualViewport;
    var sichtbar = r.top < vh && r.bottom > 0 && r.width > 0 && r.height > 0 &&
                   cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0;

    zeilen.push('4 hidden entfernt: ' + ja(!bar.hidden));
    zeilen.push('5 .hero2 gefunden: ' + ja(!!hero) + '  bottom: ' + heroUnten +
                '  verlassen: ' + (verlassen === null ? '-' : ja(verlassen)));
    zeilen.push('6 is-visible gesetzt: ' + ja(bar.classList.contains('is-visible')));
    zeilen.push('7 pos=' + cs.position + ' disp=' + cs.display + ' vis=' + cs.visibility +
                ' op=' + cs.opacity + ' z=' + cs.zIndex);
    zeilen.push('  transform=' + cs.transform + ' bottom=' + cs.bottom);
    zeilen.push('  rect top=' + Math.round(r.top) + ' h=' + Math.round(r.height) +
                ' w=' + Math.round(r.width) + '  vh=' + vh +
                (vv ? '  visualVP=' + Math.round(vv.height) + ' off=' + Math.round(vv.offsetTop) : ''));
    zeilen.push('  im Viewport sichtbar: ' + ja(sichtbar));

    var oben = document.elementFromPoint(Math.round(window.innerWidth / 2), Math.round(vh - 20));
    zeilen.push('  unten am Punkt liegt: ' + (oben ? (oben.tagName + '.' + (typeof oben.className === 'string' ? oben.className.trim().split(/\s+/)[0] : '')) : '-') +
                '  = Leiste: ' + ja(!!(oben && bar.contains(oben))));

    var v = vorfahrenBefund(bar);
    zeilen.push('8 Vorfahren-Befunde: ' + (v.length ? v.join(' | ') : 'keine'));
    zeilen.push('9 sessionStorage vc-wa-dismissed war: ' + (warAusgeblendet === null ? 'nicht gesetzt' : warAusgeblendet) + ' (geleert)');
    zeilen.push('Zwangsmodus aktiv: ' + ja(bar.style.getPropertyValue('z-index') === '2147483647'));

    feld.textContent = zeilen.join('\n');

    /* Zwangsdarstellung nur mobil und nur nach dem Hero. */
    if (istMobil() && (verlassen === null ? window.pageYOffset > vh : verlassen)) {
      zwangSetzen(bar);
    } else {
      zwangLoesen(bar);
    }
  }

  function start() {
    feldAufbauen();
    aktualisieren();
    window.addEventListener('scroll', aktualisieren, { passive: true });
    window.addEventListener('resize', aktualisieren);
    window.addEventListener('orientationchange', aktualisieren);
    window.setInterval(aktualisieren, 700);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
