// src/components/ApplicationForm.js

import React, { useState } from "react";
import PersonalDetails from "./PersonalDetails";
import AcademicInfo from "./AcademicInfo";
import AdditionalInfo from "./AdditionalInfo";
import ReviewSubmit from "./ReviewSubmit";

/**
 * ApplicationForm Component
 * Manages the multi-step application process.
 */
const ApplicationForm = () => {
  // State to manage current step
  const [currentStep, setCurrentStep] = useState(1);

  // State to hold all form data
  const [formData, setFormData] = useState({
    // Personal Details
    first_name: "",
    middle_name: "",
    last_name: "",
    contact_number: "",
    gender: "",

    // Academic Information
    final_percentage: "",
    tentative_ranking: "",
    final_year_project: "",
    other_research: "",
    publications: "",
    extracurricular: "",
    professional_experience: "",
    strong_points: "",
    weak_points: "",
    transcript: null,
    cv: null,
    photo: null,

    // Additional Information
    preferred_programs: "",
    references: "",
  });

  /**
   * Handles updating form data.
   * @param {Object} data - Updated form data.
   */
  const handleFormData = (data) => {
    setFormData(data);
  };

  /**
   * Navigates to the next step.
   */
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  /**
   * Navigates to the previous step.
   */
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  /**
   * Handles the final submission of the form.
   */
  const handleFinalSubmit = async () => {
    try {
      // Create FormData to send files
      const submissionData = new FormData();

      // Append all form data
      Object.keys(formData).forEach((key) => {
        submissionData.append(key, formData[key]);
      });

      // Make API call to submit the application
      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        body: submissionData,
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        // Reset the form or navigate to a success page
        window.location.href = "/dashboard"; // Redirect to dashboard
      } else {
        alert("Failed to submit the application. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  /**
   * Renders the component based on the current step.
   */
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetails
            nextStep={nextStep}
            formData={formData}
            handleFormData={handleFormData}
          />
        );
      case 2:
        return (
          <AcademicInfo
            prevStep={prevStep}
            nextStep={nextStep}
            formData={formData}
            handleFormData={handleFormData}
          />
        );
      case 3:
        return (
          <AdditionalInfo
            prevStep={prevStep}
            nextStep={nextStep}
            formData={formData}
            handleFormData={handleFormData}
          />
        );
      case 4:
        return (
          <ReviewSubmit
            prevStep={prevStep}
            formData={formData}
            handleFinalSubmit={handleFinalSubmit}
          />
        );
      default:
        return (
          <PersonalDetails
            nextStep={nextStep}
            formData={formData}
            handleFormData={handleFormData}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Form Header */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Application Form</h1>
          <p className="text-lg">
            Please fill out the form below to apply for your desired program.
          </p>
        </div>
      </section>

      {/* Form Steps */}
      <section className="py-10 flex-grow">
        {renderStep()}
      </section>

      {/* Footer */}
      {/* Optionally, include a footer if needed */}
    </div>
  );
};

export default ApplicationForm;