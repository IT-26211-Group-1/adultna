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
    <div className="flex justify-center overflow-x-auto px-4 sm:px-0">
      <Breadcrumbs
        className="whitespace-nowrap"
        onAction={(key) => setCurrentStep(key as string)}
      >
        {steps.map((step) => (
          <BreadcrumbItem key={step.key} isCurrent={step.key === currentStep}>
            <span className="text-xs sm:text-sm">{step.title}</span>
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
}
