import React from 'react';
import { Heart, Coffee, CreditCard } from 'lucide-react';

const Donations: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="text-center mb-16 max-w-2xl">
        <Heart className="h-16 w-16 text-red-600 mx-auto mb-6 animate-pulse" />
        <h1 className="font-future text-4xl md:text-5xl font-bold text-white mb-6">
          FUEL THE VISION
        </h1>
        <p className="text-gray-300 text-lg leading-relaxed">
          AI Impact Media is a community-driven project. Your contributions directly fund our next production, 
          equipment rentals, and location scouting. Help us keep independent art alive.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* PayPal Card */}
        <a 
          href="https://www.paypal.me/AIImpactMedia" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative bg-[#003087] hover:bg-[#00256b] rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 border border-blue-500/30 hover:shadow-[0_0_30px_rgba(0,48,135,0.4)]"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard className="h-32 w-32 text-white" />
          </div>
          <div className="bg-white p-4 rounded-full mb-6 shadow-lg">
            {/* Simple Text Logo Mock for PayPal */}
            <span className="text-[#003087] font-bold text-2xl font-sans italic">Pay<span className="text-[#009cde]">Pal</span></span>
          </div>
          <h3 className="font-future text-2xl font-bold text-white mb-2">Direct Support</h3>
          <p className="text-blue-200 mb-6 z-10">Secure donation via PayPal. Any amount helps us move forward.</p>
          <span className="inline-block bg-white text-[#003087] px-6 py-2 rounded-full font-bold shadow-lg group-hover:scale-105 transition-transform">
            Donate Now
          </span>
        </a>

        {/* BuyMeACoffee Card */}
        <a 
          href="https://buymeacoffee.com/aiimpactmedia" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative bg-[#FFDD00] hover:bg-[#FFD000] rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 border border-yellow-400/30 hover:shadow-[0_0_30px_rgba(255,221,0,0.4)]"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Coffee className="h-32 w-32 text-black" />
          </div>
          <div className="bg-black p-4 rounded-full mb-6 shadow-lg">
             <Coffee className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-future text-2xl font-bold text-black mb-2">Buy Us A Coffee</h3>
          <p className="text-gray-800 mb-6 z-10 font-medium">Become a supporter and unlock exclusive behind-the-scenes content.</p>
          <span className="inline-block bg-black text-[#FFDD00] px-6 py-2 rounded-full font-bold shadow-lg group-hover:scale-105 transition-transform">
            Support Project
          </span>
        </a>

      </div>
      
      <div className="mt-16 text-gray-500 text-sm">
        <p>© 2024 AI Impact Media. All contributions are final.</p>
      </div>
    </div>
  );
};

export default Donations;