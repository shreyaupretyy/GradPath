// src/components/AcademicInfo.js

import React, { useState } from "react";
import { XCircleIcon, AcademicCapIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";

/**
 * AcademicInfo Component - Page 2
 * Collects academic information from the user.
 *
 * Props:
 * - prevStep: Function to return to the previous step.
 * - nextStep: Function to proceed to the next step.
 * - formData: Object containing all form data.
 * - handleFormData: Function to update form data in the parent component.
 */
const AcademicInfo = ({ prevStep, nextStep, formData, handleFormData }) => {
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({
    transcript: formData.transcript,
    cv: formData.cv,
    photo: formData.photo,
  });

  /**
   * Validates form inputs.
   * @returns {boolean} True if the form is valid, else False.
   */
  const validateForm = () => {
    const newErrors = {};

    // Final percentage validation
    if (!formData.final_percentage) {
      newErrors.final_percentage = "Final percentage is required";
    } else {
      const percentage = parseFloat(formData.final_percentage);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        newErrors.final_percentage =
          "Please enter a valid percentage between 0 and 100";
      }
    }

    // Tentative ranking validation
    if (!formData.tentative_ranking) {
      newErrors.tentative_ranking = "Please select your tentative ranking";
    }

    // Final year project validation
    if (!formData.final_year_project?.trim()) {
      newErrors.final_year_project = "Please enter your final year project details";
    } else if (formData.final_year_project.length < 50) {
      newErrors.final_year_project =
        "Please provide more details about your project (minimum 50 characters)";
    }

    // Strong points validation
    if (!formData.strong_points?.trim()) {
      newErrors.strong_points = "Please enter your strong points";
    }

    // Weak points validation
    if (!formData.weak_points?.trim()) {
      newErrors.weak_points = "Please enter your weak points";
    }

    // File validations
    if (!selectedFiles.transcript) {
      newErrors.transcript = "Please upload your transcript";
    }
    if (!selectedFiles.cv) {
      newErrors.cv = "Please upload your CV";
    }
    if (!selectedFiles.photo) {
      newErrors.photo = "Please upload your photo";
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
   * Handles file input changes.
   * @param {object} e - Event object from the file input.
   */
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setSelectedFiles((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      handleFormData({
        ...formData,
        [name]: files[0],
      });
    }
  };

  /**
   * Cancels the selected file.
   * @param {string} fieldName - The name of the file field to cancel.
   */
  const handleFileCancel = (fieldName) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
    handleFormData({
      ...formData,
      [fieldName]: null,
    });
    // Reset the file input
    const fileInput = document.querySelector(`input[name="${fieldName}"]`);
    if (fileInput) {
      fileInput.value = "";
    }
  };

  /**
   * Handles form submission.
   * @param {object} e - Event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      nextStep(); // Move to the next step
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-10">
      {/* Form Header */}
      <div className="flex items-center mb-6">
        <AcademicCapIcon className="h-8 w-8 text-indigo-500 mr-2" />
        <h1 className="text-3xl font-bold text-gray-800">Academic Information</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Final Percentage Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Final Percentage Score <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="final_percentage"
            value={formData.final_percentage}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            max="100"
            className={`w-full px-4 py-3 border ${
              errors.final_percentage ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
            placeholder="Enter your final percentage score"
          />
          {errors.final_percentage && (
            <p className="mt-2 text-sm text-red-600">{errors.final_percentage}</p>
          )}
        </div>

        {/* Tentative Ranking */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tentative Ranking <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {["Top 5%", "Top 10%", "Top 20%", "Top 30%", "Top 40%"].map((rank) => (
              <label key={rank} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="tentative_ranking"
                  value={rank}
                  checked={formData.tentative_ranking === rank}
                  onChange={handleChange}
                  required
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="text-gray-700">{rank}</span>
              </label>
            ))}
          </div>
          {errors.tentative_ranking && (
            <p className="mt-2 text-sm text-red-600">{errors.tentative_ranking}</p>
          )}
        </div>

        {/* Final Year Project */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Final Year Project Details <span className="text-red-500">*</span>
          </label>
          <textarea
            name="final_year_project"
            value={formData.final_year_project}
            onChange={handleChange}
            required
            rows="5"
            className={`w-full px-4 py-3 border ${
              errors.final_year_project ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
            placeholder="Describe your final year project in detail (minimum 50 characters)"
          ></textarea>
          {errors.final_year_project && (
            <p className="mt-2 text-sm text-red-600">{errors.final_year_project}</p>
          )}
        </div>

        {/* Any Other Notable Research or Project Work */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Other Notable Research or Project Work
          </label>
          <textarea
            name="other_research"
            value={formData.other_research}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="Describe any other research or projects you have worked on..."
          ></textarea>
        </div>

        {/* Publications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Publications
          </label>
          <textarea
            name="publications"
            value={formData.publications}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="List your publications (e.g., Title, Conference/Journal Name)"
          ></textarea>
        </div>

        {/* Notable Extracurricular Activities and Awards */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notable Extracurricular Activities and Awards
          </label>
          <textarea
            name="extracurricular"
            value={formData.extracurricular}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="List your achievements and activities..."
          ></textarea>
        </div>

        {/* Professional Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Experience
          </label>
          <textarea
            name="professional_experience"
            value={formData.professional_experience}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="Briefly describe your work experience..."
          ></textarea>
        </div>

        {/* Strong Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Strong Points <span className="text-red-500">*</span>
          </label>
          <textarea
            name="strong_points"
            value={formData.strong_points}
            onChange={handleChange}
            required
            rows="4"
            className={`w-full px-4 py-3 border ${
              errors.strong_points ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
            placeholder="List your strengths..."
          ></textarea>
          {errors.strong_points && (
            <p className="mt-2 text-sm text-red-600">{errors.strong_points}</p>
          )}
        </div>

        {/* Weak Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weak Points <span className="text-red-500">*</span>
          </label>
          <textarea
            name="weak_points"
            value={formData.weak_points}
            onChange={handleChange}
            required
            rows="4"
            className={`w-full px-4 py-3 border ${
              errors.weak_points ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
            placeholder="List your weaknesses..."
          ></textarea>
          {errors.weak_points && (
            <p className="mt-2 text-sm text-red-600">{errors.weak_points}</p>
          )}
        </div>

        {/* Transcript Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transcript <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              name="transcript"
              onChange={handleFileChange}
              required={!selectedFiles.transcript}
              accept=".pdf,.doc,.docx"
              className={`flex-1 px-4 py-3 border ${
                errors.transcript ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
            />
            {selectedFiles.transcript && (
              <button
                type="button"
                onClick={() => handleFileCancel("transcript")}
                className="text-red-500 hover:text-red-700"
                title="Remove file"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            )}
          </div>
          {errors.transcript && (
            <p className="mt-2 text-sm text-red-600">{errors.transcript}</p>
          )}
          {selectedFiles.transcript && (
            <p className="mt-1 text-sm text-gray-500">
              Selected: {selectedFiles.transcript.name}
            </p>
          )}
        </div>

        {/* CV Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CV <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              name="cv"
              onChange={handleFileChange}
              required={!selectedFiles.cv}
              accept=".pdf,.doc,.docx"
              className={`flex-1 px-4 py-3 border ${
                errors.cv ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
            />
            {selectedFiles.cv && (
              <button
                type="button"
                onClick={() => handleFileCancel("cv")}
                className="text-red-500 hover:text-red-700"
                title="Remove file"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            )}
          </div>
          {errors.cv && <p className="mt-2 text-sm text-red-600">{errors.cv}</p>}
          {selectedFiles.cv && (
            <p className="mt-1 text-sm text-gray-500">
              Selected: {selectedFiles.cv.name}
            </p>
          )}
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              name="photo"
              onChange={handleFileChange}
              required={!selectedFiles.photo}
              accept="image/*"
              className={`flex-1 px-4 py-3 border ${
                errors.photo ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
            />
            {selectedFiles.photo && (
              <button
                type="button"
                onClick={() => handleFileCancel("photo")}
                className="text-red-500 hover:text-red-700"
                title="Remove file"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            )}
          </div>
          {errors.photo && <p className="mt-2 text-sm text-red-600">{errors.photo}</p>}
          {selectedFiles.photo && (
            <p className="mt-1 text-sm text-gray-500">
              Selected: {selectedFiles.photo.name}
            </p>
          )}
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
AcademicInfo.propTypes = {
  prevStep: PropTypes.func.isRequired, // Function to return to the previous step
  nextStep: PropTypes.func.isRequired, // Function to proceed to the next step
  formData: PropTypes.shape({
    final_percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tentative_ranking: PropTypes.string,
    final_year_project: PropTypes.string,
    other_research: PropTypes.string,
    publications: PropTypes.string,
    extracurricular: PropTypes.string,
    professional_experience: PropTypes.string,
    strong_points: PropTypes.string,
    weak_points: PropTypes.string,
    transcript: PropTypes.object,
    cv: PropTypes.object,
    photo: PropTypes.object,
  }).isRequired, // Object containing all form data
  handleFormData: PropTypes.func.isRequired, // Function to update form data in the parent component
};

export default AcademicInfo;