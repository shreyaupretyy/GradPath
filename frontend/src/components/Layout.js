// Layout.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Users, Settings, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Layout({ children, darkMode, setDarkMode }) {
  // React Router hook for navigation
  const navigate = useNavigate();

  // Handle logout functionality
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear tokens or authentication data (example with localStorage)
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Show a logout success message
      toast.info('Logged out successfully');

      // Redirect to the login page
      navigate('/login');
    }
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Sidebar */}
      <aside className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md relative`}>
        {/* Sidebar Header */}
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Navigation Links */}
        <nav className="mt-10">
          <Link
            to="/"
            className={`flex items-center py-2 px-6 ${
              window.location.pathname === '/' ? 'bg-indigo-500 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="mx-3">Home</span>
          </Link>

          <Link
            to="/admin-dashboard"
            className={`flex items-center py-2 px-6 ${
              window.location.pathname === '/admin-dashboard'
                ? 'bg-indigo-500 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="mx-3">Dashboard</span>
          </Link>

          <Link
            to="/students"
            className={`flex items-center py-2 px-6 ${
              window.location.pathname === '/students'
                ? 'bg-indigo-500 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="mx-3">Students</span>
          </Link>

          {/* Example of another link:
          <Link
            to="/settings"
            className={`flex items-center py-2 px-6 ${
              window.location.pathname === '/settings'
                ? 'bg-indigo-500 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="mx-3">Settings</span>
          </Link>
          */}

          <button
            onClick={handleLogout}
            className="flex items-center py-2 px-6 text-gray-700 hover:bg-gray-200 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="mx-3">Logout</span>
          </button>
        </nav>

        {/* Dark Mode Toggle (Optional) */}
        <div className="absolute bottom-0 mb-6 px-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center py-2 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Toggle {darkMode ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}