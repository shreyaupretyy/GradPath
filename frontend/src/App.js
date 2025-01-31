// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importing React Toastify for toast notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importing global components
import Layout from './components/Layout'; // Layout for admin routes

// Importing page components
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import StudentsPage from './components/StudentsPage';
import ApplicationForm from "./components/ApplicationForm";

// Importing the PrivateRoute component for protected routes
import PrivateRoute from './components/PrivateRoute';

/**
 * App Component
 * This is the root component of the application. It sets up routing
 * and manages the global state for students.
 */
const App = () => {
  /**
   * Local state to store the students array.
   * This can be replaced with data fetched from a server if desired.
   */
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      university: "ABC University",
      be_percentage: 85,
      be_ranking: 5,
      status: "approved",
      location: "Kathmandu",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      university: "XYZ University",
      be_percentage: 78,
      be_ranking: 10,
      status: "pending",
      location: "Lalitpur",
    },
  ]);

  return (
    <>
      {/* ToastContainer is used to display toast notifications */}
      <ToastContainer position="top-right" />

      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/apply" element={<ApplicationForm />} />

          {/* Protected Routes for Students */}
          <Route
            path="/student-dashboard"
            element={
              <PrivateRoute allowedRole="student">
                <StudentDashboard />
              </PrivateRoute>
            }
          />

          {/* Protected Routes for Admins */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute allowedRole="admin">
                <Layout>
                  <AdminDashboard />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/students"
            element={
              <PrivateRoute allowedRole="admin">
                <Layout>
                  <StudentsPage
                    students={students}
                    setStudents={setStudents}
                  />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* You can add more admin-specific routes here, all wrapped with Layout */}

          {/* Redirect any unknown routes to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;