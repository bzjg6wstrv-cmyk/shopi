import { company as c, routes, formEndpoint } from '../content/company.js';
import { esc, join } from '../lib/html.js';
import { iconArrow, iconPaperclip } from './icons.js';

const req = (t) => `<span class="field__req" title="${esc(t.ui.required)}">*</span>`;

const field = (t, { id, label, type = 'text', required = false, placeholder, hint, autocomplete, inputmode, span }) => `
<div class="field${span ? ' field--wide' : ''}">
  <label class="field__label" for="${id}">${esc(label)}${required ? req(t) : ''}</label>
  ${hint ? `<span class="field__hint" id="${id}-hint">${esc(hint)}</span>` : ''}
  <input class="field__input" id="${id}" name="${id}" type="${type}"
    ${required ? 'required' : ''}
    ${placeholder ? `placeholder="${esc(placeholder)}"` : ''}
    ${autocomplete ? `autocomplete="${autocomplete}"` : ''}
    ${inputmode ? `inputmode="${inputmode}"` : ''}
    ${hint ? `aria-describedby="${id}-hint ${id}-error"` : `aria-describedby="${id}-error"`}>
  <p class="field__error" id="${id}-error" data-field-error hidden></p>
</div>`;

const textarea = (t, { id, label, placeholder, rows = 4, required = false }) => `
<div class="field field--wide">
  <label class="field__label" for="${id}">${esc(label)}${required ? req(t) : ''}</label>
  <textarea class="field__input field__input--area" id="${id}" name="${id}" rows="${rows}"
    ${required ? 'required' : ''} ${placeholder ? `placeholder="${esc(placeholder)}"` : ''}
    aria-describedby="${id}-error"></textarea>
  <p class="field__error" id="${id}-error" data-field-error hidden></p>
</div>`;

export const requestForm = (t) => {
  const f = t.form.fields;
  /* Meldungen für das Skript – sprachabhängig, damit site.js sprachneutral bleibt. */
  const i18n = {
    errors: t.form.errors,
    submit: t.form.submit,
    submitting: t.form.submitting,
    success: t.form.success,
    failure: t.form.failure,
    notConnected: t.form.notConnected,
    files: { none: f.files.none, one: f.files.label },
    phone: c.phoneDisplay,
    phoneHref: c.phoneHref,
    email: c.email,
  };
  return `
<script type="application/json" data-form-i18n>${JSON.stringify(i18n).replace(/</g, '\\u003c')}</script>
<form class="request-form" id="transport-request" novalidate
      method="post" enctype="multipart/form-data"
      ${formEndpoint ? `action="${esc(formEndpoint)}"` : ''}
      data-request-form
      data-endpoint="${formEndpoint ? esc(formEndpoint) : ''}">

  <fieldset class="form-group">
    <legend class="form-group__legend"><span class="form-group__n">01</span>${esc(t.form.groups.transport)}</legend>
    <div class="form-grid">
      ${field(t, { id: 'origin', label: f.origin.label, required: true, placeholder: f.origin.placeholder, autocomplete: 'off' })}
      ${field(t, { id: 'destination', label: f.destination.label, required: true, placeholder: f.destination.placeholder, autocomplete: 'off' })}
      ${field(t, { id: 'date', label: f.date.label, type: 'date', hint: f.date.hint })}
      <div class="field">
        <label class="field__label" for="type">${esc(f.type.label)}${req(t)}</label>
        <div class="field__select">
          <select class="field__input" id="type" name="type" required aria-describedby="type-error">
            <option value="" disabled selected>${esc(f.type.placeholder)}</option>
            ${join(t.form.types, (o) => `<option value="${esc(o)}">${esc(o)}</option>`)}
          </select>
        </div>
        <p class="field__error" id="type-error" data-field-error hidden></p>
      </div>
    </div>
  </fieldset>

  <fieldset class="form-group">
    <legend class="form-group__legend"><span class="form-group__n">02</span>${esc(t.form.groups.cargo)}</legend>
    <div class="form-grid">
      ${field(t, { id: 'cargo', label: f.cargo.label, placeholder: f.cargo.placeholder, span: true })}
      ${field(t, { id: 'weight', label: f.weight.label, placeholder: f.weight.placeholder, hint: f.weight.hint })}
      ${textarea(t, { id: 'notes', label: f.notes.label, placeholder: f.notes.placeholder, rows: 3 })}
    </div>
  </fieldset>

  <fieldset class="form-group">
    <legend class="form-group__legend"><span class="form-group__n">03</span>${esc(t.form.groups.client)}</legend>
    <div class="form-grid">
      ${field(t, { id: 'companyName', label: f.companyName.label, required: true, autocomplete: 'organization' })}
      ${field(t, { id: 'contactPerson', label: f.contactPerson.label, required: true, autocomplete: 'name' })}
      ${field(t, { id: 'phone', label: f.phone.label, type: 'tel', hint: f.phone.hint, autocomplete: 'tel', inputmode: 'tel' })}
      ${field(t, { id: 'email', label: f.email.label, type: 'email', required: true, autocomplete: 'email', inputmode: 'email' })}
    </div>
  </fieldset>

  <fieldset class="form-group">
    <legend class="form-group__legend"><span class="form-group__n">04</span>${esc(t.form.groups.documents)}</legend>
    <div class="upload">
      <input class="upload__input" id="files" name="files" type="file" multiple
             accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
             aria-describedby="files-hint files-error" data-upload>
      <label class="upload__button" for="files">
        ${iconPaperclip}<span>${esc(f.files.button)}</span>
      </label>
      <p class="upload__list" data-upload-list>${esc(f.files.none)}</p>
      <p class="field__hint" id="files-hint">${esc(f.files.hint)}</p>
      <p class="field__error" id="files-error" data-field-error hidden></p>
    </div>
  </fieldset>

  <div class="consent">
    <input class="consent__box" id="consent" name="consent" type="checkbox" required aria-describedby="consent-error">
    <label class="consent__label" for="consent">
      ${esc(f.consent.labelBefore)}<a href="${routes.privacy[t.lang]}">${esc(f.consent.linkText)}</a>${esc(f.consent.labelAfter)}${req(t)}
    </label>
    <p class="field__error" id="consent-error" data-field-error hidden></p>
  </div>

  <!-- Spamschutz: verstecktes Feld + Zeitprüfung. Kein externer Dienst, keine Cookies. -->
  <div class="honey" aria-hidden="true">
    <label for="company_website">Website</label>
    <input id="company_website" name="company_website" type="text" tabindex="-1" autocomplete="off">
  </div>
  <input type="hidden" name="form_started" value="" data-form-started>

  <div class="form-foot">
    <button class="btn btn--accent btn--large" type="submit" data-submit>
      <span data-submit-label>${esc(t.form.submit)}</span>${iconArrow}
    </button>
    <p class="form-foot__note"><span aria-hidden="true">*</span> ${esc(t.ui.required)}</p>
  </div>

  <div class="form-message" role="alert" hidden data-form-message></div>
</form>

<div class="form-success" hidden tabindex="-1" data-form-success>
  <p class="eyebrow eyebrow--accent">${esc(t.form.eyebrow)}</p>
  <h3 class="form-success__title" data-success-title>${esc(t.form.success.title)}</h3>
  <p class="form-success__text" data-success-text>${esc(t.form.success.text)}</p>
  <p class="form-success__contact">
    <a href="${c.phoneHref}">${esc(c.phoneDisplay)}</a>
    <a href="mailto:${c.email}">${esc(c.email)}</a>
  </p>
</div>`;
};
