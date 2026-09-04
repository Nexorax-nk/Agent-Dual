import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();

const MAX_PRODUCTS = 100000; // 100k products to keep sqlite file < 100MB for git

async function main() {
  console.log('Starting seed...');
  let count = 0;
  const products: any[] = [];
  
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream('C:\\Users\\navee\\Agent-Dual\\amz_ca_total_products_data_processed.csv\\amz_ca_total_products_data_processed.csv')
      .pipe(csv())
      .on('data', (data) => {
        if (count >= MAX_PRODUCTS) return;

        // Parse price and other numerics safely
        const price = parseFloat(data.price) || 0;
        const stars = parseFloat(data.stars) || 0;
        const reviews = parseInt(data.reviews) || 0;
        const boughtInLastMonth = parseInt(data.boughtInLastMonth) || 0;
        const isBestSeller = data.isBestSeller?.toLowerCase() === 'true';

        // Only add products with a valid price
        if (price > 0 && data.asin && data.title) {
          products.push({
            asin: data.asin,
            title: data.title,
            imgUrl: data.imgUrl || null,
            productUrl: data.productURL || null,
            stars,
            reviews,
            price,
            category: data.categoryName || 'General',
            isBestSeller,
            boughtInLastMonth
          });
          count++;
        }
      })
      .on('end', async () => {
        console.log(`Parsed ${products.length} products. Inserting into database...`);
        
        // Chunk insertion to prevent SQLite statement limits
        const CHUNK_SIZE = 5000;
        for (let i = 0; i < products.length; i += CHUNK_SIZE) {
          const chunk = products.slice(i, i + CHUNK_SIZE);
          await prisma.product.createMany({
            data: chunk
          });
          console.log(`Inserted chunk ${i / CHUNK_SIZE + 1} of ${Math.ceil(products.length / CHUNK_SIZE)}`);
        }
        
        console.log('Seed completed successfully.');
        resolve();
      })
      .on('error', (error) => {
        console.error('Error parsing CSV:', error);
        reject(error);
      });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
