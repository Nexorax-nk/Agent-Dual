"use client";

import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { ChevronRight, Plus, CreditCard as CreditCardIcon, Trash2 } from 'lucide-react';

export default function PaymentSettings() {
  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      name: "Demo User",
      expires: "12/2028",
      isDefault: true,
      color: "from-blue-600 to-blue-800"
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8888",
      name: "Demo User",
      expires: "08/2025",
      isDefault: false,
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#eaeded] text-gray-900 font-sans pb-20">
      <Navbar />

      <main className="max-w-[1000px] mx-auto p-4 md:p-8 relative z-10">
        
        {/* Breadcrumb */}
        <div className="text-sm mb-6 flex items-center text-gray-500">
          <Link href="/account" className="hover:underline hover:text-orange-600 transition-colors">Your Account</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-900 font-medium">Your Payments</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Payments</h1>
          <button className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors border border-gray-200/60 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add a payment method
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 relative group flex flex-col h-[200px]">
              
              {/* Card visual */}
              <div className={`w-14 h-10 rounded shadow-sm bg-gradient-to-br ${method.color} mb-4 flex items-center justify-center`}>
                <CreditCardIcon className="w-6 h-6 text-white opacity-80" />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  {method.type} ending in {method.last4}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{method.name}</p>
                <p className="text-sm text-gray-500">Expires {method.expires}</p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                {method.isDefault ? (
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">Default</span>
                ) : (
                  <button className="text-sm text-blue-600 hover:text-orange-600 font-medium">Set as default</button>
                )}
                
                <button className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}

          {/* Add new card placeholder */}
          <button className="bg-gray-50/50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 h-[200px] cursor-pointer">
            <Plus className="w-8 h-8 mb-2" />
            <span className="font-bold">Add Payment Method</span>
          </button>

        </div>
      </main>
    </div>
  );
}
