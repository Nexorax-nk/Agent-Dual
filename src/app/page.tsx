import prisma from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { BentoHero } from '@/components/BentoHero';
import { ProductCard } from '@/components/ProductCard';

export default async function Home() {
  // Fetch some top-rated products for the homepage
  const topProducts = await prisma.product.findMany({
    where: { stars: { gte: 4.5 } },
    take: 12,
    orderBy: { reviews: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#eaeded] text-gray-900 font-sans">
      <Navbar />

      <BentoHero dealProducts={topProducts} />

      {/* Main Content */}
      <main className="max-w-[1500px] mx-auto p-4 md:p-8 relative z-10">
        
        <div className="flex items-center mb-8 mt-4">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Top Picks For You</h2>
          <div className="ml-4 h-0.5 flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
          {topProducts.map((product) => (
            <div key={product.id}>
              <ProductCard 
                id={product.id}
                title={product.title}
                price={product.price}
                rating={product.stars}
                reviewCount={product.reviews}
                imageUrl={product.imgUrl || ''}
                asin={product.asin}
                isBestSeller={product.reviews > 1000}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
