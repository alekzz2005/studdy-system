// components/auth/RegisterSteps/TutorSubjects.jsx
import React, { useState, useEffect } from 'react';
import { BookOpen, Check } from 'lucide-react';

const TutorSubjects = ({ subjects, selectedSubjects, onChange, error }) => {
  // If subjects aren't provided via props, you can fetch them here
  // But it's better to fetch in the parent component and pass down

  const handleSubjectToggle = (subjectId) => {
    const isSelected = selectedSubjects.includes(subjectId);
    let newSelectedSubjects;
    
    if (isSelected) {
      newSelectedSubjects = selectedSubjects.filter(id => id !== subjectId);
    } else {
      newSelectedSubjects = [...selectedSubjects, subjectId];
    }
    
    onChange(newSelectedSubjects);
  };

  // If no subjects are passed, show a loading state or default list
  if (!subjects || subjects.length === 0) {
    return (
      <div className="space-y-4 mt-6">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Subjects You Can Teach</h3>
        </div>
        <p className="text-sm text-gray-600">Loading subjects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center space-x-2">
        <BookOpen className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Subjects You Can Teach</h3>
      </div>
      
      <p className="text-sm text-gray-600">
        Select the subjects you're comfortable teaching. You can update this list anytime in your settings.
      </p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {subjects.map((subject) => {
          const isSelected = selectedSubjects.includes(subject.subjectId.toString());
          
          return (
            <button
              key={subject.subjectId}
              type="button"
              onClick={() => handleSubjectToggle(subject.subjectId.toString())}
              className={`p-4 rounded-lg border transition-all text-left ${
                isSelected 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {isSelected && (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <h4 className={`font-medium ${isSelected ? 'text-green-700' : 'text-gray-800'}`}>
                      {subject.subjectName}
                    </h4>
                  </div>
                  {subject.subjectDesc && (
                    <p className="text-xs text-gray-500 mt-1">
                      {subject.subjectDesc}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> You can always add or remove subjects later in your profile settings. 
          Start with the subjects you're most confident teaching.
        </p>
      </div>
    </div>
  );
};

export default TutorSubjects;