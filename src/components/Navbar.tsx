import { Search, ShoppingCart, MapPin, Globe, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { CartCounter } from './CartCounter';
import { DeliverySelector } from './DeliverySelector';
import { LanguageSelector } from './LanguageSelector';
import { AccountDropdown } from './AccountDropdown';

export function Navbar({ query = '' }: { query?: string }) {
  return (
    <>
    <nav className="bg-[#131921] text-white p-2 flex items-center gap-4 sticky top-0 z-50">
      
      {/* Logo */}
      <Link href="/" className="flex items-center px-2 py-1 hover:border hover:border-white border border-transparent rounded h-[50px]">
        <span className="text-2xl font-bold tracking-tight">WebMCPStore</span>
        <span className="text-sm font-medium mt-1 ml-0.5 text-gray-300">.ai</span>
      </Link>
      
      {/* Deliver To */}
      <DeliverySelector />

      {/* Search Bar */}
      <form action="/s" className="flex-1 flex max-w-5xl rounded h-[40px] focus-within:ring-2 focus-within:ring-orange-500 overflow-hidden ml-2" suppressHydrationWarning>
        <div className="relative h-full bg-gray-100 hover:bg-gray-200 border-r border-gray-300">
          <select 
            name="category"
            className="appearance-none bg-transparent text-gray-700 text-xs pl-3 pr-6 h-full outline-none cursor-pointer relative z-10"
            suppressHydrationWarning
          >
            <option value="">All</option>
            <option value="Laptops">Laptops</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Accessories">Accessories</option>
            <option value="Bags">Bags</option>
            <option value="Gaming">Gaming</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-600 z-0">
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
        
        <input 
          name="k"
          type="text" 
          placeholder="Search WebMCPStore" 
          defaultValue={query}
          className="w-full px-4 h-full bg-white text-black outline-none"
          suppressHydrationWarning
        />
        <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] w-12 h-full transition-colors flex items-center justify-center text-gray-900" suppressHydrationWarning>
          <Search className="w-5 h-5 text-gray-900" />
        </button>
      </form>

      {/* Right side navigation items */}
      <div className="flex items-center gap-1">
        
        {/* Language */}
        <LanguageSelector />

        {/* Account & Lists */}
        <AccountDropdown />

        {/* Returns & Orders */}
        <Link href="/orders" className="flex flex-col justify-center px-2 py-1 cursor-pointer hover:border hover:border-white border border-transparent rounded h-[50px]">
          <span className="text-xs text-gray-300 leading-none">Returns</span>
          <span className="text-sm font-bold leading-tight">& Orders</span>
        </Link>

        {/* Cart */}
        <Link href="/cart" className="flex items-end px-2 py-1 cursor-pointer hover:border hover:border-white border border-transparent rounded h-[50px] relative">
          <div className="relative flex items-end">
            <ShoppingCart className="w-9 h-9" />
            <CartCounter />
          </div>
          <span className="font-bold text-sm mb-1">Cart</span>
        </Link>
      </div>
    </nav>
    <div className="bg-[#232f3e] text-white px-3 py-2 flex items-center gap-1 text-sm font-medium sticky top-[66px] z-40 overflow-x-auto whitespace-nowrap scrollbar-hide shadow-sm">
      
      {/* Hamburger All */}
      <Link href="/catalog" className="flex items-center gap-1 hover:border hover:border-white border border-transparent px-2 py-1 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        <span className="font-bold">All</span>
      </Link>

      {/* AI Agent Badge (Rufus style) */}
      <div className="flex items-center gap-1.5 bg-white text-gray-900 px-3 py-1 rounded-full mx-2 font-bold cursor-pointer hover:bg-gray-100 transition-colors shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#fa8900]">
          <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
        </svg>
        WebMCP AI
      </div>

      {/* Categories */}
      <Link href="/catalog" className="hover:border hover:border-white border border-transparent px-2 py-1 rounded">Bestsellers</Link>
      <Link href="/s?category=Laptops" className="hover:border hover:border-white border border-transparent px-2 py-1 rounded">Laptops</Link>
      <Link href="/s?category=Smartphones" className="hover:border hover:border-white border border-transparent px-2 py-1 rounded">Smartphones</Link>
      <Link href="/s?category=Accessories" className="hover:border hover:border-white border border-transparent px-2 py-1 rounded">Accessories</Link>
      <Link href="/s?category=Gaming" className="hover:border hover:border-white border border-transparent px-2 py-1 rounded">Gaming</Link>
      <Link href="/s?category=Bags" className="hover:border hover:border-white border border-transparent px-2 py-1 rounded">Bags</Link>
      <Link href="/deals" className="hover:border hover:border-white border border-transparent px-2 py-1 rounded">Today's Deals</Link>
      <Link href="/help" className="hover:border hover:border-white border border-transparent px-2 py-1 rounded">Customer Service</Link>
    </div>
    </>
  );
}
