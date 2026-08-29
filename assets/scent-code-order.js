/* Generischer Bestellweg: verbindet das Code-Feld mit dem Produktformular.
   Der Code wird als Positionsangabe an Shopify übergeben – ohne gültigen
   Code lässt sich nichts in den Warenkorb legen. */
(function () {
  'use strict';

  var codeForm = document.querySelector('[data-scent-code-form="local"]');
  if (!codeForm) return;

  var input = codeForm.querySelector('[data-scent-code-input]');
  if (!input) return;

  /* Zwei Vorlagen, ein Skript:

     A  Eigene Vorlage `product.scent-code` – der Abschnitt bringt sein
        eigenes Bestellformular mit Varianten- und Preiswechsel mit.
     B  Standard-Produktvorlage – die Code-Eingabe steht vor dem regulären
        Produktformular, die Positionsangaben liegen darin. Varianten und
        Preis regelt dort weiterhin product-form.js.

     Dadurch funktioniert der Bestellweg unabhängig davon, welche Vorlage dem
     Produkt im Adminbereich zugewiesen ist. */
  var orderForm = document.querySelector('[data-scent-code-order]');
  var inlineHost = document.querySelector('[data-scent-code-inline]');
  var form = orderForm;
  if (!form && inlineHost) {
    form = document.querySelector('form[action*="/cart/add"]');
  }
  if (!form) return;

  var eigeneVorlage = Boolean(orderForm);
  var anzeige = eigeneVorlage ? form : inlineHost;

  var visibleProperty = form.querySelector('[data-code-property]');
  var hiddenProperty = form.querySelector('[data-code-property-hidden]');
  var badge = anzeige.querySelector('[data-code-badge]');
  var badgeValue = anzeige.querySelector('[data-code-badge-value]');
  var submit = form.querySelector('[data-code-submit]') || form.querySelector('[data-add-button]');
  var errorTarget = form.querySelector('[data-form-error]');
  var variantField = form.querySelector('[data-variant-id]');
  var priceHost = form.querySelector('[data-product-price]');
  var orderStrings = window.VCCodeOrderStrings || {};
  var codeStrings = window.VCCodeStrings || {};

  /* Dieselbe Regel wie in scent-code.js. Der eigene Weg greift nur, falls
     jenes Skript auf dieser Seite nicht zum Zug kam. */
  var ERSATZMUSTER = /^(?:VC[-_.#\s]*)?(\d{1,9})$/i;

  function normalise(value) {
    if (window.VCScentCode && typeof window.VCScentCode.normalise === 'function') {
      return window.VCScentCode.normalise(value);
    }
    if (value === null || value === undefined) return null;
    var treffer = String(value).trim().match(ERSATZMUSTER);
    if (!treffer) return null;
    var nummer = parseInt(treffer[1], 10);
    if (!nummer || nummer < 1) return null;
    return 'VC-' + String(nummer).padStart(3, '0');
  }

  function apply(code) {
    var valid = Boolean(code);
    if (visibleProperty) visibleProperty.value = valid ? code : '';
    if (hiddenProperty) hiddenProperty.value = valid ? code : '';
    if (badge) badge.hidden = !valid;
    if (badgeValue && valid) badgeValue.textContent = code;
    if (submit) {
      var chosen = form.querySelector('[data-variant-input]:checked');
      var variantAvailable = chosen ? chosen.getAttribute('data-available') === 'true' : true;
      submit.disabled = !valid || !variantAvailable;
    }
    if (errorTarget && valid) {
      errorTarget.hidden = true;
      errorTarget.textContent = '';
    }
  }

  function setCodeStatus(message, tone) {
    var status = codeForm.querySelector('[data-scent-code-status]');
    if (!status) return;
    status.textContent = message || '';
    status.setAttribute('data-tone', tone || '');
  }

  /* Das Code-Formular auf dieser Seite leitet nicht weiter, sondern füllt
     das Bestellformular. */
  codeForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var code = normalise(input.value);
    apply(code);
    if (code) {
      setCodeStatus((codeStrings.found || '').replace('__CODE__', code), 'ok');
    } else {
      /* Ohne gültigen Code bleibt der Warenkorb-Button gesperrt – der Grund
         muss sichtbar sein und nicht nur der Button ausgegraut. */
      setCodeStatus(codeStrings.invalid || '', 'error');
      var row = codeForm.querySelector('.code-field__row');
      if (row && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        row.classList.remove('is-invalid');
        void row.offsetWidth;
        row.classList.add('is-invalid');
      }
      input.focus();
    }
  });

  input.addEventListener('input', function () {
    var row = codeForm.querySelector('.code-field__row');
    if (row) row.classList.remove('is-invalid', 'is-valid');
    setCodeStatus('', '');
    apply(normalise(input.value));
  });

  /* Code aus der URL übernehmen (?code=VC-081). */
  var fromUrl = new URLSearchParams(window.location.search).get('code');
  if (fromUrl) {
    var normalised = normalise(fromUrl);
    if (normalised) {
      input.value = normalised.replace(/^[A-Z]+-/, '');
      apply(normalised);
    }
  }

  /* Ohne gültigen Code wird nicht abgesendet – in beiden Vorlagen. */
  form.addEventListener('submit', function (event) {
    if (visibleProperty && visibleProperty.value) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (errorTarget) {
      errorTarget.textContent = orderStrings.required || '';
      errorTarget.hidden = false;
    }
    setCodeStatus(codeStrings.invalid || '', 'error');
    input.focus();
  });

  /* Variantenwechsel nur auf der eigenen Vorlage: Auf der Standardvorlage
     erledigt das product-form.js, ein zweiter Zugriff würde sich in die Quere
     kommen. Dort wird nach jedem Wechsel nur die Codesperre erneut gesetzt. */
  if (!eigeneVorlage) {
    form.addEventListener('change', function () {
      window.setTimeout(function () { apply(normalise(input.value)); }, 0);
    });
    apply(normalise(input.value));
    return;
  }

  /* Variantenwechsel: identisch zur normalen Produktseite.
     Preis, Grundpreis, Konzentration, Größe, Artikelnummer, Verfügbarkeit und
     Buttonzustand wechseln gemeinsam. Ein Eau de Parfum zeigt nie 30 %. */
  var metaHost = form.querySelector('[data-variant-meta]');
  var skuHost = form.querySelector('[data-variant-sku]');
  var skuValue = form.querySelector('[data-variant-sku-value]');
  var buttonStrings = window.VCStrings || {};

  var variantData = {};
  var dataNode = document.querySelector('[data-variant-data]');
  if (dataNode) {
    try {
      variantData = JSON.parse(dataNode.textContent);
    } catch (error) {
      /* Ohne Daten greift der Rückfall auf die data-Attribute. */
    }
  }

  function hasCode() {
    return Boolean(visibleProperty && visibleProperty.value);
  }

  function applyVariant(id, fallbackPrice, fallbackAvailable) {
    var entry = variantData[id];
    var price = entry ? entry.price : fallbackPrice;
    var available = entry ? entry.available : fallbackAvailable;

    if (priceHost && price) {
      var current = priceHost.querySelector('.price__current');
      if (current) current.textContent = price;

      var wrapper = priceHost.querySelector('.price');
      var regular = priceHost.querySelector('.price__regular');
      if (wrapper && entry) wrapper.classList.toggle('price--on-sale', Boolean(entry.onSale));
      if (regular && entry) {
        regular.textContent = entry.compare || '';
        regular.hidden = !entry.onSale;
      }

      var unit = priceHost.querySelector('.card__unit-price');
      if (unit && entry) {
        unit.textContent = entry.unit || '';
        unit.hidden = !entry.unit;
      }
    }

    if (metaHost && entry) {
      metaHost.textContent = entry.meta || '';
      metaHost.hidden = !entry.meta;
    }

    if (entry) {
      if (skuValue) skuValue.textContent = entry.sku || '';
      if (skuHost) skuHost.hidden = !entry.sku;
    }

    if (submit) {
      submit.disabled = !available || !hasCode();
      submit.textContent = available ? buttonStrings.addToCart : buttonStrings.soldOut;
    }
  }

  form.addEventListener('change', function (event) {
    var choice = event.target.closest('[data-variant-input]');
    if (!choice) return;
    if (variantField) variantField.value = choice.value;
    applyVariant(
      choice.value,
      choice.getAttribute('data-price'),
      choice.getAttribute('data-available') === 'true'
    );
  });

})();
