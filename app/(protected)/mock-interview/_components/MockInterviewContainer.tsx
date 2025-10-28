"use client";

import React, { useState } from "react";
import { HowItWorks } from "./HowItWorks";
import { FieldSelector } from "./FieldSelector";

export function MockInterviewContainer() {
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleSelectField = (fieldId: string) => {
    setSelectedField(fieldId);
    // TODO: Navigate to next step or update UI
    console.log("Selected field:", fieldId);
  };

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
      </div>
    </div>
  );
}
