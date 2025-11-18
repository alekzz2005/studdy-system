import React from 'react';
import SectionTitle from './components/SectionTitle';

// Subjects Section Component
const SubjectsSection = ({ subjects }) => {
  return (
    <section id="subjects" className="section subjects">
      <div className="container">
        <SectionTitle 
          title="Explore Our Subjects"
          subtitle="Find expert tutors across a wide range of academic subjects to help you succeed in your studies."
        />
        <div className="subjects-grid">
          {subjects.map((subject, index) => (
            <SubjectCard key={index} {...subject} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Subject Card Component
const SubjectCard = ({ icon, title, description }) => {
  return (
    <div className="subject-card">
      <div className="subject-icon">
        <i className={icon}></i>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default SubjectsSection;