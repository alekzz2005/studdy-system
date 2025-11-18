import React from 'react';

const Sidebar = () => {
  const quickActions = [
    { label: 'Book Tutor', active: true, icon: 'fas fa-calendar-plus' },
    { label: 'Session History', active: false, icon: 'fas fa-history' },
    { label: 'Account Settings', active: false, icon: 'fas fa-cog' }
  ];

  return (
    <aside className="dashboard-sidebar">
      <h3 className="sidebar-title">Quick Actions</h3>
      
      <div className="sidebar-actions">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className={`action-item ${action.active ? 'active' : ''}`}
          >
            <i className={action.icon}></i>
            {action.label}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;