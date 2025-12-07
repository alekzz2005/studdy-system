import React from 'react';
import { CalendarPlus } from 'lucide-react';

const MobileBookButton = ({ onBookSession }) => {
  return (
    <button 
      onClick={() => onBookSession()}
      className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors z-50"
    >
      <CalendarPlus className="w-6 h-6" />
    </button>
  );
};

export default MobileBookButton;