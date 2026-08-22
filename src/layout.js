import { company as c, routes } from './content/company.js';
import { esc } from './lib/html.js';
import { header, footer, contact } from './partials/chrome.js';

const ALT = { de: 'en', en: 'de' };

const jsonLd = (t) => ({
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  '@id': `${c.siteUrl}/#organization`,
  name: c.brand,
  legalName: c.legalName,
  url: `${c.siteUrl}/`,
  logo: `${c.siteUrl}/assets/brand/im-cargo-mark-512.png`,
  image: `${c.siteUrl}/assets/brand/og-image.jpg`,
  description: t.home.description,
  telephone: c.phoneDisplay,
  email: c.email,
  vatID: c.vatId,
  address: {
    '@type': 'PostalAddress',
    streetAddress: c.street,
    postalCode: c.postalCode,
    addressLocality: c.city,
    addressCountry: c.countryCode,
  },
  areaServed: [
    { '@type': 'Country', name: t.lang === 'de' ? 'Deutschland' : 'Germany' },
    { '@type': 'Place', name: t.lang === 'de' ? 'Europa' : 'Europe' },
  ],
  knowsLanguage: ['de', 'en'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: t.lang === 'de' ? 'Disposition' : 'Dispatch',
      telephone: c.phoneDisplay,
      email: c.email,
      availableLanguage: ['de', 'en'],
    },
  ],
});

export function document_({ t, routeKey, title, description, bodyClass = '', main, year, withOrganization = false, indexable = true, onHome = routeKey === 'home' }) {
  const canonical = `${c.siteUrl}${routes[routeKey][t.lang]}`;
  const alt = ALT[t.lang];

  return `<!doctype html>
<html lang="${t.lang}" id="top">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${indexable ? `<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="de" href="${c.siteUrl}${routes[routeKey].de}">
<link rel="alternate" hreflang="en" href="${c.siteUrl}${routes[routeKey].en}">
<link rel="alternate" hreflang="x-default" href="${c.siteUrl}${routes[routeKey].de}">` : '<meta name="robots" content="noindex, follow">'}

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(c.brand)}">
<meta property="og:locale" content="${t.lang === 'de' ? 'de_DE' : 'en_GB'}">
<meta property="og:locale:alternate" content="${alt === 'de' ? 'de_DE' : 'en_GB'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${c.siteUrl}/assets/brand/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(c.brand)} – ${esc(t.footer.tagline)}">
<meta name="twitter:card" content="summary_large_image">

<meta name="theme-color" content="#071A2F">
<meta name="format-detection" content="telephone=no">

<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/assets/brand/im-cargo-mark-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/assets/brand/im-cargo-mark-180.png">
<link rel="manifest" href="/site.webmanifest">

<link rel="preload" href="/assets/fonts/archivo-latin-wght.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/ibm-plex-sans-latin-wght.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
${withOrganization ? `<script type="application/ld+json">${JSON.stringify(jsonLd(t))}</script>` : ''}
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#inhalt">${esc(t.ui.skipToContent)}</a>
${header(t, routeKey, onHome)}
<main id="inhalt">
${main}
</main>
${footer(t, routeKey, year)}
${contact(t, routeKey, onHome)}
<script src="/assets/site.js" defer></script>
</body>
</html>
`;
}
