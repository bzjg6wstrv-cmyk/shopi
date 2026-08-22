import { company as c } from './company.js';

const address = `${c.legalName}<br>${c.street}<br>${c.postalCode} ${c.city}<br>Deutschland`;

export const legalDe = {
  imprint: {
    title: 'Impressum | I&M CARGO',
    description: 'Impressum und Anbieterkennzeichnung der I & M Dienstleistungen GmbH (I&M CARGO), Bremen.',
    eyebrow: 'Rechtliches',
    headline: 'Impressum',
    notice:
      'Diese Seite ist ein vorbereiteter Entwurf auf Grundlage der übermittelten Unternehmensdaten. Sie wurde nicht anwaltlich geprüft. Bitte vor Veröffentlichung prüfen und die unten als offen markierten Punkte ergänzen.',
    flag: 'offen',
    openTitle: 'Vor Veröffentlichung zu ergänzen',
    open: [
      'Inhaltlich verantwortliche Person nach § 18 Abs. 2 MStV (Name und Anschrift) bestätigen.',
      'Erlaubnis bzw. EU-Lizenz für den Güterkraftverkehr und erteilende Behörde, sofern anzugeben.',
      'Angaben zur Berufshaftpflicht- bzw. Verkehrshaftungsversicherung, sofern anzugeben.',
      'Bildnachweise, sobald die Platzhalterbilder durch eigene oder lizenzierte Fotos ersetzt sind.',
      'Gesamten Text vor Livegang rechtlich prüfen lassen.',
    ],
    blocks: [
      {
        title: 'Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)',
        defs: [
          { k: 'Anbieter', v: c.legalName },
          { k: 'Geschäftsbereich', v: 'I&M CARGO' },
          { k: 'Anschrift', v: `${c.street}<br>${c.postalCode} ${c.city}<br>Deutschland` },
          { k: 'Vertreten durch', v: `Geschäftsführerin ${c.managingDirector}` },
        ],
      },
      {
        title: 'Kontakt',
        defs: [
          { k: 'Telefon', v: `<a href="${c.phoneHref}">${c.phoneDisplay}</a>` },
          { k: 'E-Mail', v: `<a href="mailto:${c.email}">${c.email}</a>` },
          { k: 'Website', v: c.domain },
        ],
      },
      {
        title: 'Registereintrag',
        defs: [
          { k: 'Registergericht', v: c.registerCourt },
          { k: 'Handelsregister', v: c.registerNumber },
        ],
      },
      {
        title: 'Umsatzsteuer-Identifikationsnummer',
        paragraphs: ['Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:'],
        defs: [{ k: 'USt-IdNr.', v: c.vatId }],
      },
      {
        title: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
        todo: true,
        paragraphs: [
          'Angabe ist vor Veröffentlichung zu bestätigen. In der Regel werden hier Name und Anschrift der inhaltlich verantwortlichen Person genannt.',
        ],
      },
      {
        title: 'Erlaubnis und Aufsichtsbehörde',
        todo: true,
        paragraphs: [
          'Sofern für die ausgeübte Tätigkeit eine Erlaubnis nach dem Güterkraftverkehrsgesetz oder eine EU-Lizenz vorliegt, sind hier die erteilende Behörde und die Erlaubnis anzugeben. Entsprechende Angaben liegen für diesen Entwurf nicht vor.',
        ],
      },
      {
        title: 'Versicherung',
        todo: true,
        paragraphs: [
          'Angaben zu einer Berufshaftpflicht- bzw. Verkehrshaftungsversicherung (Versicherer, räumlicher Geltungsbereich) sind hier zu ergänzen, sofern sie anzugeben sind. Entsprechende Angaben liegen für diesen Entwurf nicht vor.',
        ],
      },
      {
        title: 'Verbraucherstreitbeilegung',
        paragraphs: [
          'Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Diese Angabe ist vor Veröffentlichung zu prüfen.',
        ],
      },
      {
        title: 'Bildnachweise',
        todo: true,
        paragraphs: [
          'Die derzeit eingebundenen Bilder sind gekennzeichnete Platzhalter. Sobald eigene oder lizenzierte Fotos eingesetzt werden, sind die erforderlichen Bildnachweise hier zu ergänzen.',
        ],
      },
      {
        title: 'Haftung für Inhalte',
        paragraphs: [
          'Die Inhalte dieser Website werden mit Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann keine Gewähr übernommen werden. Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.',
        ],
      },
      {
        title: 'Haftung für Links',
        paragraphs: [
          'Diese Website enthält, soweit vorhanden, Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.',
        ],
      },
      {
        title: 'Urheberrecht',
        paragraphs: [
          'Die auf dieser Website veröffentlichten Inhalte unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Vervielfältigung, Bearbeitung und Verbreitung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung.',
        ],
      },
    ],
  },

  privacy: {
    title: 'Datenschutz | I&M CARGO',
    description: 'Datenschutzhinweise der I & M Dienstleistungen GmbH (I&M CARGO), Bremen.',
    eyebrow: 'Rechtliches',
    headline: 'Datenschutz',
    notice:
      'Diese Datenschutzhinweise sind ein vorbereiteter Entwurf. Sie wurden nicht anwaltlich geprüft und sind vor Veröffentlichung an die tatsächlichen technischen Gegebenheiten (insbesondere Hosting und Formularversand) anzupassen.',
    flag: 'offen',
    openTitle: 'Vor Veröffentlichung zu ergänzen',
    open: [
      'Hosting-Anbieter, Serverstandort und Auftragsverarbeitungsvertrag.',
      'Tatsächlicher Weg des Formularversands (E-Mail-Dienst, Speicherung, beteiligte Dienstleister).',
      'Speicherdauer für Anfragen, Bewerbungen und Server-Logfiles.',
      'Empfänger bzw. Auftragsverarbeiter und mögliche Drittlandübermittlungen.',
      'Prüfung, ob ein Datenschutzbeauftragter zu benennen ist.',
      'Umgang mit WhatsApp-Kontakten, sofern dieser Kanal genutzt wird.',
      'Gesamten Text vor Livegang rechtlich prüfen lassen.',
    ],
    blocks: [
      {
        title: '1. Verantwortlicher',
        paragraphs: ['Verantwortlich für die Datenverarbeitung auf dieser Website ist:'],
        defs: [
          { k: 'Unternehmen', v: address },
          { k: 'Vertreten durch', v: `Geschäftsführerin ${c.managingDirector}` },
          { k: 'Telefon', v: `<a href="${c.phoneHref}">${c.phoneDisplay}</a>` },
          { k: 'E-Mail', v: `<a href="mailto:${c.email}">${c.email}</a>` },
        ],
      },
      {
        title: '2. Datenschutzbeauftragter',
        todo: true,
        paragraphs: [
          'Ob ein Datenschutzbeauftragter zu benennen ist, ist zu prüfen. Entsprechende Angaben liegen für diesen Entwurf nicht vor.',
        ],
      },
      {
        title: '3. Hosting und Server-Logfiles',
        todo: true,
        paragraphs: [
          'Beim Aufruf dieser Website werden durch den Hosting-Anbieter technisch notwendige Daten in Server-Logfiles verarbeitet, üblicherweise IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, übertragene Datenmenge, Referrer sowie Browser- und Betriebssystemangaben. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; das berechtigte Interesse liegt im sicheren und stabilen Betrieb der Website.',
          'Anbieter, Serverstandort, Speicherdauer und der Abschluss eines Auftragsverarbeitungsvertrags sind vor Veröffentlichung zu ergänzen.',
        ],
      },
      {
        title: '4. Keine Cookies, keine externen Dienste',
        paragraphs: [
          'Diese Website setzt keine Cookies und verwendet keine Analyse-, Tracking- oder Werbedienste. Schriftarten, Bilder, Stylesheets und Skripte werden ausschließlich vom eigenen Server ausgeliefert; es werden keine externen Schriftarten-, Karten- oder Videodienste eingebunden. Eine Einwilligung für Cookies ist daher nicht erforderlich.',
          'Werden später weitere Dienste eingebunden, sind diese Hinweise entsprechend zu ergänzen.',
        ],
      },
      {
        title: '5. Kontaktaufnahme per Telefon, E-Mail oder WhatsApp',
        paragraphs: [
          'Wenn Sie uns anrufen oder eine E-Mail schreiben, verarbeiten wir die von Ihnen mitgeteilten Angaben, um Ihr Anliegen zu bearbeiten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Kommunikation der Anbahnung oder Durchführung eines Vertrags dient, im Übrigen Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses an der Bearbeitung von Anfragen.',
          'Sofern Sie uns über WhatsApp kontaktieren, gelten zusätzlich die Datenschutzbestimmungen des jeweiligen Anbieters. Die Nutzung dieses Kanals ist freiwillig; für vertrauliche Angaben empfehlen wir Telefon oder E-Mail. Die Angaben zu diesem Kanal sind vor Veröffentlichung zu prüfen und zu ergänzen.',
        ],
      },
      {
        title: '6. Transportanfrage über das Formular',
        paragraphs: [
          'Über das Anfrageformular verarbeiten wir die von Ihnen eingegebenen Angaben zu Transport, Ladung und Auftraggeber sowie optional hochgeladene Dateien, um Ihre Anfrage zu prüfen und zu beantworten. Pflichtangaben sind als solche gekennzeichnet; weitere Angaben sind freiwillig.',
          'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) und ergänzend Art. 6 Abs. 1 lit. f DSGVO. Zum Schutz vor automatisierten Einsendungen enthält das Formular ein verstecktes Feld sowie eine Zeitprüfung; hierbei werden keine personenbezogenen Daten an Dritte übermittelt.',
          'Der technische Weg des Versands (E-Mail-Zustellung, etwaige Speicherung, beteiligte Dienstleister) ist vor Veröffentlichung zu ergänzen.',
        ],
        todo: true,
      },
      {
        title: '7. Bewerbungen',
        paragraphs: [
          'Wenn Sie sich telefonisch oder per E-Mail bei uns bewerben, verarbeiten wir Ihre Angaben ausschließlich zur Durchführung des Bewerbungsverfahrens. Rechtsgrundlage ist § 26 BDSG in Verbindung mit Art. 6 Abs. 1 lit. b DSGVO. Die Speicherdauer ist vor Veröffentlichung zu ergänzen.',
        ],
        todo: true,
      },
      {
        title: '8. Empfänger und Speicherdauer',
        todo: true,
        paragraphs: [
          'Eine Weitergabe Ihrer Daten erfolgt nur, soweit dies zur Durchführung des Transportauftrags erforderlich ist, Sie eingewilligt haben oder eine gesetzliche Verpflichtung besteht. Konkrete Empfänger, Auftragsverarbeiter, etwaige Übermittlungen in Drittländer sowie die jeweiligen Speicherdauern sind vor Veröffentlichung zu ergänzen. Gesetzliche Aufbewahrungsfristen, insbesondere aus Handels- und Steuerrecht, bleiben unberührt.',
        ],
      },
      {
        title: '9. Ihre Rechte',
        paragraphs: ['Sie haben nach der Datenschutz-Grundverordnung insbesondere folgende Rechte:'],
        list: [
          'Auskunft über die zu Ihrer Person verarbeiteten Daten (Art. 15 DSGVO)',
          'Berichtigung unrichtiger Daten (Art. 16 DSGVO)',
          'Löschung (Art. 17 DSGVO)',
          'Einschränkung der Verarbeitung (Art. 18 DSGVO)',
          'Datenübertragbarkeit (Art. 20 DSGVO)',
          'Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO)',
          'Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)',
        ],
        paragraphsAfter: [
          `Zur Ausübung Ihrer Rechte genügt eine Nachricht an <a href="mailto:${c.email}">${c.email}</a>.`,
        ],
      },
      {
        title: '10. Beschwerderecht bei der Aufsichtsbehörde',
        paragraphs: [
          'Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren, insbesondere bei der Behörde Ihres gewöhnlichen Aufenthaltsorts oder der für uns zuständigen Stelle. Die zuständige Behörde ist vor Veröffentlichung zu benennen und zu prüfen.',
        ],
        todo: true,
      },
      {
        title: '11. Aktualität',
        paragraphs: [
          'Diese Hinweise sind anzupassen, sobald sich die Website, die eingesetzten Dienste oder die Verarbeitungen ändern.',
        ],
      },
    ],
  },
};
