import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Header = ({ navigate }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center">
    
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Go back to dashboard"
            >
              <ArrowLeft className="w-6 h-6 text-green-600" />
            </button>
            
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600 leading-none pt-5">My Profile</h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;