/** Minimale Template-Helfer. Kein Framework, keine Abhängigkeiten. */

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** HTML-escapen. Für alle Werte, die aus Inhaltsdaten in Markup fließen. */
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ENTITIES[ch]);

/** Bereits ausgezeichnete Inhalte (bewusst nicht escapen). */
export const raw = (value) => String(value ?? '');

/** Arrays zu Markup verbinden. */
export const join = (items, fn) => items.map(fn).join('');

/** Attribut nur ausgeben, wenn ein Wert vorhanden ist. */
export const attr = (name, value) =>
  value === undefined || value === null || value === false ? '' : ` ${name}="${esc(value)}"`;

/** Mehrfache Leerzeichen und Zeilenumbrüche zwischen Tags entfernen. */
export const tidy = (markup) => markup.replace(/\n\s*\n/g, '\n').trimStart();
