/* Filter und Sortierung über die Shopify Section Rendering API.
   Ohne JavaScript funktioniert das Formular als normaler GET-Request. */
(function () {
  'use strict';

  var container = document.querySelector('[data-collection-section]');
  if (!container) return;

  var sectionId = container.getAttribute('data-collection-section');
  var busy = false;

  function currentParams(form) {
    var params = new URLSearchParams();
    var source = form || document.querySelector('[data-facet-form]');

    if (source) {
      new FormData(source).forEach(function (value, key) {
        if (value === '' || value === null) return;
        params.append(key, value);
      });
    }

    var sort = document.querySelector('[data-sort-select]');
    if (sort && sort.value) params.set('sort_by', sort.value);
    else params.delete('sort_by');

    return params;
  }

  function swap(selector, doc) {
    var fresh = doc.querySelector(selector);
    var current = document.querySelector(selector);
    if (fresh && current) current.innerHTML = fresh.innerHTML;
  }

  function render(params, pushState) {
    if (busy) return;
    busy = true;

    var results = document.querySelector('[data-collection-results]');
    if (results) results.setAttribute('aria-busy', 'true');

    var query = params.toString();
    var url = window.location.pathname + (query ? '?' + query : '');
    var fetchUrl = window.location.pathname + '?' + (query ? query + '&' : '') + 'section_id=' + sectionId;

    fetch(fetchUrl)
      .then(function (response) {
        if (!response.ok) throw new Error(response.status);
        return response.text();
      })
      .then(function (markup) {
        var doc = new DOMParser().parseFromString(markup, 'text/html');
        swap('[data-product-grid]', doc);
        swap('[data-facets-desktop]', doc);
        swap('[data-facets-mobile]', doc);
        swap('[data-active-filters]', doc);
        swap('[data-result-count]', doc);
        swap('[data-pagination]', doc);

        if (pushState !== false) window.history.pushState({ vcFacets: true }, '', url);
      })
      .catch(function () {
        window.location.href = url;
      })
      .finally(function () {
        busy = false;
        if (results) results.setAttribute('aria-busy', 'false');
      });
  }

  var debouncedRender = window.VC.debounce(function (form) {
    render(currentParams(form));
  }, 400);

  document.addEventListener('change', function (event) {
    var form = event.target.closest('[data-facet-form]');
    if (form) {
      if (event.target.type === 'number') debouncedRender(form);
      else render(currentParams(form));
      return;
    }
    if (event.target.closest('[data-sort-select]')) render(currentParams());
  });

  document.addEventListener('submit', function (event) {
    var form = event.target.closest('[data-facet-form]');
    if (!form) return;
    event.preventDefault();
    render(currentParams(form));
  });

  /* Aktive Filter entfernen und „alle entfernen“ */
  document.addEventListener('click', function (event) {
    var chip = event.target.closest('[data-facet-remove]');
    if (!chip) return;
    event.preventDefault();
    var href = chip.getAttribute('href');
    var params = new URLSearchParams(href.split('?')[1] || '');
    render(params);
  });

  window.addEventListener('popstate', function () {
    render(new URLSearchParams(window.location.search), false);
  });
})();
