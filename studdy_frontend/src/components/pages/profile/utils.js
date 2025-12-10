export const fetchMockProfile = () => {
  return {
    user: {
      userId: 1,
      firstName: 'John',
      lastName: 'Dela Cruz',
      email: 'john.delacruz@email.com',
      phoneNumber: '+63 912 345 6789',
      dateOfBirth: '2000-05-15',
      address: '123 Main St, Sual, Pangasinan',
      bio: 'Passionate about learning and helping others understand complex mathematical concepts. Currently pursuing BS Mathematics.',
      school: 'Pangasinan State University',
      gradeLevel: 3,
      major: 'BS Mathematics',
      dateStarted: '2024-01-15',
      type: 'Tutor',
      active: true
    },
    tutor: {
      tutorId: 101,
      averageRating: 4.8,
      isAvailable: true
    },
    tutee: null,
    tutorSubjects: [
      {
        tutorSubjectId: 1,
        subject: {
          subjectId: 1,
          subjectName: 'Calculus',
          subjectDesc: 'Advanced calculus and mathematical analysis'
        }
      },
      {
        tutorSubjectId: 2,
        subject: {
          subjectId: 2,
          subjectName: 'Linear Algebra',
          subjectDesc: 'Matrices, vectors, and linear transformations'
        }
      },
      {
        tutorSubjectId: 3,
        subject: {
          subjectId: 3,
          subjectName: 'Statistics',
          subjectDesc: 'Probability and statistical inference'
        }
      }
    ],
    sessions: [
      {
        sessionId: 1,
        subjectName: 'Calculus',
        date: '2024-11-15',
        duration: 90,
        status: 'completed',
        rating: 5,
        feedback: 'Excellent session! Very clear explanations.',
        role: 'tutor'
      },
      {
        sessionId: 2,
        subjectName: 'Linear Algebra',
        date: '2024-11-20',
        duration: 60,
        status: 'completed',
        rating: 5,
        feedback: 'Great patience and understanding.',
        role: 'tutor'
      }
    ],
    availableSubjects: [
      { subjectId: 4, subjectName: 'Geometry', subjectDesc: 'Euclidean and analytical geometry' },
      { subjectId: 5, subjectName: 'Physics', subjectDesc: 'Mechanics and thermodynamics' }
    ]
  };
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};