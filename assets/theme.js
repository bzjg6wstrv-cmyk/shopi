/* ==========================================================================
   VENT CELESTE – Kern-JavaScript
   Kein Framework, keine externen Abhängigkeiten. Wird mit defer geladen.
   Enthält: Fokusverwaltung, Drawer, Navigation, Warenkorb-API, Einblendungen.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------------------------------------------------------------- Fokus */
  var FOCUSABLE =
    'a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), details > summary, [tabindex]:not([tabindex="-1"])';

  var trapState = { container: null, onKeydown: null, returnTo: null };

  function focusableIn(container) {
    return Array.prototype.filter.call(container.querySelectorAll(FOCUSABLE), function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
  }

  function trapFocus(container, elementToFocus) {
    removeTrapFocus();
    trapState.container = container;
    trapState.returnTo = document.activeElement;

    trapState.onKeydown = function (event) {
      if (event.key !== 'Tab') return;
      var items = focusableIn(container);
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', trapState.onKeydown);
    window.requestAnimationFrame(function () {
      var target = elementToFocus || focusableIn(container)[0];
      if (target) target.focus();
    });
  }

  function removeTrapFocus(restore) {
    if (trapState.onKeydown) document.removeEventListener('keydown', trapState.onKeydown);
    if (restore && trapState.returnTo && typeof trapState.returnTo.focus === 'function') {
      trapState.returnTo.focus();
    }
    trapState.container = null;
    trapState.onKeydown = null;
    trapState.returnTo = null;
  }

  /* ------------------------------------------------------- Scroll-Sperre */
  var lockCount = 0;
  function lockScroll() {
    lockCount += 1;
    if (lockCount === 1) {
      var width = window.innerWidth - root.clientWidth;
      document.body.style.setProperty('padding-right', width > 0 ? width + 'px' : '');
      document.body.classList.add('is-locked');
    }
  }
  function unlockScroll() {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.body.classList.remove('is-locked');
      document.body.style.removeProperty('padding-right');
    }
  }

  /* -------------------------------------------------------------- Drawer */
  /* <vc-drawer id="cart-drawer"> … </vc-drawer>
     Wird über [data-drawer-open="cart-drawer"] geöffnet.                    */
  var openDrawers = [];

  function getOverlay() {
    var overlay = document.querySelector('[data-overlay]');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.setAttribute('data-overlay', '');
      overlay.setAttribute('hidden', '');
      document.body.appendChild(overlay);
      overlay.addEventListener('click', function () {
        var top = openDrawers[openDrawers.length - 1];
        if (top) top.close();
      });
    }
    return overlay;
  }

  class VCDrawer extends HTMLElement {
    connectedCallback() {
      this.setAttribute('role', 'dialog');
      this.setAttribute('aria-modal', 'true');
      this.setAttribute('tabindex', '-1');
      this.setAttribute('aria-hidden', 'true');

      this.addEventListener('click', (event) => {
        if (event.target.closest('[data-drawer-close]')) {
          event.preventDefault();
          this.close();
        }
      });

      this.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          this.close();
        }
      });
    }

    open(opener) {
      if (this.classList.contains('is-open')) return;
      this.opener = opener || document.activeElement;

      const overlay = getOverlay();
      overlay.removeAttribute('hidden');
      window.requestAnimationFrame(() => overlay.classList.add('is-open'));

      this.classList.add('is-open');
      this.setAttribute('aria-hidden', 'false');
      lockScroll();
      openDrawers.push(this);
      trapFocus(this, this.querySelector('[data-drawer-initial-focus]'));
      this.dispatchEvent(new CustomEvent('vc:drawer:open', { bubbles: true }));
    }

    close() {
      if (!this.classList.contains('is-open')) return;
      this.classList.remove('is-open');
      this.setAttribute('aria-hidden', 'true');
      openDrawers = openDrawers.filter((drawer) => drawer !== this);

      if (!openDrawers.length) {
        const overlay = getOverlay();
        overlay.classList.remove('is-open');
        window.setTimeout(() => {
          if (!openDrawers.length) overlay.setAttribute('hidden', '');
        }, 300);
      }

      unlockScroll();
      removeTrapFocus(false);
      if (this.opener && typeof this.opener.focus === 'function') this.opener.focus();
      this.dispatchEvent(new CustomEvent('vc:drawer:close', { bubbles: true }));
    }
  }

  if (!customElements.get('vc-drawer')) customElements.define('vc-drawer', VCDrawer);

  document.addEventListener('click', function (event) {
    var opener = event.target.closest('[data-drawer-open]');
    if (!opener) return;
    var target = document.getElementById(opener.getAttribute('data-drawer-open'));
    if (!target || typeof target.open !== 'function') return;
    event.preventDefault();
    target.open(opener);
  });

  /* -------------------------------------------------------- Navigation */
  /* Desktop-Dropdowns basieren auf <details>: funktionieren auch ohne JS. */
  function closeAllDetails(except) {
    document.querySelectorAll('[data-nav-dropdown][open]').forEach(function (item) {
      if (item !== except) item.removeAttribute('open');
    });
  }

  document.addEventListener('click', function (event) {
    var inside = event.target.closest('[data-nav-dropdown]');
    closeAllDetails(inside);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var open = document.querySelector('[data-nav-dropdown][open]');
    if (open) {
      open.removeAttribute('open');
      var summary = open.querySelector('summary');
      if (summary) summary.focus();
    }
  });

  document.addEventListener('focusout', function (event) {
    var dropdown = event.target.closest('[data-nav-dropdown][open]');
    if (!dropdown) return;
    window.requestAnimationFrame(function () {
      if (!dropdown.contains(document.activeElement)) dropdown.removeAttribute('open');
    });
  });

  /* ------------------------------------------------------- Warenkorb-API */
  var routes = window.VCRoutes || {};

  function requestJSON(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok) throw data;
        return data;
      });
    });
  }

  var sectionIds = [];
  function registerCartSection(id) {
    if (id && sectionIds.indexOf(id) === -1) sectionIds.push(id);
  }

  function applySections(data) {
    if (!data || !data.sections) return;
    Object.keys(data.sections).forEach(function (id) {
      var markup = data.sections[id];
      if (!markup) return;
      var parsed = new DOMParser().parseFromString(markup, 'text/html');
      var fresh = parsed.querySelector('[data-cart-section="' + id + '"]');
      var current = document.querySelector('[data-cart-section="' + id + '"]');
      if (fresh && current) current.innerHTML = fresh.innerHTML;
    });
  }

  function announceCart(cart) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = cart.item_count;
      el.hidden = cart.item_count === 0;
    });
    document.dispatchEvent(new CustomEvent('vc:cart:updated', { detail: { cart: cart } }));
  }

  var cartApi = {
    addFromForm: function (form) {
      var formData = new FormData(form);
      formData.append('sections', sectionIds.join(','));
      formData.append('sections_url', window.location.pathname);
      return fetch((routes.cart_add_url || '/cart/add') + '.js', {
        method: 'POST',
        headers: { Accept: 'application/javascript', 'X-Requested-With': 'XMLHttpRequest' },
        body: formData
      })
        .then(function (response) {
          return response.json().then(function (data) {
            if (!response.ok) throw data;
            return data;
          });
        })
        .then(function (data) {
          applySections(data);
          return cartApi.refresh();
        });
    },

    change: function (payload) {
      payload.sections = sectionIds.join(',');
      payload.sections_url = window.location.pathname;
      return requestJSON((routes.cart_change_url || '/cart/change') + '.js', payload).then(function (cart) {
        applySections(cart);
        announceCart(cart);
        return cart;
      });
    },

    refresh: function () {
      return fetch((routes.cart_url || '/cart') + '.js', { headers: { Accept: 'application/json' } })
        .then(function (r) {
          return r.json();
        })
        .then(function (cart) {
          announceCart(cart);
          return cart;
        });
    }
  };

  /* --------------------------------------------------------- Mengenfeld */
  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-quantity-step]');
    if (!button) return;
    var wrapper = button.closest('[data-quantity]');
    if (!wrapper) return;
    var input = wrapper.querySelector('input[type="number"]');
    if (!input) return;
    var step = parseInt(button.getAttribute('data-quantity-step'), 10);
    var min = parseInt(input.getAttribute('min') || '0', 10);
    var next = Math.max(min, (parseInt(input.value, 10) || 0) + step);
    if (next === (parseInt(input.value, 10) || 0)) return;
    input.value = next;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ------------------------------------------------------- Einblendungen */
  function initReveal() {
    if (!document.body.classList.contains('animations-on')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------ Akkordeon */
  document.addEventListener('click', function (event) {
    var summary = event.target.closest('[data-accordion] > summary');
    if (!summary) return;
    var group = summary.closest('[data-accordion-group]');
    if (!group) return;
    var current = summary.parentElement;
    window.requestAnimationFrame(function () {
      if (!current.hasAttribute('open')) return;
      group.querySelectorAll('[data-accordion][open]').forEach(function (item) {
        if (item !== current) item.removeAttribute('open');
      });
    });
  });

  /* ----------------------------------------------------------- Öffentlich */
  window.VC = {
    trapFocus: trapFocus,
    removeTrapFocus: removeTrapFocus,
    lockScroll: lockScroll,
    unlockScroll: unlockScroll,
    cart: cartApi,
    registerCartSection: registerCartSection,
    routes: routes,
    debounce: function (fn, wait) {
      var timer;
      return function () {
        var args = arguments;
        var self = this;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(self, args);
        }, wait || 200);
      };
    }
  };

  if (document.readyState !== 'loading') initReveal();
  else document.addEventListener('DOMContentLoaded', initReveal);

  document.addEventListener('shopify:section:load', initReveal);
})();

/* ==========================================================================
   Mobile Beratungsleiste
   Bewusst eine eigene, in sich geschlossene Einheit: Sie laeuft unabhaengig
   von den uebrigen Bausteinen und kann daher von keinem anderen Fehler
   angehalten werden.
   Sichtbarkeit hat genau eine Quelle – die Klasse `is-visible`. Ihr Wert
   ergibt sich aus zwei Bedingungen, die bei jedem Bildlauf neu gemessen
   werden: Der Hero ist vollstaendig verlassen und gerade wird nichts
   eingegeben. Weil beides gemessen und nicht gemerkt wird, findet die
   Leiste auch dann in den richtigen Zustand zurueck, wenn ein Ereignis
   ausbleibt – etwa ein `focusout`, das iOS beim Wischen nicht sendet.
   ========================================================================== */
(function () {
  'use strict';

  var bar = document.querySelector('[data-whatsapp-bar]');
  if (!bar) return;

  /* Auf Produktseiten gewinnt der Warenkorb-Button. */
  var hasStickyAtc = Boolean(document.querySelector('[data-sticky-atc]'));
  if (hasStickyAtc) document.body.classList.add('has-sticky-atc');

  var dismissed = false;
  try {
    dismissed = window.sessionStorage.getItem('vc-wa-dismissed') === '1';
  } catch (error) {
    /* Privater Modus: Leiste erscheint dann in jeder Sitzung erneut. */
  }

  if (dismissed || hasStickyAtc) {
    bar.remove();
    return;
  }

  bar.hidden = false;

  /* Solange die Leiste erscheinen kann, haelt der Fussbereich Platz frei.
     Die Klasse wird sofort gesetzt – der reservierte Raum liegt unterhalb
     des Fussbereichs und erzeugt daher keinen sichtbaren Sprung. */
  document.body.classList.add('has-whatsapp-bar');

  var schwelle = parseInt(bar.getAttribute('data-threshold'), 10) || 40;

  /* Wird gerade in ein Feld geschrieben? Bei Fokus tritt die Leiste zurueck,
     damit sie die Tastatur nicht ueberlagert. Der Zustand wird gemessen und
     nicht in einer Body-Klasse gespeichert – eine solche Klasse wuerde die
     Leiste ueberstimmen und nach einer verpassten Abmeldung dauerhaft
     blockieren. */
  function schreibtGerade() {
    var active = document.activeElement;
    if (!active || typeof active.matches !== 'function') return false;
    return active.matches('input:not([type="hidden"]), textarea, select');
  }

  /* Der Hero wird bei jedem Durchlauf neu gesucht: Im Theme-Editor wird ein
     Abschnitt beim Bearbeiten ersetzt, eine einmal gemerkte Referenz zeigte
     danach auf ein entferntes Element. */
  function heroVerlassen() {
    var hero = document.querySelector('.hero2');
    if (hero) return hero.getBoundingClientRect().bottom <= 0;

    /* Seiten ohne Hero: Anteil der Seitenlaenge. */
    var viewport = window.innerHeight || document.documentElement.clientHeight || 0;
    var max = document.documentElement.scrollHeight - viewport;
    if (max <= 0) return false;
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    return (y / max) * 100 >= schwelle;
  }

  function anwenden() {
    bar.classList.toggle('is-visible', heroVerlassen() && !schreibtGerade());
  }

  var ticking = false;
  function pruefen() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      anwenden();
    });
  }

  window.addEventListener('scroll', pruefen, { passive: true });
  window.addEventListener('resize', pruefen);
  window.addEventListener('orientationchange', pruefen);
  window.addEventListener('load', pruefen);
  window.addEventListener('pageshow', pruefen);
  document.addEventListener('focusin', pruefen);
  document.addEventListener('focusout', function () {
    /* iOS gibt den Fokus erst nach dem Ereignis frei. */
    window.setTimeout(pruefen, 60);
  });
  anwenden();

  var dismiss = bar.querySelector('[data-whatsapp-dismiss]');
  if (dismiss) {
    dismiss.addEventListener('click', function () {
      bar.classList.remove('is-visible');
      try {
        window.sessionStorage.setItem('vc-wa-dismissed', '1');
      } catch (error) {
        /* nichts zu tun */
      }
      /* Element und reservierter Platz verschwinden erst nach der
         Ausblendung und gemeinsam – dadurch kein Layoutsprung. */
      window.setTimeout(function () {
        bar.remove();
        document.body.classList.remove('has-whatsapp-bar');
      }, 300);
    });
  }
})();

/* ==========================================================================
   V2-Ergänzungen: Hero-Drift, Tastatur-Zustand, Quick Add
   Alles rein additiv – die Bausteine aus V1 bleiben unverändert.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------- Leisten weichen der Tastatur */
  document.addEventListener('focusin', function (event) {
    if (event.target.matches('input, textarea, select')) {
      document.body.classList.add('is-typing');
    }
  });
  document.addEventListener('focusout', function () {
    window.setTimeout(function () {
      var active = document.activeElement;
      if (!active || !active.matches || !active.matches('input, textarea, select')) {
        document.body.classList.remove('is-typing');
      }
    }, 60);
  });

  /* ------------------------------------------------------------ Hero-Drift */
  var drift = document.querySelector('[data-hero-drift]');
  if (drift && !reduceMotion.matches) {
    var driftTicking = false;
    var updateDrift = function () {
      if (driftTicking) return;
      driftTicking = true;
      window.requestAnimationFrame(function () {
        var rect = drift.getBoundingClientRect();
        var viewport = window.innerHeight || 1;
        /* -1 … 1 über den sichtbaren Bereich, gedeckelt auf 24 px */
        var relative = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        var offset = Math.max(-1, Math.min(1, relative)) * -24;
        drift.style.setProperty('--hero-drift', offset.toFixed(1) + 'px');
        driftTicking = false;
      });
    };
    window.addEventListener('scroll', updateDrift, { passive: true });
    window.addEventListener('resize', updateDrift);
    updateDrift();
  }

  /* -------------------------------------------------- Quick-Add-Rückmeldung */
  document.addEventListener('submit', function (event) {
    var form = event.target.closest('.card__quick-add');
    if (!form) return;
    var button = form.querySelector('button');
    if (!button) return;
    button.setAttribute('data-state', 'added');
    window.setTimeout(function () {
      button.removeAttribute('data-state');
    }, 1400);
  });
})();
