// src/components/StudentDashboard.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer'; // Ensure Footer is correctly imported
import { FaUser, FaBell, FaClipboardList, FaSignOutAlt, FaRocket } from 'react-icons/fa';

/**
 * StudentDashboard Component
 * This component serves as the dashboard for logged-in students.
 * It includes a welcome section, profile overview, application status,
 * notifications, additional features, an "Apply Now" button, and a "Logout" button.
 */
const StudentDashboard = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  /**
   * Handles the logout process.
   * Clears user session and redirects to the login page.
   */
  const handleLogout = () => {
    // Clear authentication tokens or user data from localStorage
    localStorage.removeItem('authToken'); // Adjust based on your auth implementation
    // Redirect to the login page
    navigate('/login');
  };

  // Example data - In a real application, this would come from props or a global state
  const studentProfile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    program: 'Computer Science',
    enrollmentYear: 2022,
    profilePicture: 'https://via.placeholder.com/150', // Placeholder image
  };

  const applicationStatus = {
    submitted: true,
    approved: false,
    pendingDocuments: ['Transcript', 'Letters of Recommendation'],
  };

  const notifications = [
    { id: 1, message: 'Your application has been submitted successfully.', date: '2025-01-28' },
    { id: 2, message: 'Please upload your transcript before the deadline.', date: '2025-01-29' },
    { id: 3, message: 'Your application is under review.', date: '2025-01-30' },
  ];

  // Example statistics - In a real application, fetch these from an API
  const statistics = {
    applicationsSubmitted: 3,
    applicationsApproved: 1,
    notifications: notifications.length,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Student Portal</h1>
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="flex items-center text-gray-700 hover:text-indigo-600 transition">
              <FaUser className="mr-1" />
              Profile
            </Link>
            <Link to="/notifications" className="flex items-center text-gray-700 hover:text-indigo-600 transition">
              <FaBell className="mr-1" />
              Notifications
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-red-600 transition"
            >
              <FaSignOutAlt className="mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center">
            {/* Profile Picture */}
            <img
              src={studentProfile.profilePicture}
              alt={`${studentProfile.firstName} ${studentProfile.lastName}`}
              className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-6 object-cover border-4 border-white"
            />
            {/* Welcome Message */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">
                Welcome, {studentProfile.firstName} {studentProfile.lastName}!
              </h2>
              <p className="text-lg mb-4">
                Manage your application, track your progress, and take the next step in your academic journey.
              </p>
              <Link
                to="/apply"
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
              >
                <FaRocket className="mr-2" />
                Apply Now
              </Link>
            </div>
          </div>
        </section>

        {/* Profile Overview and Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Profile Overview */}
          <section className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaUser className="mr-2 text-indigo-600" />
              Profile Overview
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {studentProfile.firstName} {studentProfile.lastName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {studentProfile.email}
              </p>
              <p>
                <span className="font-medium">Program:</span> {studentProfile.program}
              </p>
              <p>
                <span className="font-medium">Enrollment Year:</span> {studentProfile.enrollmentYear}
              </p>
            </div>
          </section>

          {/* Application Status */}
          <section className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaClipboardList className="mr-2 text-indigo-600" />
              Application Status
            </h2>
            <div className="space-y-2">
              {applicationStatus.submitted ? (
                <p className="text-green-600 font-medium">Your application has been submitted.</p>
              ) : (
                <p className="text-red-600 font-medium">Your application has not been submitted.</p>
              )}

              {applicationStatus.approved ? (
                <p className="text-green-600 font-medium">Your application has been approved!</p>
              ) : applicationStatus.submitted ? (
                <p className="text-yellow-600 font-medium">Your application is under review.</p>
              ) : null}

              {applicationStatus.pendingDocuments.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium">Pending Documents:</p>
                  <ul className="list-disc list-inside text-gray-700">
                    {applicationStatus.pendingDocuments.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Statistics */}
          <section className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaClipboardList className="mr-2 text-indigo-600" />
              Statistics
            </h2>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between bg-blue-100 p-4 rounded-lg">
                <div>
                  <p className="text-gray-700">Applications Submitted</p>
                  <p className="text-2xl font-bold">{statistics.applicationsSubmitted}</p>
                </div>
                <FaClipboardList className="text-blue-500 text-3xl" />
              </div>
              <div className="flex items-center justify-between bg-green-100 p-4 rounded-lg">
                <div>
                  <p className="text-gray-700">Applications Approved</p>
                  <p className="text-2xl font-bold">{statistics.applicationsApproved}</p>
                </div>
                <FaClipboardList className="text-green-500 text-3xl" />
              </div>
              <div className="flex items-center justify-between bg-yellow-100 p-4 rounded-lg">
                <div>
                  <p className="text-gray-700">New Notifications</p>
                  <p className="text-2xl font-bold">{statistics.notifications}</p>
                </div>
                <FaBell className="text-yellow-500 text-3xl" />
              </div>
            </div>
          </section>
        </div>

        {/* Notifications */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaBell className="mr-2 text-indigo-600" />
            Notifications
          </h2>
          {notifications.length > 0 ? (
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li key={notification.id} className="border-b pb-2">
                  <p className="text-gray-800">{notification.message}</p>
                  <p className="text-gray-500 text-sm">{notification.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">You have no new notifications.</p>
          )}
        </section>

        {/* Additional Dashboard Features */}
        {/* Add more sections or components as needed */}
      </main>

      {/* Footer */}
    </div>
  );
};

// Define PropTypes for type checking
StudentDashboard.propTypes = {
  // If you plan to pass props, define them here
};

export default StudentDashboard;