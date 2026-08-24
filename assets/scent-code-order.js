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
  var strings = window.VCCodeOrderStrings || {};

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
    if (submit) submit.disabled = !valid;
    if (errorTarget && valid) {
      errorTarget.hidden = true;
      errorTarget.textContent = '';
    }
  }

  /* Das Code-Formular auf dieser Seite leitet nicht weiter, sondern füllt
     das Bestellformular. */
  codeForm.addEventListener('submit', function (event) {
    event.preventDefault();
    apply(normalise(input.value));
  });

  input.addEventListener('input', function () {
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

  /* Variantenwechsel: Preis und Varianten-ID aktualisieren. */
  form.addEventListener('change', function (event) {
    var choice = event.target.closest('[data-variant-input]');
    if (!choice) return;
    if (variantField) variantField.value = choice.value;
    var price = choice.getAttribute('data-price');
    if (priceHost && price) {
      var current = priceHost.querySelector('.price__current');
      if (current) current.textContent = price;
    }
  });

  form.addEventListener('submit', function (event) {
    if (visibleProperty && visibleProperty.value) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (errorTarget) {
      errorTarget.textContent = strings.required || '';
      errorTarget.hidden = false;
    }
    input.focus();
  });
})();
