import React from 'react';
import Button from '../common/Button';

// CTA Section Component
const CTASection = ({ onFindTutor, onBecomeTutor }) => {
  return (
    <section className="container">
      <div className="cta">
        <h2>Ready to Start Learning?</h2>
        <p>Join thousands of students already improving their grades with Studdy's peer tutoring network.</p>
        <div className="cta-buttons">
          <Button 
            variant="primary" 
            className="btn-white"
            onClick={onFindTutor}
          >
            Find a Tutor Now <i className="fas fa-arrow-right"></i>
          </Button>
          <Button 
            variant="outline" 
            className="btn-outline-white"
            onClick={onBecomeTutor}
          >
            Become a Tutor
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;