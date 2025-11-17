"use client";

import { Card, CardBody, Button, Chip } from "@heroui/react";
import { Lightbulb, Plus, Info } from "lucide-react";
import { useState } from "react";

interface AISuggestionsProps {
  title: string;
  subtitle: string;
  suggestions: string[];
  onApplySuggestion?: (suggestion: string) => void;
  className?: string;
  buttonType?: "apply" | "plus" | "addSummary";
}

export default function AISuggestions({
  title,
  subtitle,
  suggestions,
  onApplySuggestion,
  className = "",
  buttonType = "apply",
}: AISuggestionsProps) {
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(
    new Set(),
  );

  const handleApplySuggestion = (suggestion: string) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
      setAppliedSuggestions(
        (prev) => new Set([...Array.from(prev), suggestion]),
      );
    }
  };

  return (
    <Card className={`bg-amber-50 border-amber-200 ${className}`}>
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-amber-100 rounded-full">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-medium text-amber-900 flex items-center gap-2">
                {title}
              </h3>
              <p className="text-sm text-amber-700 mt-1">{subtitle}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  AI can make mistakes. Please review suggestions carefully.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200"
                >
                  <div className="flex-1">
                    <p className="text-sm text-amber-900">{suggestion}</p>
                  </div>

                  {onApplySuggestion && (
                    <div className="ml-3">
                      {buttonType !== "plus" &&
                      appliedSuggestions.has(suggestion) ? (
                        <Chip color="success" size="sm" variant="flat">
                          Applied
                        </Chip>
                      ) : (
                        <Button
                          className="text-xs bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700"
                          isIconOnly={buttonType === "plus"}
                          size="sm"
                          variant="flat"
                          onClick={() => handleApplySuggestion(suggestion)}
                        >
                          {buttonType === "plus" ? (
                            <Plus size={14} />
                          ) : buttonType === "addSummary" ? (
                            "Add Summary"
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
