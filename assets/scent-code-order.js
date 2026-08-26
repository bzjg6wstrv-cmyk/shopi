/* Generischer Bestellweg: verbindet das Code-Feld mit dem Produktformular.
   Der Code wird als Positionsangabe an Shopify übergeben – ohne gültigen
   Code lässt sich nichts in den Warenkorb legen. */
(function () {
  'use strict';

  var form = document.querySelector('[data-scent-code-order]');
  var codeForm = document.querySelector('[data-scent-code-form="local"]');
  if (!form || !codeForm) return;

  var input = codeForm.querySelector('[data-scent-code-input]');
  var visibleProperty = form.querySelector('[data-code-property]');
  var hiddenProperty = form.querySelector('[data-code-property-hidden]');
  var badge = form.querySelector('[data-code-badge]');
  var badgeValue = form.querySelector('[data-code-badge-value]');
  var submit = form.querySelector('[data-code-submit]');
  var errorTarget = form.querySelector('[data-form-error]');
  var variantField = form.querySelector('[data-variant-id]');
  var priceHost = form.querySelector('[data-product-price]');
  var orderStrings = window.VCCodeOrderStrings || {};
  var codeStrings = window.VCCodeStrings || {};

  function normalise(value) {
    if (window.VCScentCode && typeof window.VCScentCode.normalise === 'function') {
      return window.VCScentCode.normalise(value);
    }
    return null;
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

  form.addEventListener('submit', function (event) {
    if (visibleProperty && visibleProperty.value) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (errorTarget) {
      errorTarget.textContent = orderStrings.required || '';
      errorTarget.hidden = false;
    }
    input.focus();
  });
})();
