import { company as c, routes } from '../content/company.js';
import { esc } from '../lib/html.js';
import { iconArrow } from '../partials/icons.js';

export const notFound = (t) => `
<section class="notfound">
  <div class="shell notfound__inner">
    <p class="eyebrow">${esc(t.notFound.code)}</p>
    <h1 class="notfound__title">${esc(t.notFound.headline)}</h1>
    <p class="notfound__text">${esc(t.notFound.text)}</p>
    <div class="notfound__actions">
      <a class="btn btn--accent btn--large" href="${routes.home[t.lang]}">${esc(t.notFound.home)}${iconArrow}</a>
      <a class="btn btn--outline btn--large" href="${c.phoneHref}">${esc(t.notFound.call)}</a>
    </div>
  </div>
</section>
`;
