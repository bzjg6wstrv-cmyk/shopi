/* VENT CELESTE search normalizer.
   - "49" -> "VC-049"
   - "7"  -> "VC-007"
   Duftnoten/-charaktere remain unchanged and are resolved by main-search.liquid. */
(function () {
  'use strict';

  function normalize(raw) {
    var value = (raw || '').trim();
    if (!value) return value;

    var compact = value.toUpperCase().replace(/\s+/g, '').replace(/^VC[-_]?/, '');
    if (/^\d{1,3}$/.test(compact)) {
      return 'VC-' + compact.padStart(3, '0');
    }
    return value;
  }

  document.addEventListener('submit', function (event) {
    var form = event.target.closest('[data-vc-search-form]');
    if (!form) return;
    var input = form.querySelector('input[name="q"]');
    if (!input) return;
    input.value = normalize(input.value);
  });
})();
