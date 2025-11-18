import React from 'react';
import SectionTitle from './components/SectionTitle';

// How It Works Section Component
const HowItWorksSection = ({ steps }) => {
  return (
    <section id="how-it-works" className="section how-it-works">
      <div className="container">
        <SectionTitle 
          title="How Studdy Works"
          subtitle="Getting started with peer tutoring is simple. Follow these easy steps to connect with qualified student tutors and start improving your grades."
        />
        <div className="steps">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Step Card Component
const StepCard = ({ number, title, description }) => {
  return (
    <div className="step-card">
      <div className="step-number">
        <span>{number}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default HowItWorksSection;