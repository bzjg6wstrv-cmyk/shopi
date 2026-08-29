/* Warenkorb-Interaktionen. Alle Änderungen laufen über die native
   Shopify Cart AJAX API; Preise, Rabatte und Bestand bleiben bei Shopify. */
(function () {
  'use strict';

  var drawer = document.getElementById('CartDrawer');
  if (!drawer || !window.VC) return;

  window.VC.registerCartSection('cart-drawer');

  var busy = false;

  function setBusy(state) {
    busy = state;
    drawer.setAttribute('aria-busy', state ? 'true' : 'false');
    drawer.style.setProperty('opacity', state ? '0.6' : '');
    drawer.style.setProperty('pointer-events', state ? 'none' : '');
  }

  function changeLine(line, quantity) {
    if (busy) return;
    setBusy(true);
    window.VC.cart
      .change({ line: line, quantity: quantity })
      .catch(function () {
        window.location.href = window.VCRoutes.cart_url;
      })
      .finally(function () {
        setBusy(false);
      });
  }

  drawer.addEventListener('change', function (event) {
    var input = event.target.closest('[data-cart-quantity]');
    if (!input) return;
    var quantity = parseInt(input.value, 10);
    if (isNaN(quantity) || quantity < 0) return;
    changeLine(parseInt(input.getAttribute('data-line'), 10), quantity);
  });

  drawer.addEventListener('click', function (event) {
    var remove = event.target.closest('[data-cart-remove]');
    if (!remove) return;
    event.preventDefault();
    changeLine(parseInt(remove.getAttribute('data-line'), 10), 0);
  });

  /* Produktformulare überall auf der Seite in den Drawer leiten. */
  document.addEventListener('submit', function (event) {
    var form = event.target.closest('form[action*="/cart/add"]');
    if (!form || form.hasAttribute('data-no-ajax')) return;

    event.preventDefault();
    var button = form.querySelector('[type="submit"]');
    /* innerHTML, nicht textContent: Manche Knöpfe tragen ein Symbol neben der
       Beschriftung. Mit textContent wäre es nach dem ersten Klick verloren. */
    var label = button ? button.innerHTML : '';
    if (button) {
      button.setAttribute('aria-disabled', 'true');
      button.textContent = window.VCStrings.adding;
    }

    var errorTarget = form.querySelector('[data-form-error]');
    if (errorTarget) {
      errorTarget.textContent = '';
      errorTarget.hidden = true;
    }

    window.VC.cart
      .addFromForm(form)
      .then(function () {
        drawer.open(button);
      })
      .catch(function (error) {
        var message = (error && (error.description || error.message)) || window.VCStrings.error;
        if (errorTarget) {
          errorTarget.textContent = message;
          errorTarget.hidden = false;
        } else {
          window.alert(message);
        }
      })
      .finally(function () {
        if (button) {
          button.removeAttribute('aria-disabled');
          button.innerHTML = label;
        }
      });
  });
})();
