"use client";

import React, { useState, useCallback, memo, useEffect } from "react";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import { HowItWorks } from "./HowItWorks";
import { FieldSelector } from "./FieldSelector";
import { JobRoleSelector } from "./JobRoleSelector";
import { InterviewGuidelines } from "./InterviewGuidelines";
import { QuestionsList } from "./QuestionsList";
import type { SessionQuestion } from "@/types/interview-question";

type Step = "field" | "jobRole" | "guidelines" | "questions";

type MockInterviewState = {
  currentStep: Step;
  selectedField: string | null;
  selectedJobRole: string | null;
  sessionId: string | null;
  sessionQuestions: SessionQuestion[];
};

const STORAGE_KEY = "mock_interview_state";
const EXPIRY_MINUTES = 60; // 1 hour

const MockInterviewContainerComponent = () => {
  const { getSecureItem, setSecureItem } = useSecureStorage();

  // Initialize state from secure storage or defaults
  const [currentStep, setCurrentStep] = useState<Step>(() => {
    if (typeof window === "undefined") return "field";
    const stored = getSecureItem(STORAGE_KEY);

    if (stored) {
      try {
        const state: MockInterviewState = JSON.parse(stored);

        return state.currentStep;
      } catch {
        return "field";
      }
    }

    return "field";
  });

  const [selectedField, setSelectedField] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = getSecureItem(STORAGE_KEY);

    if (stored) {
      try {
        const state: MockInterviewState = JSON.parse(stored);

        return state.selectedField;
      } catch {
        return null;
      }
    }

    return null;
  });

  const [selectedJobRole, setSelectedJobRole] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = getSecureItem(STORAGE_KEY);

    if (stored) {
      try {
        const state: MockInterviewState = JSON.parse(stored);

        return state.selectedJobRole;
      } catch {
        return null;
      }
    }

    return null;
  });

  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = getSecureItem(STORAGE_KEY);

    if (stored) {
      try {
        const state: MockInterviewState = JSON.parse(stored);

        return state.sessionId || null;
      } catch {
        return null;
      }
    }

    return null;
  });

  const [sessionQuestions, setSessionQuestions] = useState<SessionQuestion[]>(
    () => {
      if (typeof window === "undefined") return [];
      const stored = getSecureItem(STORAGE_KEY);

      if (stored) {
        try {
          const state: MockInterviewState = JSON.parse(stored);

          return state.sessionQuestions || [];
        } catch {
          return [];
        }
      }

      return [];
    },
  );

  // Save state to secure storage whenever it changes
  useEffect(() => {
    const state: MockInterviewState = {
      currentStep,
      selectedField,
      selectedJobRole,
      sessionId,
      sessionQuestions,
    };

    setSecureItem(STORAGE_KEY, JSON.stringify(state), EXPIRY_MINUTES);
  }, [
    currentStep,
    selectedField,
    selectedJobRole,
    sessionId,
    sessionQuestions,
    setSecureItem,
  ]);

  const handleSelectField = useCallback((fieldId: string) => {
    setSelectedField(fieldId);
    setCurrentStep("jobRole");
  }, []);

  const handleSelectJobRole = useCallback((jobRole: string) => {
    setSelectedJobRole(jobRole);
    setCurrentStep("guidelines");
  }, []);

  const handleProceedToQuestions = useCallback(
    (sessionId: string, questions: SessionQuestion[]) => {
      setSessionId(sessionId);
      setSessionQuestions(questions);
      setCurrentStep("questions");
    },
    [],
  );

  const handleBackToFields = useCallback(() => {
    setSelectedField(null);
    setSelectedJobRole(null);
    setSessionId(null);
    setSessionQuestions([]);
    setCurrentStep("field");
  }, []);

  const handleBackToJobRoles = useCallback(() => {
    setSelectedJobRole(null);
    setSessionId(null);
    setSessionQuestions([]);
    setCurrentStep("jobRole");
  }, []);

  const handleBackToGuidelines = useCallback(() => {
    setCurrentStep("guidelines");
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
                  onBack={handleBackToFields}
                  onSelectJobRole={handleSelectJobRole}
                />
              )}

              {currentStep === "guidelines" &&
                selectedField &&
                selectedJobRole && (
                  <InterviewGuidelines
                    selectedIndustry={selectedField}
                    selectedJobRole={selectedJobRole}
                    onBack={handleBackToJobRoles}
                    onNext={handleProceedToQuestions}
                  />
                )}

              {currentStep === "questions" &&
                selectedField &&
                selectedJobRole &&
                sessionId && (
                  <QuestionsList
                    selectedIndustry={selectedField}
                    selectedJobRole={selectedJobRole}
                    sessionId={sessionId}
                    sessionQuestions={sessionQuestions}
                    onBack={handleBackToGuidelines}
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
