// src/components/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer'; // Ensure Footer is correctly imported

/**
 * Home Component
 * This component serves as the landing page for the GradPath application.
 * It includes multiple sections:
 * - Hero Section
 * - Features Overview
 * - How It Works
 * - Call to Action
 * - Footer
 */
const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to GradPath</h1>
          <p className="text-lg mb-6">
            Your gateway to advanced studies. Apply with ease and track your application status seamlessly.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-transparent border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                {/* Replace with an appropriate icon or image */}
                <svg
                  className="w-12 h-12 text-blue-600 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Easy Application</h3>
              <p className="text-center">
                Fill out your application form quickly and efficiently with our user-friendly interface.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                {/* Replace with an appropriate icon or image */}
                <svg
                  className="w-12 h-12 text-blue-600 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5V4H2v16h5m7-9h6m-6 4h6m-6-8h6"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Real-Time Tracking</h3>
              <p className="text-center">
                Monitor the status of your application in real-time and stay updated with notifications.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                {/* Replace with an appropriate icon or image */}
                <svg
                  className="w-12 h-12 text-blue-600 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6 3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Admin Management</h3>
              <p className="text-center">
                Admins can easily review, approve, or reject applications with just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Step 1 */}
            <div className="flex-1 mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold ml-4">Create an Account</h3>
              </div>
              <p>
                Sign up as a student to start your application process or as an admin to manage applications.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex-1 mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold ml-4">Fill Out the Application</h3>
              </div>
              <p>
                Complete your application form with all the required details and submit it for review.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold ml-4">Track & Receive Updates</h3>
              </div>
              <p>
                Monitor the status of your application and get notified once a decision is made.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="mb-8">
            Join GradPath today and streamline your application process for higher studies.
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default Home;