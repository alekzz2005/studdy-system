import React from 'react';

// Features Section Component
const FeaturesSection = ({ features }) => {
  return (
    <section id="features" className="section">
      <div className="container">
        {/* Temporary inline styles for testing */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '64px' }}>
          <h2 style={{ 
            fontSize: '36px',
            fontWeight: '700', 
            marginBottom: '16px',
            color: '#111827',
            textAlign: 'center'
          }}>
            Why Choose Studdy?
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#6B7280', 
            maxWidth: '768px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            Experience peer-to-peer learning with features designed to make tutoring accessible, affordable, and effective for every student.
          </p>
        </div>
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

// MAKE SURE THIS EXPORT IS AT THE END
export default FeaturesSection;