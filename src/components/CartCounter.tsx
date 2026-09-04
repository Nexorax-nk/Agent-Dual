'use client';

import { useEffect, useState } from 'react';

export function CartCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCartSize = async () => {
      try {
        const res = await fetch('/api/cart');
        const data = await res.json();
        if (Array.isArray(data)) {
          const totalQty = data.reduce((acc, item) => acc + item.quantity, 0);
          setCount(totalQty);
        }
      } catch (err) {
        console.error('Failed to fetch cart size', err);
      }
    };

    fetchCartSize();
    
    // Listen for WebMCP cart updates
    window.addEventListener('cartUpdated', fetchCartSize);
    return () => window.removeEventListener('cartUpdated', fetchCartSize);
  }, []);

  return (
    <span className="absolute top-0 left-4 text-[#fa8900] font-bold text-base bg-[#131921] px-0.5">
      {count}
    </span>
  );
}
