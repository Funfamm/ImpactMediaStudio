import React, { useEffect, useState } from 'react';
import { ViewState } from '../types';
import { Users, Clapperboard, HandHeart, Building2 } from 'lucide-react';

interface HomeProps {
  setView: (view: ViewState) => void;
}

const Home: React.FC<HomeProps> = ({ setView }) => {
  const [offset, setOffset] = useState(0);

  // Auto scroll effect for the poster footer
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const menuBlocks = [
    { 
      label: 'CASTING', 
      view: 'CASTING' as ViewState, 
      icon: Users,
      desc: 'Join our next production',
      bg: 'https://picsum.photos/id/1012/800/800' 
    },
    { 
      label: 'SPONSORS', 
      view: 'SPONSORS' as ViewState, 
      icon: Building2,
      desc: 'Partner with the future',
      bg: 'https://picsum.photos/id/1033/800/800'
    },
    { 
      label: 'MOVIES', 
      view: 'MOVIES' as ViewState, 
      icon: Clapperboard,
      desc: 'Watch our originals',
      bg: 'https://picsum.photos/id/1002/800/800'
    },
    { 
      label: 'DONATIONS', 
      view: 'DONATIONS' as ViewState, 
      icon: HandHeart,
      desc: 'Support the vision',
      bg: 'https://picsum.photos/id/1060/800/800'
    },
  ];

  const posterUrls = [
    "https://picsum.photos/id/10/200/300",
    "https://picsum.photos/id/11/200/300",
    "https://picsum.photos/id/12/200/300",
    "https://picsum.photos/id/13/200/300",
    "https://picsum.photos/id/14/200/300",
    "https://picsum.photos/id/15/200/300",
    "https://picsum.photos/id/16/200/300",
    "https://picsum.photos/id/17/200/300",
    "https://picsum.photos/id/18/200/300",
    "https://picsum.photos/id/19/200/300",
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/id/1000/1920/1080')] bg-cover bg-center opacity-30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-4 flex flex-col items-center">
        <h1 className="font-future text-5xl md:text-7xl lg:text-8xl font-black text-center mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          AI IMPACT
        </h1>
        <p className="font-future text-red-500 tracking-[0.3em] text-sm md:text-lg mb-12 uppercase">
          The Future of Community Cinema
        </p>

        {/* 4 Main Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {menuBlocks.map((block) => (
            <div 
              key={block.label}
              onClick={() => setView(block.view)}
              className="group relative h-64 md:h-80 w-full bg-gray-900 rounded-lg overflow-hidden cursor-pointer border border-gray-800 hover:border-red-600 transition-all duration-500 netflix-card"
            >
              {/* Image BG */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60"
                style={{ backgroundImage: `url(${block.bg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
                <block.icon className="h-10 w-10 text-red-600 mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300" />
                <h3 className="font-future text-2xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">
                  {block.label}
                </h3>
                <p className="text-gray-400 text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                  {block.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Poster Scroller */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20 overflow-hidden pointer-events-none">
        <div 
          className="flex space-x-4 absolute bottom-0 left-0 h-24 items-end pb-4 transition-transform duration-75 ease-linear"
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {[...posterUrls, ...posterUrls, ...posterUrls].map((url, i) => (
            <img 
              key={i} 
              src={url} 
              alt="Movie Poster" 
              className="h-20 w-14 object-cover rounded opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;