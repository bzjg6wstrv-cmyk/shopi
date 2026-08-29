/* VENT CELESTE search normalizer.
   - "49"   -> "VC-049"
   - "7"    -> "VC-007"
   - "1250" -> "VC-1250"
   Unter 100 wird dreistellig aufgefüllt, ab 100 bleibt die Nummer wie sie ist.
   Duftnoten/-charaktere remain unchanged and are resolved by main-search.liquid. */
(function () {
  'use strict';

  /* Nur optionales Präfix und danach ausschließlich Ziffern. Ein Minuszeichen
     oder Buchstaben im Zahlteil bleiben unverändert und laufen als normaler
     Suchbegriff weiter. */
  var CODE_PATTERN = /^(?:VC[-_.#\s]*)?(\d{1,9})$/i;

  function normalize(raw) {
    var value = (raw || '').trim();
    if (!value) return value;

    var match = value.match(CODE_PATTERN);
    if (!match) return value;

    var number = parseInt(match[1], 10);
    if (!number || number < 1) return value;

    return 'VC-' + String(number).padStart(3, '0');
  }

  document.addEventListener('submit', function (event) {
    var form = event.target.closest('[data-vc-search-form]');
    if (!form) return;
    var input = form.querySelector('input[name="q"]');
    if (!input) return;
    input.value = normalize(input.value);
  });
})();
