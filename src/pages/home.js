import { company as c } from '../content/company.js';
import { esc, join } from '../lib/html.js';
import { iconArrow, iconPhone, iconMail, iconWhatsapp } from '../partials/icons.js';
import { requestForm } from '../partials/form.js';

const photo = ({ name, alt, width, height, sizes, priority = false, className = '' }) => `
<figure class="photo ${className}">
  <picture>
    <source type="image/webp" srcset="/assets/img/${name}.webp"${sizes ? ` sizes="${sizes}"` : ''}>
    <img src="/assets/img/${name}.jpg" width="${width}" height="${height}" alt="${esc(alt)}"
         ${priority ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">
  </picture>
</figure>`;

/* Bewegungslinie aus dem Logo, auf Rulenlänge verlängert. Wird genau einmal je Seite eingesetzt. */
const brandRule = `
<svg class="brand-rule" viewBox="0 0 1923 204" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" focusable="false">
  <path d="M22.5 181.5H1400C1525 181.5 1525 22.5 1650 22.5H1900" stroke="#F2C400" stroke-width="45" stroke-linecap="round"/>
</svg>`;

export const home = (t) => `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__inner shell">
    <div class="hero__text">
      <p class="eyebrow">${esc(t.hero.eyebrow)}</p>
      <h1 class="hero__title" id="hero-title">
        ${t.hero.headline
          .map((line, i, all) =>
            `<span class="hero__title-line${i === all.length - 1 ? ' hero__title-line--rule' : ''}">${esc(line)}</span>`
          )
          .join('\n        ')}
      </h1>
      <p class="hero__lead">${esc(t.hero.lead)}</p>
      <div class="hero__actions">
        <a class="btn btn--accent btn--large" href="#anfrage">${esc(t.hero.ctaPrimary)}${iconArrow}</a>
        <button class="btn btn--outline btn--large" type="button" aria-expanded="false" aria-controls="contact-panel" data-contact-open>
          ${esc(t.hero.ctaSecondary)}
        </button>
      </div>
    </div>
    <div class="hero__media">
      ${photo({
        name: 'hero-fernverkehr',
        alt: t.hero.imageAlt,
        width: 1200,
        height: 1600,
        sizes: '(min-width: 1000px) 42vw, 100vw',
        priority: true,
        className: 'photo--fill',
      })}
    </div>
  </div>

  <div class="hero__facts">
    <dl class="hero__facts-inner shell">
      ${join(
        t.hero.facts,
        (f) => `<div class="hero__fact"><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`
      )}
      <div class="hero__fact hero__fact--phone">
        <dt>${esc(t.hero.phoneLabel)}</dt>
        <dd><a href="${c.phoneHref}">${iconPhone}${esc(c.phoneDisplay)}</a></dd>
      </div>
    </dl>
  </div>
</section>

<section class="section services" id="leistungen" aria-labelledby="services-title">
  <div class="shell services__head">
    <div class="section-head">
      <p class="eyebrow">${esc(t.services.eyebrow)}</p>
      <h2 class="section-title" id="services-title">${esc(t.services.headline)}</h2>
      <p class="section-lead">${esc(t.services.lead)}</p>
    </div>
    ${photo({
      name: 'containerverkehr',
      alt: t.services.imageAlt,
      width: 1800,
      height: 1200,
      sizes: '(min-width: 1000px) 40vw, 100vw',
      className: 'services__photo',
    })}
  </div>

  <ol class="index shell" data-reveal-group>
    ${join(
      t.services.items,
      (item) => `
    <li class="index__row">
      <span class="index__n" aria-hidden="true">${esc(item.n)}</span>
      <h3 class="index__title">${esc(item.title)}</h3>
      <p class="index__text">${esc(item.text)}</p>
    </li>`
    )}
  </ol>

  <div class="shell services__more">
    <h3 class="services__more-title">${esc(t.services.moreTitle)}</h3>
    <div class="services__more-body">
      <p>${esc(t.services.moreText)}</p>
      <a class="link-arrow" href="#anfrage">${esc(t.services.moreCta)}${iconArrow}</a>
    </div>
  </div>
</section>

<section class="section approach" id="arbeitsweise" aria-labelledby="approach-title">
  <div class="shell approach__inner">
    <div class="section-head approach__head">
      <p class="eyebrow">${esc(t.approach.eyebrow)}</p>
      <h2 class="section-title" id="approach-title">${esc(t.approach.headline)}</h2>
    </div>
    <ol class="approach__list">
      ${join(
        t.approach.items,
        (item) => `
      <li class="approach__item">
        <span class="approach__n" aria-hidden="true">${esc(item.n)}</span>
        <div class="approach__body">
          <h3 class="approach__title">${esc(item.title)}</h3>
          <p class="approach__text">${esc(item.text)}</p>
        </div>
      </li>`
      )}
    </ol>
  </div>
</section>

<section class="section section--navy coverage" id="europa" aria-labelledby="coverage-title">
  <div class="shell">
    <div class="coverage__head">
      <div>
        <p class="eyebrow eyebrow--accent">${esc(t.europe.eyebrow)}</p>
        <h2 class="section-title" id="coverage-title">${esc(t.europe.headline)}</h2>
      </div>
      <p class="coverage__text">${esc(t.europe.text)}</p>
    </div>
    <div class="coverage__rule">${brandRule}</div>
    <dl class="coverage__facts">
      ${join(
        t.europe.facts,
        (f) => `<div class="coverage__fact"><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`
      )}
    </dl>
  </div>
  ${photo({
    name: 'autobahn-band',
    alt: t.europe.imageAlt,
    width: 2400,
    height: 1030,
    sizes: '100vw',
    className: 'coverage__band',
  })}
</section>

<section class="section request" id="anfrage" aria-labelledby="request-title">
  <div class="shell request__inner">
    <div class="request__intro">
      <p class="eyebrow">${esc(t.form.eyebrow)}</p>
      <h2 class="section-title" id="request-title">${esc(t.form.headline)}</h2>
      <p class="section-lead">${esc(t.form.lead)}</p>

      <div class="request__aside">
        <h3 class="request__aside-title">${esc(t.form.asideTitle)}</h3>
        <p>${esc(t.form.asideText)}</p>
        <p class="request__aside-links">
          <a class="link-arrow" href="${c.phoneHref}">${iconPhone}${esc(c.phoneDisplay)}</a>
          <a class="link-arrow" href="mailto:${c.email}">${iconMail}${esc(c.email)}</a>
        </p>
      </div>
    </div>

    <div class="request__form">
      ${requestForm(t)}
    </div>
  </div>
</section>

<section class="section career" id="karriere" aria-labelledby="career-title">
  <div class="shell career__inner">
    ${photo({
      name: 'verladung',
      alt: t.career.imageAlt,
      width: 1600,
      height: 1200,
      sizes: '(min-width: 1000px) 45vw, 100vw',
      className: 'career__photo',
    })}
    <div class="career__text">
      <p class="eyebrow">${esc(t.career.eyebrow)}</p>
      <h2 class="section-title" id="career-title">${esc(t.career.headline)}</h2>
      <p>${esc(t.career.text)}</p>
      <p>${esc(t.career.text2)}</p>
      <div class="career__actions">
        <a class="btn btn--dark" href="mailto:${c.email}?subject=${encodeURIComponent(t.career.mailSubject)}">${esc(t.career.ctaPrimary)}${iconArrow}</a>
        <a class="btn btn--outline" href="${c.phoneHref}">${esc(t.career.ctaSecondary)}</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--navy contact" id="kontakt" aria-labelledby="contact-title">
  <div class="shell">
    <div class="section-head section-head--inline">
      <p class="eyebrow eyebrow--accent">${esc(t.contact.eyebrow)}</p>
      <h2 class="section-title" id="contact-title">${esc(t.contact.headline)}</h2>
    </div>

    <div class="contact__cols">
      <div class="contact__col">
        <h3 class="contact__label">${esc(t.contact.addressTitle)}</h3>
        <address>
          ${esc(c.legalName)}<br>
          ${esc(c.street)}<br>
          ${esc(c.postalCode)} ${esc(c.city)}<br>
          ${t.lang === 'de' ? 'Deutschland' : 'Germany'}
        </address>
      </div>

      <div class="contact__col contact__col--main">
        <h3 class="contact__label">${esc(t.contact.contactTitle)}</h3>
        <a class="contact__phone" href="${c.phoneHref}">${esc(c.phoneDisplay)}</a>
        <a class="contact__mail" href="mailto:${c.email}">${esc(c.email)}</a>
        <p class="contact__availability">${esc(t.contact.availability)}</p>
        <a class="contact__whatsapp" href="${c.whatsappHref}" target="_blank" rel="noopener">${iconWhatsapp}<span>${esc(t.contact.whatsappCta)}</span></a>
      </div>

      <div class="contact__col">
        <h3 class="contact__label">${esc(t.contact.companyTitle)}</h3>
        <p>
          ${esc(c.legalName)}<br>
          <span class="contact__muted">${esc(t.contact.managingDirectorLabel)}</span><br>
          ${esc(c.managingDirector)}
        </p>
      </div>
    </div>

    <div class="contact__actions">
      <a class="btn btn--accent btn--large" href="#anfrage">${esc(t.contact.requestCta)}${iconArrow}</a>
      <a class="btn btn--outline-light btn--large" href="${c.phoneHref}">${esc(t.contact.callCta)}</a>
    </div>
  </div>
</section>
`;
