import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/auth';
import '../styles/LandingPage.css';

import Header from './HeaderSection';

import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import SubjectsSection from './SubjectsSection';
import CTASection from './CTASection';

import Footer from './FooterSection';

const LandingPage = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    subjects: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
    authAPI.logout();
    navigate('/login');
  };

  const handleGetStarted = () => {
    authAPI.logout();
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
      <SubjectsSection subjects={subjects} />
      <HowItWorksSection steps={steps} />
      <CTASection onFindTutor={handleFindTutor} onBecomeTutor={handleBecomeTutor} />
      
      <Footer />
    </div>
  );
};

export default LandingPage;