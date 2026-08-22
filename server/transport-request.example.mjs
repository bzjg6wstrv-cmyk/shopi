/**
 * BEISPIEL-HANDLER FÜR DAS ANFRAGEFORMULAR — NOCH NICHT ANGEBUNDEN
 * ================================================================
 * Dieses Modul ist bewusst ein Gerüst. Es versendet nichts.
 * Es zeigt, welche serverseitigen Prüfungen vor dem Livegang nötig sind.
 *
 * Anbinden:
 *   1. Diesen Handler in der Hosting-Umgebung bereitstellen
 *      (Node-Server, Serverless-Function o. Ä.) und unter einer URL
 *      erreichbar machen, z. B. POST /api/transport-request.
 *   2. In src/content/company.js `formEndpoint` auf genau diese URL setzen.
 *   3. Den mit TODO markierten Versand implementieren (SMTP der Domain
 *      im-cargo.de oder ein Transaktions-E-Mail-Dienst).
 *   4. Datenschutzerklärung ergänzen: Empfänger, Speicherdauer,
 *      eingesetzte Dienstleister, Auftragsverarbeitungsvertrag.
 *
 * Das Formular sendet multipart/form-data. Zum Parsen wird eine
 * Multipart-Bibliothek der jeweiligen Umgebung benötigt (z. B. busboy,
 * formidable oder das Request-Objekt des Frameworks).
 */

export const LIMITS = {
  maxFiles: 5,
  maxFileBytes: 10 * 1024 * 1024,
  allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  maxFieldLength: 2000,
  /** Formulare, die schneller als 3 Sekunden abgeschickt werden, sind praktisch immer Bots. */
  minFillMs: 3000,
};

const REQUIRED = ['origin', 'destination', 'type', 'companyName', 'contactPerson', 'email', 'consent'];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Serverseitige Validierung. Die Prüfung im Browser ist Komfort,
 * verbindlich ist ausschließlich diese Prüfung.
 *
 * @param {Record<string, string>} fields
 * @param {Array<{ name: string, size: number, mimeType: string }>} files
 * @returns {{ ok: boolean, errors: Record<string, string>, spam: boolean }}
 */
export function validateRequest(fields, files = []) {
  const errors = {};

  // Spamschutz: verstecktes Feld und Zeitprüfung. Kein externer Dienst,
  // keine Cookies, keine Weitergabe von Daten an Dritte.
  const started = Number(fields.form_started || 0);
  const spam =
    Boolean(fields.company_website) || (started > 0 && Date.now() - started < LIMITS.minFillMs);

  for (const name of REQUIRED) {
    const value = String(fields[name] ?? '').trim();
    if (!value) errors[name] = 'required';
  }

  if (fields.email && !EMAIL.test(String(fields.email).trim())) errors.email = 'email';
  if (fields.consent !== 'on' && fields.consent !== 'true') errors.consent = 'required';

  for (const [name, value] of Object.entries(fields)) {
    if (typeof value === 'string' && value.length > LIMITS.maxFieldLength) errors[name] = 'tooLong';
  }

  if (files.length > LIMITS.maxFiles) errors.files = 'tooMany';
  for (const file of files) {
    if (file.size > LIMITS.maxFileBytes) errors.files = 'tooLarge';
    if (!LIMITS.allowedTypes.includes(file.mimeType)) errors.files = 'type';
  }

  return { ok: Object.keys(errors).length === 0, errors, spam };
}

/** Aus den Feldern eine lesbare E-Mail für die Disposition bauen. */
export function buildMessage(fields, files = []) {
  const line = (label, value) => (value ? `${label}: ${value}\n` : '');
  return (
    'Neue Transportanfrage über im-cargo.de\n\n' +
    '— TRANSPORT —\n' +
    line('Abholort', fields.origin) +
    line('Zielort', fields.destination) +
    line('Abholdatum', fields.date) +
    line('Transportart', fields.type) +
    '\n— LADUNG —\n' +
    line('Ladung', fields.cargo) +
    line('Gewicht', fields.weight) +
    line('Hinweise', fields.notes) +
    '\n— AUFTRAGGEBER —\n' +
    line('Unternehmen', fields.companyName) +
    line('Ansprechpartner', fields.contactPerson) +
    line('Telefon', fields.phone) +
    line('E-Mail', fields.email) +
    '\n— DATEIEN —\n' +
    (files.length ? files.map((f) => `${f.name} (${Math.round(f.size / 1024)} kB)`).join('\n') : 'keine') +
    '\n'
  );
}

/**
 * Beispielhafter Ablauf. `parseMultipart` und `sendMail` sind von der
 * Hosting-Umgebung bereitzustellen.
 */
export async function handleTransportRequest(request, { parseMultipart, sendMail }) {
  if (request.method !== 'POST') {
    return { status: 405, body: { error: 'method_not_allowed' } };
  }

  const { fields, files } = await parseMultipart(request);
  const { ok, errors, spam } = validateRequest(fields, files);

  // Bei Spamverdacht bewusst mit 200 antworten und nichts versenden.
  if (spam) return { status: 200, body: { ok: true } };
  if (!ok) return { status: 422, body: { ok: false, errors } };

  // TODO (vor Livegang): tatsächlichen Versand einsetzen.
  // Empfänger: dispo@im-cargo.de, Reply-To: fields.email
  // Anhänge: files
  await sendMail({
    to: 'dispo@im-cargo.de',
    replyTo: String(fields.email),
    subject: `Transportanfrage: ${fields.origin} → ${fields.destination}`,
    text: buildMessage(fields, files),
    attachments: files,
  });

  return { status: 200, body: { ok: true } };
}
