import React from 'react';
import { ViewState } from '../types';
import { MonitorPlay, Menu, X } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems: { label: string; view: ViewState }[] = [
    { label: 'Home', view: 'HOME' },
    { label: 'Casting', view: 'CASTING' },
    { label: 'Movies', view: 'MOVIES' },
    { label: 'Sponsors', view: 'SPONSORS' },
    { label: 'Donations', view: 'DONATIONS' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => setView('HOME')}
          >
            <MonitorPlay className="h-8 w-8 text-red-600 mr-2 group-hover:text-red-500 transition-colors" />
            <span className="font-future font-bold text-2xl tracking-wider text-white group-hover:text-gray-200 transition-colors">
              AI IMPACT
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setView(item.view)}
                  className={`font-future px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    currentView === item.view
                      ? 'text-red-500 scale-110'
                      : 'text-gray-300 hover:text-white hover:scale-105'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 absolute w-full border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setView(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className={`font-future block w-full text-left px-3 py-4 text-base font-medium border-l-4 ${
                  currentView === item.view
                    ? 'border-red-600 text-white bg-gray-900'
                    : 'border-transparent text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;