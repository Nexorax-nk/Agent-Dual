"use client";

import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export default function SecuritySettings() {
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Demo User',
    email: 'demo@web-mcp-store.ai',
    mobile: '+1 234 567 8900',
    password: '********'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#eaeded] text-gray-900 font-sans pb-20">
      <Navbar />

      <main className="max-w-[800px] mx-auto p-4 md:p-8 relative z-10">
        
        {/* Breadcrumb */}
        <div className="text-sm mb-6 flex items-center text-gray-500">
          <Link href="/account" className="hover:underline hover:text-orange-600 transition-colors">Your Account</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-900 font-medium">Login & Security</span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Login & Security</h1>

        {isSaved && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded shadow-sm flex items-center animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <h3 className="text-green-800 font-bold text-sm">Success</h3>
              <p className="text-green-700 text-sm">Your security settings have been successfully updated.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Form Fields */}
          <div className="divide-y divide-gray-100">
            
            {/* Name */}
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-900 mb-1">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-600"
                />
              </div>
              <button type="button" className="text-sm font-semibold text-blue-600 hover:text-orange-600 transition-colors px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 self-start md:self-center">
                Edit
              </button>
            </div>

            {/* Email */}
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-900 mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-600"
                />
              </div>
              <button type="button" className="text-sm font-semibold text-blue-600 hover:text-orange-600 transition-colors px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 self-start md:self-center">
                Edit
              </button>
            </div>

            {/* Mobile */}
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-900 mb-1">Primary mobile number</label>
                <input 
                  type="text" 
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-600"
                />
                <p className="text-xs text-gray-400 mt-1">Quickly sign in, easily recover passwords, and receive security notifications.</p>
              </div>
              <button type="button" className="text-sm font-semibold text-blue-600 hover:text-orange-600 transition-colors px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 self-start md:self-center">
                Edit
              </button>
            </div>

            {/* Password */}
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-900 mb-1">Password</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-600"
                />
              </div>
              <button type="button" className="text-sm font-semibold text-blue-600 hover:text-orange-600 transition-colors px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 self-start md:self-center">
                Edit
              </button>
            </div>

          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button type="submit" className="bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold py-2.5 px-6 rounded-xl shadow-sm transition-colors border border-[#fcd200]">
              Save Changes
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
