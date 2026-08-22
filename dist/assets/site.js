/* =========================================================================
   I&M CARGO — Interaktion
   Kein Framework, keine Abhängigkeiten. Alles funktioniert auch ohne JS,
   mit Ausnahme des Kontaktpanels (Telefon und E-Mail sind zusätzlich als
   normale Links in Kopf-, Fußzeile und Kontaktbereich erreichbar).
   ========================================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var duration = function () { return reduced.matches ? 0 : 280; };

  var FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /* ---------------------------------------------------------------- Dialog */
  function createDialog(element, options) {
    var opts = options || {};
    var trap = null;
    var lastFocus = null;
    var open = false;

    element.tabIndex = -1;

    function onKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      var items = Array.prototype.filter.call(element.querySelectorAll(FOCUSABLE), function (el) {
        return el.offsetParent !== null || el === document.activeElement;
      });
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
    }

    function show(trigger) {
      if (open) return;
      open = true;
      lastFocus = trigger || document.activeElement;
      element.hidden = false;
      if (opts.backdrop) opts.backdrop.hidden = false;
      /* Reflow erzwingen, damit die Transition greift. */
      void element.offsetWidth;
      element.classList.add('is-open');
      if (opts.backdrop) opts.backdrop.classList.add('is-open');
      document.body.classList.add('is-locked');
      (opts.triggers || []).forEach(function (t) { t.setAttribute('aria-expanded', 'true'); });
      trap = onKeydown;
      document.addEventListener('keydown', trap);
      window.setTimeout(function () { element.focus(); }, reduced.matches ? 0 : 60);
    }

    function close() {
      if (!open) return;
      open = false;
      element.classList.remove('is-open');
      if (opts.backdrop) opts.backdrop.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      (opts.triggers || []).forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
      if (trap) document.removeEventListener('keydown', trap);
      trap = null;
      window.setTimeout(function () {
        element.hidden = true;
        if (opts.backdrop) opts.backdrop.hidden = true;
      }, duration());
      if (lastFocus && typeof lastFocus.focus === 'function' && document.contains(lastFocus)) lastFocus.focus();
    }

    return { show: show, close: close, isOpen: function () { return open; } };
  }

  /* ------------------------------------------------------- Kontaktebene */
  var panel = document.querySelector('[data-contact-panel]');
  if (panel) {
    var backdrop = document.querySelector('[data-contact-backdrop]');
    var openers = Array.prototype.slice.call(document.querySelectorAll('[data-contact-open]'));
    var contactDialog = createDialog(panel, { backdrop: backdrop, triggers: openers });

    openers.forEach(function (button) {
      button.addEventListener('click', function () { contactDialog.show(button); });
    });
    Array.prototype.forEach.call(panel.querySelectorAll('[data-contact-close]'), function (button) {
      button.addEventListener('click', contactDialog.close);
    });
    if (backdrop) backdrop.addEventListener('click', contactDialog.close);

    var requestLink = panel.querySelector('[data-contact-request]');
    if (requestLink) requestLink.addEventListener('click', function () { contactDialog.close(); });
  }

  /* --------------------------------------------------------- Mobiles Menü */
  var menu = document.querySelector('[data-site-menu]');
  if (menu) {
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var menuDialog = createDialog(menu, { triggers: menuToggle ? [menuToggle] : [] });

    if (menuToggle) {
      menuToggle.addEventListener('click', function () {
        if (menuDialog.isOpen()) menuDialog.close();
        else menuDialog.show(menuToggle);
      });
    }
    Array.prototype.forEach.call(menu.querySelectorAll('[data-menu-close]'), function (button) {
      button.addEventListener('click', menuDialog.close);
    });
    Array.prototype.forEach.call(menu.querySelectorAll('[data-menu-link]'), function (link) {
      link.addEventListener('click', menuDialog.close);
    });
    /* Menü ist nur unterhalb des Desktop-Breakpoints vorgesehen. */
    var wide = window.matchMedia('(min-width: 1180px)');
    var onWide = function (event) { if (event.matches) menuDialog.close(); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* --------------------------------------------------------- Kopfzeile */
  var header = document.querySelector('[data-site-header]');
  if (header && 'IntersectionObserver' in window) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;';
    document.body.insertBefore(sentinel, document.body.firstChild);
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* --------------------------------------------------------- Reveal */
  if ('IntersectionObserver' in window && !reduced.matches) {
    var targets = document.querySelectorAll(
      '.section-head, .index__row, .approach__item, .coverage__facts, .career__text, .contact__cols, .services__more'
    );
    if (targets.length) {
      var observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
      Array.prototype.forEach.call(targets, function (el, i) {
        el.setAttribute('data-reveal', '');
        el.style.transitionDelay = Math.min(i % 4, 3) * 60 + 'ms';
        observer.observe(el);
      });
    }
  }

  /* --------------------------------------------------------- Formular */
  var form = document.querySelector('[data-request-form]');
  if (!form) return;

  var i18nNode = document.querySelector('[data-form-i18n]');
  var T = i18nNode ? JSON.parse(i18nNode.textContent) : null;
  if (!T) return;

  var MAX_FILE_BYTES = 10 * 1024 * 1024;
  var MAX_FILES = 5;

  var started = form.querySelector('[data-form-started]');
  if (started) started.value = String(Date.now());

  var messageBox = form.querySelector('[data-form-message]');
  var successBox = document.querySelector('[data-form-success]');
  var submitButton = form.querySelector('[data-submit]');
  var submitLabel = form.querySelector('[data-submit-label]');

  function fieldWrapper(control) {
    return control.closest('.field') || control.closest('.consent') || control.closest('.upload');
  }

  function setError(control, message) {
    var wrapper = fieldWrapper(control);
    if (!wrapper) return;
    var slot = wrapper.querySelector('[data-field-error]');
    if (message) {
      wrapper.classList.add('field--invalid');
      control.setAttribute('aria-invalid', 'true');
      if (slot) { slot.textContent = message; slot.hidden = false; }
    } else {
      wrapper.classList.remove('field--invalid');
      control.removeAttribute('aria-invalid');
      if (slot) { slot.textContent = ''; slot.hidden = true; }
    }
  }

  function validateControl(control) {
    var value = (control.value || '').trim();

    if (control.type === 'checkbox') {
      if (control.required && !control.checked) return T.errors.consent;
      return '';
    }
    if (control.tagName === 'SELECT') {
      if (control.required && !value) return T.errors.select;
      return '';
    }
    if (control.required && !value) return T.errors.required;
    if (control.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return T.errors.email;
    return '';
  }

  function validateFiles(input) {
    if (!input.files || !input.files.length) return '';
    if (input.files.length > MAX_FILES) return T.errors.fileCount;
    for (var i = 0; i < input.files.length; i += 1) {
      if (input.files[i].size > MAX_FILE_BYTES) return T.errors.fileSize;
    }
    return '';
  }

  var controls = Array.prototype.filter.call(form.querySelectorAll('input, select, textarea'), function (el) {
    return el.type !== 'hidden' && el.name !== 'company_website' && el.type !== 'file';
  });

  controls.forEach(function (control) {
    var event = control.type === 'checkbox' || control.tagName === 'SELECT' ? 'change' : 'blur';
    control.addEventListener(event, function () { setError(control, validateControl(control)); });
    control.addEventListener('input', function () {
      if (fieldWrapper(control) && fieldWrapper(control).classList.contains('field--invalid')) {
        setError(control, validateControl(control));
      }
    });
  });

  /* Dateiauswahl */
  var upload = form.querySelector('[data-upload]');
  var uploadList = form.querySelector('[data-upload-list]');
  if (upload && uploadList) {
    upload.addEventListener('change', function () {
      var error = validateFiles(upload);
      setError(upload, error);
      if (!upload.files || !upload.files.length) {
        uploadList.textContent = T.files.none;
        return;
      }
      var names = Array.prototype.map.call(upload.files, function (file) {
        return file.name + ' (' + Math.max(1, Math.round(file.size / 1024)) + ' kB)';
      });
      uploadList.textContent = names.join(' · ');
    });
  }

  function showMessage(title, text, isError) {
    if (!messageBox) return;
    messageBox.innerHTML =
      '<strong></strong><span></span> <a class="js-phone"></a> · <a class="js-mail"></a>';
    messageBox.querySelector('strong').textContent = title;
    messageBox.querySelector('span').textContent = text;
    var phone = messageBox.querySelector('.js-phone');
    phone.href = T.phoneHref;
    phone.textContent = T.phone;
    var mail = messageBox.querySelector('.js-mail');
    mail.href = 'mailto:' + T.email;
    mail.textContent = T.email;
    messageBox.classList.toggle('form-message--error', !!isError);
    messageBox.hidden = false;
  }

  function showPlainMessage(text) {
    if (!messageBox) return;
    messageBox.textContent = text;
    messageBox.classList.add('form-message--error');
    messageBox.hidden = false;
  }

  function succeed() {
    if (!successBox) return;
    form.hidden = true;
    successBox.hidden = false;
    successBox.focus();
    successBox.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'center' });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (messageBox) messageBox.hidden = true;

    var firstInvalid = null;
    controls.forEach(function (control) {
      var error = validateControl(control);
      setError(control, error);
      if (error && !firstInvalid) firstInvalid = control;
    });
    if (upload) {
      var fileError = validateFiles(upload);
      setError(upload, fileError);
      if (fileError && !firstInvalid) firstInvalid = upload;
    }

    if (firstInvalid) {
      showPlainMessage(T.errors.summary);
      firstInvalid.focus();
      return;
    }

    var endpoint = form.getAttribute('data-endpoint');
    if (!endpoint) {
      /* Kein Endpunkt hinterlegt: nichts vortäuschen, direkten Weg anbieten. */
      showMessage(T.notConnected.title, T.notConnected.text, true);
      return;
    }

    if (submitButton) submitButton.disabled = true;
    if (submitLabel) submitLabel.textContent = T.submitting;

    fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (response) {
        if (!response.ok) throw new Error('request failed');
        succeed();
      })
      .catch(function () {
        showMessage(T.failure.title, T.failure.text, true);
      })
      .finally(function () {
        if (submitButton) submitButton.disabled = false;
        if (submitLabel) submitLabel.textContent = T.submit;
      });
  });
})();
