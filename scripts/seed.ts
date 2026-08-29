import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user — kredencialet vijnë nga .env, ndryshe gjenerohet një fjalëkalim i rastësishëm.
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@elev8printings.al';
  const adminPassword = process.env.ADMIN_PASSWORD ?? crypto.randomBytes(12).toString('base64url');
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  });
  if (!adminExists && !process.env.ADMIN_PASSWORD) {
    console.log(`\n  Admin: ${adminEmail}\n  Fjalëkalimi: ${adminPassword}\n  (ruaje tani — nuk shfaqet më)\n`);
  }

  // Categories
  const categories = [
    { name: 'Custom T-Shirts', nameAl: 'Bluza të personalizuara', slug: 'tshirts', description: 'Custom printed t-shirts with your logo or design.', descriptionAl: 'Bluza të personalizuara me logon ose dizajnin tuaj.', imageUrl: '/images/custom-tshirt.png', sortOrder: 1 },
    { name: 'Custom Hoodies', nameAl: 'Hoodie të personalizuara', slug: 'hoodies', description: 'Premium custom hoodies for any occasion.', descriptionAl: 'Hoodie premium të personalizuara për çdo rast.', imageUrl: '/images/custom-hoodie.png', sortOrder: 2 },
    { name: 'Sportswear', nameAl: 'Veshje sportive', slug: 'sportswear', description: 'Custom sportswear for teams and clubs.', descriptionAl: 'Veshje sportive të personalizuara për ekipe dhe klube.', imageUrl: '/images/custom-sportswear.png', sortOrder: 3 },
    { name: 'Workwear', nameAl: 'Uniforma pune', slug: 'workwear', description: 'Branded workwear and uniforms.', descriptionAl: 'Uniforma pune me logon tuaj.', imageUrl: '/images/workwear-branding.png', sortOrder: 4 },
    { name: 'DTF Transfers', nameAl: 'Transferta DTF', slug: 'dtf-transfers', description: 'Ready-to-press DTF transfer sheets.', descriptionAl: 'Fletë transferte DTF, gati për aplikim.', imageUrl: '/images/dtf-transfer-application.png', sortOrder: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // Get category IDs
  const catMap: Record<string, string> = {};
  const allCats = await prisma.category.findMany();
  for (const c of allCats) catMap[c.slug] = c.id;

  // Products
  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Gray'];
  const printAreas = ['Left Chest (9x4cm)', 'Full Front (22x9cm)', 'Full Back (30x25cm)', 'Sleeve (3x8cm)'];

  const products = [
    { name: 'Classic T-Shirt', nameAl: 'Bluzë klasike', slug: 'classic-tshirt', description: 'High-quality cotton t-shirt with custom DTF print. Perfect for casual wear, events, and branding.', descriptionAl: 'Bluzë pambuku me cilësi të lartë, me printim DTF. Perfekte për veshje të përditshme, evente dhe logo biznesi.', basePrice: 1500, categorySlug: 'tshirts', imageUrl: '/images/custom-tshirt.png', isFeatured: true },
    { name: 'Premium T-Shirt', nameAl: 'Bluzë premium', slug: 'premium-tshirt', description: 'Premium quality t-shirt with enhanced fabric and print.', descriptionAl: 'Bluzë me cilësi premium, me material dhe printim të përmirësuar.', basePrice: 2000, categorySlug: 'tshirts', imageUrl: '/images/products/premium_tshirt.png', isFeatured: false },
    { name: 'Classic Hoodie', nameAl: 'Hoodie klasike', slug: 'classic-hoodie', description: 'Warm and comfortable hoodie with professional DTF printing. Great for teams and brands.', descriptionAl: 'Hoodie e ngrohtë dhe komode, me printim DTF profesional. E shkëlqyer për ekipe dhe marka.', basePrice: 3000, categorySlug: 'hoodies', imageUrl: '/images/custom-hoodie.png', isFeatured: true },
    { name: 'Zip-Up Hoodie', nameAl: 'Hoodie me zinxhir', slug: 'zip-hoodie', description: 'Zip-up hoodie with custom branding. Perfect for company merch and team apparel.', descriptionAl: 'Hoodie me zinxhir dhe logo të personalizuar. Perfekte për veshjet e kompanisë.', basePrice: 3500, categorySlug: 'hoodies', imageUrl: '/images/custom-hoodie.png', isFeatured: false },
    { name: 'Sweatshirt', nameAl: 'Sweatshirt', slug: 'sweatshirt', description: 'Classic crew neck sweatshirt with custom DTF print. Comfortable for everyday wear.', descriptionAl: 'Sweatshirt klasik me printim DTF të personalizuar. Komod për çdo ditë.', basePrice: 2500, categorySlug: 'hoodies', imageUrl: '/images/custom-hoodie.png', isFeatured: true },
    { name: 'Sports Jersey', nameAl: 'Fanellë sportive', slug: 'sports-jersey', description: 'Lightweight sports jersey with name and number printing. Ideal for teams and clubs.', descriptionAl: 'Fanellë sportive e lehtë, me printim emri dhe numri. Ideale për ekipe dhe klube.', basePrice: 2500, categorySlug: 'sportswear', imageUrl: '/images/custom-sportswear.png', isFeatured: true },
    { name: 'Training Shirt', nameAl: 'Bluzë stërvitjeje', slug: 'training-shirt', description: 'Breathable training shirt with custom print. Perfect for gyms and fitness teams.', descriptionAl: 'Bluzë stërvitjeje që merr frymë, me printim të personalizuar. Perfekte për palestra dhe ekipe fitnesi.', basePrice: 2000, categorySlug: 'sportswear', imageUrl: '/images/custom-sportswear.png', isFeatured: false },
    { name: 'Work Polo', nameAl: 'Polo pune', slug: 'work-polo', description: 'Professional polo shirt with company logo. Perfect for businesses and restaurants.', descriptionAl: 'Polo profesionale me logon e kompanisë. Perfekte për biznese dhe restorante.', basePrice: 2000, categorySlug: 'workwear', imageUrl: '/images/workwear-branding.png', isFeatured: true },
    { name: 'Work Shirt', nameAl: 'Këmishë pune', slug: 'work-shirt', description: 'Durable work shirt with custom branding. For construction and industrial teams.', descriptionAl: 'Këmishë pune e qëndrueshme me logo. Për ekipe ndërtimi dhe industriale.', basePrice: 2200, categorySlug: 'workwear', imageUrl: '/images/workwear-branding.png', isFeatured: false },
    { name: 'DTF Transfer Sheet', nameAl: 'Fletë transferte DTF', slug: 'dtf-transfer', description: 'Custom DTF transfer sheet ready to press. Just apply with a heat press.', descriptionAl: 'Fletë transferte DTF e personalizuar, gati për aplikim. Mjafton ta aplikoni me presë nxehtësie.', basePrice: 500, categorySlug: 'dtf-transfers', imageUrl: '/images/dtf-transfer-application.png', isFeatured: true, minQty: 5 },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        nameAl: prod.nameAl,
        description: prod.description,
        descriptionAl: prod.descriptionAl,
        basePrice: prod.basePrice,
        imageUrl: prod.imageUrl,
        isFeatured: prod.isFeatured,
        categoryId: catMap[prod.categorySlug] ?? '',
        sizes,
        colors,
        printAreas,
        minQuantity: prod.minQty ?? 1,
      },
      create: {
        name: prod.name,
        nameAl: prod.nameAl,
        slug: prod.slug,
        description: prod.description,
        descriptionAl: prod.descriptionAl,
        basePrice: prod.basePrice,
        imageUrl: prod.imageUrl,
        isFeatured: prod.isFeatured,
        categoryId: catMap[prod.categorySlug] ?? '',
        sizes,
        colors,
        printAreas,
        minQuantity: prod.minQty ?? 1,
      },
    });
  }

  // Portfolio Items
  const portfolioItems = [
    { title: 'Gym Brand T-Shirts', titleAl: 'Bluza për palestër', description: 'Custom t-shirts for FitLife Gym', descriptionAl: 'Bluza të personalizuara për palestrën FitLife', imageUrl: '/images/custom-tshirt.png', category: 'T-Shirts', isFeatured: true, sortOrder: 1 },
    { title: 'Football Team Kit', titleAl: 'Kompleti i ekipit të futbollit', description: 'Full kit for local football team', descriptionAl: 'Komplet i plotë për një ekip vendas futbolli', imageUrl: '/images/custom-sportswear.png', category: 'Sportswear', isFeatured: true, sortOrder: 2 },
    { title: 'Restaurant Uniforms', titleAl: 'Uniforma restoranti', description: 'Branded polo shirts for staff', descriptionAl: 'Polo me logo për stafin', imageUrl: '/images/workwear-branding.png', category: 'Workwear', isFeatured: true, sortOrder: 3 },
    { title: 'Event Hoodies', titleAl: 'Hoodie për evente', description: 'Custom hoodies for music festival', descriptionAl: 'Hoodie të personalizuara për një festival muzike', imageUrl: '/images/custom-hoodie.png', category: 'Hoodies', isFeatured: true, sortOrder: 4 },
    { title: 'Running Club Gear', titleAl: 'Veshje për klub vrapimi', description: 'Training shirts for running club', descriptionAl: 'Bluza stërvitjeje për klubin e vrapimit', imageUrl: '/images/custom-sportswear.png', category: 'Sportswear', isFeatured: false, sortOrder: 5 },
    { title: 'Brand Merch Collection', titleAl: 'Koleksion veshjesh me markë', description: 'Full merchandise line for clothing brand', descriptionAl: 'Linjë e plotë veshjesh për një markë rrobash', imageUrl: '/images/portfolio-gallery.png', category: 'Collection', isFeatured: true, sortOrder: 6 },
  ];

  for (const item of portfolioItems) {
    const existing = await prisma.portfolioItem.findFirst({ where: { title: item.title } });
    if (!existing) {
      await prisma.portfolioItem.create({ data: item });
    }
  }

  // Testimonials
  const testimonials = [
    { name: 'Andi M.', company: 'FitZone Gym', text: 'Excellent quality prints and fast turnaround. Our gym members love the custom t-shirts!', textAl: 'Printim me cilësi të shkëlqyer dhe dorëzim i shpejtë. Anëtarët e palestrës sonë janë shumë të kënaqur me bluzat!', rating: 5 },
    { name: 'Elona K.', company: 'Caffè Bella', text: 'We ordered polo shirts for our restaurant staff. Professional service and great results.', textAl: 'Porositëm polo për stafin e restorantit. Shërbim profesional dhe rezultate të shkëlqyera.', rating: 5 },
    { name: 'Dritan H.', company: 'FC Partizani Youth', text: 'The team jerseys came out perfect. Great quality printing and reasonable prices.', textAl: 'Fanellat e ekipit dolën perfekte. Printim me cilësi të lartë dhe çmime të arsyeshme.', rating: 5 },
    { name: 'Sara B.', company: 'StartUp Hub', text: 'Fast service, great communication, and the hoodies were amazing quality. Highly recommend!', textAl: 'Shërbim i shpejtë, komunikim i shkëlqyer dhe hoodie me cilësi të lartë. E rekomandoj!', rating: 5 },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
