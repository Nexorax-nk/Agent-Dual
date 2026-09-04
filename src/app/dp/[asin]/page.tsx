import prisma from '@/lib/prisma';
import { Star, Truck, ShieldCheck, Undo2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import { ProductImage } from '@/components/ProductImage';
import { ProductCard } from '@/components/ProductCard';

export default async function ProductDetail({ params }: { params: Promise<{ asin: string }> }) {
  const { asin } = await params;
  
  const product = await prisma.product.findUnique({
    where: { asin }
  });

  if (!product) {
    notFound();
  }

  // Fetch similar products from the same category
  const similarProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      NOT: { asin: product.asin }
    },
    take: 6,
    orderBy: { reviews: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <main className="max-w-[1600px] mx-auto p-4 md:p-8 flex flex-col gap-8">
        
        {/* Top Section: Main Product Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
          
          {/* Product Image */}
          <div className="w-full md:w-2/5 flex justify-center items-start sticky top-24">
            <ProductImage 
              src={product.imgUrl || ''}
              alt={product.title}
              className="w-full max-w-lg object-contain mix-blend-multiply"
            />
          </div>

          {/* Product Info */}
          <div className="w-full md:w-2/5 flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center">
                <span className="text-sm font-bold mr-1">{product.stars.toFixed(1)}</span>
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                <Star className="w-4 h-4 fill-orange-200 text-orange-200" />
              </div>
              <span className="text-sm text-blue-500 cursor-pointer hover:underline">{new Intl.NumberFormat('en-US').format(product.reviews)} ratings</span>
            </div>

            <div className="mb-4">
              <div className="flex items-start gap-1 text-gray-900">
                <span className="text-sm mt-1">$</span>
                <span className="text-4xl font-extrabold">{Math.floor(product.price)}</span>
                <span className="text-sm mt-1">{(product.price % 1).toFixed(2).substring(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">FREE Returns</p>
            </div>
            
            <div className="text-sm mb-6 space-y-3 border-t border-b border-gray-100 py-4">
              <div className="flex gap-4">
                <span className="font-bold w-24 text-gray-700">Category</span>
                <span className="text-gray-900">{product.category}</span>
              </div>
              <div className="flex gap-4">
                <span className="font-bold w-24 text-gray-700">ASIN</span>
                <span className="text-gray-900">{product.asin}</span>
              </div>
            </div>

            <h2 className="font-bold text-lg mb-3">About this item</h2>
            <ul className="list-disc pl-5 text-sm space-y-2 text-gray-700">
              <li>High-quality materials designed for durability and long-lasting performance.</li>
              <li>Perfect for daily use and highly rated by thousands of satisfied customers.</li>
              <li>Backed by our robust WebMCPStore premium guarantee.</li>
              <li>Engineered for efficiency and top-tier reliability.</li>
            </ul>
          </div>

          {/* Buy Box */}
          <div className="w-full md:w-1/5">
            <div className="border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm bg-gray-50/50">
              <div className="text-2xl font-extrabold mb-2 text-gray-900">${product.price.toFixed(2)}</div>
              <p className="text-sm text-gray-600 mb-4">FREE delivery <span className="font-bold text-black">Tomorrow</span></p>
              <p className="text-green-700 font-bold text-lg mb-4">In Stock</p>

              <div className="space-y-3">
                <AddToCartButton productId={product.id} />
              </div>

              <div className="text-xs text-gray-500 space-y-3 mt-6">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-400" /> Ships from WebMCPStore
                </div>
                <div className="flex items-center gap-2">
                  <Undo2 className="w-4 h-4 text-gray-400" /> Eligible for Return
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gray-400" /> Secure transaction
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Customer Reviews</h2>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Rating Breakdown */}
            <div className="w-full md:w-1/3">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-6 h-6 ${i < Math.round(product.stars) ? 'fill-orange-400 text-orange-400' : 'fill-orange-100 text-orange-100'}`} />
                  ))}
                </div>
                <span className="text-2xl font-bold">{product.stars.toFixed(1)} out of 5</span>
              </div>
              <p className="text-gray-500 mb-6">{new Intl.NumberFormat('en-US').format(product.reviews)} global ratings</p>
              
              <div className="space-y-3">
                {[
                  { stars: 5, percent: 76 },
                  { stars: 4, percent: 14 },
                  { stars: 3, percent: 6 },
                  { stars: 2, percent: 2 },
                  { stars: 1, percent: 2 },
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-3 text-sm text-gray-600 hover:text-orange-600 cursor-pointer group">
                    <span className="w-12 group-hover:underline">{row.stars} star</span>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <div className="h-full bg-[#febd69] rounded-r-full" style={{ width: `${row.percent}%` }}></div>
                    </div>
                    <span className="w-10 text-right group-hover:underline">{row.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="w-full md:w-2/3 space-y-6">
              {[
                { name: 'Alex M.', title: 'Exceeded all expectations!', text: 'This product completely transformed my workflow. The build quality is fantastic and it arrived perfectly on time. Would definitely recommend to anyone looking for a reliable tech upgrade.' },
                { name: 'Sarah J.', title: 'Great value for the price', text: 'I was hesitant at first, but after using it for a week, I can honestly say it was worth every penny. The features match the description exactly.' }
              ].map((review, i) => (
                <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">{review.name.charAt(0)}</div>
                    <span className="font-semibold text-gray-900">{review.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-4 h-4 ${j < 5 ? 'fill-orange-400 text-orange-400' : 'fill-orange-100 text-orange-100'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-sm text-gray-900">{review.title}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Customers who viewed this item also viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {similarProducts.map((simProduct) => (
                <div key={simProduct.id}>
                  <ProductCard 
                    id={simProduct.id}
                    title={simProduct.title}
                    price={simProduct.price}
                    rating={simProduct.stars}
                    reviewCount={simProduct.reviews}
                    imageUrl={simProduct.imgUrl || ''}
                    asin={simProduct.asin}
                    isBestSeller={simProduct.reviews > 1000}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
