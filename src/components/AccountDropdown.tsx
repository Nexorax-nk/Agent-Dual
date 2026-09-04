"use client";
import { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function AccountDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <>
      <div 
        className="relative flex flex-col justify-center px-2 py-1 cursor-pointer hover:border hover:border-white border border-transparent rounded h-[50px]"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <span className="text-xs text-gray-300 leading-none">Hello, Demo User</span>
        <div className="flex items-center leading-tight">
          <span className="text-sm font-bold">Account & Lists</span>
          <ChevronDown className="w-3 h-3 ml-1 text-gray-400" />
        </div>

        {isOpen && (
          <div className="absolute top-[50px] -right-12 w-[400px] bg-white text-gray-900 rounded shadow-lg border border-gray-200 z-50 p-4 flex gap-6 cursor-default">
            <div className="flex-1">
              <h3 className="font-bold text-base mb-2">Your Lists</h3>
              <ul className="text-sm space-y-2 text-gray-600">
                <li className="hover:text-orange-500 cursor-pointer hover:underline" onClick={() => showToast("Lists are disabled in demo mode.")}>Create a List</li>
                <li className="hover:text-orange-500 cursor-pointer hover:underline" onClick={() => showToast("Lists are disabled in demo mode.")}>Find a List or Registry</li>
              </ul>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="flex-1">
              <h3 className="font-bold text-base mb-2">Your Account</h3>
              <ul className="text-sm space-y-2 text-gray-600">
                <li><Link href="/account" className="hover:text-orange-500 hover:underline">Account</Link></li>
                <li><Link href="/orders" className="hover:text-orange-500 hover:underline">Orders</Link></li>
                <li><Link href="/cart" className="hover:text-orange-500 hover:underline">Recommendations</Link></li>
                <li className="hover:text-orange-500 cursor-pointer hover:underline" onClick={() => showToast("Browsing History is disabled in demo mode.")}>Browsing History</li>
                <li className="hover:text-orange-500 cursor-pointer hover:underline" onClick={() => showToast("Watchlist is disabled in demo mode.")}>Watchlist</li>
                <li className="hover:text-orange-500 cursor-pointer hover:underline" onClick={() => showToast("You are permanently signed in as Demo User.")}>Sign Out</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="fixed top-4 right-4 z-[100] bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
          <p className="text-green-800 font-bold text-sm">{toastMessage}</p>
        </div>
      )}
    </>
  );
}
