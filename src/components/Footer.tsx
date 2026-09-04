"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#131921] text-gray-300 font-sans mt-auto">
      
      {/* Back to top button */}
      <button 
        suppressHydrationWarning
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#485769] transition-colors py-4 flex items-center justify-center text-sm font-semibold text-white"
      >
        Back to top
      </button>

      {/* Main Footer Content */}
      <div className="max-w-[1500px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 justify-items-start md:justify-items-center">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white text-base mb-1">Get to Know Us</h4>
            <Link href="#" className="text-sm hover:underline">Careers</Link>
            <Link href="#" className="text-sm hover:underline">Blog</Link>
            <Link href="#" className="text-sm hover:underline">About Us</Link>
            <Link href="#" className="text-sm hover:underline">Investor Relations</Link>
            <Link href="#" className="text-sm hover:underline">Science</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white text-base mb-1">Make Money with Us</h4>
            <Link href="#" className="text-sm hover:underline">Sell products on Amazon</Link>
            <Link href="#" className="text-sm hover:underline">Sell on Amazon Business</Link>
            <Link href="#" className="text-sm hover:underline">Sell apps on Amazon</Link>
            <Link href="#" className="text-sm hover:underline">Become an Affiliate</Link>
            <Link href="#" className="text-sm hover:underline">Host an Amazon Hub</Link>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white text-base mb-1">Amazon Payment Products</h4>
            <Link href="#" className="text-sm hover:underline">Amazon Business Card</Link>
            <Link href="#" className="text-sm hover:underline">Shop with Points</Link>
            <Link href="#" className="text-sm hover:underline">Reload Your Balance</Link>
            <Link href="#" className="text-sm hover:underline">Amazon Currency Converter</Link>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white text-base mb-1">Let Us Help You</h4>
            <Link href="#" className="text-sm hover:underline">Your Account</Link>
            <Link href="#" className="text-sm hover:underline">Your Orders</Link>
            <Link href="#" className="text-sm hover:underline">Shipping Rates & Policies</Link>
            <Link href="#" className="text-sm hover:underline">Returns & Replacements</Link>
            <Link href="#" className="text-sm hover:underline">Manage Your Content and Devices</Link>
          </div>

        </div>
      </div>

      {/* Footer Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Bottom Footer Section */}
      <div className="max-w-[1500px] mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-center md:justify-between gap-6">
        
        {/* Brand / Logo Area */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#febd69] rounded flex items-center justify-center">
            <span className="text-gray-900 font-black text-xl leading-none">A</span>
          </div>
          <span className="text-xl font-bold text-white">agentic.io</span>
        </div>

        {/* Global Selectors */}
        <div className="flex items-center gap-4">
        <button suppressHydrationWarning className="border border-gray-500 rounded px-3 py-1.5 text-sm flex items-center gap-2 hover:border-gray-400 transition-colors">
            English
          </button>
        <button suppressHydrationWarning className="border border-gray-500 rounded px-3 py-1.5 text-sm flex items-center gap-2 hover:border-gray-400 transition-colors">
            $ USD - U.S. Dollar
          </button>
        <button suppressHydrationWarning className="border border-gray-500 rounded px-3 py-1.5 text-sm flex items-center gap-2 hover:border-gray-400 transition-colors">
            United States
          </button>
        </div>
      </div>

      {/* Legal Footer */}
      <div className="bg-[#0b0e12] py-6 px-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs mb-2">
          <Link href="#" className="hover:underline">Conditions of Use</Link>
          <Link href="#" className="hover:underline">Privacy Notice</Link>
          <Link href="#" className="hover:underline">Consumer Health Data Privacy Disclosure</Link>
          <Link href="#" className="hover:underline">Your Ads Privacy Choices</Link>
        </div>
        <p className="text-xs text-gray-400">&copy; 1996-2026, Agentic.io, Inc. or its affiliates. Built for the WebMCP Hackathon.</p>
      </div>
    </footer>
  );
}
