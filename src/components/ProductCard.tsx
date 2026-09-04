"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "./ProductImage";

export interface ProductCardProps {
  id: string | number;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  asin: string;
  isBestSeller?: boolean;
}

export function ProductCard({
  id,
  title,
  price,
  rating,
  reviewCount,
  imageUrl,
  asin,
  isBestSeller = false,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product page
    if (isAddedToCart || isAddingToCart) return;
    setIsAddingToCart(true);
    
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });
      
      if (res.ok) {
        setIsAddedToCart(true);
        setTimeout(() => setIsAddedToCart(false), 2000);
      } else {
        alert('Failed to add to cart');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Link href={`/dp/${asin}`} className="block h-full">
      <div className="w-full h-full max-w-sm overflow-hidden group bg-white text-gray-900 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 rounded-2xl border border-gray-200/60 flex flex-col relative">
        
        {/* Image Area */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center p-4">
          <motion.div
            className="w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ProductImage 
              src={imageUrl} 
              alt={title} 
              className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
            />
          </motion.div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isBestSeller && (
              <span className="bg-gradient-to-r from-[#fa8900] to-[#ff9800] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Best Seller
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            suppressHydrationWarning
            className={`absolute top-3 right-3 flex items-center justify-center h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors ${
              isWishlisted ? "text-rose-500" : "text-gray-400"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`}
            />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-sm line-clamp-2 text-gray-800 group-hover:text-orange-600 transition-colors mb-2" title={title}>
            {title}
          </h3>
          
          <div className="flex items-center gap-1.5 mb-3 mt-auto">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
              <span className="ml-1 text-sm font-bold text-gray-700">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-400">({new Intl.NumberFormat('en-US').format(reviewCount)})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-extrabold text-gray-900">${price.toFixed(2)}</span>
          </div>

          {/* Add to Cart Footer */}
          <button
            suppressHydrationWarning
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all duration-200 ${
              isAddedToCart 
                ? "bg-green-100 text-green-700" 
                : "bg-gray-50 text-gray-900 hover:bg-[#febd69] hover:text-gray-900 hover:shadow-md hover:-translate-y-0.5 border border-gray-200 hover:border-[#f3a847]"
            }`}
            onClick={handleAddToCart}
            disabled={isAddingToCart || isAddedToCart}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : isAddedToCart ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
