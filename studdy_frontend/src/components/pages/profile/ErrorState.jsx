import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ navigate }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load profile</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ErrorState;