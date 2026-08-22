/** Nur funktionale Icons. Keine Dekor-Icons an Überschriften. */

const wrap = (paths, extra = '') =>
  `<svg class="icon"${extra} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">${paths}</svg>`;

export const iconPhone = wrap(
  '<path d="M6.2 3.5h3.1l1.6 4-2 1.3a12.6 12.6 0 0 0 6.3 6.3l1.3-2 4 1.6v3.1c0 .9-.7 1.7-1.7 1.7A17.3 17.3 0 0 1 4.5 5.2c0-1 .8-1.7 1.7-1.7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
);

export const iconMail = wrap(
  '<path d="M3.5 5.5h17v13h-17z" stroke="currentColor" stroke-width="1.6"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
);

export const iconWhatsapp = wrap(
  '<path d="M12 3.8a8.2 8.2 0 0 0-7 12.5l-1 3.9 4-1a8.2 8.2 0 1 0 4-15.4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.3 8.2c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .6.5l.6 1.5c.1.2 0 .4-.1.5l-.4.5c-.1.2-.2.3 0 .6a6 6 0 0 0 2.6 2.2c.3.1.4 0 .6-.1l.5-.6c.2-.2.3-.1.5-.1l1.4.7c.2.1.4.2.4.3v.5c0 .3-.3 1-.6 1.2-.3.3-.8.5-1.3.4a9 9 0 0 1-5.6-4.5c-.4-.7-.6-1.4-.6-2 0-.6.2-1.1.4-1.4Z" fill="currentColor"/>'
);

export const iconArrow = wrap(
  '<path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="square"/>'
);

export const iconClose = wrap(
  '<path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="square"/>'
);

export const iconMenu = wrap(
  '<path d="M3.5 7h17M3.5 12h17M3.5 17h17" stroke="currentColor" stroke-width="1.7" stroke-linecap="square"/>'
);

export const iconPaperclip = wrap(
  '<path d="M17.5 9.5 10 17a3.5 3.5 0 0 1-5-5l7.8-7.8a2.4 2.4 0 0 1 3.4 3.4L8.4 15.4a1.2 1.2 0 0 1-1.7-1.7l7-7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'
);
