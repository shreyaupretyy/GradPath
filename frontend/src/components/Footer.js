// src/components/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer Component
 * This component appears at the bottom of every page, providing navigation and informational links.
 */

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo and Project Name */}
        <div className="flex items-center mb-4 md:mb-0">
          {/* Replace '/path/to/logo.png' with the actual path to your logo image */}
          <img src="/path/to/logo.png" alt="GradPath Logo" className="h-8 w-8 mr-2" />
          <span className="text-xl font-bold">GradPath</span>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/contact-us" className="hover:underline">
            Contact Us
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-4 text-center text-sm">
        &copy; {new Date().getFullYear()} GradPath. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;