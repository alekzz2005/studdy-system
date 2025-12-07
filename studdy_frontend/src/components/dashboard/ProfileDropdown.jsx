import React from 'react';
import { User, Key, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ isOpen, onClose, currentUser, onLogout }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleEditProfile = () => {
    navigate('/profile/edit');
    onClose();
  };

  const handleChangePassword = () => {
    navigate('/change-password');
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      ></div>
      
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
        {currentUser && (
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
            <div className="flex items-center mt-1">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                {currentUser.type || 'Student'}
              </span>
              {currentUser.major && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  {currentUser.major}
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="py-1">
          <button 
            onClick={handleEditProfile}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
          
          <button 
            onClick={handleChangePassword}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Key className="w-4 h-4" />
            <span>Change Password</span>
          </button>
          
          <div className="border-t border-gray-100 my-1"></div>
          
          <button 
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;