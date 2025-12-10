import React from 'react';

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

export default Footer;