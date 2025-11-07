"use client";

import React, { memo } from "react";
import { useMockInterviewState } from "@/hooks/useMockInterviewState";
import { HowItWorks } from "./HowItWorks";
import { FieldSelector } from "./FieldSelector";
import { JobRoleSelector } from "./JobRoleSelector";
import { InterviewGuidelines } from "./InterviewGuidelines";
import { QuestionsList } from "./QuestionsList";

const MockInterviewContainerComponent = () => {
  const { state, actions } = useMockInterviewState();

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
        {state.currentStep === "field" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - How it Works */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <HowItWorks />
            </div>

            {/* Right Column - Field Selection */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <FieldSelector onSelectField={actions.selectField} />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {state.currentStep === "jobRole" &&
                state.selectedField &&
                state.selectedField.toLowerCase() !== "general" && (
                  <JobRoleSelector
                    selectedIndustry={state.selectedField}
                    onBack={actions.goBack}
                    onSelectJobRole={actions.selectJobRole}
                  />
                )}

              {state.currentStep === "guidelines" &&
                state.selectedField &&
                state.selectedJobRole && (
                  <InterviewGuidelines
                    selectedIndustry={state.selectedField}
                    selectedJobRole={state.selectedJobRole}
                    onBack={actions.goBack}
                    onNext={actions.startQuestions}
                  />
                )}

              {state.currentStep === "questions" &&
                state.selectedField &&
                state.selectedJobRole &&
                state.sessionId && (
                  <QuestionsList
                    selectedIndustry={state.selectedField}
                    selectedJobRole={state.selectedJobRole}
                    sessionId={state.sessionId}
                    sessionQuestions={state.sessionQuestions}
                    onBack={actions.goBack}
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
