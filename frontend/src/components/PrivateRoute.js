import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRole }) => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    // Check if user is authenticated and has the correct role
    if (!token || !user) {
        // Not logged in, redirect to login page
        return <Navigate to="/login" />;
    }

    if (user.role !== allowedRole) {
        // Wrong role, redirect to appropriate dashboard
        if (user.role === 'student') {
            return <Navigate to="/student-dashboard" />;
        } else if (user.role === 'admin') {
            return <Navigate to="/admin-dashboard" />;
        } else {
            // Invalid role, logout
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return <Navigate to="/login" />;
        }
    }

    // Authorized, render component
    return children;
};

export default PrivateRoute;