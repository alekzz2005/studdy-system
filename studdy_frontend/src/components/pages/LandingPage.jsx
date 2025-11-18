import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { fetchLandingPageStats } from '../../services/api';
import './LandingPage.css';

const LandingPage = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    subjects: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch landing page statistics from API
    const loadStats = async () => {
      try {
        const statsData = await fetchLandingPageStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback data
        setStats({
          activeUsers: 300,
          subjects: 50,
          rating: 4.8
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const features = [
    {
      icon: 'fas fa-check-circle',
      title: 'Verified Tutors',
      description: 'All tutors are verified students with proven academic excellence in their subjects.'
    },
    {
      icon: 'fas fa-calendar-alt',
      title: 'Flexible Scheduling',
      description: 'Book sessions that fit your schedule. Available 24/7 to match your learning pace.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure Platform',
      description: 'Safe and secure payment processing with transparent pricing and no hidden fees.'
    },
    {
      icon: 'fas fa-star',
      title: 'Rating System',
      description: 'Rate and review tutors to help others find the best match for their learning needs.'
    },
    {
      icon: 'fas fa-tag',
      title: 'Affordable Rates',
      description: 'Quality tutoring at student-friendly prices. Much more affordable than traditional services.'
    },
    {
      icon: 'fas fa-bolt',
      title: 'Instant Booking',
      description: 'Quick and easy booking process. Find and book a tutor in under 5 minutes.'
    },
    {
      icon: 'fas fa-comments',
      title: 'Direct Communication',
      description: 'Chat directly with your tutor to discuss goals and coordinate sessions effectively.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Track Progress',
      description: 'Monitor your learning progress and see improvement over time with detailed analytics.'
    }
  ];

  const subjects = [
    {
      icon: 'fas fa-calculator',
      title: 'Mathematics',
      description: 'Algebra, Calculus, Geometry, Statistics, and more'
    },
    {
      icon: 'fas fa-flask',
      title: 'Science',
      description: 'Biology, Chemistry, Physics, Environmental Science'
    },
    {
      icon: 'fas fa-language',
      title: 'Languages',
      description: 'English, Spanish, French, Writing, Literature'
    },
    {
      icon: 'fas fa-laptop-code',
      title: 'Computer Science',
      description: 'Programming, Web Development, Data Structures, Algorithms'
    },
    {
      icon: 'fas fa-landmark',
      title: 'Social Sciences',
      description: 'History, Psychology, Economics, Political Science'
    },
    {
      icon: 'fas fa-paint-brush',
      title: 'Arts & Humanities',
      description: 'Art History, Music Theory, Philosophy, Creative Writing'
    },
    {
      icon: 'fas fa-chart-bar',
      title: 'Business',
      description: 'Accounting, Marketing, Finance, Management'
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Test Prep',
      description: 'SAT, ACT, GRE, GMAT, MCAT, and other standardized tests'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Find a Tutor',
      description: 'Browse our network of qualified student tutors by subject, rating, and availability.'
    },
    {
      number: 2,
      title: 'Book a Session',
      description: 'Schedule a tutoring session at your convenience. Choose one-on-one or group sessions based on your preference.'
    },
    {
      number: 3,
      title: 'Learn Together',
      description: 'Meet online or in person for your session. Get personalized help and clear your doubts effectively.'
    },
    {
      number: 4,
      title: 'Rate & Review',
      description: 'Share your experience and rate your tutor. Help other students find the best tutors for their needs.'
    }
  ];

  const handleFindTutor = () => {
    navigate('/login');
  };

  const handleBecomeTutor = () => {
    navigate('/register');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleGetStarted = () => {
    navigate('/register');
  };  

  return (
    <div className="landing-page">
      {/* Header */}
      <Header onSignIn={handleSignIn} onGetStarted={handleGetStarted} />
      
      {/* Hero Section */}
      <HeroSection 
        stats={stats} 
        loading={loading}
        onFindTutor={handleFindTutor}
        onBecomeTutor={handleBecomeTutor}
      />
      
      {/* Features Section */}
      <FeaturesSection features={features} />
      
      {/* Subjects Section */}
      <SubjectsSection subjects={subjects} />
      
      {/* How It Works Section */}
      <HowItWorksSection steps={steps} />
      
      {/* CTA Section */}
      <CTASection onFindTutor={handleFindTutor} onBecomeTutor={handleBecomeTutor} />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

// Header Component
const Header = ({ onSignIn, onGetStarted }) => {
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleSmoothScroll = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a href="/" className="logo" onClick={handleLogoClick}>Studdy</a>
          <nav>
            <ul>
              <li><a href="#features" onClick={(e) => handleSmoothScroll(e, 'features')}>Features</a></li>
              <li><a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, 'how-it-works')}>How It Works</a></li>
              <li><a href="#subjects" onClick={(e) => handleSmoothScroll(e, 'subjects')}>Subjects</a></li>
            </ul>
          </nav>
          <div className="header-actions">
            <Button variant="outline" onClick={onSignIn}>Sign In</Button>
            <Button variant="primary" onClick={onGetStarted}>Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Hero Section Component
const HeroSection = ({ stats, loading, onFindTutor, onBecomeTutor }) => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <span className="tag">Interactive Learning</span>
          <h1>Connect. Learn. Collaborate.</h1>
          <p>Studdy connects students for peer-to-peer tutoring and academic collaboration. Get help from qualified fellow students or share your knowledge to support others in their learning journey.</p>
          <div className="hero-actions">
            <Button variant="primary" onClick={onFindTutor}>
              Find a Tutor <i className="fas fa-arrow-right"></i>
            </Button>
            <Button variant="outline" onClick={onBecomeTutor}>
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

// Stat Item Component
const StatItem = ({ icon, value, label }) => {
  return (
    <div className="stat">
      <div className="stat-value">
        <i className={icon}></i> {value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

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

// Footer Component
const Footer = () => {
  const footerLinks = {
    quickLinks: [
      { label: 'Find Tutors', href: '#find-tutors' },
      { label: 'Become a Tutor', href: '#become-tutor' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Subjects', href: '#subjects' }
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Safety Guidelines', href: '#' },
      { label: 'Community Rules', href: '#' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Refund Policy', href: '#' }
    ]
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Studdy</h3>
            <p>Connecting students for affordable peer tutoring. Learn from qualified fellow students and earn while you teach.</p>
            <SocialLinks />
          </div>
          <FooterColumn title="Quick Links" links={footerLinks.quickLinks} />
          <FooterColumn title="Support" links={footerLinks.support} />
          <FooterColumn title="Legal" links={footerLinks.legal} />
        </div>
        <div className="footer-bottom">
          <p>© 2025 Studdy. All rights reserved. Empowering students through peer learning.</p>
        </div>
      </div>
    </footer>
  );
};

// Footer Column Component
const FooterColumn = ({ title, links }) => {
  return (
    <div className="footer-column">
      <h3>{title}</h3>
      <ul className="footer-links">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Social Links Component
const SocialLinks = () => {
  const socialPlatforms = [
    { icon: 'fab fa-facebook-f', href: '#' },
    { icon: 'fab fa-twitter', href: '#' },
    { icon: 'fab fa-instagram', href: '#' },
    { icon: 'fab fa-linkedin-in', href: '#' }
  ];

  return (
    <div className="social-links">
      {socialPlatforms.map((platform, index) => (
        <a key={index} href={platform.href} className="social-link">
          <i className={platform.icon}></i>
        </a>
      ))}
    </div>
  );
};

// Reusable Section Title Component
const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
};

export default LandingPage;