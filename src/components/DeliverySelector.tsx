"use client";
import { useState } from 'react';
import { MapPin, X } from 'lucide-react';

export function DeliverySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [zip, setZip] = useState("10001");
  const [showWarning, setShowWarning] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="flex items-center px-2 py-1 cursor-pointer hover:border hover:border-white border border-transparent rounded h-[50px]"
      >
        <MapPin className="w-5 h-5 mt-3 text-white" />
        <div className="flex flex-col ml-1">
          <span className="text-xs text-gray-300 font-medium leading-none">Deliver to Demo User</span>
          <span className="text-sm font-bold leading-tight">New York {zip}</span>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-sm overflow-hidden shadow-2xl relative text-black">
            <div className="bg-gray-100 p-4 border-b border-gray-300 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Choose your location</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              {showWarning && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-800 text-sm">
                  <svg className="w-5 h-5 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Sign in is currently disabled for the WebMCP Hackathon demo mode.</p>
                </div>
              )}
              <button onClick={() => setShowWarning(true)} className="w-full bg-[#ffd814] text-gray-900 text-sm font-bold py-2 rounded-lg shadow-sm border border-[#fcd200] mb-4 hover:bg-[#f7ca00]">
                Sign in to see your addresses
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-500 my-2">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span>or enter a US zip code</span>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>
              <div className="flex gap-2 mt-4">
                <input type="text" className="border border-gray-300 rounded px-3 py-1.5 flex-1 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="10001" value={zip} onChange={(e) => setZip(e.target.value)} />
                <button onClick={() => setIsOpen(false)} className="bg-white border border-gray-300 rounded px-4 py-1.5 text-sm font-bold hover:bg-gray-50">Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
