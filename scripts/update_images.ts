import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const updates: {slug: string; imageUrl: string}[] = [
    { slug: 'premium-tshirt', imageUrl: '/images/products/premium_tshirt.png' },
    { slug: 'zip-hoodie', imageUrl: '/images/products/zip_hoodie.png' },
    { slug: 'sweatshirt', imageUrl: '/images/products/sweatshirt.png' },
    { slug: 'training-shirt', imageUrl: '/images/products/training_shirt.png' },
    { slug: 'work-polo', imageUrl: '/images/products/work_polo.png' },
    { slug: 'work-shirt', imageUrl: '/images/products/work_shirt.png' },
  ];
  for (const u of updates) {
    await prisma.product.update({ where: { slug: u.slug }, data: { imageUrl: u.imageUrl } });
  }
  // Update portfolio
  await prisma.portfolioItem.updateMany({ where: { title: 'Running Club Gear' }, data: { imageUrl: '/images/products/running_club.png' } });
  console.log('Images updated!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
