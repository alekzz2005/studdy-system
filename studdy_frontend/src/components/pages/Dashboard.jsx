import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Calendar,
  LogOut,
  User,
  Settings
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    upcomingSessions: 0,
    completionRate: 0
  });

  useEffect(() => {
    // Check if user is logged in (you can replace this with your actual auth check)
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }

    // Simulate fetching dashboard data
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    // Simulate API call - replace with your actual API
    setTimeout(() => {
      setStats({
        totalStudents: 124,
        activeCourses: 8,
        upcomingSessions: 3,
        completionRate: 78
      });
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken'); // Remove if you have tokens
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Studdy Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-500" />
                <span className="text-gray-700">{user.email || user.name || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName || user.email?.split('@')[0] || 'Student'}!
          </h2>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your learning today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="h-6 w-6 text-blue-600" />}
            title="Total Students"
            value={stats.totalStudents}
            color="blue"
          />
          <StatCard
            icon={<BookOpen className="h-6 w-6 text-green-600" />}
            title="Active Courses"
            value={stats.activeCourses}
            color="green"
          />
          <StatCard
            icon={<Calendar className="h-6 w-6 text-orange-600" />}
            title="Upcoming Sessions"
            value={stats.upcomingSessions}
            color="orange"
          />
          <StatCard
            icon={<BarChart3 className="h-6 w-6 text-purple-600" />}
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            color="purple"
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b">
            <nav className="flex -mb-px">
              {['overview', 'courses', 'students', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 font-medium text-sm border-b-2 transition duration-200 ${
                    activeTab === tab
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'courses' && <CoursesTab />}
            {activeTab === 'students' && <StudentsTab />}
            {activeTab === 'settings' && <SettingsTab user={user} />}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            title="Create New Course"
            description="Start a new learning journey"
            icon={<BookOpen className="h-8 w-8" />}
            action={() => alert('Create course functionality')}
            buttonText="Create Course"
          />
          <QuickActionCard
            title="Schedule Session"
            description="Plan your next study session"
            icon={<Calendar className="h-8 w-8" />}
            action={() => alert('Schedule session functionality')}
            buttonText="Schedule"
          />
          <QuickActionCard
            title="View Progress"
            description="Check student progress and analytics"
            icon={<BarChart3 className="h-8 w-8" />}
            action={() => alert('View progress functionality')}
            buttonText="View Analytics"
          />
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  return (
    <div className={`bg-white rounded-lg border-2 p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="p-3 bg-white rounded-full shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
};

// Quick Action Card Component
const QuickActionCard = ({ title, description, icon, action, buttonText }) => (
  <div className="bg-white rounded-lg border p-6 hover:shadow-md transition duration-200">
    <div className="flex items-center space-x-4 mb-4">
      <div className="p-2 bg-green-50 rounded-lg text-green-600">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
    <button
      onClick={action}
      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200 font-medium"
    >
      {buttonText}
    </button>
  </div>
);

// Tab Components
const OverviewTab = () => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <p className="text-gray-700">
            New student registered in Course {item}
          </p>
          <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
        </div>
      ))}
    </div>
  </div>
);

const CoursesTab = () => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Courses</h3>
    <p className="text-gray-600">Course management functionality coming soon...</p>
  </div>
);

const StudentsTab = () => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Management</h3>
    <p className="text-gray-600">Student management functionality coming soon...</p>
  </div>
);

const SettingsTab = ({ user }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={user.email || ''}
          readOnly
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200">
        Update Profile
      </button>
    </div>
  </div>
);

export default Dashboard;