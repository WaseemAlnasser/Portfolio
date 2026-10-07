/**
 * Central configuration. Missing values are `null` (or empty arrays) and the UI
 * hides anything that depends on them.
 */

export type MediaItem = {
  src: string; // e.g. "/images/deliverit/customer-flow.webp"
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export const site = {
  name: "Waseem Alnasser",
  title: "Full Stack Software Engineer",
  location: "Dubai, UAE",
  email: "hello@waseemalnasser.com",
  phoneDisplay: "+971 54 320 4140",
  phoneHref: "tel:+971543204140",

  /** Existing domain, e.g. "https://your-domain.tld". Null until supplied. */
  siteUrl: "https://waseemalnasser.com" as string | null,
  /** True only for the reviewed production site. */
  readyForIndexing: true,

  linkedinUrl: "https://www.linkedin.com/in/waseem-alnasser-887185251" as string | null,
  githubUrl: null as string | null,
  portrait: null as string | null,

  /** Public paths under /public. Null hides the download button. */
  cv: {
    backend: null as string | null, // "/cv/waseem-alnasser-backend.pdf"
    fullStack: "/cv/Waseem_Alnasser_CV.pdf" as string | null, // single combined CV
  },

  /** Availability line shown in Contact. Update it yourself; null hides it. */
  availableFrom: "7 November 2026" as string | null,

  /** Leave null to show "Present"; once the end is confirmed, set e.g. "November 2026". */
  deliveritEnd: null as string | null,

  /** Verified public project/store links. Null hides the link. */
  projectUrls: {
    deliverit: "https://deliverit.ae",
    "multi-tenant-saas": null,
    "vpn-platform": null,
    "elite-style": null,
    "rapid-medics": "https://rapidmedics.ae", // from CV: "Product/demo"; confirm it is live
  } as Record<string, string | null>,

  /** Live WordPress sites shown under WordPress client work. */
  clientSites: [
    { label: "deliverit.ae", url: "https://deliverit.ae" },
    { label: "mbvision.ae", url: "https://mbvision.ae" },
    { label: "stepsdecor.ae", url: "https://stepsdecor.ae" },
    { label: "foamlines.ae", url: "https://foamlines.ae" },
  ] as { label: string; url: string }[],

  /** Project periods taken from the CV ("Client Booking Platforms | 2025-2026"). */
  projectPeriods: {
    "elite-style": "2025–2026",
    "rapid-medics": "2025–2026",
  } as Record<string, string>,

  /**
   * Approved images per project. Case-study keys render on their page; the
   * client-project keys render on the homepage. Empty = SVG/text fallback only.
   */
  media: {
    deliverit: [
      { src: "/images/deliverit/request.webp", width: 720, height: 1280, alt: "Delivery request form with package description, package size options and pickup and drop-off locations.", caption: "Creating a delivery request: package details, size and locations." },
      { src: "/images/deliverit/offers.webp", width: 720, height: 1280, alt: "Customer view of a driver offer showing offer value, service charge, total and Accept and Reject buttons.", caption: "Customer view of driver offers, with the total shown before accepting." },
      { src: "/images/deliverit/tracking.webp", width: 720, height: 1280, alt: "Order tracking screen with a route map between pickup and drop-off points and delivery details below.", caption: "Order tracking with a route map and delivery status." },
      { src: "/images/deliverit/chat.webp", width: 720, height: 1280, alt: "In-app chat between a customer and a driver about a delivery.", caption: "In-app chat between customer and driver." },
      { src: "/images/deliverit/payment.webp", width: 720, height: 1280, alt: "Card payment sheet at checkout asking for card details and showing the amount to pay.", caption: "Card payment at checkout; cash is also accepted." },
    ],
    "multi-tenant-saas": [],
    "vpn-platform": [
      { src: "/images/vpn/app.webp", width: 640, height: 1387, alt: "VPN app main screen showing the selected country, download and upload speeds, a connect button and connection status.", caption: "Main connection screen with server selection and live connection status." },
    ],
    "elite-style": [
      { src: "/images/elite-style/app.webp", width: 1024, height: 500, alt: "Three phone screens from the Elite Style app: home with a Book Now button, a booking confirmation and a sign-in screen, beside the salon logo.", caption: "Promotional artwork with the home, booking-confirmation and sign-in screens." },
    ],
    "rapid-medics": [
      { src: "/images/rapid-medics/home.webp", width: 640, height: 1425, alt: "Rapid Medics app home screen with Book Now and My Records actions and a special offers card.", caption: "Home screen with sample content." },
      { src: "/images/rapid-medics/services.webp", width: 640, height: 1425, alt: "Rapid Medics services screen listing physiotherapy, lab tests, IV drip therapy, home nursing and doctor on call.", caption: "Services list." },
    ],
  } as Record<string, MediaItem[]>,

  /** Short note shown above a case study's images. */
  mediaNotes: {
    deliverit: "Promotional app screens with sample data.",
  } as Record<string, string>,
};

export const caseStudySlugs = ["deliverit", "multi-tenant-saas", "vpn-platform"] as const;
export type CaseStudySlug = (typeof caseStudySlugs)[number];

export const hasCv = Boolean(site.cv.backend || site.cv.fullStack);

export const navItems = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];
