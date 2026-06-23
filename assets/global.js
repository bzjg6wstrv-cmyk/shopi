/* ==========================================================================
   Shopi Modern — global.js
   Web components & interactions: cart drawer (AJAX), product form, variants,
   sticky add-to-cart, predictive search, quantity inputs, reveal-on-scroll.
   ========================================================================== */
(function () {
  'use strict';

  const config = window.Shopi || {};
  const routes = config.routes || {};
  const strings = config.strings || {};

  /* ----------------------------- Helpers ------------------------------ */
  const onReady = (fn) =>
    document.readyState !== 'loading'
      ? fn()
      : document.addEventListener('DOMContentLoaded', fn);

  function postJSON(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => r.json());
  }

  function parseHTML(html) {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  const debounce = (fn, wait = 250) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), wait);
    };
  };

  function trapBodyScroll(lock) {
    document.body.classList.toggle('overflow-hidden', lock);
  }

  // Shopify-compatible money formatter.
  function formatMoney(cents, format) {
    if (typeof cents === 'string') cents = cents.replace('.', '');
    format = format || config.moneyFormat || '${{amount}}';
    const placeholder = /\{\{\s*(\w+)\s*\}\}/;
    const fallback = (v, d) => (v == null || v !== v ? d : v);
    function withDelimiters(number, precision, thousands, decimal) {
      precision = fallback(precision, 2);
      thousands = fallback(thousands, ',');
      decimal = fallback(decimal, '.');
      if (isNaN(number) || number == null) return '0';
      number = (number / 100.0).toFixed(precision);
      const parts = number.split('.');
      const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      const cents = parts[1] ? decimal + parts[1] : '';
      return dollars + cents;
    }
    const match = format.match(placeholder);
    const token = match ? match[1] : 'amount';
    let value = '';
    switch (token) {
      case 'amount': value = withDelimiters(cents, 2); break;
      case 'amount_no_decimals': value = withDelimiters(cents, 0); break;
      case 'amount_with_comma_separator': value = withDelimiters(cents, 2, '.', ','); break;
      case 'amount_no_decimals_with_comma_separator': value = withDelimiters(cents, 0, '.', ','); break;
      case 'amount_with_space_separator': value = withDelimiters(cents, 2, ' ', ','); break;
      case 'amount_no_decimals_with_space_separator': value = withDelimiters(cents, 0, ' ', ''); break;
      case 'amount_with_apostrophe_separator': value = withDelimiters(cents, 2, "'", '.'); break;
      default: value = withDelimiters(cents, 2);
    }
    return format.replace(placeholder, value);
  }

  function buildPriceHTML(variant) {
    const price = formatMoney(variant.price);
    if (variant.compare_at_price && variant.compare_at_price > variant.price) {
      return (
        '<div class="price price--on-sale"><span class="price__sale">' +
        price +
        '</span> <s class="price__compare">' +
        formatMoney(variant.compare_at_price) +
        '</s></div>'
      );
    }
    return '<div class="price"><span class="price__regular">' + price + '</span></div>';
  }

  // Broadcast cart state so any component (header bubble, drawer) can react.
  function publishCart(cart) {
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
  }

  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = count;
      el.classList.toggle('is-empty', count === 0);
      if (count > 0) {
        el.classList.remove('bump');
        void el.offsetWidth; // reflow to restart animation
        el.classList.add('bump');
      }
    });
  }

  /* --------------------------- Cart Drawer ---------------------------- */
  class CartDrawer extends HTMLElement {
    constructor() {
      super();
      this.contentSelector = '#CartDrawerContents';
    }

    connectedCallback() {
      this.overlay = this.querySelector('.cart-drawer__overlay');
      this.addEventListener('click', (e) => {
        if (e.target.matches('.cart-drawer__overlay') || e.target.closest('[data-cart-close]')) this.close();
        const removeBtn = e.target.closest('[data-cart-remove]');
        if (removeBtn) {
          e.preventDefault();
          this.changeLine(removeBtn.dataset.key, 0, removeBtn.closest('.cart-item'));
        }
      });

      // Quantity changes & order note inside the drawer
      this.addEventListener('change', (e) => {
        const input = e.target.closest('input[data-key]');
        if (input) {
          this.changeLine(input.dataset.key, input.value, input.closest('.cart-item'));
          return;
        }
        if (e.target.matches('textarea[name="note"]')) {
          postJSON('/cart/update.js', { note: e.target.value }).catch(() => {});
        }
      });

      // Open from any cart toggle button
      document.addEventListener('click', (e) => {
        if (e.target.closest('[data-cart-toggle]')) {
          e.preventDefault();
          this.open();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.classList.contains('is-open')) this.close();
      });

      // React to items added elsewhere
      document.addEventListener('cart:added', (e) => {
        if (e.detail && e.detail.sections) this.renderFromSections(e.detail.sections);
        this.open();
      });
    }

    open() {
      this.classList.add('is-open');
      this.setAttribute('aria-hidden', 'false');
      trapBodyScroll(true);
      const focusable = this.querySelector('[data-cart-close]');
      if (focusable) focusable.focus();
    }

    close() {
      this.classList.remove('is-open');
      this.setAttribute('aria-hidden', 'true');
      trapBodyScroll(false);
      const toggle = document.querySelector('[data-cart-toggle]');
      if (toggle) toggle.focus();
    }

    changeLine(key, quantity, itemEl) {
      if (itemEl) itemEl.classList.add('is-loading');
      postJSON(routes.cart_change_url || '/cart/change.js', {
        id: key,
        quantity: Number(quantity),
        sections: 'cart-drawer',
        sections_url: window.location.pathname,
      })
        .then((cart) => {
          if (cart.sections) this.renderFromSections(cart.sections);
          updateCartCount(cart.item_count);
          publishCart(cart);
        })
        .catch(() => itemEl && itemEl.classList.remove('is-loading'));
    }

    renderFromSections(sections) {
      const html = sections['cart-drawer'];
      if (!html) return;
      const fresh = parseHTML(html).querySelector(this.contentSelector);
      const current = this.querySelector(this.contentSelector);
      if (fresh && current) {
        current.innerHTML = fresh.innerHTML;
        const count = fresh.getAttribute('data-item-count');
        if (count !== null) {
          current.setAttribute('data-item-count', count);
          updateCartCount(Number(count));
        }
      }
    }
  }
  customElements.define('cart-drawer', CartDrawer);

  /* --------------------------- Product Form --------------------------- */
  class ProductForm extends HTMLElement {
    connectedCallback() {
      this.form = this.querySelector('form');
      if (!this.form) return;
      this.submitButton = this.querySelector('[type="submit"]');
      this.form.addEventListener('submit', this.onSubmit.bind(this));
    }

    onSubmit(evt) {
      evt.preventDefault();
      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.setLoading(true);
      const formData = new FormData(this.form);
      formData.append('sections', 'cart-drawer');
      formData.append('sections_url', window.location.pathname);

      fetch(routes.cart_add_url || '/cart/add.js', {
        method: 'POST',
        headers: { Accept: 'application/javascript', 'X-Requested-With': 'XMLHttpRequest' },
        body: formData,
      })
        .then((r) => r.json())
        .then((response) => {
          if (response.status) {
            this.showError(response.description || response.message);
            return;
          }
          this.flashAdded();
          const drawer = document.querySelector('cart-drawer');
          if (drawer) {
            document.dispatchEvent(
              new CustomEvent('cart:added', { detail: { sections: response.sections } })
            );
          } else if (routes.cart_url) {
            window.location.href = routes.cart_url;
          }
        })
        .catch(() => this.showError())
        .finally(() => this.setLoading(false));
    }

    setLoading(state) {
      if (!this.submitButton) return;
      this.submitButton.classList.toggle('loading', state);
      this.submitButton.setAttribute('aria-busy', state);
    }

    flashAdded() {
      if (!this.submitButton) return;
      const label = this.submitButton.querySelector('.button__text');
      if (!label) return;
      const original = label.dataset.add || label.textContent;
      label.dataset.add = original;
      label.textContent = strings.added || 'Added ✓';
      setTimeout(() => (label.textContent = original), 1800);
    }

    showError(message) {
      const box = this.querySelector('[data-form-error]');
      if (box) {
        box.textContent = message || 'Something went wrong. Please try again.';
        box.hidden = false;
      } else {
        console.warn('[Shopi] add to cart failed:', message);
      }
    }
  }
  customElements.define('product-form', ProductForm);

  /* -------------------------- Quantity Input -------------------------- */
  class QuantityInput extends HTMLElement {
    connectedCallback() {
      this.input = this.querySelector('input');
      this.querySelectorAll('button').forEach((btn) =>
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const step = btn.dataset.action === 'increase' ? 1 : -1;
          const min = Number(this.input.min || 1);
          const next = Math.max(min, (Number(this.input.value) || min) + step);
          if (next !== Number(this.input.value)) {
            this.input.value = next;
            this.input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        })
      );
    }
  }
  customElements.define('quantity-input', QuantityInput);

  /* ------------------------- Variant Selector ------------------------- */
  class VariantSelector extends HTMLElement {
    connectedCallback() {
      this.variants = JSON.parse(this.querySelector('[type="application/json"]').textContent);
      this.idInput = this.querySelector('[name="id"]');
      this.priceTarget = document.getElementById(this.dataset.priceTarget);
      this.submitButton = document.querySelector(`#${this.dataset.formId} [type="submit"]`);
      this.addEventListener('change', this.onChange.bind(this));
      this.currentVariant = this.variants.find((v) => String(v.id) === String(this.idInput.value)) || this.variants[0];
    }

    get selectedOptions() {
      return Array.from(this.querySelectorAll('input:checked, select')).map((el) => el.value);
    }

    onChange() {
      const selected = this.selectedOptions;
      const match = this.variants.find((v) =>
        v.options.every((opt, i) => opt === selected[i])
      );
      this.currentVariant = match;
      this.updateUI(match);
    }

    updateUI(variant) {
      if (!variant) {
        this.toggleButton(false, strings.unavailable || 'Unavailable');
        return;
      }
      this.idInput.value = variant.id;

      // Update URL without reload
      if (variant.id) {
        const url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({}, '', url);
      }

      // Price
      if (this.priceTarget) {
        this.priceTarget.innerHTML = buildPriceHTML(variant);
      }

      // Availability
      this.toggleButton(variant.available, variant.available ? null : strings.soldOut || 'Sold out');

      // Featured media
      if (variant.featured_media) {
        document.dispatchEvent(
          new CustomEvent('variant:media', { detail: { mediaId: variant.featured_media } })
        );
      }

      document.dispatchEvent(new CustomEvent('variant:changed', { detail: { variant } }));
    }

    toggleButton(available, label) {
      if (!this.submitButton) return;
      const text = this.submitButton.querySelector('.button__text');
      this.submitButton.setAttribute('aria-disabled', String(!available));
      this.submitButton.toggleAttribute('disabled', !available);
      if (text) text.textContent = label || strings.addToCart || text.dataset.add || 'Add to cart';
    }
  }
  customElements.define('variant-selector', VariantSelector);

  /* ------------------------- Product Gallery -------------------------- */
  class ProductGallery extends HTMLElement {
    connectedCallback() {
      this.main = this.querySelector('[data-gallery-main]');
      this.querySelectorAll('[data-thumb]').forEach((thumb) =>
        thumb.addEventListener('click', () => this.select(thumb.dataset.mediaId))
      );
      document.addEventListener('variant:media', (e) => this.select(e.detail.mediaId));
    }

    select(mediaId) {
      if (!mediaId) return;
      const target = this.querySelector(`[data-media-id="${mediaId}"]`);
      if (target && this.main) {
        this.main.querySelectorAll('[data-media-id]').forEach((m) => (m.hidden = true));
        const mainMedia = this.main.querySelector(`[data-media-id="${mediaId}"]`);
        if (mainMedia) mainMedia.hidden = false;
      }
      this.querySelectorAll('[data-thumb]').forEach((t) =>
        t.setAttribute('aria-current', String(t.dataset.mediaId === String(mediaId)))
      );
    }
  }
  customElements.define('product-gallery', ProductGallery);

  /* ------------------------- Sticky Add To Cart ----------------------- */
  class StickyCart extends HTMLElement {
    connectedCallback() {
      this.target = document.querySelector(this.dataset.watch);
      this.formId = this.dataset.formId;
      this.button = this.querySelector('[data-sticky-add]');
      if (this.button && this.formId) {
        this.button.addEventListener('click', () => {
          const form = document.getElementById(this.formId);
          if (form) form.requestSubmit ? form.requestSubmit() : form.querySelector('[type=submit]').click();
        });
      }
      if (!this.target || !('IntersectionObserver' in window)) return;

      this.observer = new IntersectionObserver(
        ([entry]) => {
          // Show the bar once the main buy button has scrolled out of view.
          const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          this.classList.toggle('is-visible', show);
        },
        { threshold: 0 }
      );
      this.observer.observe(this.target);

      // Mirror availability from the main form button
      document.addEventListener('variant:changed', (e) => this.sync(e.detail.variant));
    }

    sync(variant) {
      if (!this.button) return;
      const available = variant && variant.available;
      this.button.toggleAttribute('disabled', !available);
      const price = this.querySelector('[data-sticky-price]');
      if (price && variant) price.innerHTML = formatMoney(variant.price);
    }
  }
  customElements.define('sticky-cart', StickyCart);

  /* -------------------------- Predictive Search ----------------------- */
  class PredictiveSearch extends HTMLElement {
    connectedCallback() {
      this.input = this.querySelector('input[type="search"]');
      this.results = this.querySelector('[data-search-results]');
      this.overlay = this.querySelector('.search-modal__overlay');

      this.input.addEventListener('input', debounce(() => this.search(), 250));
      this.addEventListener('click', (e) => {
        if (e.target.matches('.search-modal__overlay') || e.target.closest('[data-search-close]')) this.close();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.classList.contains('is-open')) this.close();
      });
      document.addEventListener('click', (e) => {
        if (e.target.closest('[data-search-toggle]')) {
          e.preventDefault();
          this.open();
        }
      });
    }

    open() {
      this.classList.add('is-open');
      trapBodyScroll(true);
      setTimeout(() => this.input.focus(), 50);
    }

    close() {
      this.classList.remove('is-open');
      trapBodyScroll(false);
    }

    search() {
      const q = this.input.value.trim();
      if (q.length < 2) {
        this.results.innerHTML = '';
        return;
      }
      this.results.setAttribute('aria-busy', 'true');
      const url = `${routes.predictive_search_url || '/search/suggest'}?q=${encodeURIComponent(
        q
      )}&section_id=predictive-search&resources[type]=product&resources[limit]=6`;

      fetch(url)
        .then((r) => r.text())
        .then((text) => {
          const doc = parseHTML(text);
          const fresh = doc.querySelector('#predictive-results');
          this.results.innerHTML = fresh ? fresh.innerHTML : '';
        })
        .catch(() => {})
        .finally(() => this.results.removeAttribute('aria-busy'));
    }
  }
  customElements.define('predictive-search', PredictiveSearch);

  /* --------------------------- Mobile Menu ---------------------------- */
  function initMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (!menu) return;
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-menu-toggle]')) {
        menu.classList.add('is-open');
        trapBodyScroll(true);
      }
      if (e.target.closest('[data-menu-close]') || e.target === menu) {
        menu.classList.remove('is-open');
        trapBodyScroll(false);
      }
    });
  }

  /* ------------------------ Reveal on scroll -------------------------- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
  }

  onReady(() => {
    initMobileMenu();
    initReveal();
  });
})();
