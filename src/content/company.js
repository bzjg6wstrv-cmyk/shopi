/**
 * Einzige Quelle für Unternehmensdaten.
 * Alle Angaben stammen aus dem Briefing. Hier wird nichts ergänzt oder geschätzt.
 */
export const company = {
  legalName: 'I & M Dienstleistungen GmbH',
  brand: 'I&M CARGO',
  managingDirector: 'Amal Alawi',

  street: 'Heinz-Kerneck-Straße 20',
  postalCode: '28307',
  city: 'Bremen',
  countryCode: 'DE',

  phoneDisplay: '+49 176 72442336',
  phoneHref: 'tel:+4917672442336',
  whatsappHref: 'https://wa.me/4917672442336',
  email: 'dispo@im-cargo.de',

  domain: 'www.im-cargo.de',
  siteUrl: 'https://www.im-cargo.de',

  registerCourt: 'Amtsgericht Bremen',
  registerNumber: 'HRB 39821 HB',
  vatId: 'DE366537520',
};

export const routes = {
  home:    { de: '/',             en: '/en/' },
  imprint: { de: '/impressum/',   en: '/en/imprint/' },
  privacy: { de: '/datenschutz/', en: '/en/privacy/' },
};

/**
 * Endpunkt für den Versand der Transportanfrage.
 * TODO (vor Livegang): auf die tatsächliche URL des Formular-Handlers setzen,
 * z. B. '/api/transport-request'. Siehe server/transport-request.example.mjs.
 * Solange der Wert null ist, sendet das Formular nichts und weist die
 * Besucher:innen auf Telefon und E-Mail hin.
 */
export const formEndpoint = null;
