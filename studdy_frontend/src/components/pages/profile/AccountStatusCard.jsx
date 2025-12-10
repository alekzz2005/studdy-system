import React from 'react';
import { Info } from 'lucide-react';

const AccountStatusCard = ({ user, formatDate }) => {
    console.log("Is active: ", user.active);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
          <Info className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Account Status</h3>
          <p className="text-sm text-gray-600">Your account information</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Account Type</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.type === 'Tutor' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {user.type}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.active 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {user.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Member Since</span>
          <span className="font-medium text-gray-900">{formatDate(user.dateStarted)}</span>
        </div>
      </div>
    </div>
  );
};

export default AccountStatusCard;