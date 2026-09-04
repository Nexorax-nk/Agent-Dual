import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up database to only keep Gadgets/Electronics...");

  // Delete cart items and order items first to avoid foreign key constraints (or cascade will handle it)
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});

  const techKeywords = ['laptop', 'phone', 'keyboard', 'mouse', 'monitor', 'headphone', 'earbud', 'gaming', 'smart', 'usb', 'cable', 'macbook', 'ipad', 'tablet', 'pc', 'desktop', 'wireless', 'bluetooth', 'speaker', 'camera', 'lens', 'drone'];

  // SQLite doesn't easily support regex or complex NOT LIKE in Prisma without raw queries,
  // so we'll fetch all IDs that match our criteria, and delete everything else.
  // Wait, 100k items might be too large to fetch all at once. Let's just use a raw query to delete.

  console.log("Executing raw delete query...");

  // Build the NOT LIKE conditions
  const conditions = techKeywords.map(kw => `LOWER(title) NOT LIKE '%${kw}%' AND LOWER(category) NOT LIKE '%${kw}%'`).join(' AND ');

  const result = await prisma.$executeRawUnsafe(`
    DELETE FROM "Product" 
    WHERE ${conditions}
  `);

  console.log(`Deleted ${result} non-gadget products.`);
  
  const count = await prisma.product.count();
  console.log(`Remaining products: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
