'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      if (res.ok) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setBuying(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      if (res.ok) {
        router.push('/checkout');
      } else {
        setBuying(false);
      }
    } catch (err) {
      console.error(err);
      setBuying(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleAddToCart}
        disabled={loading || added || buying}
        className={`w-full text-sm font-medium py-3 rounded-full shadow-sm transition-colors ${
          added 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200]'
        }`}
      >
        {loading ? 'Adding...' : added ? 'Added to Cart' : 'Add to Cart'}
      </button>

      <button 
        onClick={handleBuyNow}
        disabled={loading || added || buying}
        className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-gray-900 text-sm font-bold py-3 rounded-full shadow-sm transition-colors border border-[#ff8f00]"
      >
        {buying ? 'Processing...' : 'Buy Now'}
      </button>
    </>
  );
}
