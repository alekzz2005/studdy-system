// components/auth/RegisterSteps/TutorSubjects.jsx
import React, { useState } from 'react';
import { BookOpen, Check } from 'lucide-react';

const TutorSubjects = ({ selectedSubjects, onChange, error }) => {
  // Common subjects for tutoring
  const allSubjects = [
    { id: 'math', name: 'Mathematics', description: 'Algebra, Calculus, Geometry, Statistics' },
    { id: 'physics', name: 'Physics', description: 'Mechanics, Thermodynamics, Electromagnetism' },
    { id: 'chemistry', name: 'Chemistry', description: 'Organic, Inorganic, Physical Chemistry' },
    { id: 'biology', name: 'Biology', description: 'Cell Biology, Genetics, Ecology' },
    { id: 'cs', name: 'Computer Science', description: 'Programming, Algorithms, Data Structures' },
    { id: 'english', name: 'English', description: 'Grammar, Literature, Writing Skills' },
    { id: 'history', name: 'History', description: 'World History, Philippine History' },
    { id: 'economics', name: 'Economics', description: 'Microeconomics, Macroeconomics' },
    { id: 'accounting', name: 'Accounting', description: 'Financial, Managerial Accounting' },
    { id: 'engineering', name: 'Engineering', description: 'Civil, Electrical, Mechanical' },
    { id: 'filipino', name: 'Filipino', description: 'Wika at Panitikan' },
    { id: 'spanish', name: 'Spanish', description: 'Spanish Language and Culture' },
  ];

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
        {allSubjects.map((subject) => {
          const isSelected = selectedSubjects.includes(subject.id);
          
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => handleSubjectToggle(subject.id)}
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
                      {subject.name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {subject.description}
                  </p>
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