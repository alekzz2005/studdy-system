import React from 'react';
import SectionTitle from './components/SectionTitle';

// Features Section Component
const FeaturesSection = ({ features }) => {
  return (
    <section id="features" className="section">
      <div className="container">
        <SectionTitle 
          title="Why Choose Studdy?"
          subtitle="Experience peer-to-peer learning with features designed to make tutoring accessible, affordable, and effective for every student."
        />
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        <i className={icon}></i>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeaturesSection;