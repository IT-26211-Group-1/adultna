"use client";

import { Card, CardBody, Progress } from "@heroui/react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface DetailField {
  label: string;
  status: "complete" | "incomplete" | "needs-improvement";
}

interface PersonalDetailsScoreProps {
  score: number;
  totalFields: number;
  needsImprovement: number;
  fields: DetailField[];
  className?: string;
}

export function PersonalDetailsScore({
  score,
  totalFields,
  needsImprovement,
  fields,
  className = "",
}: PersonalDetailsScoreProps) {
  const percentage = (score / totalFields) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "incomplete":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "needs-improvement":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`${className} flex-shrink-0`}>
      <CardBody className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Personal Details</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{score}</span>
            <span className="text-gray-500">/ {totalFields}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress
          value={percentage}
          color={percentage === 100 ? "success" : "default"}
          size="md"
          className="w-full"
        />

        {/* Status Text */}
        {needsImprovement > 0 && (
          <p className="text-sm text-gray-600">
            {needsImprovement} / {totalFields} - Fields Need Improvement
          </p>
        )}

        {/* Fields List */}
        <div className="space-y-2 pt-2">
          {fields.map((field, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{field.label}</span>
              {getStatusIcon(field.status)}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
