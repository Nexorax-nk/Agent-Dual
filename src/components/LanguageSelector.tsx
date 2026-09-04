"use client";
import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState("EN");

  return (
    <div 
      className="relative flex items-center gap-1 px-2 py-1 cursor-pointer hover:border hover:border-white border border-transparent rounded h-[50px] font-bold text-sm"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Globe className="w-4 h-4 text-gray-300" />
      <span>{lang}</span>
      <ChevronDown className="w-3 h-3 text-gray-400" />

      {isOpen && (
        <div className="absolute top-[50px] left-0 w-48 bg-white text-gray-900 rounded shadow-lg border border-gray-200 z-50 py-2">
          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => { setLang("EN"); setIsOpen(false); }}>
            <input type="radio" checked={lang === "EN"} readOnly className="mr-2 accent-orange-500" /> English - EN
          </div>
        </div>
      )}
    </div>
  );
}
