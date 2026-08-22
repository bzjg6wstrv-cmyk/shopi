import { esc, join, raw } from '../lib/html.js';

const block = (b, flag) => `
<section class="legal__block${b.todo ? ' legal__block--open' : ''}">
  <h2 class="legal__title">${esc(b.title)}</h2>
  ${b.todo ? `<p class="legal__flag">${esc(flag)}</p>` : ''}
  ${b.paragraphs ? join(b.paragraphs, (p) => `<p>${raw(p)}</p>`) : ''}
  ${
    b.defs
      ? `<dl class="legal__defs">${join(
          b.defs,
          (d) => `<div class="legal__def"><dt>${esc(d.k)}</dt><dd>${raw(d.v)}</dd></div>`
        )}</dl>`
      : ''
  }
  ${b.list ? `<ul class="legal__list">${join(b.list, (i) => `<li>${raw(i)}</li>`)}</ul>` : ''}
  ${b.paragraphsAfter ? join(b.paragraphsAfter, (p) => `<p>${raw(p)}</p>`) : ''}
</section>`;

export const legalPage = (t, doc) => `
<article class="legal">
  <div class="shell legal__inner">
    <header class="legal__head">
      <p class="eyebrow">${esc(doc.eyebrow)}</p>
      <h1 class="legal__headline">${esc(doc.headline)}</h1>
      <p class="legal__notice">${esc(doc.notice)}</p>
    </header>

    <section class="legal__open">
      <h2 class="legal__open-title">${esc(doc.openTitle)}</h2>
      <ul>${join(doc.open, (i) => `<li>${esc(i)}</li>`)}</ul>
    </section>

    <div class="legal__body">
      ${join(doc.blocks, (b) => block(b, doc.flag))}
    </div>
  </div>
</article>
`;
