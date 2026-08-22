import { company as c } from './company.js';

const address = `${c.legalName}<br>${c.street}<br>${c.postalCode} ${c.city}<br>Germany`;

export const legalEn = {
  imprint: {
    title: 'Imprint | I&M CARGO',
    description: 'Imprint and provider identification of I & M Dienstleistungen GmbH (I&M CARGO), Bremen, Germany.',
    eyebrow: 'Legal',
    headline: 'Imprint',
    notice:
      'This page is a prepared draft based on the company details provided. It has not been reviewed by a lawyer. Please review it before publication and complete the points marked as open below. The German version is the authoritative one.',
    flag: 'open',
    openTitle: 'To be completed before publication',
    open: [
      'Confirm the person responsible for content under § 18 (2) MStV (name and address).',
      'Road haulage permit or EU licence and the issuing authority, where these must be stated.',
      'Details of professional indemnity or carrier liability insurance, where these must be stated.',
      'Image credits, once the placeholder images are replaced with own or licensed photographs.',
      'Have the full text reviewed by a lawyer before going live.',
    ],
    blocks: [
      {
        title: 'Information pursuant to § 5 German Digital Services Act (DDG)',
        defs: [
          { k: 'Provider', v: c.legalName },
          { k: 'Trading as', v: 'I&M CARGO' },
          { k: 'Address', v: `${c.street}<br>${c.postalCode} ${c.city}<br>Germany` },
          { k: 'Represented by', v: `Managing Director ${c.managingDirector}` },
        ],
      },
      {
        title: 'Contact',
        defs: [
          { k: 'Phone', v: `<a href="${c.phoneHref}">${c.phoneDisplay}</a>` },
          { k: 'Email', v: `<a href="mailto:${c.email}">${c.email}</a>` },
          { k: 'Website', v: c.domain },
        ],
      },
      {
        title: 'Commercial register',
        defs: [
          { k: 'Register court', v: 'Bremen Local Court (Amtsgericht Bremen)' },
          { k: 'Register number', v: c.registerNumber },
        ],
      },
      {
        title: 'VAT identification number',
        paragraphs: ['VAT identification number pursuant to § 27 a German VAT Act:'],
        defs: [{ k: 'VAT ID', v: c.vatId }],
      },
      {
        title: 'Responsible for content under § 18 (2) MStV',
        todo: true,
        paragraphs: [
          'This entry is to be confirmed before publication. It usually states the name and address of the person responsible for the content.',
        ],
      },
      {
        title: 'Permit and supervisory authority',
        todo: true,
        paragraphs: [
          'Where a permit under German road haulage law or an EU licence applies to the activity carried out, the issuing authority and the permit are to be stated here. No such details were available for this draft.',
        ],
      },
      {
        title: 'Insurance',
        todo: true,
        paragraphs: [
          'Details of professional indemnity or carrier liability insurance (insurer, territorial scope) are to be added here where they must be stated. No such details were available for this draft.',
        ],
      },
      {
        title: 'Consumer dispute resolution',
        paragraphs: [
          'We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration body. This statement is to be reviewed before publication.',
        ],
      },
      {
        title: 'Image credits',
        todo: true,
        paragraphs: [
          'The images currently used are clearly marked placeholders. As soon as own or licensed photographs are used, the required image credits are to be added here.',
        ],
      },
      {
        title: 'Liability for content',
        paragraphs: [
          'The content of this website is compiled with care. No guarantee can be given for its accuracy, completeness or timeliness. As a service provider we are responsible for our own content on these pages in accordance with general legislation.',
        ],
      },
      {
        title: 'Liability for links',
        paragraphs: [
          'Where this website contains links to external third-party websites, we have no influence over their content. The respective provider is always responsible for the content of linked pages.',
        ],
      },
      {
        title: 'Copyright',
        paragraphs: [
          'The content published on this website is subject to German copyright law. Third-party contributions are marked as such. Reproduction, editing and distribution beyond the limits of copyright law require written consent.',
        ],
      },
    ],
  },

  privacy: {
    title: 'Privacy | I&M CARGO',
    description: 'Privacy notice of I & M Dienstleistungen GmbH (I&M CARGO), Bremen, Germany.',
    eyebrow: 'Legal',
    headline: 'Privacy notice',
    notice:
      'This privacy notice is a prepared draft. It has not been reviewed by a lawyer and must be adapted to the actual technical set-up (in particular hosting and form delivery) before publication. The German version is the authoritative one.',
    flag: 'open',
    openTitle: 'To be completed before publication',
    open: [
      'Hosting provider, server location and data processing agreement.',
      'The actual route of form delivery (email service, storage, service providers involved).',
      'Retention periods for enquiries, applications and server log files.',
      'Recipients or processors and any transfers to third countries.',
      'Assessment of whether a data protection officer must be appointed.',
      'Handling of WhatsApp contacts, where that channel is used.',
      'Have the full text reviewed by a lawyer before going live.',
    ],
    blocks: [
      {
        title: '1. Controller',
        paragraphs: ['The controller for data processing on this website is:'],
        defs: [
          { k: 'Company', v: address },
          { k: 'Represented by', v: `Managing Director ${c.managingDirector}` },
          { k: 'Phone', v: `<a href="${c.phoneHref}">${c.phoneDisplay}</a>` },
          { k: 'Email', v: `<a href="mailto:${c.email}">${c.email}</a>` },
        ],
      },
      {
        title: '2. Data protection officer',
        todo: true,
        paragraphs: [
          'Whether a data protection officer has to be appointed is to be assessed. No such details were available for this draft.',
        ],
      },
      {
        title: '3. Hosting and server log files',
        todo: true,
        paragraphs: [
          'When this website is accessed, the hosting provider processes technically necessary data in server log files, typically the IP address, the date and time of access, the page requested, the volume of data transferred, the referrer and details of the browser and operating system. The legal basis is Art. 6 (1) (f) GDPR; the legitimate interest lies in the secure and stable operation of the website.',
          'The provider, server location, retention period and the conclusion of a data processing agreement are to be added before publication.',
        ],
      },
      {
        title: '4. No cookies, no external services',
        paragraphs: [
          'This website does not set cookies and does not use analytics, tracking or advertising services. Fonts, images, stylesheets and scripts are served exclusively from our own server; no external font, map or video services are embedded. Consent for cookies is therefore not required.',
          'If further services are added later, this notice must be updated accordingly.',
        ],
      },
      {
        title: '5. Contact by phone, email or WhatsApp',
        paragraphs: [
          'If you call us or send us an email, we process the details you provide in order to deal with your request. The legal basis is Art. 6 (1) (b) GDPR where the communication serves to initiate or perform a contract, and otherwise Art. 6 (1) (f) GDPR based on our legitimate interest in handling enquiries.',
          'If you contact us via WhatsApp, the privacy terms of the respective provider apply in addition. Use of this channel is voluntary; for confidential information we recommend phone or email. The details for this channel are to be reviewed and completed before publication.',
        ],
      },
      {
        title: '6. Transport enquiries submitted through the form',
        todo: true,
        paragraphs: [
          'Through the enquiry form we process the details you enter about the transport, the cargo and your company, as well as any files you upload, in order to assess and answer your enquiry. Mandatory fields are marked as such; all other details are optional.',
          'The legal basis is Art. 6 (1) (b) GDPR (pre-contractual measures) and, in addition, Art. 6 (1) (f) GDPR. To protect against automated submissions, the form contains a hidden field and a timing check; no personal data is transmitted to third parties in this process.',
          'The technical route of delivery (email transmission, any storage, service providers involved) is to be added before publication.',
        ],
      },
      {
        title: '7. Applications',
        todo: true,
        paragraphs: [
          'If you apply to us by phone or email, we process your details exclusively for the purpose of the application procedure. The legal basis is § 26 BDSG in conjunction with Art. 6 (1) (b) GDPR. The retention period is to be added before publication.',
        ],
      },
      {
        title: '8. Recipients and retention',
        todo: true,
        paragraphs: [
          'Your data is passed on only where this is necessary to carry out the transport order, where you have consented or where there is a legal obligation. Specific recipients, processors, any transfers to third countries and the respective retention periods are to be added before publication. Statutory retention obligations, in particular under commercial and tax law, remain unaffected.',
        ],
      },
      {
        title: '9. Your rights',
        paragraphs: ['Under the General Data Protection Regulation you have, in particular, the following rights:'],
        list: [
          'Access to the data processed about you (Art. 15 GDPR)',
          'Rectification of inaccurate data (Art. 16 GDPR)',
          'Erasure (Art. 17 GDPR)',
          'Restriction of processing (Art. 18 GDPR)',
          'Data portability (Art. 20 GDPR)',
          'Objection to processing based on legitimate interests (Art. 21 GDPR)',
          'Withdrawal of consent with effect for the future (Art. 7 (3) GDPR)',
        ],
        paragraphsAfter: [
          `A message to <a href="mailto:${c.email}">${c.email}</a> is sufficient to exercise your rights.`,
        ],
      },
      {
        title: '10. Right to lodge a complaint',
        todo: true,
        paragraphs: [
          'You have the right to lodge a complaint with a data protection supervisory authority about the processing of your personal data, in particular with the authority of your habitual residence or the authority responsible for us. The competent authority is to be named and verified before publication.',
        ],
      },
      {
        title: '11. Keeping this notice current',
        paragraphs: [
          'This notice must be updated as soon as the website, the services used or the processing operations change.',
        ],
      },
    ],
  },
};
