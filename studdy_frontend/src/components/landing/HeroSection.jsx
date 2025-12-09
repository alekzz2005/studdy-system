import React from 'react';
import Button from '../common/Button';

// Hero Section Component
const HeroSection = ({ stats, loading, onFindTutor, onBecomeTutor }) => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content pt-10">
          <span className="tag">Interactive Learning</span>
          <h1>Connect. Learn. Collaborate.</h1>
          <p>Studdy connects students for peer-to-peer tutoring and academic collaboration. Get help from qualified fellow students or share your knowledge to support others in their learning journey.</p>
          <div className="hero-actions flex flex-wrap gap-4">
            <Button variant="primary" onClick={onFindTutor} className="py-3.5 flex-initial">
              Find a Tutor <i className="fas fa-arrow-right ml-2"></i>
            </Button>
            <Button variant="outline" onClick={onBecomeTutor} className="py-3.5 flex-initial">
              Become a Tutor
            </Button>
          </div>
          <div className="hero-stats">
            <StatItem 
              icon="fas fa-user" 
              value={loading ? '...' : `${stats.activeUsers}+`} 
              label="Active Users" 
            />
            <StatItem 
              icon="fas fa-book-open" 
              value={loading ? '...' : `${stats.subjects}+`} 
              label="Subjects" 
            />
            <StatItem 
              icon="fas fa-star" 
              value={loading ? '...' : stats.rating} 
              label="Average Rating" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Stat Item Component - Updated with green icons
const StatItem = ({ icon, value, label }) => {
  return (
    <div className="stat">
      <div className="stat-value">
        <i className={`${icon} text-green-600`}></i> {value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default HeroSection;