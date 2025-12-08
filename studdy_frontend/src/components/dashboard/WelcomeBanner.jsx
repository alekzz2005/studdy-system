import React from 'react';
import { GraduationCap } from 'lucide-react';

const WelcomeBanner = ({ currentUser }) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-8 mb-8 text-white shadow-lg">
      <h2 className="text-3xl font-bold mb-2">
        Welcome back, {currentUser?.firstName || 'Student'}!
      </h2>
      <p className="text-green-50 text-lg">
        {currentUser?.type === 'TUTOR' 
          ? 'Ready to help students today?' 
          : 'Ready to continue your learning journey?'}
      </p>
      {currentUser?.major && (
        <div className="mt-4 flex items-center">
          <GraduationCap className="w-5 h-5 mr-2" />
          <span>{currentUser.major} • {currentUser.school || 'University'}</span>
        </div>
      )}
    </div>
  );
};

export default WelcomeBanner;