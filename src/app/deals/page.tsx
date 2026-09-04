import prisma from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';

export default async function Deals() {
  // Fetch some products to simulate "Deals" (e.g. price under $50, high rating)
  const dealProducts = await prisma.product.findMany({
    where: { 
      price: { lt: 50 },
      stars: { gte: 4.5 }
    },
    take: 24,
    orderBy: { reviews: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <main className="max-w-[1600px] mx-auto p-4 md:p-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Today's Deals</h1>
          <p className="text-gray-600">Save big on highly-rated tech, gadgets, and accessories. Limited time only!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {dealProducts.map((product) => (
            <div key={product.id}>
              <ProductCard 
                id={product.id}
                title={product.title}
                price={product.price}
                rating={product.stars}
                reviewCount={product.reviews}
                imageUrl={product.imgUrl || ''}
                asin={product.asin}
                isBestSeller={true}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
