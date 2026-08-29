/* Scent Code direkt in den Warenkorb.

   Hinter „Jetzt auswählen" steckt bewusst keine Navigation: kein Link, kein
   Formular, kein window.location. Der Klick spricht ausschließlich die
   Shopify Cart API an und öffnet danach die vorhandene Warenkorb-Lade.

   Die Variantennummer kommt serverseitig aus dem Produkt. Fehlt sie – etwa
   weil das Produkt gerade neu angelegt wurde und die Theme-Einstellung noch
   ins Leere zeigt –, wird sie zur Laufzeit über /products/<handle>.js geholt.
   Im Theme steht keine feste Nummer.

   Die Ergebnisse der Sofortsuche werden nachträglich eingefügt; der Klick
   wird deshalb am Dokument abgefangen und nicht am einzelnen Element. */
(function () {
  'use strict';

  var ERSATZ_HANDLE = 'vent-celeste-scent-code';

  function routen() {
    return window.VCRoutes || {};
  }

  function wurzel() {
    var root = routen().root_url || '/';
    return root === '/' ? '' : root;
  }

  function fehlerZeigen(button, text) {
    var ziel = button.parentElement
      ? button.parentElement.querySelector('[data-scent-code-add-error]')
      : null;
    if (!ziel) return;
    ziel.textContent = text || '';
    ziel.hidden = !text;
  }

  function beschriftung(button, text) {
    var label = button.querySelector('[data-scent-code-add-label]');
    if (label) label.textContent = text;
  }

  /* --------------------------------------------------------- Variantennummer */
  function variantenNummer(button) {
    var gesetzt = (button.getAttribute('data-variant-id') || '').trim();
    if (gesetzt) return Promise.resolve(gesetzt);

    var handle = (button.getAttribute('data-product-handle') || '').trim() || ERSATZ_HANDLE;
    return fetch(wurzel() + '/products/' + handle + '.js', {
      headers: { Accept: 'application/json' }
    })
      .then(function (antwort) {
        if (!antwort.ok) {
          throw new Error('Produkt ' + handle + ' nicht abrufbar (HTTP ' + antwort.status + ')');
        }
        return antwort.json();
      })
      .then(function (daten) {
        var varianten = (daten && daten.variants) || [];
        var verfuegbar = null;
        for (var i = 0; i < varianten.length; i += 1) {
          if (varianten[i].available) { verfuegbar = varianten[i]; break; }
        }
        var gewaehlt = verfuegbar || varianten[0];
        if (!gewaehlt) throw new Error('Produkt ' + handle + ' hat keine Variante');
        return String(gewaehlt.id);
      });
  }

  /* ------------------------------------------------------ Warenkorb ansprechen */
  function inDenWarenkorb(id, code) {
    return fetch((routen().cart_add_url || '/cart/add') + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        items: [
          {
            id: Number(id),
            quantity: 1,
            properties: { 'Scent Code': code }
          }
        ],
        sections: 'cart-drawer',
        sections_url: window.location.pathname
      })
    }).then(function (antwort) {
      return antwort.json().then(function (daten) {
        if (!antwort.ok) {
          var grund = (daten && (daten.description || daten.message)) || ('HTTP ' + antwort.status);
          throw new Error(grund);
        }
        return daten;
      });
    });
  }

  /* Den Inhalt der Warenkorb-Lade aus der Antwort übernehmen – dieselbe
     Mechanik, die das Theme auch sonst für den Warenkorb verwendet. */
  function abschnitteUebernehmen(daten) {
    if (!daten || !daten.sections) return;
    Object.keys(daten.sections).forEach(function (id) {
      var markup = daten.sections[id];
      if (!markup) return;
      var geparst = new DOMParser().parseFromString(markup, 'text/html');
      var frisch = geparst.querySelector('[data-cart-section="' + id + '"]');
      var aktuell = document.querySelector('[data-cart-section="' + id + '"]');
      if (frisch && aktuell) aktuell.innerHTML = frisch.innerHTML;
    });
  }

  function ladeOeffnen(button) {
    var lade = document.getElementById('CartDrawer');
    if (lade && typeof lade.open === 'function') {
      lade.open(button);
      return true;
    }
    return false;
  }

  /* ------------------------------------------------------------------ Klick -- */
  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-scent-code-add]');
    if (!button) return;

    /* Sicherheitshalber: Falls die Schaltfläche je in einem Formular landet,
       darf der Klick nichts absenden und nirgendwohin führen. */
    event.preventDefault();

    /* Doppelklickschutz: Während der Anfrage nimmt die Schaltfläche nichts an. */
    if (button.getAttribute('aria-busy') === 'true') return;

    var code = button.getAttribute('data-code');
    if (!code) return;

    var texte = window.VCStrings || {};
    var urspruenglich = button.querySelector('[data-scent-code-add-label]');
    urspruenglich = urspruenglich ? urspruenglich.textContent : '';

    button.setAttribute('aria-busy', 'true');
    button.disabled = true;
    beschriftung(button, button.getAttribute('data-busy-text') || texte.adding || urspruenglich);
    fehlerZeigen(button, '');

    variantenNummer(button)
      .then(function (id) {
        /* Die gefundene Nummer merken – ein zweiter Klick spart die Abfrage. */
        button.setAttribute('data-variant-id', id);
        return inDenWarenkorb(id, code);
      })
      .then(function (daten) {
        abschnitteUebernehmen(daten);
        if (window.VC && window.VC.cart && typeof window.VC.cart.refresh === 'function') {
          window.VC.cart.refresh().catch(function () {});
        }
        /* Erst nach bestätigtem Hinzufügen: Lade öffnen, sonst zum Warenkorb. */
        if (!ladeOeffnen(button)) {
          window.location.href = routen().cart_url || '/cart';
        }
      })
      .catch(function (fehler) {
        /* Kein stiller Rücksprung und kein vorgetäuschter Erfolg. */
        console.error('[VENT CELESTE] Scent Code konnte nicht hinzugefügt werden:', fehler);
        fehlerZeigen(button, button.getAttribute('data-error-text') || texte.error || '');
      })
      .then(function () {
        button.removeAttribute('aria-busy');
        button.disabled = false;
        beschriftung(button, urspruenglich);
      });
  });
})();
