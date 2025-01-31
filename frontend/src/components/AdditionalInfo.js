// src/components/AdditionalInfo.js

import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * AdditionalInfo Component - Page 3
 * Collects additional information from the user.
 *
 * Props:
 * - prevStep: Function to return to the previous step.
 * - nextStep: Function to proceed to the next step.
 * - formData: Object containing all form data.
 * - handleFormData: Function to update form data in the parent component.
 */
const AdditionalInfo = ({ prevStep, nextStep, formData, handleFormData }) => {
  const [errors, setErrors] = useState({});

  /**
   * Validates form inputs.
   * @returns {boolean} True if the form is valid, else False.
   */
  const validateForm = () => {
    const newErrors = {};

    // Preferred Programs validation
    if (!formData.preferred_programs?.trim()) {
      newErrors.preferred_programs = "Please enter your preferred programs";
    }

    // References validation
    if (!formData.references?.trim()) {
      newErrors.references = "Please provide references";
    }

    // Statement of Purpose validation
    if (!formData.statement_of_purpose?.trim()) {
      newErrors.statement_of_purpose = "Please enter your statement of purpose";
    } else if (formData.statement_of_purpose.length < 100) {
      newErrors.statement_of_purpose =
        "Statement of purpose should be at least 100 characters long";
    }

    // Intended Research Areas validation
    if (!formData.intended_research_areas?.trim()) {
      newErrors.intended_research_areas = "Please enter your intended research areas";
    }

    // English Proficiency validation
    if (!formData.english_proficiency) {
      newErrors.english_proficiency = "Please select your English proficiency level";
    }

    // Leadership Experience validation
    if (!formData.leadership_experience?.trim()) {
      newErrors.leadership_experience = "Please describe your leadership experience";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles input changes and updates form data.
   * @param {object} e - Event object from the input field.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    handleFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  /**
   * Handles form submission.
   * @param {object} e - Event object from the form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      nextStep(); // Move to the next step
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-10">
      {/* Form Header */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Additional Information
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preferred Programs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Programs <span className="text-red-500">*</span>
          </label>
          <textarea
            name="preferred_programs"
            value={formData.preferred_programs}
            onChange={handleChange}
            required
            rows="3"
            className={`w-full px-4 py-3 border ${
              errors.preferred_programs ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
            placeholder="List the programs you are interested in..."
          ></textarea>
          {errors.preferred_programs && (
            <p className="mt-2 text-sm text-red-600">{errors.preferred_programs}</p>
          )}
        </div>

        {/* References */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            References <span className="text-red-500">*</span>
          </label>
          <textarea
            name="references"
            value={formData.references}
            onChange={handleChange}
            required
            rows="3"
            className={`w-full px-4 py-3 border ${
              errors.references ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
            placeholder="Provide references or mentors..."
          ></textarea>
          {errors.references && (
            <p className="mt-2 text-sm text-red-600">{errors.references}</p>
          )}
        </div>

        {/* Statement of Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statement of Purpose <span className="text-red-500">*</span>
          </label>
          <textarea
            name="statement_of_purpose"
            value={formData.statement_of_purpose}
            onChange={handleChange}
            required
            rows="5"
            className={`w-full px-4 py-3 border ${
              errors.statement_of_purpose ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
            placeholder="Write your statement of purpose (minimum 100 characters)..."
          ></textarea>
          {errors.statement_of_purpose && (
            <p className="mt-2 text-sm text-red-600">{errors.statement_of_purpose}</p>
          )}
        </div>

        {/* Intended Research Areas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intended Research Areas <span className="text-red-500">*</span>
          </label>
          <textarea
            name="intended_research_areas"
            value={formData.intended_research_areas}
            onChange={handleChange}
            required
            rows="3"
            className={`w-full px-4 py-3 border ${
              errors.intended_research_areas ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
            placeholder="Describe your intended research areas..."
          ></textarea>
          {errors.intended_research_areas && (
            <p className="mt-2 text-sm text-red-600">
              {errors.intended_research_areas}
            </p>
          )}
        </div>

        {/* English Proficiency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            English Proficiency <span className="text-red-500">*</span>
          </label>
          <select
            name="english_proficiency"
            value={formData.english_proficiency}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 border ${
              errors.english_proficiency ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
          >
            <option value="">Select your proficiency level</option>
            <option value="Native">Native</option>
            <option value="Fluent">Fluent</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Basic">Basic</option>
          </select>
          {errors.english_proficiency && (
            <p className="mt-2 text-sm text-red-600">{errors.english_proficiency}</p>
          )}
        </div>

        {/* Leadership Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Leadership Experience <span className="text-red-500">*</span>
          </label>
          <textarea
            name="leadership_experience"
            value={formData.leadership_experience}
            onChange={handleChange}
            required
            rows="4"
            className={`w-full px-4 py-3 border ${
              errors.leadership_experience ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
            placeholder="Describe your leadership experiences..."
          ></textarea>
          {errors.leadership_experience && (
            <p className="mt-2 text-sm text-red-600">{errors.leadership_experience}</p>
          )}
        </div>

        {/* Availability to Start */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability to Start <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="availability_to_start"
            value={formData.availability_to_start}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 border ${
              errors.availability_to_start ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
          />
          {errors.availability_to_start && (
            <p className="mt-2 text-sm text-red-600">{errors.availability_to_start}</p>
          )}
        </div>

        {/* Additional Certifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Certifications
          </label>
          <textarea
            name="additional_certifications"
            value={formData.additional_certifications}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="List any additional certifications you have..."
          ></textarea>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center justify-center w-1/2 py-3 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            Previous
          </button>
          <button
            type="submit"
            className="flex items-center justify-center w-1/2 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

// Define PropTypes for type checking
AdditionalInfo.propTypes = {
  prevStep: PropTypes.func.isRequired, // Function to return to the previous step
  nextStep: PropTypes.func.isRequired, // Function to proceed to the next step
  formData: PropTypes.shape({
    preferred_programs: PropTypes.string,
    references: PropTypes.string,
    statement_of_purpose: PropTypes.string,
    intended_research_areas: PropTypes.string,
    english_proficiency: PropTypes.string,
    leadership_experience: PropTypes.string,
    availability_to_start: PropTypes.string,
    additional_certifications: PropTypes.string,
  }).isRequired, // Object containing all form data
  handleFormData: PropTypes.func.isRequired, // Function to update form data in the parent component
};

export default AdditionalInfo;