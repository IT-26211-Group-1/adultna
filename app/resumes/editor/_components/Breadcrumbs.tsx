"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { steps } from "./steps";

interface BreadcrumbsProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
}

export default function HeroBreadcrumbs({
  currentStep,
  setCurrentStep,
}: BreadcrumbsProps) {
  return (
    <div className="flex justify-center">
      <Breadcrumbs onAction={(key) => setCurrentStep(key as string)}>
        {steps.map((step) => (
          <BreadcrumbItem
            key={step.key}
            isCurrent={step.key === currentStep}
          >
            {step.title}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
}
