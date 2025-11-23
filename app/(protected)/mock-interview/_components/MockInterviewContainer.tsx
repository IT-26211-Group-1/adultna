"use client";

import React, { memo } from "react";
import { useMockInterviewState } from "@/hooks/useMockInterviewState";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { HowItWorks } from "./HowItWorks";
import { FieldSelector } from "./FieldSelector";
import { JobRoleSelector } from "./JobRoleSelector";
import { InterviewGuidelines } from "./InterviewGuidelines";
import { QuestionsList } from "./QuestionsList";

const MockInterviewContainerComponent = () => {
  const { state, actions } = useMockInterviewState();

  const getBreadcrumbItems = () => {
    type BreadcrumbItem = {
      label: string;
      href?: string;
      current?: boolean;
      onClick?: () => void;
    };

    const items: BreadcrumbItem[] = [
      { label: "Dashboard", href: "/dashboard" },
    ];

    if (state.currentStep === "field") {
      items.push({ label: "Mock Interview", current: true });
    } else if (state.selectedField) {
      items.push({
        label: "Mock Interview",
        onClick: () => actions.reset()
      });

      const fieldName = state.selectedField.charAt(0).toUpperCase() + state.selectedField.slice(1).toLowerCase();
      items.push({ label: fieldName, current: true });
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-3">
            <Breadcrumb items={getBreadcrumbItems()} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-5xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {state.currentStep === "field" ? (
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
              {/* Left Column - Title and How it Works */}
              <div className="space-y-10 pt-0 pr-4">
                <div className="text-center lg:text-left">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    Practice Job Interviews with{" "}
                    <span className="text-adult-green bg-adult-green/10 px-6 py-1 rounded-lg">Confidence</span>
                  </h1>
                  <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Your safe space to prepare for job interviews and first impressions.
                  </p>
                </div>

                <div>
                  <HowItWorks />
                </div>
              </div>

              {/* Right Column - Field Selection */}
              <div className="pl-4">
                <FieldSelector onSelectField={actions.selectField} />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 animate-in fade-in slide-in-from-right-4 duration-500">
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
          )}
        </div>
      </div>
    </div>
  );
};

MockInterviewContainerComponent.displayName = "MockInterviewContainer";

export const MockInterviewContainer = memo(MockInterviewContainerComponent);
