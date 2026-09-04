import prisma from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/Pagination';

export default async function Catalog({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1');
  const itemsPerPage = 40;
  const skip = (currentPage - 1) * itemsPerPage;

  // We fetch count and products in parallel for performance
  const [totalProducts, products] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({
      skip,
      take: itemsPerPage,
      orderBy: {
        reviews: 'desc'
      }
    })
  ]);

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // Format number with commas (e.g. 123,127)
  const formattedTotal = new Intl.NumberFormat('en-US').format(totalProducts);
  const currentRangeStart = skip + 1;
  const currentRangeEnd = Math.min(skip + products.length, totalProducts);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <div className="max-w-[1600px] mx-auto p-4 flex gap-6">
        <main className="flex-1">
          <div className="bg-white p-4 mb-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Complete Product Catalog</h1>
              <p className="text-gray-500 mt-1 text-sm">
                Showing <span className="font-semibold text-gray-900">{currentRangeStart}-{currentRangeEnd}</span> of <span className="font-bold text-orange-600">{formattedTotal}</span> results
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
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

          <Pagination 
            totalPages={totalPages} 
            currentPage={currentPage} 
            basePath="/catalog" 
          />
        </main>
      </div>
    </div>
  );
}
