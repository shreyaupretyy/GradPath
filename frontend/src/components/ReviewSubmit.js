// src/components/ReviewSubmit.js

import React from "react";
import PropTypes from "prop-types";

/**
 * ReviewSubmit Component - Page 4
 * Allows users to review their information and submit the application.
 *
 * Props:
 * - prevStep: Function to return to the previous step.
 * - formData: Object containing all form data.
 * - handleFinalSubmit: Function to handle the final submission of the form.
 */
const ReviewSubmit = ({ prevStep, formData, handleFinalSubmit }) => {
  /**
   * Handles the final submission of the form.
   * @param {object} e - Event object from the form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    handleFinalSubmit(); // Finalize and submit the application
  };

  /**
   * Formats the date to a more readable format.
   * @param {string} dateStr - Date string in YYYY-MM-DD format.
   * @returns {string} Formatted date string.
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
      {/* Form Header */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Review &amp; Submit Your Application
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details Review */}
        <section className="border-l-4 border-indigo-500 pl-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <span className="font-medium text-gray-600">First Name:</span>{" "}
                {formData.first_name || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium text-gray-600">Middle Name:</span>{" "}
                {formData.middle_name || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium text-gray-600">Last Name:</span>{" "}
                {formData.last_name || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium text-gray-600">Contact Number:</span>{" "}
                {formData.contact_number || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium text-gray-600">Gender:</span>{" "}
                {formData.gender || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium text-gray-600">Availability to Start:</span>{" "}
                {formatDate(formData.availability_to_start)}
              </p>
            </div>
          </div>
        </section>

        {/* Academic Information Review */}
        <section className="border-l-4 border-indigo-500 pl-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Academic Information
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium text-gray-600">Final Percentage:</span>{" "}
              {formData.final_percentage ? `${formData.final_percentage}%` : "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Tentative Ranking:</span>{" "}
              {formData.tentative_ranking || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Final Year Project:</span>{" "}
              {formData.final_year_project || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Other Research:</span>{" "}
              {formData.other_research || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Publications:</span>{" "}
              {formData.publications || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Extracurricular Activities:</span>{" "}
              {formData.extracurricular || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Professional Experience:</span>{" "}
              {formData.professional_experience || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Strong Points:</span>{" "}
              {formData.strong_points || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Weak Points:</span>{" "}
              {formData.weak_points || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Transcript:</span>{" "}
              {formData.transcript ? formData.transcript.name : "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">CV:</span>{" "}
              {formData.cv ? formData.cv.name : "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Photo:</span>{" "}
              {formData.photo ? formData.photo.name : "N/A"}
            </p>
          </div>
        </section>

        {/* Additional Information Review */}
        <section className="border-l-4 border-indigo-500 pl-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Additional Information
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium text-gray-600">Preferred Programs:</span>{" "}
              {formData.preferred_programs || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">References:</span>{" "}
              {formData.references || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Statement of Purpose:</span>{" "}
              {formData.statement_of_purpose || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Intended Research Areas:</span>{" "}
              {formData.intended_research_areas || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">English Proficiency:</span>{" "}
              {formData.english_proficiency || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Leadership Experience:</span>{" "}
              {formData.leadership_experience || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Additional Certifications:</span>{" "}
              {formData.additional_certifications || "N/A"}
            </p>
          </div>
        </section>

        {/* Submission Confirmation */}
        <section className="border-t-2 border-gray-200 pt-6">
          <p className="text-center text-gray-600">
            Please review all your information before submitting. Ensure that all details are accurate and complete.
          </p>
        </section>

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
            className="flex items-center justify-center w-1/2 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

// Define PropTypes for type checking
ReviewSubmit.propTypes = {
  prevStep: PropTypes.func.isRequired, // Function to return to the previous step
  formData: PropTypes.shape({
    first_name: PropTypes.string,
    middle_name: PropTypes.string,
    last_name: PropTypes.string,
    contact_number: PropTypes.string,
    gender: PropTypes.string,
    availability_to_start: PropTypes.string,
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
    preferred_programs: PropTypes.string,
    references: PropTypes.string,
    statement_of_purpose: PropTypes.string,
    intended_research_areas: PropTypes.string,
    english_proficiency: PropTypes.string,
    leadership_experience: PropTypes.string,
    additional_certifications: PropTypes.string,
  }).isRequired, // Object containing all form data
  handleFinalSubmit: PropTypes.func.isRequired, // Function to handle final form submission
};

export default ReviewSubmit;