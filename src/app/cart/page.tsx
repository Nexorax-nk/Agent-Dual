'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronDown, Check, Info } from 'lucide-react';

export default function Cart() {
  const [items, setItems] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const res = await fetch(`/api/cart?t=${Date.now()}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecs = async () => {
    try {
      const res = await fetch('/api/recommendations');
      const data = await res.json();
      setRecommendations(data);
    } catch (err) {}
  };

  useEffect(() => {
    const refresh = () => { fetchCart(); fetchRecs(); };
    refresh();
    window.addEventListener('cartUpdated', refresh);
    return () => window.removeEventListener('cartUpdated', refresh);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemove = async (id: string) => {
    setItems(items.filter(item => item.id !== id));
    await fetch(`/api/cart?id=${id}`, { method: 'DELETE' });
    showToast('Item removed from cart.');
  };

  const handleUpdateQuantity = async (id: string, newQty: number) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    setIsUpdating(true);
    try {
      await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId: id, quantity: newQty }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const isFreeShipping = subtotal > 35;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans pb-20">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[60] bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
          <p className="text-green-800 font-bold text-sm">{toastMessage}</p>
        </div>
      )}

      <main className="max-w-[1500px] mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-6 mt-4">
        
        {/* Cart Items */}
        <div className="flex-[3] bg-white p-6 md:p-8 shadow-sm rounded-xl border border-gray-200/60">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Shopping Cart</h1>
          {!loading && items.length > 0 && <p className="text-right text-gray-500 mb-2 pb-2 border-b border-gray-200">Price</p>}
          
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-[#f3a847] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-48 h-48 mb-6 opacity-80">
                {/* Empty Cart Illustration Placeholder */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-gray-300">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Your WebMCPStore Cart is empty</h2>
              <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Check out today's deals or continue shopping.</p>
              <div className="flex gap-4">
                <Link href="/" className="bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold py-3 px-8 rounded-full shadow-sm transition-colors border border-[#fcd200]">
                  Continue shopping
                </Link>
                <Link href="/orders" className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-3 px-8 rounded-full shadow-sm transition-colors border border-gray-200/60">
                  View your orders
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 py-6 border-b border-gray-100 last:border-0">
                  
                  {/* Checkbox & Image */}
                  <div className="flex gap-4 shrink-0">
                    <input type="checkbox" defaultChecked className="w-5 h-5 mt-2 accent-[#007185] rounded cursor-pointer" />
                    <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-50 rounded-xl flex items-center justify-center p-2 mix-blend-multiply cursor-pointer">
                      <Image src={item.product.imgUrl || ''} alt={item.product.title} width={200} height={200} className="w-full h-full object-contain" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4">
                      <Link href={`/dp/${item.product.asin}`} className="text-xl font-medium text-gray-900 hover:text-orange-600 line-clamp-3">
                        {item.product.title}
                      </Link>
                      {item.addedBy === 'agent' && (
                        <span className="inline-flex items-center gap-1 mt-1 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded border border-purple-200">
                          🤖✨ Added by your AI
                        </span>
                      )}
                      <div className="text-right shrink-0">
                        <span className="text-xl font-bold block">${item.product.price.toFixed(2)}</span>
                        {item.product.price > 50 && <span className="text-sm text-gray-500 line-through">${(item.product.price * 1.2).toFixed(2)}</span>}
                      </div>
                    </div>
                    
                    <p className="text-green-700 text-sm mt-2 mb-1 font-medium">In Stock</p>
                    <p className="text-sm text-gray-500 mb-1">Eligible for FREE Shipping & <span className="text-blue-600 font-medium">FREE Returns</span></p>
                    <div className="flex items-center gap-2 mb-3">
                      <input type="checkbox" id={`gift-${item.id}`} className="w-4 h-4 accent-[#007185] rounded cursor-pointer" />
                      <label htmlFor={`gift-${item.id}`} className="text-sm text-gray-700 cursor-pointer">This is a gift <span className="text-[#007185] hover:underline cursor-pointer">Learn more</span></label>
                    </div>

                    <div className="mt-auto flex items-center gap-4 text-sm text-[#007185]">
                      <div className="relative">
                        <select 
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                          className="appearance-none bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-[#007185] focus:border-[#007185] block py-1.5 pl-3 pr-8 shadow-sm cursor-pointer hover:bg-gray-200 transition-colors"
                        >
                          {Array.from({ length: Math.max(10, item.quantity) }, (_, i) => i + 1).map(n => (
                            <option key={n} value={n}>Qty: {n}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2 top-2 pointer-events-none text-gray-600" />
                      </div>
                      
                      <div className="w-px h-4 bg-gray-300"></div>
                      <button onClick={() => handleRemove(item.id)} className="hover:underline">Delete</button>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <button onClick={() => { handleRemove(item.id); showToast('Item saved for later.'); }} className="hover:underline">Save for later</button>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <button onClick={() => showToast('Link copied to clipboard!')} className="hover:underline">Share</button>
                    </div>
                  </div>

                </div>
              ))}
              
              {!loading && items.length > 0 && (
                <div className="text-right pt-2">
                  <span className="text-xl">Subtotal ({totalItems} items): </span>
                  <span className="text-2xl font-bold">${subtotal.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Checkout Sidebar */}
        <div className="w-full lg:w-[350px] shrink-0">
          {!loading && items.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/60 sticky top-4">
              
              {/* Free Shipping Progress */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                {isFreeShipping ? (
                  <div className="flex items-start gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">
                      Your order qualifies for FREE Shipping. <span className="text-gray-500 font-normal block mt-1">Choose this option at checkout. See details</span>
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-[#c40000]">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm">
                      Add <span className="font-bold">${(35 - subtotal).toFixed(2)}</span> of eligible items to your order to qualify for FREE Shipping.
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <span className="text-xl">Subtotal ({totalItems} items): </span>
                <span className="text-2xl font-bold">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-6">
                <input type="checkbox" id="gift-order" className="w-4 h-4 accent-[#007185] rounded cursor-pointer" />
                <label htmlFor="gift-order" className="text-sm text-gray-900 cursor-pointer">This order contains a gift</label>
              </div>

              <button 
                onClick={() => router.push('/checkout')}
                disabled={isUpdating}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black text-sm font-bold py-3.5 rounded-full shadow-sm transition-colors border border-[#fcd200] flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Updating...' : 'Proceed to checkout'}
              </button>
            </div>
          )}

          {/* AI Recommendations */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/60 mt-6 hidden lg:block">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              🤖 AI Recommendations
            </h3>
            {recommendations.length === 0 ? (
              <p className="text-sm text-gray-500">Your AI agent hasn't recommended anything yet. Ask it to find something for you!</p>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="flex gap-4 cursor-pointer group">
                    <div className="w-16 h-16 shrink-0 bg-gray-50 rounded flex items-center justify-center border border-gray-100 p-1">
                      <Image src={rec.product.imgUrl || ''} width={64} height={64} alt={rec.product.title} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform" />
                    </div>
                    <div>
                      <Link href={`/dp/${rec.product.asin}`} className="text-[#007185] group-hover:text-orange-600 text-sm line-clamp-2 transition-colors">{rec.product.title}</Link>
                      <p className="text-orange-700 font-bold text-sm mt-1">${rec.product.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-600 mt-1 italic border-l-2 border-purple-300 pl-2">"{rec.reason}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  );
}
