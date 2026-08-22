import { company } from './company.js';

const c = company;

export const en = {
  lang: 'en',
  locale: 'en-GB',
  label: 'English',

  ui: {
    skipToContent: 'Skip to content',
    menu: 'Menu',
    close: 'Close',
    langSwitchLabel: 'Change language',
    toGerman: 'Deutsch',
    required: 'Required',
    openContact: 'Contact',
    contactAria: 'Open contact options',
  },

  nav: [
    { label: 'Services', href: '#leistungen' },
    { label: 'How we work', href: '#arbeitsweise' },
    { label: 'Request', href: '#anfrage' },
    { label: 'Careers', href: '#karriere' },
    { label: 'Contact', href: '#kontakt' },
  ],
  navCta: 'Request a transport',

  home: {
    title: 'I&M CARGO – Road haulage from Bremen | Germany & Europe',
    description:
      'I&M CARGO in Bremen handles container, curtainsider and dangerous goods transports, full and part loads as well as direct and express runs across Germany and Europe. Dispatch available 24/7.',
  },

  hero: {
    eyebrow: 'Road haulage · Bremen',
    headline: ['Transport. Direct.', 'Reliable.'],
    lead: 'Transport solutions for businesses – across Germany and throughout Europe. Our dispatch team is reachable around the clock.',
    ctaPrimary: 'Request a transport',
    ctaSecondary: 'Contact dispatch',
    facts: [
      { label: 'Coverage', value: 'Germany & Europe' },
      { label: 'Dispatch', value: 'Available 24/7' },
    ],
    phoneLabel: 'Straight to dispatch',
    imageAlt: 'Articulated truck on the motorway',
  },

  services: {
    eyebrow: 'Services',
    headline: 'What we haul.',
    lead: 'For industry, trade, forwarders and other commercial customers – from a single transport to a recurring need.',
    items: [
      { n: '01', title: 'Container transport', text: 'Transports of common container types and sizes.' },
      { n: '02', title: 'Curtainsider transport', text: 'Tarpaulin, curtainsider and tautliner – matched to the load.' },
      { n: '03', title: 'Dangerous goods', text: 'In line with the legal and technical requirements that apply in each case.' },
      { n: '04', title: 'Full loads', text: 'FTL transports for commercial customers.' },
      { n: '05', title: 'Part loads', text: 'LTL and part loads where they suit the transport at hand.' },
      { n: '06', title: 'Direct transport', text: 'Straight from the collection point to the consignee.' },
      { n: '07', title: 'Express & special runs', text: 'Time-critical transports and individually planned runs.' },
    ],
    moreTitle: 'Further transport solutions',
    moreText: 'Depending on what a job requires, we arrange further suitable trucks and trailers. If you are not sure what fits your cargo, send us a short enquiry – we will sort it out on the phone.',
    moreCta: 'Talk through your transport',
    imageAlt: 'Container terminal with freight traffic',
  },

  approach: {
    eyebrow: 'How we work',
    headline: 'The way we operate.',
    items: [
      { n: '01', title: 'Direct communication', text: 'Short lines, clear arrangements. You speak to dispatch – not to a ticketing system.' },
      { n: '02', title: 'Reachable quickly', text: 'Reach us by phone, by email or through the request form – including outside regular office hours.' },
      { n: '03', title: 'Flexible dispatch', text: 'We look at every enquiry individually and plan around the cargo, the deadline and the route.' },
      { n: '04', title: 'A named contact', text: 'You know who is looking after your transport, and you get the same person back on the line.' },
    ],
  },

  europe: {
    eyebrow: 'Coverage',
    headline: 'Germany & Europe.',
    text: 'We run domestic and cross-border transports. Journeys within Germany are planned the same way as runs to and from other European countries.',
    facts: [
      { label: 'Based in', value: 'Bremen, Germany' },
      { label: 'Domestic', value: 'Transports within Germany' },
      { label: 'International', value: 'Transports across Europe' },
    ],
    imageAlt: 'Motorway traffic on a European freight route',
  },

  form: {
    eyebrow: 'Transport enquiry',
    headline: 'Request a transport.',
    lead: 'A short form that goes straight to dispatch. If it is urgent, give us a call.',
    asideTitle: 'Prefer to talk?',
    asideText: 'For transports at short notice, a phone call is the fastest route. Dispatch is reachable around the clock.',
    callCta: 'Call now',
    mailCta: 'Send an email',

    groups: {
      transport: 'Transport',
      cargo: 'Cargo',
      client: 'Your company',
      documents: 'Documents',
    },

    fields: {
      origin: { label: 'Collection address', placeholder: 'Postcode, town, country' },
      destination: { label: 'Delivery address', placeholder: 'Postcode, town, country' },
      date: { label: 'Preferred collection date', hint: 'If known' },
      type: { label: 'Type of transport', placeholder: 'Please select' },
      cargo: { label: 'Cargo description', placeholder: 'What needs to be moved?' },
      weight: { label: 'Weight', placeholder: 'e.g. 12 t', hint: 'If known' },
      notes: { label: 'Additional information', placeholder: 'Dimensions, loading equipment, time slots, dangerous goods class …' },
      companyName: { label: 'Company' },
      contactPerson: { label: 'Contact person' },
      phone: { label: 'Phone', hint: 'For any questions' },
      email: { label: 'Email' },
      files: {
        label: 'Attach files',
        hint: 'Optional: transport details, cargo documents, photos. PDF, JPG, PNG – up to 10 MB per file, 5 files maximum.',
        button: 'Choose files',
        none: 'No file selected',
      },
      consent: {
        labelBefore: 'I agree that the details I provide may be processed in order to handle this enquiry. Further information is set out in the ',
        linkText: 'privacy policy',
        labelAfter: '.',
      },
    },

    types: [
      'Container',
      'Curtainsider',
      'Dangerous goods',
      'Full load',
      'Part load',
      'Direct transport',
      'Express / special run',
      'Other',
    ],

    submit: 'Send enquiry',
    submitting: 'Sending …',

    errors: {
      required: 'Please complete this field.',
      email: 'Please enter a valid email address.',
      select: 'Please choose a type of transport.',
      consent: 'Please confirm the privacy notice.',
      fileSize: 'File too large (10 MB per file maximum).',
      fileCount: 'Please select no more than 5 files.',
      summary: 'Please check the highlighted fields.',
    },

    success: {
      title: 'Enquiry received.',
      text: 'Thank you. We will look at your enquiry and come back to you. If it is urgent, dispatch is reachable on',
    },

    failure: {
      title: 'The enquiry could not be sent.',
      text: 'Please try again or contact dispatch directly:',
    },

    notConnected: {
      title: 'Please contact dispatch directly.',
      text: 'Your enquiry cannot be submitted here at the moment. Call us or send us an email – we are reachable around the clock:',
    },
  },

  career: {
    eyebrow: 'Careers',
    headline: 'Driving with I&M.',
    text: 'You drive trucks and are looking for a new place to do it? Speculative applications from professional drivers are welcome at any time.',
    text2: 'The simplest way is the direct one: give us a call or send an email – with your licence classes, your experience and when you are available.',
    ctaPrimary: 'Get in touch',
    ctaSecondary: 'Call us',
    mailSubject: 'Application – driving staff',
    imageAlt: 'Loading in a logistics yard',
  },

  contact: {
    eyebrow: 'Contact',
    headline: 'Straight to us.',
    addressTitle: 'Address',
    contactTitle: 'Dispatch',
    companyTitle: 'Company',
    availability: 'Available 24/7',
    managingDirectorLabel: 'Managing Director',
    callCta: 'Call now',
    mailCta: 'Send an email',
    requestCta: 'Request a transport',
    whatsappCta: 'WhatsApp',
  },

  panel: {
    title: '24/7 dispatch',
    phoneLabel: 'Phone',
    callCta: 'Call now',
    mailLabel: 'Email',
    mailCta: 'Send an email',
    whatsappCta: 'WhatsApp',
    requestCta: 'Request a transport',
    close: 'Close contact panel',
    open: 'Contact',
    note: 'Bremen · Germany & Europe',
  },

  notFound: {
    title: 'Page not found | I&M CARGO',
    description: 'This page no longer exists or has been moved.',
    code: '404',
    headline: 'Page not found.',
    text: 'This address leads nowhere. The page may have moved, or the link may be incomplete. The home page will take you everywhere else — or simply call dispatch.',
    home: 'Go to the home page',
    call: 'Call dispatch',
  },

  footer: {
    tagline: 'Transport. Direct. Reliable.',
    contactTitle: 'Contact',
    addressTitle: 'Address',
    legalTitle: 'Legal',
    registerTitle: 'Register details',
    imprint: 'Imprint',
    privacy: 'Privacy',
    availability: 'Available 24/7',
    copyright: (year) => `© ${year} ${c.legalName}`,
    backToTop: 'Back to top',
  },
};
