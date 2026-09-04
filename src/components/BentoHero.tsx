import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface BentoHeroProps {
  dealProducts: any[];
}

export const BentoHero: React.FC<BentoHeroProps> = ({ dealProducts }) => {
  return (
    <div className="w-full bg-[#eaeded] py-4">
      <div className="max-w-[1500px] mx-auto px-4">
        
        {/* Main Grid container */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          
          {/* Large Vertical Card (Left) */}
          <Link href="/catalog" className="col-span-1 md:col-span-1 bg-white relative overflow-hidden rounded-md shadow-sm h-[400px] md:h-full cursor-pointer group block">
            <Image 
              src="/images/hero/promo_shoes.jpg" 
              alt="Conquer every trail" 
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 p-6 flex flex-col justify-start">
              <h2 className="text-4xl font-extrabold text-white leading-tight mb-2 drop-shadow-md">Conquer<br/>every trail</h2>
              <p className="text-white font-bold tracking-widest text-lg drop-shadow-md">BACCA BUCCI</p>
            </div>
          </Link>

          {/* Right side container for the Top Row and Bottom Row */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
            
            {/* Top Row - 3 Promotional Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-[250px]">
              
              {/* Promo Card 1 */}
              <Link href="/s?category=Accessories" className="bg-[#e6f2ec] relative overflow-hidden rounded-md shadow-sm p-5 cursor-pointer group">
                <Image 
                  src="/images/hero/promo_mobile.jpg" 
                  alt="Mobile Accessories" 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                />
                <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-black/80 to-transparent z-10" />
                <div className="relative z-20">
                  <h3 className="text-2xl font-extrabold text-white drop-shadow-lg leading-tight mb-1">Up to 65% off</h3>
                  <p className="text-gray-100 drop-shadow-md text-sm font-medium">Premium mobile accessories</p>
                </div>
              </Link>

              {/* Promo Card 2 */}
              <Link href="/s?category=Accessories" className="bg-[#ff8f00] relative overflow-hidden rounded-md shadow-sm p-5 cursor-pointer group">
                <Image 
                  src="/images/hero/promo_tv.jpg" 
                  alt="Streaming Stick" 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                />
                <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-black/80 to-transparent z-10" />
                <div className="relative z-20">
                  <span className="text-gray-200 drop-shadow-md text-xs font-bold uppercase tracking-wider mb-1 block">All-new Fire TV Stick HD</span>
                  <h3 className="text-3xl font-extrabold text-white drop-shadow-lg leading-tight">Fast streaming<br/>starts here</h3>
                </div>
              </Link>

              {/* Promo Card 3 */}
              <Link href="/catalog" className="bg-[#f0ece5] relative overflow-hidden rounded-md shadow-sm p-5 cursor-pointer group">
                <Image 
                  src="/images/hero/promo_apparel.jpg" 
                  alt="Apparel" 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                />
                <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-black/80 to-transparent z-10" />
                <div className="relative z-20">
                  <h3 className="text-2xl font-extrabold text-white drop-shadow-lg leading-tight mb-1">Min. 50% off</h3>
                  <p className="text-gray-100 drop-shadow-md text-sm font-medium">Serve sale<br/>Fave denim</p>
                </div>
              </Link>

            </div>

            {/* Bottom Row - Functional Small Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 h-auto md:h-[180px]">
              
              {/* Custom Deal Card */}
              <Link href="/deals" className="bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 border border-gray-200/60">
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight mb-1 text-sm md:text-base">Deal on your saved items</h4>
                  <span className="text-xs text-gray-500">Sponsored</span>
                </div>
                <div className="mt-4 flex justify-center items-center flex-1 relative w-full h-24">
                  {dealProducts[4] && (
                    <Image 
                      src={dealProducts[4].imgUrl}
                      alt="Deal"
                      fill
                      className="object-contain mix-blend-multiply"
                    />
                  )}
                </div>
              </Link>

              {/* Dynamic Product Cards */}
              {dealProducts.slice(0, 4).map((product) => (
                <Link key={product.id} href={`/dp/${product.asin}`} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 border border-gray-200/60 group">
                  <h4 className="font-bold text-gray-900 leading-tight mb-2 text-sm line-clamp-2">{product.title}</h4>
                  <div className="relative h-24 w-full mt-auto mix-blend-multiply">
                     <Image 
                        src={product.imgUrl}
                        alt={product.title}
                        fill
                        className="object-contain transition-transform group-hover:scale-105"
                     />
                  </div>
                  <div className="mt-2 text-xs font-bold text-red-600 bg-red-50 w-fit px-2 py-0.5 rounded">Up to 40% off</div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
