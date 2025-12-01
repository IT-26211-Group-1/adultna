import { memo } from "react";
import { Card, CardBody } from "@heroui/react";

type ScoreMetric = {
  label: string;
  score: number;
  description: string;
  color: string;
};

type StarMetricCardsProps = {
  starCompleteness: number;
  actionSpecificity: number;
  resultQuantification: number;
  relevanceToRole: number;
  deliveryFluency: number;
};

const StarMetricCardsComponent = ({
  starCompleteness,
  actionSpecificity,
  resultQuantification,
  relevanceToRole,
  deliveryFluency,
}: StarMetricCardsProps) => {
  const metrics: ScoreMetric[] = [
    {
      label: "STAR Completeness",
      score: starCompleteness,
      description: "How well you structured your answer",
      color: "bg-blue-500",
    },
    {
      label: "Action Specificity",
      score: actionSpecificity,
      description: "Detail and clarity of actions taken",
      color: "bg-purple-500",
    },
    {
      label: "Result Quantification",
      score: resultQuantification,
      description: "Measurable outcomes provided",
      color: "bg-green-500",
    },
    {
      label: "Role Relevance",
      score: relevanceToRole,
      description: "Alignment with job requirements",
      color: "bg-orange-500",
    },
    {
      label: "Delivery Fluency",
      score: deliveryFluency,
      description: "Communication clarity and flow",
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Performance Metrics
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="bg-gray-50 shadow-none">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {metric.label}
                </h4>
                <span className="text-2xl font-bold text-gray-900">
                  {metric.score.toFixed(1)}
                  <span className="text-sm text-gray-500">/5</span>
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-3">{metric.description}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${metric.color}`}
                  style={{ width: `${(metric.score / 5) * 100}%` }}
                />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

const StarMetricCards = memo(StarMetricCardsComponent);

export default StarMetricCards;
