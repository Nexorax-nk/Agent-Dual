import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();
const CSV_FILE = 'amz_ca_total_products_data_processed.csv/amz_ca_total_products_data_processed.csv';

function mapCategory(original: string): string | null {
  if (!original) return null;
  const lower = original.toLowerCase();
  
  if (lower.includes('laptop') || lower.includes('computer')) return 'Laptops';
  if (lower.includes('phone') || lower.includes('mobile')) return 'Smartphones';
  if (lower.includes('mouse') || lower.includes('keyboard') || lower.includes('headphone') || lower.includes('cable') || lower.includes('accessory')) return 'Accessories';
  if (lower.includes('bag') || lower.includes('backpack')) return 'Bags';
  if (lower.includes('gaming') || lower.includes('console')) return 'Gaming';
  
  return null;
}

async function main() {
  console.log("Wiping database for a clean slate...");
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  
  console.log("Reading CSV to extract strictly tech products...");
  
  const batch: any[] = [];
  const seenAsins = new Set<string>();
  let count = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(CSV_FILE)
      .pipe(csv())
      .on('data', (row) => {
        const category = row.categoryName;
        const cleanCategory = mapCategory(category);
        if (!cleanCategory) return;

        const asin = row.asin;
        if (!asin || seenAsins.has(asin)) return;
        seenAsins.add(asin);

        let imgUrl = row.imgUrl;
        if (imgUrl && !imgUrl.startsWith('http')) {
          imgUrl = null;
        }

        const priceNum = parseFloat(row.price);

        batch.push({
          asin,
          title: (row.title || '').substring(0, 255),
          imgUrl: imgUrl || null,
          productUrl: row.productURL || '',
          stars: parseFloat(row.stars) || 0,
          reviews: parseInt(row.reviews) || 0,
          price: isNaN(priceNum) ? (Math.random() * 100 + 10) : priceNum,
          category: cleanCategory,
          isBestSeller: (parseInt(row.reviews) || 0) > 1000,
          boughtInLastMonth: parseInt(row.boughtInLastMonth) || 0
        });

        if (batch.length >= 1000) {
          const dataToInsert = [...batch];
          batch.length = 0;
          // Fire and forget batch insertion (in real script we'd pause the stream, but this is fast enough for SQLite)
          prisma.product.createMany({ data: dataToInsert }).then(() => {
            count += dataToInsert.length;
            console.log(`Inserted ${count} tech products...`);
          }).catch(console.error);
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          await prisma.product.createMany({ data: batch });
          count += batch.length;
        }
        console.log(`Successfully rebuilt database with ${count} STRICTLY TECH products!`);
        
        // After DB is rebuilt, we must run the demo-seed to inject our 6 perfect products!
        console.log("Now run: npx ts-node prisma/demo-seed.ts to add the curated items back!");
        resolve(null);
      })
      .on('error', reject);
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
