/* Sofortsuche – nutzt ausschließlich die native Shopify-Route /search/suggest.
   Ohne JavaScript bleibt das Formular ein normales Suchformular.            */
(function () {
  'use strict';

  var form = document.querySelector('[data-predictive-search]');
  if (!form) return;

  var input = form.querySelector('input[type="search"]');
  var results = document.querySelector('[data-predictive-results]');
  var status = document.querySelector('[data-predictive-status]');
  if (!input || !results) return;

  var routes = window.VCRoutes || {};
  var strings = window.VCStrings || {};
  var controller = null;
  var lastTerm = '';

  function setStatus(text) {
    if (status) status.textContent = text || '';
  }

  function clear() {
    results.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
    setStatus('');
  }

  function search(term) {
    if (controller) controller.abort();
    controller = new AbortController();

    var params = new URLSearchParams({
      q: term,
      section_id: 'predictive-search'
    });
    params.append('resources[type]', 'product,collection,page,query');
    params.append('resources[limit]', '6');
    params.append('resources[options][unavailable_products]', 'last');
    /* „body" nimmt die Produktbeschreibung mit auf. Duftnoten in Metafeldern
       sind für die Shopify-Suche nicht erreichbar – sie müssen in der
       Beschreibung stehen, damit sie gefunden werden. */
    params.append('resources[options][fields]', 'title,product_type,variants.title,vendor,tag,body');

    setStatus(strings.loading || '');

    fetch((routes.predictive_search_url || '/search/suggest') + '?' + params.toString(), {
      signal: controller.signal
    })
      .then(function (response) {
        if (!response.ok) throw new Error(response.status);
        return response.text();
      })
      .then(function (markup) {
        var parsed = new DOMParser().parseFromString(markup, 'text/html');
        var section = parsed.querySelector('.shopify-section') || parsed.body;
        results.innerHTML = section.innerHTML;
        input.setAttribute('aria-expanded', 'true');

        var count = results.querySelectorAll('[role="option"]').length;
        setStatus(count ? count + '' : '');
      })
      .catch(function (error) {
        if (error.name === 'AbortError') return;
        clear();
        setStatus(strings.error || '');
      });
  }

  var onInput = window.VC.debounce(function () {
    var term = input.value.trim();
    if (term === lastTerm) return;
    lastTerm = term;
    if (term.length < 2) {
      clear();
      return;
    }
    search(term);
  }, 250);

  input.addEventListener('input', onInput);

  input.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    var options = Array.prototype.slice.call(results.querySelectorAll('[role="option"]'));
    if (!options.length) return;
    event.preventDefault();
    var index = options.indexOf(document.activeElement);
    var next = event.key === 'ArrowDown' ? index + 1 : index - 1;
    if (next < 0) {
      input.focus();
      return;
    }
    if (next >= options.length) next = options.length - 1;
    options[next].focus();
  });

  results.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      var options = Array.prototype.slice.call(results.querySelectorAll('[role="option"]'));
      var index = options.indexOf(document.activeElement);
      if (index === -1) return;
      event.preventDefault();
      if (event.key === 'ArrowUp' && index === 0) {
        input.focus();
        return;
      }
      var next = event.key === 'ArrowDown' ? Math.min(index + 1, options.length - 1) : index - 1;
      options[next].focus();
    }
  });

  document.getElementById('SearchDrawer').addEventListener('vc:drawer:close', clear);
})();
