import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * This Navbar component uses Tailwind CSS and React.
 * It conditionally displays links depending on:
 *  - User login status
 *  - Whether they are a student or an admin
 *
 * It also includes:
 *  - A logo image that routes to the Home page when clicked
 *  - The "gradpath" label before the main navigation links
 *
 * Replace the placeholder login logic with real authentication/role data.
 */

const Navbar = () => {
  // Placeholder states for demonstration
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(''); // 'student' or 'admin'

  // Example toggle logic (purely for demonstration)
  const toggleLogin = () => {
    // Cycle through not logged in, 'student', 'admin' for demonstration
    if (!isLoggedIn) {
      setIsLoggedIn(true);
      setUserRole('student');
    } else if (userRole === 'student') {
      setUserRole('admin');
    } else {
      setIsLoggedIn(false);
      setUserRole('');
    }
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo: when clicked, routes to Home */}
        <Link to="/" className="flex items-center">
          {/* Replace /path/to/logo.png with the actual path to your logo image */}
          <img
            src="/path/to/logo.png"
            alt="Logo"
            className="h-8 w-auto mr-2"
          />
          {/* Project name "gradpath" before any buttons */}
          <span className="text-xl font-bold">gradpath</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="space-x-4">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact Us</Link>

          {isLoggedIn ? (
            <>
              {/* If user is logged in as a student */}
              {userRole === 'student' && (
                <Link to="/student-dashboard">Dashboard</Link>
              )}
              {/* If user is logged in as an admin */}
              {userRole === 'admin' && (
                <Link to="/admin-dashboard">Dashboard</Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>

        {/* Demo Button to toggle login status and role (remove in production) */}
        <button
          onClick={toggleLogin}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
        >
          Toggle Login (Demo)
        </button>
      </div>
    </nav>
  );
};

export default Navbar;