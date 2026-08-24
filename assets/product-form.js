/* Variantenauswahl und Sticky-Warenkorb der Produktseite.
   Die Auswahl schreibt ausschließlich die Shopify-Varianten-ID in das
   native Produktformular – Preisberechnung bleibt vollständig bei Shopify. */
(function () {
  'use strict';

  var form = document.getElementById('ProductForm');
  if (!form) return;

  var hidden = form.querySelector('[data-variant-id]');
  var addButton = form.querySelector('[data-add-button]');
  var priceHost = document.querySelector('[data-product-price]');
  var stickyPrice = document.querySelector('[data-sticky-price]');
  var strings = window.VCStrings || {};

  form.addEventListener('change', function (event) {
    var input = event.target.closest('[data-variant-input]');
    if (!input) return;

    hidden.value = input.value;

    var price = input.getAttribute('data-price');
    var available = input.getAttribute('data-available') === 'true';

    if (priceHost && price) {
      var current = priceHost.querySelector('.price__current');
      if (current) current.textContent = price;
    }
    if (stickyPrice && price) stickyPrice.textContent = price;

    if (addButton) {
      addButton.disabled = !available;
      addButton.textContent = available ? strings.addToCart : strings.soldOut;
    }

    var url = new URL(window.location.href);
    url.searchParams.set('variant', input.value);
    window.history.replaceState({}, '', url.toString());
  });

  /* Sticky Add-to-Cart erscheint, sobald der Hauptbutton aus dem Blick ist. */
  var sticky = document.querySelector('[data-sticky-atc]');
  if (sticky && addButton && 'IntersectionObserver' in window) {
    var stickyAdd = sticky.querySelector('[data-sticky-add]');
    if (stickyAdd) {
      stickyAdd.addEventListener('click', function () {
        if (typeof form.requestSubmit === 'function') form.requestSubmit();
        else form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          sticky.classList.toggle('is-visible', show);
          sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
        });
      },
      { threshold: 0 }
    );
    observer.observe(addButton);
  }
})();
