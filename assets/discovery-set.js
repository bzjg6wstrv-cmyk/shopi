/* Discovery Set – fünf Scent Codes eingeben.

   Nutzt dieselbe Normalisierung wie das übrige Scent-Code-System:
   47, 047, vc47, VC 047 und VC-047 ergeben alle VC-047.
   Doppelte Codes werden abgewiesen, der Warenkorb-Button ist erst bei genau
   fünf gültigen, verschiedenen Codes aktiv.

   Beim Absenden hängen die Codes als Positionsangaben am nativen
   Shopify-Produktformular – im Warenkorb, im Checkout und in der Bestellung
   eindeutig lesbar. */
(function () {
  'use strict';

  var form = document.querySelector('[data-discovery-form]');
  if (!form) return;

  var inputs = Array.prototype.slice.call(form.querySelectorAll('[data-discovery-code]'));
  if (!inputs.length) return;

  var submit = form.querySelector('[data-discovery-submit]');
  var propertyHost = form.querySelector('[data-discovery-properties]');
  var errorTarget = form.querySelector('[data-form-error]');
  var counter = document.querySelector('[data-picker-counter]');
  var counterValue = document.querySelector('[data-picker-count]');
  var strings = window.VCDiscoveryStrings || {};

  var max = parseInt(form.getAttribute('data-max'), 10) || inputs.length;

  function normalise(value) {
    if (window.VCScentCode && typeof window.VCScentCode.normalise === 'function') {
      return window.VCScentCode.normalise(value);
    }
    return null;
  }

  function slotParts(input) {
    var slot = input.closest('.code-slot');
    return {
      row: slot ? slot.querySelector('[data-slot-row]') : null,
      mark: slot ? slot.querySelector('[data-slot-mark]') : null,
      hint: slot ? slot.querySelector('[data-slot-hint]') : null
    };
  }

  function setSlot(input, state, message) {
    var parts = slotParts(input);
    if (parts.row) {
      if (state) parts.row.setAttribute('data-state', state);
      else parts.row.removeAttribute('data-state');
    }
    if (parts.mark) parts.mark.hidden = state !== 'valid';
    if (parts.hint) parts.hint.textContent = message || '';
    input.setAttribute('aria-invalid', state === 'error' ? 'true' : 'false');
  }

  function evaluate() {
    var seen = [];
    var valid = [];

    inputs.forEach(function (input) {
      var raw = input.value.trim();

      if (!raw) {
        setSlot(input, '', '');
        return;
      }

      var code = normalise(raw);

      if (!code) {
        setSlot(input, 'error', strings.unknown || '');
        return;
      }

      if (seen.indexOf(code) !== -1) {
        setSlot(input, 'error', strings.duplicate || '');
        return;
      }

      seen.push(code);
      valid.push({ input: input, code: code });
      setSlot(input, 'valid', code);
    });

    if (counterValue) counterValue.textContent = valid.length;
    if (counter) {
      counter.textContent = (strings.selected || '__COUNT__ / __MAX__')
        .replace('__COUNT__', valid.length)
        .replace('__MAX__', max);
    }

    if (submit) submit.disabled = valid.length !== max;

    if (errorTarget && valid.length === max) {
      errorTarget.hidden = true;
      errorTarget.textContent = '';
    }

    return valid;
  }

  inputs.forEach(function (input) {
    input.addEventListener('input', evaluate);
    input.addEventListener('blur', evaluate);

    /* Enter springt ins nächste Feld statt das Formular abzuschicken. */
    input.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter') return;
      var index = inputs.indexOf(input);
      if (index > -1 && index < inputs.length - 1) {
        event.preventDefault();
        inputs[index + 1].focus();
      }
    });
  });

  form.addEventListener('submit', function (event) {
    var valid = evaluate();

    if (!valid || valid.length !== max) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (errorTarget) {
        errorTarget.textContent = strings.incomplete || '';
        errorTarget.hidden = false;
      }
      var firstEmpty = inputs.filter(function (input) {
        return !normalise(input.value);
      })[0];
      if (firstEmpty) firstEmpty.focus();
      return;
    }

    propertyHost.innerHTML = '';
    var codes = [];

    valid.forEach(function (entry, index) {
      var field = document.createElement('input');
      field.type = 'hidden';
      field.name = 'properties[' + (strings.label || 'Scent Code') + ' ' + (index + 1) + ']';
      field.value = entry.code;
      propertyHost.appendChild(field);
      codes.push(entry.code);
    });

    /* Versteckte, maschinenlesbare Fassung für Kommissionierung und Export. */
    var hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = 'properties[_vc_codes]';
    hidden.value = codes.join(',');
    propertyHost.appendChild(hidden);
  });

  evaluate();
})();
