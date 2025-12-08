import React, { useState } from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';

const TutorSubjectsCard = ({
  tutor,
  tutorSubjects,
  availableSubjects,
  editingSection,
  setEditingSection,
  setSuccessMessage,
  setError
}) => {
  const [selectedSubject, setSelectedSubject] = useState('');

  const handleAddSubject = () => {
    if (!selectedSubject) {
      setError('Please select a subject');
      return;
    }

    try {
      const subjectToAdd = availableSubjects.find(
        s => s.subjectId === parseInt(selectedSubject)
      );
      
      if (subjectToAdd) {
        setSuccessMessage('Subject added successfully!');
        setSelectedSubject('');
        setEditingSection(null);
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      setError('Failed to add subject');
    }
  };

  const handleRemoveSubject = (tutorSubjectId) => {
    if (!window.confirm('Are you sure you want to remove this subject?')) return;

    try {
      setSuccessMessage('Subject removed successfully!');
    } catch (error) {
      console.error('Error removing subject:', error);
      setError('Failed to remove subject');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Subjects</h3>
              <p className="text-sm text-gray-600">What I teach</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setEditingSection(editingSection === 'subjects' ? null : 'subjects');
              setSelectedSubject('');
            }}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors border border-green-200"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {editingSection === 'subjects' && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Add New Subject</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Select Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Choose a subject...</option>
                  {availableSubjects.map(subject => (
                    <option key={subject.subjectId} value={subject.subjectId}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddSubject}
                  disabled={!selectedSubject}
                  className="flex-1 bg-green-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Add Subject
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {tutorSubjects && tutorSubjects.length > 0 ? (
          <div className="space-y-3">
            {tutorSubjects.map(tutorSubject => (
              <div 
                key={tutorSubject.tutorSubjectId}
                className="group flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                    <BookOpen className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {tutorSubject.subject.subjectName}
                    </h4>
                    <p className="text-xs text-gray-600 truncate max-w-[200px]">
                      {tutorSubject.subject.subjectDesc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSubject(tutorSubject.tutorSubjectId)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all p-1"
                  title="Remove subject"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No subjects added yet</p>
            <button 
              onClick={() => setEditingSection('subjects')}
              className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Add your first subject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSubjectsCard;