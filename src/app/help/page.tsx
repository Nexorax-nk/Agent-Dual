import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { Truck, ShieldCheck, Undo2, Headphones, HelpCircle, FileText } from 'lucide-react';

export default function CustomerService() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <main className="max-w-[1200px] mx-auto p-4 md:p-8">
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Hello. What can we help you with?</h1>
          <p className="text-gray-600 mb-6">Search our help library or select a topic below.</p>
          <div className="max-w-2xl mx-auto flex">
            <input 
              type="text" 
              placeholder="Search help topics..." 
              className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="bg-[#febd69] hover:bg-[#f3a847] px-6 py-3 rounded-r-lg font-bold text-gray-900 transition-colors">
              Search
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6">Some things you can do here</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Track your package</h3>
            <p className="text-sm text-gray-500">Track packages, discover shipping options, and check delivery status.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <Undo2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Returns & Refunds</h3>
            <p className="text-sm text-gray-500">Return or exchange items, print return mailing labels, and check refund status.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Account Settings</h3>
            <p className="text-sm text-gray-500">Change your email or password, update login information, and manage your account.</p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6">Browse Help Topics</h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-gray-100">
            <div className="p-6 hover:bg-gray-50 cursor-pointer transition-colors">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-gray-400" /> Where's my stuff?
              </h3>
              <p className="text-sm text-gray-500">Find out how to track, manage, or return your orders.</p>
            </div>
            <div className="p-6 hover:bg-gray-50 cursor-pointer transition-colors">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" /> Shipping & Delivery
              </h3>
              <p className="text-sm text-gray-500">Shipping rates, delivery options, and scheduling.</p>
            </div>
            <div className="p-6 hover:bg-gray-50 cursor-pointer transition-colors">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Headphones className="w-5 h-5 text-gray-400" /> Contact Us
              </h3>
              <p className="text-sm text-gray-500">Reach out to our customer service team via chat or phone.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <Link href="/" className="text-orange-600 hover:underline font-bold">Return to Shopping</Link>
        </div>
      </main>
    </div>
  );
}
