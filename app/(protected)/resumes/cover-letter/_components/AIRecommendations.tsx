"use client";

import { Card, CardBody, Button, Chip } from "@heroui/react";
import { Lightbulb } from "lucide-react";
import { useState } from "react";

interface AIRecommendation {
  title: string;
  description: string;
  content: string;
}

interface AIRecommendationsProps {
  onApplyRecommendation?: (content: string) => void;
}

export function AIRecommendations({ onApplyRecommendation }: AIRecommendationsProps) {
  const [appliedRecommendations, setAppliedRecommendations] = useState<Set<number>>(
    new Set()
  );

  const recommendations: AIRecommendation[] = [
    {
      title: "Highlight Quantifiable Achievements",
      description:
        "Include specific metrics from your resume to demonstrate impact",
      content: "In my previous role, I increased sales by 35% and managed a team of 12 professionals, resulting in a 20% improvement in project delivery time.",
    },
    {
      title: "Match Job Requirements",
      description:
        "Align your cover letter with the specific job posting requirements",
      content: "My experience in project management, combined with my proficiency in Agile methodologies and stakeholder communication, directly aligns with the requirements outlined in your job posting.",
    },
    {
      title: "Showcase Relevant Skills",
      description: "Emphasize skills that match the job description",
      content: "I bring strong expertise in data analysis, Python programming, and machine learning, which I have successfully applied to drive business insights and optimize operational efficiency.",
    },
    {
      title: "Demonstrate Cultural Fit",
      description:
        "Research company values that align with your experience",
      content: "I am particularly drawn to your company's commitment to innovation and sustainability, values that resonate with my professional philosophy and past initiatives in green technology.",
    },
  ];

  const handleApplyRecommendation = (index: number, content: string) => {
    if (onApplyRecommendation) {
      onApplyRecommendation(content);
      setAppliedRecommendations(prev => new Set([...Array.from(prev), index]));
    }
  };

  return (
    <Card className="bg-stone-50 border-gray-200 flex-shrink-0">
      <CardBody className="p-3">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 p-1.5 bg-stone-100 rounded-full">
            <Lightbulb className="w-4 h-4 text-amber-600" />
          </div>
          
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-medium text-stone-900 flex items-center gap-2 text-sm">
                AI Recommendations
              </h3>
              <p className="text-xs text-stone-700 mt-0.5">
                Based on your resume analysis
              </p>
            </div>

            <div className="space-y-1.5">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-2 bg-white rounded-lg border border-gray-300"
                >
                  <div className="flex-1 pr-2">
                    <h4 className="font-medium text-black-900 text-xs mb-0.5">
                      {rec.title}
                    </h4>
                    <p className="text-[10px] text-black-700 leading-tight">{rec.description}</p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {appliedRecommendations.has(index) ? (
                      <Chip size="sm" color="success" variant="flat" className="text-[10px] h-5">
                        Applied
                      </Chip>
                    ) : (
                      <Button
                        size="sm"
                        variant="flat"
                        onClick={() => handleApplyRecommendation(index, rec.content)}
                        className="text-[10px] h-6 px-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700"
                      >
                        Apply
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
