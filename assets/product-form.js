/* Produktformular: vollständiger Variantenwechsel.

   Beim Wechsel der Ausführung wechseln Preis, Grundpreis, Konzentration,
   Größe, Artikelnummer, Verfügbarkeit und – falls hinterlegt – das Bild.

   Die Werte kommen fertig formatiert aus Liquid. Das vermeidet nachgebaute
   Währungs- und Grundpreislogik im Browser, spart eine Netzanfrage und
   verhindert Flackern. Ein Eau de Parfum zeigt dadurch nie die
   Prozentzahl des Extrait. */
(function () {
  'use strict';

  var form = document.getElementById('ProductForm');
  if (!form) return;

  var hidden = form.querySelector('[data-variant-id]');
  var addButton = form.querySelector('[data-add-button]');
  var priceHost = document.querySelector('[data-product-price]');
  var metaHost = document.querySelector('[data-variant-meta]');
  var skuHost = document.querySelector('[data-variant-sku]');
  var skuValue = document.querySelector('[data-variant-sku-value]');
  var stickyPrice = document.querySelector('[data-sticky-price]');
  var strings = window.VCStrings || {};

  var data = {};
  var dataNode = document.querySelector('[data-variant-data]');
  if (dataNode) {
    try {
      data = JSON.parse(dataNode.textContent);
    } catch (error) {
      /* Ohne Daten bleibt der Grundablauf funktionsfähig. */
    }
  }

  function setText(host, value) {
    if (!host) return;
    host.textContent = value || '';
    host.hidden = !value;
  }

  function applyPrice(entry) {
    if (!priceHost) return;

    var current = priceHost.querySelector('.price__current');
    if (current) current.textContent = entry.price;

    var wrapper = priceHost.querySelector('.price');
    var regular = priceHost.querySelector('.price__regular');
    if (wrapper) wrapper.classList.toggle('price--on-sale', Boolean(entry.onSale));
    if (regular) {
      regular.textContent = entry.compare || '';
      regular.hidden = !entry.onSale;
    }

    var unit = priceHost.querySelector('.card__unit-price');
    if (unit) {
      unit.textContent = entry.unit || '';
      unit.hidden = !entry.unit;
    }
  }

  function applyMedia(mediaId) {
    if (!mediaId) return;
    var target = document.querySelector('[data-media-id="' + mediaId + '"]');
    if (!target) return;
    if (typeof target.scrollIntoView === 'function') {
      var behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      /* inline zusaetzlich, damit der Wechsel auch in der waagerechten
         Galerie auf dem Telefon das richtige Bild heranholt. */
      target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: behavior });
    }
  }

  form.addEventListener('change', function (event) {
    var input = event.target.closest('[data-variant-input]');
    if (!input) return;

    hidden.value = input.value;
    var entry = data[input.value];

    if (entry) {
      applyPrice(entry);
      setText(metaHost, entry.meta);
      if (skuValue) skuValue.textContent = entry.sku || '';
      if (skuHost) skuHost.hidden = !entry.sku;
      if (stickyPrice) stickyPrice.textContent = entry.price;
      applyMedia(entry.media);

      if (addButton) {
        addButton.disabled = !entry.available;
        addButton.textContent = entry.available ? strings.addToCart : strings.soldOut;
      }
    } else {
      /* Rückfall, falls keine Variantendaten gerendert wurden. */
      var price = input.getAttribute('data-price');
      var available = input.getAttribute('data-available') === 'true';
      if (priceHost && price) {
        var fallback = priceHost.querySelector('.price__current');
        if (fallback) fallback.textContent = price;
      }
      if (stickyPrice && price) stickyPrice.textContent = price;
      if (addButton) {
        addButton.disabled = !available;
        addButton.textContent = available ? strings.addToCart : strings.soldOut;
      }
    }

    var url = new URL(window.location.href);
    url.searchParams.set('variant', input.value);
    window.history.replaceState({}, '', url.toString());
  });

  /* Sticky Add-to-Cart erscheint, sobald der Hauptbutton nach oben aus dem
     Blick gescrollt ist.

     Bewusst ohne IntersectionObserver: Der Beobachter meldet sich nur, wenn
     eine Schwelle ueberschritten wird. Beim Laden liegt der Kaufbutton
     unterhalb des Bildschirms, beim Weiterscrollen wandert er darueber
     hinaus – in beiden Faellen schneidet er den Bildschirm nie, es gab also
     genau eine Meldung mit „nicht sichtbar, aber noch unterhalb". Die Leiste
     blieb dadurch dauerhaft verborgen. Gemessen wird stattdessen bei jedem
     Scrollen ein einzelnes Rechteck; das ist guenstig und immer richtig. */
  var sticky = document.querySelector('[data-sticky-atc]');
  if (sticky && addButton) {
    var stickyAdd = sticky.querySelector('[data-sticky-add]');
    if (stickyAdd) {
      stickyAdd.addEventListener('click', function () {
        if (typeof form.requestSubmit === 'function') form.requestSubmit();
        else form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      });
    }

    var stickyPruefen = function () {
      var show = addButton.getBoundingClientRect().bottom <= 0;
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
    };

    window.addEventListener('scroll', stickyPruefen, { passive: true });
    window.addEventListener('resize', stickyPruefen);
    window.addEventListener('orientationchange', stickyPruefen);
    window.addEventListener('load', stickyPruefen);
    window.addEventListener('pageshow', stickyPruefen);
    stickyPruefen();
  }
})();
