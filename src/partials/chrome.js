import { company as c, routes } from '../content/company.js';
import { esc, join } from '../lib/html.js';
import { iconPhone, iconMail, iconWhatsapp, iconArrow, iconClose, iconMenu } from './icons.js';

const other = (lang) => (lang === 'de' ? 'en' : 'de');

/** Logo-Lockup. Das Logo wird unverändert eingesetzt. */
export const logo = (t, routeKey, { light = false, tag = 'a' } = {}) => {
  const word = light ? 'im-cargo-wordmark-white.png' : 'im-cargo-wordmark-navy.png';
  const inner = `
    <img class="logo__mark" src="/assets/brand/im-cargo-mark.png" width="120" height="120" alt="" decoding="async">
    <img class="logo__word" src="/assets/brand/${word}" width="867" height="100" alt="I&amp;M CARGO" decoding="async">`;
  if (tag === 'span') return `<span class="logo logo--static">${inner}</span>`;
  const label = t.lang === 'de' ? 'I&M CARGO – zur Startseite' : 'I&M CARGO – to the home page';
  return `<a class="logo" href="${routes.home[t.lang]}" aria-label="${esc(label)}">${inner}</a>`;
};

const langSwitch = (t, routeKey, cls = '') => {
  const o = other(t.lang);
  const oLabel = o === 'de' ? 'Deutsch' : 'English';
  const current = t.lang === 'de' ? 'Deutsch' : 'English';
  return `
    <p class="lang-switch ${cls}">
      <span class="lang-switch__label" aria-hidden="true">${t.lang === 'de' ? 'DE' : 'EN'}</span>
      <span class="visually-hidden">${esc(t.ui.langSwitchLabel)}: ${esc(current)}</span>
      <a class="lang-switch__link" hreflang="${o}" lang="${o}" href="${routes[routeKey][o]}">${o.toUpperCase()}<span class="visually-hidden"> – ${esc(oLabel)}</span></a>
    </p>`;
};

export const header = (t, routeKey, onHome = routeKey === 'home') => `
<header class="site-header" data-site-header>
  <div class="site-header__inner">
    ${logo(t, routeKey)}
    <nav class="site-nav" aria-label="${t.lang === 'de' ? 'Hauptnavigation' : 'Main navigation'}">
      <ul class="site-nav__list">
        ${join(t.nav, (item) => {
          const href = onHome ? item.href : `${routes.home[t.lang]}${item.href}`;
          return `<li><a class="site-nav__link" href="${href}">${esc(item.label)}</a></li>`;
        })}
      </ul>
    </nav>
    <div class="site-header__actions">
      <a class="site-header__phone" href="${c.phoneHref}">${esc(c.phoneDisplay)}</a>
      ${langSwitch(t, routeKey)}
      <a class="btn btn--accent btn--compact site-header__cta" href="${onHome ? '#anfrage' : `${routes.home[t.lang]}#anfrage`}">${esc(t.navCta)}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" data-menu-toggle>
        <span class="menu-toggle__icon" aria-hidden="true">${iconMenu}</span>
        <span class="visually-hidden">${esc(t.ui.menu)}</span>
      </button>
    </div>
  </div>
</header>

<div class="site-menu" id="site-menu" hidden data-site-menu>
  <div class="site-menu__head">
    ${logo(t, routeKey, { light: true })}
    <button class="site-menu__close" type="button" data-menu-close>
      <span aria-hidden="true">${iconClose}</span>
      <span class="visually-hidden">${esc(t.ui.close)}</span>
    </button>
  </div>
  <nav class="site-menu__nav" aria-label="${t.lang === 'de' ? 'Hauptnavigation' : 'Main navigation'}">
    <ul>
      ${join(t.nav, (item) => {
        const href = onHome ? item.href : `${routes.home[t.lang]}${item.href}`;
        return `<li><a href="${href}" data-menu-link>${esc(item.label)}</a></li>`;
      })}
    </ul>
  </nav>
  <div class="site-menu__foot">
    <a class="site-menu__contact" href="${c.phoneHref}">${iconPhone}<span>${esc(c.phoneDisplay)}</span></a>
    <a class="site-menu__contact" href="mailto:${c.email}">${iconMail}<span>${esc(c.email)}</span></a>
    ${langSwitch(t, routeKey, 'lang-switch--light')}
  </div>
</div>`;

export const contact = (t, routeKey, onHome = routeKey === 'home') => `
<button class="contact-rail" type="button" aria-expanded="false" aria-controls="contact-panel" data-contact-open>
  <span class="contact-rail__icon" aria-hidden="true">${iconPhone}</span>
  <span class="contact-rail__label">${esc(t.panel.open)}</span>
</button>

<button class="contact-fab" type="button" aria-expanded="false" aria-controls="contact-panel" data-contact-open>
  <span aria-hidden="true">${iconPhone}</span>
  <span class="contact-fab__label">${esc(t.panel.open)}</span>
</button>

<div class="contact-backdrop" data-contact-backdrop hidden></div>

<aside class="contact-panel" id="contact-panel" role="dialog" aria-modal="true" aria-labelledby="contact-panel-title" hidden data-contact-panel>
  <div class="contact-panel__inner">
    <button class="contact-panel__close" type="button" data-contact-close>
      <span aria-hidden="true">${iconClose}</span>
      <span class="visually-hidden">${esc(t.panel.close)}</span>
    </button>

    <p class="eyebrow eyebrow--accent" id="contact-panel-title">${esc(t.panel.title)}</p>

    <div class="contact-panel__block">
      <p class="contact-panel__label">${esc(t.panel.phoneLabel)}</p>
      <a class="contact-panel__phone" href="${c.phoneHref}">${esc(c.phoneDisplay)}</a>
      <a class="btn btn--accent btn--block" href="${c.phoneHref}">${esc(t.panel.callCta)}${iconArrow}</a>
      <a class="contact-panel__whatsapp" href="${c.whatsappHref}" target="_blank" rel="noopener">${iconWhatsapp}<span>${esc(t.panel.whatsappCta)}</span></a>
    </div>

    <div class="contact-panel__block">
      <p class="contact-panel__label">${esc(t.panel.mailLabel)}</p>
      <a class="contact-panel__mail" href="mailto:${c.email}">${esc(c.email)}</a>
      <a class="btn btn--outline-light btn--block" href="mailto:${c.email}">${esc(t.panel.mailCta)}${iconArrow}</a>
    </div>

    <div class="contact-panel__block">
      <a class="btn btn--outline-light btn--block" href="${onHome ? '#anfrage' : `${routes.home[t.lang]}#anfrage`}" data-contact-request>${esc(t.panel.requestCta)}${iconArrow}</a>
    </div>

    <p class="contact-panel__note">${esc(t.panel.note)}</p>
  </div>
</aside>`;

export const footer = (t, routeKey, year) => `
<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__brand">
      ${logo(t, routeKey, { light: true })}
      <p class="site-footer__tagline">${esc(t.footer.tagline)}</p>
    </div>

    <div class="site-footer__cols">
      <div class="site-footer__col">
        <h2 class="site-footer__title">${esc(t.footer.contactTitle)}</h2>
        <p>
          <a href="${c.phoneHref}">${esc(c.phoneDisplay)}</a><br>
          <a href="mailto:${c.email}">${esc(c.email)}</a>
        </p>
        <p class="site-footer__note">${esc(t.footer.availability)}</p>
      </div>

      <div class="site-footer__col">
        <h2 class="site-footer__title">${esc(t.footer.addressTitle)}</h2>
        <address>
          ${esc(c.legalName)}<br>
          ${esc(c.street)}<br>
          ${esc(c.postalCode)} ${esc(c.city)}<br>
          ${t.lang === 'de' ? 'Deutschland' : 'Germany'}
        </address>
      </div>

      <div class="site-footer__col">
        <h2 class="site-footer__title">${esc(t.footer.registerTitle)}</h2>
        <p>
          ${esc(c.registerCourt)}<br>
          ${esc(c.registerNumber)}<br>
          ${t.lang === 'de' ? 'USt-IdNr.' : 'VAT ID'} ${esc(c.vatId)}
        </p>
      </div>

      <div class="site-footer__col">
        <h2 class="site-footer__title">${esc(t.footer.legalTitle)}</h2>
        <ul class="site-footer__links">
          <li><a href="${routes.imprint[t.lang]}">${esc(t.footer.imprint)}</a></li>
          <li><a href="${routes.privacy[t.lang]}">${esc(t.footer.privacy)}</a></li>
        </ul>
        ${langSwitch(t, routeKey, 'lang-switch--light')}
      </div>
    </div>

    <div class="site-footer__bottom">
      <p>${esc(t.footer.copyright(year))}</p>
      <a class="site-footer__top" href="#top">${esc(t.footer.backToTop)}${iconArrow}</a>
    </div>
  </div>
</footer>`;
