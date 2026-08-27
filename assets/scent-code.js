/* Scent Code – Normalisierung und Auflösung.
   Eingaben wie 47, 047, vc47, VC 047 oder VC-047 führen alle zu VC-047.
   Die Nummernkreise sind nach oben offen: 1250 wird zu VC-1250.

   Auflösung in drei Stufen:
     1. Tabelle der öffentlich gelisteten Düfte (serverseitig gerendert, 0 ms)
     2. native Shopify-Sofortsuche  /search/suggest  (fängt später ergänzte Produkte)
     3. generisches Bestellprodukt mit dem Code als Positionsangabe

   Es gibt keine Sackgasse: Jeder gültig formatierte Code führt irgendwohin.
   Ohne dieses Skript bleiben die Felder normale Suchformulare. */
(function () {
  'use strict';

  var forms = document.querySelectorAll('[data-scent-code-form]');
  if (!forms.length) return;

  var configNode = document.querySelector('[data-scent-code-map]');
  var config = { prefix: 'VC', allowed: [], codes: {}, fallback: '', searchUrl: '/search/suggest' };
  if (configNode) {
    try {
      config = Object.assign(config, JSON.parse(configNode.textContent));
    } catch (error) {
      /* Fehlerhafte Tabelle: Wir arbeiten mit den Standardwerten weiter. */
    }
  }

  var strings = window.VCCodeStrings || {};
  var root = window.VCRoutes || {};

  /* ------------------------------------------------------- Normalisierung */
  /* Erlaubt ist ausschließlich: optionales Präfix, danach ausschließlich
     Ziffern. Ein Minuszeichen, Buchstaben im Zahlteil oder ein Trennzeichen
     ohne Präfix führen zur Ablehnung – „-5", „a7b1" und „71a" sind kein Code.
     Das Muster wird einmal aus dem eingestellten Präfix gebaut. */
  function escapeForRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
  }

  var codePattern = new RegExp(
    '^(?:' + escapeForRegex(config.prefix || 'VC') + '[-_.#\\s]*)?(\\d{1,9})$',
    'i'
  );

  function normalise(raw) {
    if (raw === null || raw === undefined) return null;
    /* Nur außen kürzen, nicht innen: „VC 071" ist ein Code, „1 2" nicht. */
    var value = String(raw).trim();
    if (!value) return null;

    var match = value.match(codePattern);
    if (!match) return null;

    var number = parseInt(match[1], 10);
    /* 0 und 000 sind keine Kennung. Nach oben gibt es keine Grenze: Die
       Nummernkreise wachsen, das Theme darf dabei nicht im Weg stehen. */
    if (!number || number < 1) return null;

    /* Ist eine Liste vergebener Nummern hinterlegt, muss der Code darin stehen.
       Ohne Liste ist jede positive Nummer gültig – siehe README. */
    if (Array.isArray(config.allowed) && config.allowed.length > 0) {
      if (config.allowed.indexOf(number) === -1) return null;
    }

    /* Unter 100 dreistellig mit führenden Nullen, ab 100 die volle Nummer:
       1 → VC-001, 71 → VC-071, 130 → VC-130, 1250 → VC-1250. */
    return config.prefix + '-' + String(number).padStart(3, '0');
  }

  /* --------------------------------------------------------- Auflösung --- */
  function lookupLocal(code) {
    return Object.prototype.hasOwnProperty.call(config.codes, code) ? config.codes[code] : null;
  }

  function lookupRemote(code) {
    var params = new URLSearchParams({ q: code });
    params.append('resources[type]', 'product');
    params.append('resources[limit]', '4');

    return fetch(config.searchUrl + '.json?' + params.toString(), {
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then(function (data) {
        var products = (data.resources && data.resources.results && data.resources.results.products) || [];
        for (var i = 0; i < products.length; i += 1) {
          var title = (products[i].title || '').toUpperCase();
          if (title.indexOf(code) !== -1) return products[i].url;
        }
        return null;
      })
      .catch(function () {
        return null;
      });
  }

  function fallbackUrl(code) {
    if (!config.fallback) return (root.search_url || '/search') + '?q=' + encodeURIComponent(code);
    return (root.root_url === '/' ? '' : root.root_url || '') + '/products/' + config.fallback + '?code=' + encodeURIComponent(code);
  }

  /* ----------------------------------------------------------- Interface - */
  function setStatus(form, message, tone) {
    var status = form.querySelector('[data-scent-code-status]');
    if (!status) return;
    status.textContent = message || '';
    status.setAttribute('data-tone', tone || '');
  }

  function shake(form) {
    var row = form.querySelector('.code-field__row');
    if (!row) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    row.classList.remove('is-invalid');
    /* Reflow erzwingen, damit die Animation erneut startet. */
    void row.offsetWidth;
    row.classList.add('is-invalid');
  }

  function succeed(form) {
    var row = form.querySelector('.code-field__row');
    if (row) row.classList.add('is-valid');
  }

  function resolve(form, code) {
    var local = lookupLocal(code);
    if (local) {
      succeed(form);
      setStatus(form, (strings.found || '').replace('__CODE__', code), 'ok');
      window.location.href = (root.root_url === '/' ? '' : root.root_url || '') + '/products/' + local.handle;
      return;
    }

    setStatus(form, strings.checking || '', '');

    lookupRemote(code).then(function (url) {
      succeed(form);
      if (url) {
        setStatus(form, (strings.found || '').replace('__CODE__', code), 'ok');
        window.location.href = url;
      } else {
        setStatus(form, (strings.order || '').replace('__CODE__', code), 'ok');
        window.location.href = fallbackUrl(code);
      }
    });
  }

  forms.forEach(function (form) {
    /* Felder mit mode="local" werden von der jeweiligen Seite selbst
       verarbeitet (z. B. der generische Bestellweg) – hier nichts tun. */
    if (form.getAttribute('data-scent-code-form') === 'local') return;

    var input = form.querySelector('[data-scent-code-input]');
    if (!input) return;

    /* Während der Eingabe nur aufräumen, nicht bewerten – Bewertung beim Absenden. */
    input.addEventListener('input', function () {
      var row = form.querySelector('.code-field__row');
      if (row) row.classList.remove('is-invalid', 'is-valid');
      setStatus(form, '', '');
    });

    form.addEventListener('submit', function (event) {
      var code = normalise(input.value);
      if (!code) {
        event.preventDefault();
        shake(form);
        setStatus(form, strings.invalid || '', 'error');
        input.focus();
        return;
      }
      event.preventDefault();
      resolve(form, code);
    });
  });

  /* Von anderen Bausteinen nutzbar (Suche, Discovery Set). */
  window.VCScentCode = {
    normalise: normalise,
    lookupLocal: lookupLocal,
    lookupRemote: lookupRemote,
    fallbackUrl: fallbackUrl,
    config: config
  };
})();
