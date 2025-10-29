"use client";

import React, { useState, useCallback, memo } from "react";
import { HowItWorks } from "./HowItWorks";
import { FieldSelector } from "./FieldSelector";
import { JobRoleSelector } from "./JobRoleSelector";
import { QuestionsList } from "./QuestionsList";

type Step = "field" | "jobRole" | "questions";

const MockInterviewContainerComponent = () => {
  const [currentStep, setCurrentStep] = useState<Step>("field");
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedJobRole, setSelectedJobRole] = useState<string | null>(null);

  const handleSelectField = useCallback((fieldId: string) => {
    setSelectedField(fieldId);
    setCurrentStep("jobRole");
  }, []);

  const handleSelectJobRole = useCallback((jobRole: string) => {
    setSelectedJobRole(jobRole);
    setCurrentStep("questions");
  }, []);

  const handleBackToFields = useCallback(() => {
    setSelectedField(null);
    setSelectedJobRole(null);
    setCurrentStep("field");
  }, []);

  const handleBackToJobRoles = useCallback(() => {
    setSelectedJobRole(null);
    setCurrentStep("jobRole");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Practice Job Interviews with{" "}
            <span className="text-adult-green">Confidence</span>
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Your safe space to prepare for job interviews and first impressions.
          </p>
        </div>

        {/* Main Content */}
        {currentStep === "field" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - How it Works */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <HowItWorks />
            </div>

            {/* Right Column - Field Selection */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <FieldSelector onSelectField={handleSelectField} />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {currentStep === "jobRole" && selectedField && (
                <JobRoleSelector
                  selectedIndustry={selectedField}
                  onSelectJobRole={handleSelectJobRole}
                  onBack={handleBackToFields}
                />
              )}

              {currentStep === "questions" &&
                selectedField &&
                selectedJobRole && (
                  <QuestionsList
                    selectedIndustry={selectedField}
                    selectedJobRole={selectedJobRole}
                    onBack={handleBackToJobRoles}
                  />
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

MockInterviewContainerComponent.displayName = "MockInterviewContainer";

export const MockInterviewContainer = memo(MockInterviewContainerComponent);
