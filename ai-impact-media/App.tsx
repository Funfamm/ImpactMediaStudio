import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Casting from './components/Casting';
import Sponsors from './components/Sponsors';
import Movies from './components/Movies';
import Donations from './components/Donations';
import { ViewState } from './types';
import { MockBackend } from './services/mockBackend';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');

  useEffect(() => {
    // Simulate user login tracking on app load
    MockBackend.trackUserLogin('guest_user_' + Math.floor(Math.random() * 10000));
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return <Home setView={setCurrentView} />;
      case 'CASTING':
        return <Casting />;
      case 'SPONSORS':
        return <Sponsors />;
      case 'MOVIES':
        return <Movies />;
      case 'DONATIONS':
        return <Donations />;
      default:
        return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-red-600 selection:text-white">
      {/* Navigation is always visible except possibly on a pure landing if desired, but sticking to consistent nav is better UX */}
      <Navigation currentView={currentView} setView={setCurrentView} />
      
      {/* Main Content Area */}
      <main className="animate-fade-in">
        {renderView()}
      </main>
    </div>
  );
}

export default App;