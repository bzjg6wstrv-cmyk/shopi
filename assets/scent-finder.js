/* Duftfinder.
   Übersetzt die Antworten in echte Shopify-Filter und prüft vor der
   Weiterleitung, ob die Kombination Treffer hat. Es wird nie eine leere
   Ergebnisseite als Erfolg dargestellt. Ohne dieses Skript bleibt das
   Formular ein funktionierender GET-Request. */
(function () {
  'use strict';

  var form = document.querySelector('[data-scent-finder]');
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll('[data-finder-step]'));
  if (!steps.length) return;

  var mode = form.getAttribute('data-mode') || 'metafield';
  var collectionUrl = form.getAttribute('data-collection-url') || '/collections/all';
  var progress = form.querySelector('[data-finder-progress]');
  var progressFill = form.querySelector('[data-finder-progress-fill]');
  var stepLabel = form.querySelector('[data-finder-step-label]');
  var backButton = form.querySelector('[data-finder-back]');
  var submitButton = form.querySelector('[data-finder-submit]');
  var statusEl = form.querySelector('[data-finder-status]');
  var strings = window.VCFinderStrings || {};

  var STORAGE_KEY = 'vc-scent-finder';
  var current = 0;

  form.classList.add('js-on');
  if (progress) progress.hidden = false;

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(value);
    return String(value).replace(/["\\]/g, '\\$&');
  }

  function slugify(value) {
    return value
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function selections() {
    return steps.map(function (step) {
      var checked = step.querySelector('input[type="radio"]:checked');
      return checked ? { name: checked.name, value: checked.value } : null;
    });
  }

  function saveState() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selections()));
    } catch (error) {
      /* Privater Modus – Zustand wird dann nicht gespeichert. */
    }
  }

  function restoreState() {
    var raw;
    try {
      raw = window.sessionStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return;
    }
    if (!raw) return;
    var saved;
    try {
      saved = JSON.parse(raw);
    } catch (error) {
      return;
    }
    if (!Array.isArray(saved)) return;
    saved.forEach(function (entry, index) {
      if (!entry || !steps[index]) return;
      var input = steps[index].querySelector('input[value="' + cssEscape(entry.value) + '"]');
      if (input) input.checked = true;
    });
  }

  function showStep(index) {
    current = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach(function (step, i) {
      step.hidden = i !== current;
    });
    if (backButton) backButton.hidden = current === 0;
    if (stepLabel) {
      stepLabel.textContent = (strings.step || '__CURRENT__ / __TOTAL__')
        .replace('__CURRENT__', current + 1)
        .replace('__TOTAL__', steps.length);
    }
    if (progressFill) {
      progressFill.style.width = ((current + 1) / steps.length) * 100 + '%';
    }
    if (submitButton) {
      submitButton.hidden = current !== steps.length - 1;
    }
    var legend = steps[current].querySelector('legend');
    if (legend) legend.setAttribute('tabindex', '-1');
    if (legend && document.activeElement !== document.body) legend.focus();
  }

  function activeSelections() {
    return selections().filter(Boolean);
  }

  function buildUrl(chosen) {
    if (mode === 'tag') {
      var tags = chosen.map(function (entry) {
        return slugify(entry.value);
      });
      return collectionUrl.replace(/\/$/, '') + (tags.length ? '/' + tags.join('+') : '');
    }
    var params = new URLSearchParams();
    chosen.forEach(function (entry) {
      params.append(entry.name, entry.value);
    });
    var query = params.toString();
    return collectionUrl + (query ? '?' + query : '');
  }

  function countFor(url) {
    var separator = url.indexOf('?') === -1 ? '?' : '&';
    return fetch(url + separator + 'section_id=facet-count')
      .then(function (response) {
        if (!response.ok) throw new Error(response.status);
        return response.text();
      })
      .then(function (markup) {
        var doc = new DOMParser().parseFromString(markup, 'text/html');
        var node = doc.querySelector('[data-facet-count]');
        return node ? parseInt(node.textContent.trim(), 10) : null;
      });
  }

  /* Findet die engste Kombination mit Treffern. Gibt es keine, wird der
     zuletzt gesetzte Filter gelöst – und das dem Kunden auch gesagt. */
  function resolve(chosen) {
    var url = buildUrl(chosen);
    return countFor(url).then(function (count) {
      if (count === null) return { url: url, relaxed: false };
      if (count > 0) return { url: url, relaxed: false };
      if (chosen.length <= 1) return { url: buildUrl([]), relaxed: true };
      return resolve(chosen.slice(0, -1)).then(function (result) {
        return { url: result.url, relaxed: true };
      });
    });
  }

  form.addEventListener('change', function (event) {
    if (event.target.type !== 'radio') return;
    saveState();
    if (current < steps.length - 1) {
      window.setTimeout(function () {
        showStep(current + 1);
      }, 180);
    }
  });

  form.addEventListener('click', function (event) {
    if (event.target.closest('[data-finder-skip]')) {
      event.preventDefault();
      showStep(current + 1);
      return;
    }
    if (event.target.closest('[data-finder-back]')) {
      event.preventDefault();
      showStep(current - 1);
      return;
    }
    if (event.target.closest('[data-finder-reset]')) {
      window.setTimeout(function () {
        try {
          window.sessionStorage.removeItem(STORAGE_KEY);
        } catch (error) {
          /* nichts zu tun */
        }
        if (statusEl) statusEl.textContent = '';
        showStep(0);
      }, 0);
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var chosen = activeSelections();

    if (!chosen.length) {
      window.location.href = collectionUrl;
      return;
    }

    if (submitButton) submitButton.setAttribute('aria-disabled', 'true');
    if (statusEl) statusEl.textContent = strings.checking || '';

    resolve(chosen)
      .then(function (result) {
        if (result.relaxed && statusEl) statusEl.textContent = strings.noExactMatch || '';
        window.location.href = result.url;
      })
      .catch(function () {
        window.location.href = buildUrl(chosen);
      });
  });

  restoreState();
  showStep(0);
})();
