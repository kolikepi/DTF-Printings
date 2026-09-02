import { BUSINESS } from '@/lib/contact-info';
import { FREE_SHIPPING_OVER, SHIPPING_COST } from '@/lib/pricing';

/**
 * Tekstet ligjore. Janë shkruar si bazë pune për një dyqan të vogël në Shqipëri —
 * plotësoni NIPT-in dhe adresën te lib/contact-info.ts (ose me variabla mjedisi)
 * dhe kontrollojini me juristin tuaj përpara se t’i përdorni për reklama.
 */

export type LegalSection = { heading: { sq: string; en: string }; body: { sq: string; en: string }[] };
export type LegalDoc = {
  slug: string;
  title: { sq: string; en: string };
  intro: { sq: string; en: string };
  sections: LegalSection[];
};

const contactLine = {
  sq: `${BUSINESS.legalName}, ${BUSINESS.address}. Email: ${BUSINESS.email}. Telefon: ${BUSINESS.phone}.${BUSINESS.nipt ? ` NIPT: ${BUSINESS.nipt}.` : ''}`,
  en: `${BUSINESS.legalName}, ${BUSINESS.address}. Email: ${BUSINESS.email}. Phone: ${BUSINESS.phone}.${BUSINESS.nipt ? ` Business ID: ${BUSINESS.nipt}.` : ''}`,
};

export const PRIVACY: LegalDoc = {
  slug: 'privacy',
  title: { sq: 'Politika e privatësisë', en: 'Privacy policy' },
  intro: {
    sq: 'Kjo faqe shpjegon çfarë të dhënash mbledhim, pse i mbledhim dhe çfarë mund të kërkoni ju.',
    en: 'This page explains what data we collect, why we collect it, and what you can ask us to do with it.',
  },
  sections: [
    {
      heading: { sq: 'Kush i përpunon të dhënat', en: 'Who processes the data' },
      body: [contactLine],
    },
    {
      heading: { sq: 'Çfarë mbledhim', en: 'What we collect' },
      body: [
        {
          sq: 'Kur kërkoni një ofertë ose bëni një porosi: emri, email-i, telefoni, adresa e dorëzimit dhe skedari i dizajnit që ngarkoni. Kur regjistroheni: email-i dhe fjalëkalimi i ruajtur i koduar. Kur abonoheni te buletini: vetëm email-i.',
          en: 'When you request a quote or place an order: name, email, phone, delivery address and the design file you upload. When you register: your email and a hashed password. When you subscribe to the newsletter: your email only.',
        },
      ],
    },
    {
      heading: { sq: 'Pse i përdorim', en: 'Why we use it' },
      body: [
        {
          sq: 'Për të përgatitur ofertën, për të prodhuar e dorëzuar porosinë, për të mbajtur kontakt rreth saj dhe për detyrimet ligjore e kontabël. Nuk i shesim dhe nuk i japim për reklama te palë të treta.',
          en: 'To prepare your quote, produce and deliver your order, stay in touch about it, and meet legal and accounting obligations. We do not sell your data or hand it to third parties for advertising.',
        },
      ],
    },
    {
      heading: { sq: 'Sa gjatë i mbajmë', en: 'How long we keep it' },
      body: [
        {
          sq: 'Porositë dhe faturat ruhen sa kërkon legjislacioni tatimor. Kërkesat për ofertë dhe mesazhet ruhen deri në dy vjet. Dizajnet e ngarkuara i fshijmë me kërkesën tuaj, ose kur nuk nevojiten më për prodhim.',
          en: 'Orders and invoices are kept for as long as tax law requires. Quote requests and messages are kept for up to two years. Uploaded designs are deleted at your request, or once they are no longer needed for production.',
        },
      ],
    },
    {
      heading: { sq: 'Të drejtat tuaja', en: 'Your rights' },
      body: [
        {
          sq: 'Mund të kërkoni një kopje të të dhënave tuaja, ndreqjen ose fshirjen e tyre, si dhe të tërhiqeni nga buletini në çdo moment. Na shkruani te ' + BUSINESS.email + ' dhe përgjigjemi brenda 30 ditësh.',
          en: 'You can ask for a copy of your data, ask us to correct or delete it, and unsubscribe from the newsletter at any time. Write to ' + BUSINESS.email + ' and we reply within 30 days.',
        },
      ],
    },
    {
      heading: { sq: 'Cookies dhe matja e vizitave', en: 'Cookies and analytics' },
      body: [
        {
          sq: 'Përdorim vetëm cookie teknike, të nevojshme për hyrjen në llogari dhe për shportën. Nëse aktivizohet matja e vizitave, ajo bëhet në formë të përmbledhur, pa profilizim personal.',
          en: 'We use only technical cookies, needed for login and the shopping cart. If visitor analytics is enabled, it is aggregated and does not profile individuals.',
        },
      ],
    },
  ],
};

export const TERMS: LegalDoc = {
  slug: 'terms',
  title: { sq: 'Kushtet e përdorimit', en: 'Terms of use' },
  intro: {
    sq: 'Kushtet sipas të cilave pranojmë porositë dhe ofrojmë shërbimin e printimit.',
    en: 'The terms under which we accept orders and provide the printing service.',
  },
  sections: [
    { heading: { sq: 'Shitësi', en: 'The seller' }, body: [contactLine] },
    {
      heading: { sq: 'Porosia dhe konfirmimi', en: 'Orders and confirmation' },
      body: [
        {
          sq: 'Një porosi e bërë online është kërkesë blerjeje. Ajo bëhet e detyrueshme kur ne ju konfirmojmë me email ose telefon çmimin, sasinë dhe afatin. Çmimet janë në Lekë dhe përfshijnë veshjen, printimin dhe aplikimin.',
          en: 'An online order is a purchase request. It becomes binding when we confirm the price, quantity and deadline by email or phone. Prices are in Albanian Lek and include the garment, the print and the application.',
        },
      ],
    },
    {
      heading: { sq: 'Dizajni dhe të drejtat', en: 'Designs and rights' },
      body: [
        {
          sq: 'Ju garantoni se keni të drejtë ta përdorni dizajnin që ngarkoni. Nuk printojmë materiale që cenojnë të drejtat e autorit, markat tregtare ose ligjin. Dizajni juaj përdoret vetëm për porosinë tuaj.',
          en: 'You confirm that you have the right to use the design you upload. We do not print material that infringes copyright, trademarks or the law. Your design is used only for your order.',
        },
      ],
    },
    {
      heading: { sq: 'Cilësia dhe ngjyrat', en: 'Quality and colour' },
      body: [
        {
          sq: 'Ngjyrat në ekran mund të ndryshojnë lehtë nga rezultati i printuar. Për skedarë nën 300 DPI ose me sfond jotransparent, cilësia mund të bjeje; në këto raste ju njoftojmë përpara prodhimit.',
          en: 'On-screen colours can differ slightly from the printed result. Files below 300 DPI or without a transparent background may reduce quality; in that case we tell you before production.',
        },
      ],
    },
    {
      heading: { sq: 'Pagesa', en: 'Payment' },
      body: [
        {
          sq: 'Pagesa bëhet me para në dorë në dorëzim ose me transfertë bankare. Për porosi të mëdha mund të kërkohet paradhënie, e cila njoftohet paraprakisht.',
          en: 'Payment is by cash on delivery or bank transfer. Large orders may require a deposit, which we agree in advance.',
        },
      ],
    },
  ],
};

export const SHIPPING: LegalDoc = {
  slug: 'shipping-returns',
  title: { sq: 'Dorëzimi dhe kthimet', en: 'Delivery and returns' },
  intro: {
    sq: 'Sa zgjat prodhimi, sa kushton transporti dhe çfarë ndodh nëse diçka nuk shkon.',
    en: 'How long production takes, what delivery costs, and what happens if something is wrong.',
  },
  sections: [
    {
      heading: { sq: 'Afatet', en: 'Timelines' },
      body: [
        {
          sq: 'Prodhimi zgjat zakonisht 3–5 ditë pune pas konfirmimit të dizajnit dhe porosisë. Për sasi të mëdha ose periudha me kërkesë të lartë, afati konfirmohet me shkrim.',
          en: 'Production usually takes 3–5 business days after the design and order are confirmed. For large quantities or busy periods we confirm the deadline in writing.',
        },
      ],
    },
    {
      heading: { sq: 'Transporti', en: 'Delivery' },
      body: [
        {
          sq: `Transporti brenda Shqipërisë kushton ${SHIPPING_COST} Lekë dhe është falas për porositë mbi ${FREE_SHIPPING_OVER.toLocaleString('de-DE')} Lekë. Dorëzimi bëhet me postë ose me korrier, sipas destinacionit.`,
          en: `Delivery inside Albania costs ${SHIPPING_COST} ALL and is free for orders above ${FREE_SHIPPING_OVER.toLocaleString('en-US')} ALL. We ship by post or courier depending on the destination.`,
        },
      ],
    },
    {
      heading: { sq: 'Produkte të personalizuara', en: 'Personalised products' },
      body: [
        {
          sq: 'Produktet e printuara sipas dizajnit tuaj janë të personalizuara, ndaj nuk kthehen thjesht sepse ndërruat mendje. Kjo është praktika standarde për porositë me printim.',
          en: 'Items printed with your design are personalised, so they cannot be returned simply because you changed your mind. This is standard practice for printed orders.',
        },
      ],
    },
    {
      heading: { sq: 'Defekte dhe gabime', en: 'Faults and mistakes' },
      body: [
        {
          sq: 'Nëse produkti ka defekt, printimi është i dëmtuar ose nuk përputhet me atë që konfirmuam, na njoftoni brenda 48 orësh nga marrja, me foto. E riprodhojmë pa pagesë ose ju kthejmë shumën.',
          en: 'If an item is faulty, the print is damaged, or it does not match what we confirmed, tell us within 48 hours of delivery and send photos. We reprint it free of charge or refund you.',
        },
      ],
    },
    {
      heading: { sq: 'Anulimi', en: 'Cancellation' },
      body: [
        {
          sq: 'Porosia mund të anulohet pa kosto derisa të nisë prodhimi. Pasi printimi ka filluar, anulimi nuk është i mundur.',
          en: 'An order can be cancelled at no cost until production starts. Once printing has begun, cancellation is no longer possible.',
        },
      ],
    },
  ],
};

export const LEGAL_DOCS = { privacy: PRIVACY, terms: TERMS, 'shipping-returns': SHIPPING };
