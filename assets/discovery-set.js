/* Discovery Set – Auswahl von fünf Düften.
   Die Auswahl wird beim Absenden als Positionseigenschaften an das native
   Shopify-Produktformular gehängt. Es gibt keinen eigenen Warenkorb und
   keinen zweiten Datenspeicher. */
(function () {
  'use strict';

  var form = document.querySelector('[data-discovery-form]');
  if (!form) return;

  var grid = form.querySelector('[data-picker-grid]');
  var searchInput = form.querySelector('[data-picker-search]');
  var counter = document.querySelector('[data-picker-counter]');
  var counterValue = document.querySelector('[data-picker-count]');
  var slots = document.querySelectorAll('[data-slot]');
  var submit = form.querySelector('[data-discovery-submit]');
  var status = form.querySelector('[data-picker-status]');
  var propertyHost = form.querySelector('[data-discovery-properties]');
  var strings = window.VCDiscoveryStrings || {};

  var max = parseInt(form.getAttribute('data-max'), 10) || 5;
  var sourceUrl = form.getAttribute('data-source-url');
  var sourceCount = parseInt(form.getAttribute('data-source-count'), 10) || 0;
  var activeFamily = '';

  /* --- Weitere Seiten nachladen (eine Liquid-Schleife gibt max. 50 aus) --- */
  function loadPage(page) {
    return fetch(sourceUrl + '?section_id=discovery-picker&page=' + page)
      .then(function (response) {
        if (!response.ok) throw new Error(response.status);
        return response.text();
      })
      .then(function (markup) {
        var doc = new DOMParser().parseFromString(markup, 'text/html');
        var picks = doc.querySelectorAll('[data-pick]');
        picks.forEach(function (pick) {
          grid.appendChild(document.importNode(pick, true));
        });
        var container = doc.querySelector('[data-picker-page]');
        return container ? container.getAttribute('data-has-next') === 'true' : false;
      });
  }

  function loadRemaining() {
    if (sourceCount <= 50 || !sourceUrl) return;
    var page = 2;
    var maxPages = Math.ceil(sourceCount / 50);

    function next() {
      if (page > maxPages) {
        applyFilters();
        return;
      }
      loadPage(page)
        .then(function (hasNext) {
          page += 1;
          if (hasNext && page <= maxPages) next();
          else applyFilters();
        })
        .catch(function () {
          applyFilters();
        });
    }
    next();
  }

  /* ------------------------------------------------------------ Filter --- */
  function applyFilters() {
    var term = (searchInput ? searchInput.value : '').trim().toLowerCase();
    var visible = 0;

    grid.querySelectorAll('[data-pick]').forEach(function (pick) {
      var haystack = pick.getAttribute('data-search') || '';
      var families = (pick.getAttribute('data-family') || '').toLowerCase();
      var matchesTerm = !term || haystack.indexOf(term) !== -1;
      var matchesFamily = !activeFamily || families.indexOf(activeFamily.toLowerCase()) !== -1;
      var checked = pick.querySelector('input').checked;
      var show = (matchesTerm && matchesFamily) || checked;
      pick.hidden = !show;
      if (show) visible += 1;
    });

    if (status) status.textContent = visible === 0 ? strings.noMatches || '' : '';
  }

  /* --------------------------------------------------------- Auswahl ---- */
  function chosenInputs() {
    return Array.prototype.slice.call(grid.querySelectorAll('input:checked'));
  }

  function updateState() {
    var chosen = chosenInputs();

    grid.querySelectorAll('input').forEach(function (input) {
      input.disabled = !input.checked && chosen.length >= max;
    });

    slots.forEach(function (slot, index) {
      var entry = chosen[index];
      if (entry) {
        slot.textContent = entry.value.split(' · ')[0];
        slot.classList.add('is-filled');
      } else {
        slot.textContent = strings.slotEmpty || '';
        slot.classList.remove('is-filled');
      }
    });

    if (counterValue) counterValue.textContent = chosen.length;
    if (counter) {
      counter.textContent = (strings.selected || '__COUNT__ / __MAX__')
        .replace('__COUNT__', chosen.length)
        .replace('__MAX__', max);
    }

    if (submit) submit.disabled = chosen.length !== max;
  }

  /* ------------------------------------------------------------ Events --- */
  grid.addEventListener('change', function (event) {
    if (event.target.type !== 'checkbox') return;
    updateState();
  });

  if (searchInput) {
    searchInput.addEventListener('input', window.VC.debounce(applyFilters, 180));
  }

  form.addEventListener('click', function (event) {
    var button = event.target.closest('[data-picker-family]');
    if (!button) return;
    event.preventDefault();
    activeFamily = button.getAttribute('data-picker-family') || '';
    form.querySelectorAll('[data-picker-family]').forEach(function (node) {
      node.setAttribute('aria-pressed', node === button ? 'true' : 'false');
    });
    applyFilters();
  });

  form.addEventListener('submit', function (event) {
    var chosen = chosenInputs();
    if (chosen.length !== max) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (status) status.textContent = strings.incomplete || '';
      return;
    }

    propertyHost.innerHTML = '';
    var handles = [];

    chosen.forEach(function (input, index) {
      var field = document.createElement('input');
      field.type = 'hidden';
      field.name = 'properties[' + (strings.label || 'Duft') + ' ' + (index + 1) + ']';
      field.value = input.value;
      propertyHost.appendChild(field);
      handles.push(input.getAttribute('data-handle'));
    });

    /* Versteckte, maschinenlesbare Fassung für Kommissionierung und Export. */
    var hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = 'properties[_vc_handles]';
    hidden.value = handles.join(',');
    propertyHost.appendChild(hidden);
  });

  updateState();
  loadRemaining();
})();
