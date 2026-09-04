import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { Package, Shield, CreditCard, MapPin, Gift, Crown } from 'lucide-react';

export default function Account() {
  const accountCards = [
    {
      title: "Your Orders",
      description: "Track, return, or buy things again",
      href: "/orders",
      icon: <Package className="w-8 h-8 text-[#f3a847]" />,
      bgColor: "bg-orange-50",
    },
    {
      title: "Login & security",
      description: "Edit login, name, and mobile number",
      href: "/account/security",
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Your Payments",
      description: "Manage payment methods and settings",
      href: "/account/payments",
      icon: <CreditCard className="w-8 h-8 text-green-500" />,
      bgColor: "bg-green-50",
    }
  ];

  return (
    <div className="min-h-screen bg-[#eaeded] text-gray-900 font-sans pb-20">
      <Navbar />

      <main className="max-w-[1200px] mx-auto p-4 md:p-8 relative z-10">
        
        <div className="flex items-center mb-8 mt-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Account</h1>
          <div className="ml-4 h-0.5 flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountCards.map((card, idx) => (
            <Link 
              key={idx}
              href={card.href} 
              className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 group cursor-pointer"
            >
              <div className={`w-16 h-16 shrink-0 rounded-xl flex items-center justify-center transition-colors ${card.bgColor} group-hover:bg-opacity-80`}>
                {card.icon}
              </div>
              <div className="flex flex-col justify-center h-16">
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{card.title}</h2>
                <p className="text-sm text-gray-500 mt-1 leading-snug">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
