import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const demoProducts = [
  {
    asin: 'ROG-STRIX-G16',
    title: 'ASUS ROG Strix G16 (2024) Gaming Laptop, 16” 16:10 FHD 165Hz, GeForce RTX 4060, Intel Core i7-13650HX, 16GB DDR5, 512GB PCIe SSD, Wi-Fi 6E, Windows 11',
    imgUrl: '/images/rog_strix.jpg',
    productUrl: 'https://amazon.ca/dp/ROG-STRIX',
    stars: 5.0,
    reviews: 84592,
    price: 1399.99,
    category: 'Laptops',
    isBestSeller: true,
    boughtInLastMonth: 10000,
  },
  {
    asin: 'LENOVO-LEGION-PRO',
    title: 'Lenovo Legion Pro 5i 16" LCD Gaming Laptop WQXGA 165Hz Intel Core i7-13700HX 16GB RAM 1TB SSD NVIDIA GeForce RTX 4070 8GB Windows 11',
    imgUrl: '/images/lenovo_legion.jpg',
    productUrl: 'https://amazon.ca/dp/LENOVO',
    stars: 4.9,
    reviews: 62104,
    price: 1549.99,
    category: 'Laptops',
    isBestSeller: true,
    boughtInLastMonth: 8000,
  },
  {
    asin: 'IPHONE-15-PRO',
    title: 'Apple iPhone 15 Pro, 256GB, Natural Titanium - Unlocked',
    imgUrl: '/images/iphone_15.jpg',
    productUrl: 'https://amazon.ca/dp/IPHONE15',
    stars: 5.0,
    reviews: 125990,
    price: 1099.00,
    category: 'Smartphones',
    isBestSeller: true,
    boughtInLastMonth: 50000,
  },
  {
    asin: 'LOGI-GPRO-X',
    title: 'Logitech G PRO X SUPERLIGHT Wireless Gaming Mouse, Ultra-Lightweight, Hero 25K Sensor, 25,600 DPI, 5 Programmable Buttons, Long Battery Life - Black',
    imgUrl: '/images/logitech_mouse.jpg',
    productUrl: 'https://amazon.ca/dp/LOGI-GPRO',
    stars: 4.8,
    reviews: 45012,
    price: 129.99,
    category: 'Accessories',
    isBestSeller: true,
    boughtInLastMonth: 12000,
  },
  {
    asin: 'PEAK-DESIGN-V2',
    title: 'Peak Design Everyday Backpack V2 20L - Black, Photography and Travel Bag',
    imgUrl: '/images/peak_design_backpack.jpg',
    productUrl: 'https://amazon.ca/dp/PEAK-DESIGN',
    stars: 4.9,
    reviews: 32091,
    price: 279.95,
    category: 'Bags',
    isBestSeller: true,
    boughtInLastMonth: 4000,
  },
  {
    asin: 'SONY-WH1000XM5',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones, Bluetooth Over-Ear Headset with Microphone for Phone-Call, Black',
    imgUrl: '/images/sony_headphones.jpg',
    productUrl: 'https://amazon.ca/dp/SONY',
    stars: 4.9,
    reviews: 95420,
    price: 348.00,
    category: 'Accessories',
    isBestSeller: true,
    boughtInLastMonth: 15000,
  }
];

async function main() {
  console.log("Seeding premium curated demo products...");
  
  for (const product of demoProducts) {
    await prisma.product.upsert({
      where: { asin: product.asin },
      update: product,
      create: product,
    });
    console.log(`Upserted ${product.title}`);
  }
  
  console.log("Curated Demo Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
