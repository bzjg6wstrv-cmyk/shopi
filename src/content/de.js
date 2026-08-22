import { company } from './company.js';

const c = company;

export const de = {
  lang: 'de',
  locale: 'de-DE',
  label: 'Deutsch',

  ui: {
    skipToContent: 'Zum Inhalt springen',
    menu: 'Menü',
    close: 'Schließen',
    langSwitchLabel: 'Sprache wechseln',
    toEnglish: 'English',
    required: 'Pflichtfeld',
    openContact: 'Kontakt',
    contactAria: 'Kontaktmöglichkeiten öffnen',
  },

  nav: [
    { label: 'Leistungen', href: '#leistungen' },
    { label: 'Arbeitsweise', href: '#arbeitsweise' },
    { label: 'Anfrage', href: '#anfrage' },
    { label: 'Karriere', href: '#karriere' },
    { label: 'Kontakt', href: '#kontakt' },
  ],
  navCta: 'Transport anfragen',

  home: {
    title: 'I&M CARGO – Spedition & Transporte in Bremen | Deutschland & Europa',
    description:
      'I&M CARGO aus Bremen übernimmt Container-, Planen- und Gefahrguttransporte, Komplett- und Teilladungen sowie Direkt- und Sonderfahrten in Deutschland und europaweit. Disposition 24/7 erreichbar.',
  },

  hero: {
    eyebrow: 'Spedition · Bremen',
    headline: ['Transport. Direkt.', 'Verlässlich.'],
    lead: 'Transportlösungen für Unternehmen – deutschlandweit und in ganz Europa. Unsere Disposition ist rund um die Uhr erreichbar.',
    ctaPrimary: 'Transport anfragen',
    ctaSecondary: 'Disposition kontaktieren',
    facts: [
      { label: 'Einsatzgebiet', value: 'Deutschland & Europa' },
      { label: 'Disposition', value: '24/7 erreichbar' },
    ],
    phoneLabel: 'Direkt zur Disposition',
    imageAlt: 'Sattelzug im Fernverkehr auf der Autobahn',
  },

  services: {
    eyebrow: 'Leistungen',
    headline: 'Was wir fahren.',
    lead: 'Für Industrie, Handel, Speditionen und weitere gewerbliche Auftraggeber – vom einzelnen Transport bis zum laufenden Bedarf.',
    items: [
      { n: '01', title: 'Containertransporte', text: 'Transporte gängiger Containerarten und -größen.' },
      { n: '02', title: 'Planentransporte', text: 'Planen, Curtainsider und Tautliner – passend zur jeweiligen Ladung.' },
      { n: '03', title: 'Gefahrguttransporte', text: 'Nach den dafür jeweils geltenden gesetzlichen und technischen Vorgaben.' },
      { n: '04', title: 'Komplettladungen', text: 'FTL-Transporte für gewerbliche Auftraggeber.' },
      { n: '05', title: 'Teilladungen', text: 'LTL- und Teilladungen, soweit sie zur Transportanforderung passen.' },
      { n: '06', title: 'Direkttransporte', text: 'Direkt vom Abholort zum Empfänger.' },
      { n: '07', title: 'Express- & Sonderfahrten', text: 'Zeitkritische und individuell disponierte Transporte.' },
    ],
    moreTitle: 'Weitere Transportlösungen',
    moreText: 'Je nach Anforderung disponieren wir weitere geeignete Lkw- und Aufliegerlösungen. Wenn Sie nicht sicher sind, was zu Ihrer Ladung passt: kurz anfragen, wir klären es am Telefon.',
    moreCta: 'Transportanforderung besprechen',
    imageAlt: 'Containerterminal mit Güterverkehr',
  },

  approach: {
    eyebrow: 'Arbeitsweise',
    headline: 'Wie wir arbeiten.',
    items: [
      { n: '01', title: 'Direkte Kommunikation', text: 'Kurze Wege, klare Absprachen. Sie sprechen mit der Disposition – nicht mit einem Formularsystem.' },
      { n: '02', title: 'Schnelle Erreichbarkeit', text: 'Anfragen erreichen uns telefonisch, per E-Mail oder über das Anfrageformular – auch außerhalb üblicher Bürozeiten.' },
      { n: '03', title: 'Flexible Disposition', text: 'Wir sehen uns jede Anfrage einzeln an und disponieren passend zu Ladung, Termin und Strecke.' },
      { n: '04', title: 'Klare Ansprechpartner', text: 'Sie wissen, wer Ihren Transport betreut, und erreichen dieselbe Ansprechperson wieder.' },
    ],
  },

  europe: {
    eyebrow: 'Einsatzgebiet',
    headline: 'Deutschland & Europa.',
    text: 'Wir fahren national und grenzüberschreitend. Transporte innerhalb Deutschlands disponieren wir genauso wie Fahrten in das europäische Ausland und zurück.',
    facts: [
      { label: 'Sitz', value: 'Bremen, Deutschland' },
      { label: 'National', value: 'Transporte innerhalb Deutschlands' },
      { label: 'International', value: 'Transporte europaweit' },
    ],
    imageAlt: 'Autobahn im europäischen Güterverkehr',
  },

  form: {
    eyebrow: 'Transportanfrage',
    headline: 'Transport anfragen.',
    lead: 'Kurz ausgefüllt und direkt bei der Disposition. Wenn es schnell gehen muss, rufen Sie uns an.',
    asideTitle: 'Lieber direkt?',
    asideText: 'Für kurzfristige Transporte ist der Anruf der schnellste Weg. Die Disposition ist rund um die Uhr erreichbar.',
    callCta: 'Jetzt anrufen',
    mailCta: 'E-Mail schreiben',

    groups: {
      transport: 'Transport',
      cargo: 'Ladung',
      client: 'Auftraggeber',
      documents: 'Dokumente',
    },

    fields: {
      origin: { label: 'Abholort', placeholder: 'PLZ, Ort, Land' },
      destination: { label: 'Zielort', placeholder: 'PLZ, Ort, Land' },
      date: { label: 'Gewünschtes Abholdatum', hint: 'Falls bekannt' },
      type: { label: 'Transportart', placeholder: 'Bitte wählen' },
      cargo: { label: 'Ladungsbeschreibung', placeholder: 'Was soll transportiert werden?' },
      weight: { label: 'Gewicht', placeholder: 'z. B. 12 t', hint: 'Falls bekannt' },
      notes: { label: 'Zusätzliche Informationen', placeholder: 'Abmessungen, Ladehilfsmittel, Zeitfenster, Gefahrgutklasse …' },
      companyName: { label: 'Unternehmen' },
      contactPerson: { label: 'Ansprechpartner' },
      phone: { label: 'Telefon', hint: 'Für Rückfragen' },
      email: { label: 'E-Mail' },
      files: {
        label: 'Dateien anhängen',
        hint: 'Optional: Transportinformationen, Ladungsunterlagen, Fotos. PDF, JPG, PNG – bis 10 MB je Datei, max. 5 Dateien.',
        button: 'Dateien auswählen',
        none: 'Keine Datei ausgewählt',
      },
      consent: {
        labelBefore: 'Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verarbeitet werden. Hinweise dazu in der ',
        linkText: 'Datenschutzerklärung',
        labelAfter: '.',
      },
    },

    types: [
      'Container',
      'Plane',
      'Gefahrgut',
      'Komplettladung',
      'Teilladung',
      'Direkttransport',
      'Express-/Sonderfahrt',
      'Sonstiges',
    ],

    submit: 'Anfrage senden',
    submitting: 'Wird gesendet …',

    errors: {
      required: 'Bitte ausfüllen.',
      email: 'Bitte eine gültige E-Mail-Adresse angeben.',
      select: 'Bitte eine Transportart wählen.',
      consent: 'Bitte bestätigen Sie die Datenschutzhinweise.',
      fileSize: 'Datei zu groß (max. 10 MB je Datei).',
      fileCount: 'Bitte höchstens 5 Dateien auswählen.',
      summary: 'Bitte prüfen Sie die markierten Felder.',
    },

    success: {
      title: 'Anfrage eingegangen.',
      text: 'Vielen Dank. Wir sehen uns Ihre Anfrage an und melden uns bei Ihnen. Wenn es eilig ist, erreichen Sie die Disposition unter',
    },

    failure: {
      title: 'Anfrage konnte nicht gesendet werden.',
      text: 'Bitte versuchen Sie es erneut oder wenden Sie sich direkt an die Disposition:',
    },

    /* Wird angezeigt, solange in src/content/company.js kein formEndpoint hinterlegt ist. */
    notConnected: {
      title: 'Bitte melden Sie sich direkt bei der Disposition.',
      text: 'Ihre Anfrage lässt sich hier gerade nicht absenden. Rufen Sie uns an oder schreiben Sie uns – wir sind rund um die Uhr erreichbar:',
    },
  },

  career: {
    eyebrow: 'Karriere',
    headline: 'Fahren mit I&M.',
    text: 'Sie fahren Lkw und suchen einen neuen Platz? Initiativbewerbungen von Berufskraftfahrerinnen und Berufskraftfahrern sind bei uns jederzeit willkommen.',
    text2: 'Am einfachsten geht es direkt: kurz anrufen oder eine E-Mail schreiben – mit Führerscheinklassen, Erfahrung und ab wann Sie verfügbar sind.',
    ctaPrimary: 'Jetzt Kontakt aufnehmen',
    ctaSecondary: 'Anrufen',
    mailSubject: 'Bewerbung Fahrpersonal',
    imageAlt: 'Verladung auf einem Logistikhof',
  },

  contact: {
    eyebrow: 'Kontakt',
    headline: 'Direkt bei uns.',
    addressTitle: 'Anschrift',
    contactTitle: 'Disposition',
    companyTitle: 'Unternehmen',
    availability: '24/7 erreichbar',
    managingDirectorLabel: 'Geschäftsführung',
    callCta: 'Jetzt anrufen',
    mailCta: 'E-Mail schreiben',
    requestCta: 'Transport anfragen',
    whatsappCta: 'WhatsApp',
  },

  panel: {
    title: '24/7 Disposition',
    phoneLabel: 'Telefon',
    callCta: 'Jetzt anrufen',
    mailLabel: 'E-Mail',
    mailCta: 'E-Mail schreiben',
    whatsappCta: 'WhatsApp',
    requestCta: 'Transport anfragen',
    close: 'Kontakt schließen',
    open: 'Kontakt',
    note: 'Bremen · Deutschland & Europa',
  },

  notFound: {
    title: 'Seite nicht gefunden | I&M CARGO',
    description: 'Diese Seite existiert nicht mehr oder wurde verschoben.',
    code: '404',
    headline: 'Seite nicht gefunden.',
    text: 'Diese Adresse führt ins Leere. Vielleicht wurde die Seite verschoben oder der Link ist unvollständig. Über die Startseite finden Sie alles Weitere – oder Sie rufen direkt die Disposition an.',
    home: 'Zur Startseite',
    call: 'Disposition anrufen',
  },

  footer: {
    tagline: 'Transport. Direkt. Verlässlich.',
    contactTitle: 'Kontakt',
    addressTitle: 'Anschrift',
    legalTitle: 'Rechtliches',
    registerTitle: 'Registerangaben',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    availability: '24/7 erreichbar',
    copyright: (year) => `© ${year} ${c.legalName}`,
    backToTop: 'Nach oben',
  },
};
