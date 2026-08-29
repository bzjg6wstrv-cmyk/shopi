/* Lädt die nativen Shopify-Produktempfehlungen nach.
   Liefert Shopify keine Empfehlungen, bleibt der Bereich leer –
   es wird kein Ersatzinhalt erfunden. */
(function () {
  'use strict';

  var host = document.querySelector('[data-recommendations]');
  if (!host || !host.dataset.url) return;

  fetch(host.dataset.url)
    .then(function (response) {
      if (!response.ok) throw new Error(response.status);
      return response.text();
    })
    .then(function (markup) {
      var doc = new DOMParser().parseFromString(markup, 'text/html');
      var fresh = doc.querySelector('.product-recommendations');
      if (fresh && fresh.querySelector('.grid')) host.innerHTML = fresh.innerHTML;
    })
    .catch(function () {
      host.remove();
    });
})();
