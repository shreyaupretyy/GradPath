// src/components/PersonalDetails.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaUser, FaPhone, FaVenusMars, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

/**
 * PersonalDetails Component
 * Collects user's personal information as part of a multi-step form.
 *
 * Props:
 * - nextStep: Function to proceed to the next step.
 * - prevStep: Function to return to the previous step.
 * - currentStep: Number indicating the current step.
 * - formData: Object containing all form data.
 * - handleFormData: Function to update form data in the parent component.
 */
const PersonalDetails = ({ nextStep, prevStep, currentStep, formData, handleFormData }) => {
  // Local state to manage form errors
  const [errors, setErrors] = useState({});

  /**
   * Initialize formData with default values when the component mounts.
   * This ensures that all fields are defined and prevents undefined access errors.
   */
  useEffect(() => {
    const initialFormData = {
      first_name: '',
      middle_name: '',
      last_name: '',
      contact_number: '',
      gender: '',
    };
    handleFormData(initialFormData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Validates the form fields.
   * @returns {boolean} True if the form is valid, else False.
   */
  const validateForm = () => {
    const newErrors = {};

    // Validate First Name
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    // Validate Last Name
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    // Validate Contact Number
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact_number)) {
      newErrors.contact_number = 'Please enter a valid 10-digit number';
    }

    // Validate Gender
    if (!formData.gender.trim()) {
      newErrors.gender = 'Please select a gender';
    }

    // Update the errors state
    setErrors(newErrors);

    // Return true if no errors, else false
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles input changes and updates the formData.
   * @param {object} e - Event object from the input field.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Merge the new value with existing formData
    handleFormData({ ...formData, [name]: value });

    // Clear the error message for the current field if it exists
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  /**
   * Handles form submission.
   * Validates the form and proceeds to the next step if valid.
   * @param {object} e - Event object from the form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Personal Details
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name */}
        <div className="flex flex-col">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaUser className="mr-2 text-indigo-500" />
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className={`px-4 py-3 border ${
              errors.first_name ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="Enter your first name"
          />
          {errors.first_name && (
            <p className="mt-2 text-sm text-red-600">{errors.first_name}</p>
          )}
        </div>

        {/* Middle Name */}
        <div className="flex flex-col">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaUser className="mr-2 text-indigo-500" />
            Middle Name
          </label>
          <input
            type="text"
            name="middle_name"
            value={formData.middle_name}
            onChange={handleChange}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your middle name (optional)"
          />
          {errors.middle_name && (
            <p className="mt-2 text-sm text-red-600">{errors.middle_name}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaUser className="mr-2 text-indigo-500" />
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className={`px-4 py-3 border ${
              errors.last_name ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="Enter your last name"
          />
          {errors.last_name && (
            <p className="mt-2 text-sm text-red-600">{errors.last_name}</p>
          )}
        </div>

        {/* Contact Number */}
        <div className="flex flex-col">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaPhone className="mr-2 text-indigo-500" />
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            className={`px-4 py-3 border ${
              errors.contact_number ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="Enter 10-digit mobile number"
          />
          {errors.contact_number && (
            <p className="mt-2 text-sm text-red-600">{errors.contact_number}</p>
          )}
        </div>

        {/* Gender */}
        <div className="flex flex-col">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaVenusMars className="mr-2 text-indigo-500" />
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            {/* Male */}
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleChange}
                required
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Male</span>
            </label>

            {/* Female */}
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleChange}
                required
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Female</span>
            </label>

            {/* Other */}
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Other"
                checked={formData.gender === 'Other'}
                onChange={handleChange}
                required
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Other</span>
            </label>
          </div>
          {errors.gender && (
            <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1} // Disable if it's the first step
            className={`flex items-center justify-center w-1/2 py-3 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 ${
              currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaArrowLeft className="mr-2" />
            Previous
          </button>
          <button
            type="submit"
            className="flex items-center justify-center w-1/2 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Next
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

// Define PropTypes for type checking
PersonalDetails.propTypes = {
  nextStep: PropTypes.func.isRequired, // Function to proceed to the next step
  prevStep: PropTypes.func.isRequired, // Function to go back to the previous step
  currentStep: PropTypes.number.isRequired, // Current step number
  formData: PropTypes.shape({
    first_name: PropTypes.string,
    middle_name: PropTypes.string,
    last_name: PropTypes.string,
    contact_number: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired, // Object containing all form data
  handleFormData: PropTypes.func.isRequired, // Function to update form data in the parent component
};

export default PersonalDetails;