export type Lang = 'sq' | 'en';

export const translations = {
  nav: {
    home: { sq: 'Kryefaqja', en: 'Home' },
    services: { sq: 'Shërbimet', en: 'Services' },
    products: { sq: 'Produktet', en: 'Products' },
    portfolio: { sq: 'Portofoli', en: 'Portfolio' },
    pricing: { sq: 'Çmimet', en: 'Pricing' },
    faq: { sq: 'Pyetjet', en: 'FAQ' },
    contact: { sq: 'Kontakt', en: 'Contact' },
    cart: { sq: 'Shporta', en: 'Cart' },
    login: { sq: 'Hyr', en: 'Login' },
    signup: { sq: 'Regjistrohu', en: 'Sign Up' },
    logout: { sq: 'Dil', en: 'Logout' },
    account: { sq: 'Llogaria', en: 'Account' },
    orders: { sq: 'Porositë', en: 'Orders' },
    requestQuote: { sq: 'Kërko ofertë', en: 'Request Quote' },
    mockupDesigner: { sq: 'Dizajnuesi', en: 'Designer' },
  },
  hero: {
    title: { sq: 'Printim DTF profesional në Tiranë', en: 'Professional DTF Printing in Tirana' },
    subtitle: { sq: 'Veshje e personalizuar me cilësi të lartë për biznese, ekipe dhe evente. Minimum i ulët porosie, dorëzim i shpejtë.', en: 'High-quality custom apparel for businesses, teams and events. Low minimums, fast turnaround.' },
    cta: { sq: 'Kërko ofertë', en: 'Get a Quote' },
    ctaSecondary: { sq: 'Shiko produktet', en: 'View Products' },
  },
  howItWorks: {
    title: { sq: 'Si funksionon', en: 'How It Works' },
    step1Title: { sq: 'Dërgoni dizajnin', en: 'Send Your Design' },
    step1Desc: { sq: 'Ngarkoni logon ose dizajnin tuaj në formatin PNG, me sfond transparent.', en: 'Upload your logo or design in PNG format with transparent background.' },
    step2Title: { sq: 'Zgjidhni produktin', en: 'Choose Product' },
    step2Desc: { sq: 'Zgjidhni veshjen, madhësinë, ngjyrën dhe vendin e printimit.', en: 'Select garment, size, color and print placement.' },
    step3Title: { sq: 'Ne printojmë', en: 'We Print' },
    step3Desc: { sq: 'Përgatitim transfertën DTF dhe e aplikojmë me presë profesionale nxehtësie.', en: 'We order the DTF transfer and apply it with professional heat press.' },
    step4Title: { sq: 'Dorëzimi', en: 'Delivery' },
    step4Desc: { sq: 'Produkti i përfunduar ju dorëzohet brenda 3–5 ditësh pune.', en: 'Your finished product delivered within 3-5 business days.' },
  },
  categories: {
    title: { sq: 'Kategoritë e produkteve', en: 'Product Categories' },
  },
  featured: {
    title: { sq: 'Punët e fundit', en: 'Recent Work' },
  },
  testimonials: {
    title: { sq: 'Çfarë thonë klientët', en: 'What Clients Say' },
  },
  cta: {
    title: { sq: 'Gati për të filluar?', en: 'Ready to Get Started?' },
    subtitle: { sq: 'Na kontaktoni sot për një ofertë falas ose bëni porosinë online.', en: 'Contact us today for a free quote or place your order online.' },
    button: { sq: 'Na kontaktoni', en: 'Contact Us' },
  },
  footer: {
    description: { sq: 'Printim DTF profesional dhe veshje e personalizuar në Tiranë. Cilësi e lartë, minimum i ulët porosie, dorëzim i shpejtë.', en: 'Professional DTF printing and custom apparel in Tirana, Albania. High quality, low minimums, fast turnaround.' },
    contact: { sq: 'Kontakt', en: 'Contact' },
    quickLinks: { sq: 'Lidhje të shpejta', en: 'Quick Links' },
    newsletter: { sq: 'Buletini', en: 'Newsletter' },
    newsletterDesc: { sq: 'Regjistrohuni për oferta dhe lajme.', en: 'Subscribe for deals and news.' },
    subscribe: { sq: 'Abonohu', en: 'Subscribe' },
    rights: { sq: 'Të gjitha të drejtat e rezervuara.', en: 'All rights reserved.' },
  },
  services: {
    pageTitle: { sq: 'Shërbimet tona', en: 'Our Services' },
    pageDesc: { sq: 'Ofrojmë një gamë të gjerë shërbimesh printimi DTF dhe personalizimi veshjesh.', en: 'We offer a wide range of DTF printing and custom apparel services.' },
    dtf: {
      title: { sq: 'Printim DTF', en: 'DTF Printing' },
      desc: { sq: 'Transferta Direct-to-Film me cilësi të lartë, të aplikuara me presë profesionale nxehtësie në çdo lloj veshjeje.', en: 'High-quality Direct-to-Film transfers, applied with professional heat press on any garment type.' },
    },
    custom: {
      title: { sq: 'Veshje e personalizuar', en: 'Custom Clothing' },
      desc: { sq: 'Bluza, polo, hoodie, veshje sportive, uniforma pune dhe më shumë, të personalizuara me logon tuaj.', en: 'T-shirts, polos, hoodies, sportswear, workwear and more, customized with your logo.' },
    },
    logo: {
      title: { sq: 'Printim logosh', en: 'Logo Printing' },
      desc: { sq: 'Printim logoje në vende të ndryshme: gjoks, mëngë, qafë, pjesa e përparme dhe ajo e pasme.', en: 'Logo printing in various placements: chest, sleeve, neck, full front, full back.' },
    },
    bulk: {
      title: { sq: 'Porosi me shumicë', en: 'Bulk Orders' },
      desc: { sq: 'Çmime speciale për porosi në sasi të mëdha. Ideale për ekipe, kompani dhe evente.', en: 'Special pricing for large quantity orders. Ideal for teams, companies and events.' },
    },
  },
  pricing: {
    pageTitle: { sq: 'Çmimet', en: 'Pricing' },
    pageDesc: { sq: 'Çmime transparente dhe konkurruese. Çmimi përfshin veshjen, printimin DTF dhe aplikimin.', en: 'Transparent and competitive pricing. Prices include garment, DTF print and application.' },
    from: { sq: 'Nga', en: 'From' },
    perUnit: { sq: 'për copë', en: 'per unit' },
    includes: { sq: 'Përfshin', en: 'Includes' },
  },
  contact: {
    pageTitle: { sq: 'Na kontaktoni', en: 'Contact Us' },
    pageDesc: { sq: 'Jemi këtu për t’ju ndihmuar. Na dërgoni një mesazh ose na kontaktoni drejtpërdrejt.', en: 'We are here to help. Send us a message or contact us directly.' },
    name: { sq: 'Emri', en: 'Name' },
    email: { sq: 'Email', en: 'Email' },
    phone: { sq: 'Telefoni', en: 'Phone' },
    subject: { sq: 'Subjekti', en: 'Subject' },
    message: { sq: 'Mesazhi', en: 'Message' },
    send: { sq: 'Dërgo mesazhin', en: 'Send Message' },
    success: { sq: 'Mesazhi u dërgua me sukses!', en: 'Message sent successfully!' },
  },
  faq: {
    pageTitle: { sq: 'Pyetje të shpeshta', en: 'Frequently Asked Questions' },
    pageDesc: { sq: 'Gjeni përgjigjet e pyetjeve më të shpeshta rreth shërbimeve tona.', en: 'Find answers to the most common questions about our services.' },
  },
  portfolio: {
    pageTitle: { sq: 'Portofoli', en: 'Portfolio' },
    pageDesc: { sq: 'Shihni disa nga punët tona më të mira.', en: 'Check out some of our best work.' },
  },
  cart: {
    title: { sq: 'Shporta', en: 'Shopping Cart' },
    empty: { sq: 'Shporta juaj është bosh.', en: 'Your cart is empty.' },
    checkout: { sq: 'Vazhdo me porosinë', en: 'Proceed to Checkout' },
    subtotal: { sq: 'Nëntotali', en: 'Subtotal' },
    shipping: { sq: 'Transporti', en: 'Shipping' },
    total: { sq: 'Totali', en: 'Total' },
    remove: { sq: 'Hiq', en: 'Remove' },
  },
  checkout: {
    title: { sq: 'Përfundo porosinë', en: 'Checkout' },
    shipping: { sq: 'Të dhënat e dorëzimit', en: 'Shipping Information' },
    fullName: { sq: 'Emri i plotë', en: 'Full Name' },
    address: { sq: 'Adresa', en: 'Address' },
    city: { sq: 'Qyteti', en: 'City' },
    phone: { sq: 'Telefoni', en: 'Phone' },
    notes: { sq: 'Shënime', en: 'Notes' },
    payment: { sq: 'Mënyra e pagesës', en: 'Payment Method' },
    cash: { sq: 'Para në dorë (në dorëzim)', en: 'Cash on Delivery' },
    bankTransfer: { sq: 'Transfertë bankare', en: 'Bank Transfer' },
    placeOrder: { sq: 'Dërgo porosinë', en: 'Place Order' },
  },
  quote: {
    title: { sq: 'Kërko ofertë', en: 'Request a Quote' },
    desc: { sq: 'Plotësoni formularin dhe merrni një ofertë të personalizuar brenda 24 orësh.', en: 'Fill out the form to receive a custom quote within 24 hours.' },
    company: { sq: 'Kompania', en: 'Company' },
    productType: { sq: 'Lloji i produktit', en: 'Product Type' },
    quantity: { sq: 'Sasia', en: 'Quantity' },
    description: { sq: 'Përshkrimi', en: 'Description' },
    uploadDesign: { sq: 'Ngarko dizajnin', en: 'Upload Design' },
    submit: { sq: 'Dërgo kërkesën', en: 'Submit Request' },
    success: { sq: 'Kërkesa u dërgua! Do t’ju kontaktojmë brenda 24 orësh.', en: 'Request sent! We will contact you within 24 hours.' },
  },
  product: {
    addToCart: { sq: 'Shto në shportë', en: 'Add to Cart' },
    size: { sq: 'Madhësia', en: 'Size' },
    color: { sq: 'Ngjyra', en: 'Color' },
    printArea: { sq: 'Zona e printimit', en: 'Print Area' },
    uploadDesign: { sq: 'Ngarko dizajnin', en: 'Upload Design' },
    quantity: { sq: 'Sasia', en: 'Quantity' },
    minOrder: { sq: 'Porosia minimale', en: 'Minimum order' },
    description: { sq: 'Përshkrimi', en: 'Description' },
  },
  login: {
    title: { sq: 'Hyr në llogari', en: 'Login to Account' },
    noAccount: { sq: 'Nuk keni llogari?', en: "Don't have an account?" },
    forgotPassword: { sq: 'Keni harruar fjalëkalimin?', en: 'Forgot password?' },
  },
  signup: {
    title: { sq: 'Krijo llogari', en: 'Create Account' },
    hasAccount: { sq: 'Keni tashmë llogari?', en: 'Already have an account?' },
    name: { sq: 'Emri i plotë', en: 'Full Name' },
    password: { sq: 'Fjalëkalimi', en: 'Password' },
    confirmPassword: { sq: 'Konfirmo fjalëkalimin', en: 'Confirm Password' },
  },
  common: {
    loading: { sq: 'Duke u ngarkuar…', en: 'Loading...' },
    error: { sq: 'Ndodhi një gabim.', en: 'An error occurred.' },
    success: { sq: 'Sukses!', en: 'Success!' },
    back: { sq: 'Kthehu', en: 'Back' },
    viewAll: { sq: 'Shiko të gjitha', en: 'View All' },
    lek: { sq: 'Lekë', en: 'ALL' },
  },
  printAreas: {
    leftChest: { sq: 'Gjoksi majtas (9×4 cm)', en: 'Left Chest (9x4cm)' },
    sleeve: { sq: 'Mëngë (3×8 cm)', en: 'Sleeve (3x8cm)' },
    neck: { sq: 'Qafë (4×2,5 cm)', en: 'Neck (4x2.5cm)' },
    frontFull: { sq: 'Pjesa e përparme (22×9 cm)', en: 'Full Front (22x9cm)' },
    backFull: { sq: 'Pjesa e pasme (30×25 cm)', en: 'Full Back (30x25cm)' },
  },
} as const;

export function t(key: string, lang: Lang): string {
  const keys = key?.split('.') ?? [];
  let result: any = translations;
  for (const k of keys) {
    result = result?.[k];
    if (!result) return key ?? '';
  }
  return result?.[lang] ?? result?.en ?? key ?? '';
}
