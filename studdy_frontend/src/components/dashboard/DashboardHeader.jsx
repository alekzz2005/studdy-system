import React, { useState } from 'react';
import { Bell, CalendarPlus, ChevronDown } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

const DashboardHeader = ({ currentUser, onBookSession, onLogout }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const isTutee = currentUser?.type === 'TUTOR' || currentUser?.type === 'Tutor' ? false : true;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-green-600">Studdy</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isTutee && (
            <button 
              onClick={() => onBookSession()}
              className="hidden sm:flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <CalendarPlus className="w-5 h-5" />
              <span>Book Session</span>
            </button>)}
            
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-1"
              >
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {currentUser ? getInitials(currentUser.firstName, currentUser.lastName) : 'U'}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onClose={() => setProfileDropdownOpen(false)}
                currentUser={currentUser}
                onLogout={onLogout}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;