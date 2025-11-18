// components/pages/Dashboard.jsx
import React from 'react';

// Reusable components for better code organization
const IconWrapper = ({ children, style = {} }) => (
  <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
    {children}
  </div>
);

const Icon = ({ color, style = {} }) => (
  <div style={{ background: color, ...style }} />
);

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  style = {},
  icon 
}) => {
  const baseStyle = {
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontFamily: 'Inter',
    fontWeight: 600,
    lineHeight: '24px',
    ...style
  };

  const variants = {
    primary: {
      background: '#16A34A',
      color: 'white',
      outline: '1.78px #16A34A solid',
      outlineOffset: '-1.78px'
    },
    secondary: {
      background: 'white',
      color: '#374151',
      outline: '0.89px #D1D5DB solid',
      outlineOffset: '-0.89px'
    },
    outline: {
      background: 'white',
      color: '#16A34A',
      outline: '1.78px #16A34A solid',
      outlineOffset: '-1.78px'
    },
    danger: {
      background: '#FEF2F2',
      color: '#DC2626',
      outline: '0.89px #FECACA solid',
      outlineOffset: '-0.89px'
    }
  };

  return (
    <div style={{ ...baseStyle, ...variants[variant] }} onClick={onClick}>
      {icon && <div style={{ marginRight: 8 }}>{icon}</div>}
      {children}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    confirmed: {
      background: '#DCFCE7',
      color: '#15803D',
      outline: '0.89px #BBF7D0 solid'
    },
    pending: {
      background: '#FEF9C3',
      color: '#A16207',
      outline: '0.89px #FEF08A solid'
    },
    available: {
      background: '#DCFCE7',
      color: '#15803D',
      outline: '0.89px #BBF7D0 solid'
    }
  };

  const config = statusConfig[status] || statusConfig.confirmed;

  return (
    <div style={{
      background: config.background,
      color: config.color,
      borderRadius: 9999,
      outline: config.outline,
      outlineOffset: '-0.89px',
      padding: '4.89px 12.89px',
      fontSize: 12,
      fontFamily: 'Inter',
      fontWeight: 600,
      lineHeight: '16px',
      display: 'inline-block'
    }}>
      {status}
    </div>
  );
};

const SessionCard = ({ session }) => (
  <div style={{
    borderRadius: 12,
    outline: '1.78px #E5E7EB solid',
    outlineOffset: '-1.78px',
    padding: '21.78px',
    marginBottom: '16px'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
          width: 48,
          height: 48,
          background: '#DCFCE7',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <IconWrapper style={{ width: 18, height: 16 }}>
            <Icon color="#16A34A" style={{ width: 18, height: 13.77 }} />
          </IconWrapper>
        </div>
        
        <div>
          <div style={{
            color: '#1F2937',
            fontSize: 18,
            fontFamily: 'Inter',
            fontWeight: 700,
            lineHeight: '28px',
            marginBottom: '4px'
          }}>
            {session.subject}
          </div>
          <div style={{
            color: '#4B5563',
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: 400,
            lineHeight: '20px',
            marginBottom: '8px'
          }}>
            {session.tutor}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconWrapper style={{ width: 14, height: 14 }}>
              <Icon color="#6B7280" style={{ width: 14, height: 14 }} />
            </IconWrapper>
            <span style={{
              color: '#6B7280',
              fontSize: 14,
              fontFamily: 'Inter',
              fontWeight: 400,
              lineHeight: '20px'
            }}>
              {session.date}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <StatusBadge status={session.status} />
        <Button variant="secondary" style={{ 
          width: 51.53, 
          height: 33.78,
          fontSize: 14
        }}>
          Join
        </Button>
        {session.status === 'pending' && (
          <Button variant="danger" style={{ 
            width: 67.64, 
            height: 33.78,
            fontSize: 14
          }}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  </div>
);

const TutorCard = ({ tutor }) => (
  <div style={{
    borderRadius: 12,
    outline: '1.78px #E5E7EB solid',
    outlineOffset: '-1.78px',
    padding: '21.78px',
    marginBottom: '16px'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
          width: 48,
          height: 48,
          background: '#E5E7EB',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <IconWrapper style={{ width: 14, height: 16 }}>
            <Icon color="#4B5563" style={{ width: 14, height: 16 }} />
          </IconWrapper>
        </div>
        
        <div>
          <div style={{
            color: '#1F2937',
            fontSize: 16,
            fontFamily: 'Inter',
            fontWeight: 700,
            lineHeight: '24px',
            marginBottom: '4px'
          }}>
            {tutor.name}
          </div>
          <div style={{
            color: '#4B5563',
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: 400,
            lineHeight: '20px'
          }}>
            {tutor.subject}
          </div>
        </div>
      </div>

      <StatusBadge status="available" />
    </div>

    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <IconWrapper style={{ width: 15.75, height: 14 }}>
          <Icon color="#EAB308" style={{ width: 14.44, height: 14 }} />
        </IconWrapper>
        <span style={{
          color: 'black',
          fontSize: 14,
          fontFamily: 'Inter',
          fontWeight: 600,
          lineHeight: '20px'
        }}>
          {tutor.rating}
        </span>
      </div>
      
      <Button variant="primary" style={{ 
        width: 90.07, 
        height: 32,
        fontSize: 14
      }}>
        Book Now
      </Button>
    </div>
  </div>
);

const ProgressBar = ({ label, percentage }) => (
  <div style={{ marginBottom: '24px' }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px'
    }}>
      <span style={{
        color: '#374151',
        fontSize: 14,
        fontFamily: 'Inter',
        fontWeight: 500,
        lineHeight: '20px'
      }}>
        {label}
      </span>
      <span style={{
        color: '#1F2937',
        fontSize: 14,
        fontFamily: 'Inter',
        fontWeight: 700,
        lineHeight: '20px'
      }}>
        {percentage}%
      </span>
    </div>
    <div style={{
      width: '100%',
      height: 10,
      background: '#E5E7EB',
      borderRadius: 9999
    }}>
      <div style={{
        width: `${percentage}%`,
        height: '100%',
        background: '#16A34A',
        borderRadius: 9999
      }} />
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  // Mock data - in a real app, this would come from API calls
  const upcomingSessions = [
    {
      id: 1,
      subject: 'Mathematics',
      tutor: 'Alexander Binagatan',
      date: 'Today • 2:00 PM - 3:00 PM',
      status: 'confirmed'
    },
    {
      id: 2,
      subject: 'Physics',
      tutor: 'Charry Mae Atamosa',
      date: 'Tomorrow • 10:00 AM - 11:30 AM',
      status: 'confirmed'
    },
    {
      id: 3,
      subject: 'Chemistry',
      tutor: 'John Anthony Besañez',
      date: 'Dec 15 • 4:00 PM - 5:00 PM',
      status: 'pending'
    }
  ];

  const availableTutors = [
    { id: 1, name: 'Alex Rodriguez', subject: 'Computer Science', rating: '4.9' },
    { id: 2, name: 'Lisa Wang', subject: 'Mathematics', rating: '4.7' },
    { id: 3, name: 'James Smith', subject: 'Biology', rating: '4.8' },
    { id: 4, name: 'Maria Garcia', subject: 'Spanish', rating: '4.5' }
  ];

  const studyProgress = [
    { subject: 'Mathematics', percentage: 85 },
    { subject: 'Physics', percentage: 72 },
    { subject: 'Chemistry', percentage: 90 }
  ];

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      background: 'linear-gradient(135deg, #DCFCE7 0%, #ECFDF5 50%, #CCFBF1 100%)'
    }}>
      {/* Header */}
      <div style={{
        width: '100%',
        height: 85.33,
        background: 'white',
        borderBottom: '1.78px #E5E7EB solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: 1280,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '111.36px' }}>
            <div style={{
              color: '#1F2937',
              fontSize: 24,
              fontFamily: 'Inter',
              fontWeight: '700',
              lineHeight: '32px'
            }}>
              Studdy
            </div>
            <div style={{ display: 'flex', gap: '68px' }}>
              {['Home', 'My Sessions', 'Profile'].map((item) => (
                <div key={item} style={{
                  color: '#374151',
                  fontSize: 16,
                  fontFamily: 'Inter',
                  fontWeight: '500',
                  lineHeight: '24px',
                  cursor: 'pointer'
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Button variant="outline" style={{ 
              width: 178.15, 
              height: 51.56,
              fontSize: 16
            }}>
              Book a session
            </Button>
            
            {/* Icons would go here */}
            <div style={{ display: 'flex', gap: '16px' }}>
              {/* Notification, Messages, Profile icons */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        width: '100%',
        display: 'flex',
        minHeight: 'calc(100vh - 85.33px)'
      }}>
        {/* Sidebar */}
        <div style={{
          width: 256,
          background: 'white',
          borderRight: '1.78px #E5E7EB solid',
          padding: '23.78px 24px'
        }}>
          <div style={{
            color: 'black',
            fontSize: 18,
            fontFamily: 'Inter',
            fontWeight: '700',
            lineHeight: '28px',
            marginBottom: '52.22px'
          }}>
            Quick Actions
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Book Tutor', active: true },
              { label: 'Session History', active: false },
              { label: 'Account Settings', active: false }
            ].map((action, index) => (
              <div
                key={index}
                style={{
                  height: 48,
                  background: action.active ? '#16A34A' : 'transparent',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  gap: '12px',
                  cursor: 'pointer',
                  color: action.active ? 'white' : '#374151',
                  fontSize: 16,
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  lineHeight: '24px'
                }}
              >
                {/* Icon would go here */}
                {action.label}
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{
          flex: 1,
          padding: '32px'
        }}>
          {/* Welcome Banner */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: '30.22px 32px',
            marginBottom: '32px'
          }}>
            <div style={{
              color: '#1F2937',
              fontSize: 30,
              fontFamily: 'Inter',
              fontWeight: '700',
              lineHeight: '36px',
              marginBottom: '8px'
            }}>
              Welcome back, Alex!
            </div>
            <div style={{
              color: '#4B5563',
              fontSize: 16,
              fontFamily: 'Inter',
              fontWeight: '400',
              lineHeight: '24px'
            }}>
              You have 2 sessions today. Ready to learn?
            </div>
          </div>

          <div style={{ display: 'flex', gap: '32px' }}>
            {/* Left Column */}
            <div style={{ flex: 2 }}>
              {/* Upcoming Sessions */}
              <div style={{
                background: 'white',
                borderRadius: 16,
                padding: '24px',
                marginBottom: '32px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  {/* Icon */}
                  <div style={{ width: 17.50, height: 28 }}>
                    <IconWrapper style={{ width: 17.50, height: 20 }}>
                      <Icon color="#16A34A" style={{ width: 17.50, height: 20 }} />
                    </IconWrapper>
                  </div>
                  <div>
                    <div style={{
                      color: '#1F2937',
                      fontSize: 20,
                      fontFamily: 'Inter',
                      fontWeight: 700,
                      lineHeight: '28px'
                    }}>
                      Upcoming Sessions
                    </div>
                    <div style={{
                      color: '#4B5563',
                      fontSize: 14,
                      fontFamily: 'Inter',
                      fontWeight: 400,
                      lineHeight: '20px'
                    }}>
                      Your scheduled tutoring sessions
                    </div>
                  </div>
                </div>

                <div>
                  {upcomingSessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </div>

              {/* Available Tutors */}
              <div style={{
                background: 'white',
                borderRadius: 16,
                padding: '24px'
              }}>
                <div style={{ marginBottom: '36px' }}>
                  <div style={{
                    color: '#1F2937',
                    fontSize: 20,
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    lineHeight: '28px',
                    marginBottom: '8px'
                  }}>
                    Available Tutors
                  </div>
                  <div style={{
                    color: '#4B5563',
                    fontSize: 14,
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    lineHeight: '20px'
                  }}>
                    Find and book tutors for your subjects
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '32px'
                }}>
                  {availableTutors.map(tutor => (
                    <TutorCard key={tutor.id} tutor={tutor} />
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button variant="outline" style={{ 
                    width: 159.58, 
                    height: 51.56,
                    fontSize: 16
                  }}>
                    View All Tutors
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ flex: 1 }}>
              {/* Stats Cards */}
              <div style={{
                background: 'white',
                borderRadius: 16,
                padding: '24px',
                marginBottom: '32px'
              }}>
                <div style={{
                  color: '#1F2937',
                  fontSize: 20,
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  lineHeight: '28px',
                  marginBottom: '52px'
                }}>
                  This Month
                </div>

                {[
                  { label: 'Sessions Completed', value: '12' },
                  { label: 'Hours Studied', value: '18.5' },
                  { label: 'Average Rating', value: '4.8' }
                ].map((stat, index) => (
                  <div key={index} style={{
                    background: 'white',
                    borderRadius: 12,
                    outline: '1.78px #E5E7EB solid',
                    outlineOffset: '-1.78px',
                    padding: '21.11px 21.78px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      color: '#4B5563',
                      fontSize: 14,
                      fontFamily: 'Inter',
                      fontWeight: 400,
                      lineHeight: '20px',
                      marginBottom: '4px'
                    }}>
                      {stat.label}
                    </div>
                    <div style={{
                      color: '#1F2937',
                      fontSize: 30,
                      fontFamily: 'Inter',
                      fontWeight: 700,
                      lineHeight: '36px'
                    }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Study Progress */}
              <div style={{
                background: 'white',
                borderRadius: 16,
                padding: '24px'
              }}>
                <div style={{
                  color: '#1F2937',
                  fontSize: 20,
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  lineHeight: '28px',
                  marginBottom: '52px'
                }}>
                  Study Progress
                </div>

                {studyProgress.map((progress, index) => (
                  <ProgressBar 
                    key={index}
                    label={progress.subject}
                    percentage={progress.percentage}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;