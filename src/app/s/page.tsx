import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/Pagination';
import Link from 'next/link';

export default async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<{ k?: string; category?: string; page?: string; minRating?: string; minPrice?: string; maxPrice?: string; brand?: string; }>
}) {
  const params = await searchParams;
  const query = params.k || '';
  const category = params.category || '';
  const currentPage = parseInt(params.page || '1');
  const minRating = parseFloat(params.minRating || '0');
  const minPrice = parseFloat(params.minPrice || '0');
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : 999999;
  const brand = params.brand || '';
  const itemsPerPage = 40;
  const skip = (currentPage - 1) * itemsPerPage;
  
  const searchFilter = query ? `%${query}%` : '%';
  const categoryFilter = category ? `%${category}%` : '%';

  const conditions = [
    Prisma.sql`(title LIKE ${searchFilter} OR asin LIKE ${searchFilter})`,
    Prisma.sql`category LIKE ${categoryFilter}`
  ];

  if (minRating > 0) conditions.push(Prisma.sql`stars >= ${minRating}`);
  if (minPrice > 0) conditions.push(Prisma.sql`price >= ${minPrice}`);
  if (maxPrice < 999999) conditions.push(Prisma.sql`price <= ${maxPrice}`);
  if (brand) conditions.push(Prisma.sql`title LIKE ${'%' + brand + '%'}`);

  const whereClause = Prisma.join(conditions, ' AND ');

  const totalProducts = await prisma.$queryRaw<{count: bigint}[]>`
    SELECT COUNT(*) as count 
    FROM "Product" 
    WHERE ${whereClause}
  `;
  
  const count = Number(totalProducts[0]?.count || 0);

  const products = await prisma.$queryRaw<any[]>`
    SELECT * 
    FROM "Product" 
    WHERE ${whereClause}
    ORDER BY "reviews" DESC
    LIMIT ${itemsPerPage} OFFSET ${skip}
  `;

  const totalPages = Math.ceil(count / itemsPerPage);
  const formattedCount = new Intl.NumberFormat('en-US').format(count);

  const buildUrl = (updates: Record<string, string | null>) => {
    const p = new URLSearchParams();
    if (query) p.set('k', query);
    if (category) p.set('category', category);
    if (minRating > 0) p.set('minRating', minRating.toString());
    if (minPrice > 0) p.set('minPrice', minPrice.toString());
    if (maxPrice < 999999) p.set('maxPrice', maxPrice.toString());
    if (brand) p.set('brand', brand);
    
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null) p.delete(k);
      else p.set(k, v);
    });
    
    if (!updates.page) p.delete('page');

    return `/s?${p.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar query={query} />

      <div className="max-w-[1600px] mx-auto p-4 flex gap-6 mt-4">
        <aside className="w-[240px] hidden lg:block flex-shrink-0 pr-6">
          <div className="sticky top-4">
            {/* Department */}
            <div className="mb-6">
              <h3 className="font-bold mb-2 text-gray-900 text-sm">Department</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  <Link href={buildUrl({ category: 'Laptops' })} className={`hover:text-orange-600 transition-colors ${category === 'Laptops' ? 'font-bold text-gray-900' : ''}`}>
                    Laptops
                  </Link>
                </li>
                <li>
                  <Link href={buildUrl({ category: 'Smartphones' })} className={`hover:text-orange-600 transition-colors ${category === 'Smartphones' ? 'font-bold text-gray-900' : ''}`}>
                    Smartphones
                  </Link>
                </li>
                <li>
                  <Link href={buildUrl({ category: 'Accessories' })} className={`hover:text-orange-600 transition-colors ${category === 'Accessories' ? 'font-bold text-gray-900' : ''}`}>
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link href={buildUrl({ category: 'Bags' })} className={`hover:text-orange-600 transition-colors ${category === 'Bags' ? 'font-bold text-gray-900' : ''}`}>
                    Bags
                  </Link>
                </li>
                <li>
                  <Link href={buildUrl({ category: 'Gaming' })} className={`hover:text-orange-600 transition-colors ${category === 'Gaming' ? 'font-bold text-gray-900' : ''}`}>
                    Gaming
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Reviews */}
            <div className="mb-6">
              <h3 className="font-bold mb-2 text-gray-900 text-sm">Customer Reviews</h3>
              <div className="space-y-1.5">
                {[4, 3, 2, 1].map((stars) => (
                  <Link key={stars} href={buildUrl({ minRating: stars.toString() })} className="flex items-center gap-1.5 hover:opacity-80 group w-fit">
                    <div className="flex text-[#FFA41C]">
                      {Array.from({length: 5}).map((_, i) => (
                        <svg key={i} className={`w-[17px] h-[17px] ${i < stars ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className={`text-sm ${minRating === stars ? 'font-bold text-gray-900' : 'text-gray-700'} group-hover:text-orange-600 transition-colors`}>& Up</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <h3 className="font-bold mb-2 text-gray-900 text-sm">Price</h3>
              <div className="space-y-1 text-sm text-gray-700 flex flex-col items-start">
                <Link href={buildUrl({ minPrice: null, maxPrice: '25' })} className={`hover:text-orange-600 transition-colors ${maxPrice === 25 && minPrice === 0 ? 'font-bold text-gray-900' : ''}`}>Under $25</Link>
                <Link href={buildUrl({ minPrice: '25', maxPrice: '50' })} className={`hover:text-orange-600 transition-colors ${minPrice === 25 && maxPrice === 50 ? 'font-bold text-gray-900' : ''}`}>$25 to $50</Link>
                <Link href={buildUrl({ minPrice: '50', maxPrice: '100' })} className={`hover:text-orange-600 transition-colors ${minPrice === 50 && maxPrice === 100 ? 'font-bold text-gray-900' : ''}`}>$50 to $100</Link>
                <Link href={buildUrl({ minPrice: '100', maxPrice: '200' })} className={`hover:text-orange-600 transition-colors ${minPrice === 100 && maxPrice === 200 ? 'font-bold text-gray-900' : ''}`}>$100 to $200</Link>
                <Link href={buildUrl({ minPrice: '200', maxPrice: null })} className={`hover:text-orange-600 transition-colors ${minPrice === 200 && maxPrice === 999999 ? 'font-bold text-gray-900' : ''}`}>$200 & Above</Link>
              </div>
            </div>
            
            {/* Brands */}
            <div className="mb-6">
              <h3 className="font-bold mb-2 text-gray-900 text-sm">Brands</h3>
              <div className="space-y-2 text-sm text-gray-700">
                {['Apple', 'Samsung', 'Sony', 'Logitech'].map(b => (
                  <Link key={b} href={buildUrl({ brand: brand === b ? null : b })} className="flex items-center gap-2 group w-fit">
                    <input type="checkbox" checked={brand === b} readOnly className="w-4 h-4 rounded border-gray-300 text-[#007185] focus:ring-[#007185] cursor-pointer" />
                    <span className={`group-hover:text-orange-600 transition-colors ${brand === b ? 'font-bold text-gray-900' : ''}`}>{b}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="bg-white px-6 py-4 mb-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex items-center justify-between">
            <h1 className="text-[15px] text-gray-700">
              <span className="font-bold text-gray-900">1-{itemsPerPage > count ? count : itemsPerPage} of over {formattedCount} results</span> for <span className="text-[#c45500] font-bold">"{query || category || 'All Products'}"</span>
            </h1>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-gray-500">Sort by:</span>
              <select className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#007185] focus:border-[#007185] block p-2 px-3 shadow-sm outline-none cursor-pointer">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Avg. Customer Review</option>
              </select>
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
                  imageUrl={product.imgUrl}
                  asin={product.asin}
                  isBestSeller={product.reviews > 1000}
                />
              </div>
            ))}
          </div>

          {count > 0 && (
            <Pagination 
              totalPages={totalPages} 
              currentPage={currentPage} 
              basePath="/s" 
            />
          )}
        </main>
      </div>
    </div>
  );
}
