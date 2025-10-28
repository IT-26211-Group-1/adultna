import React from "react";

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Choose a Field",
      description: "Select an industry you're preparing for.",
    },
    {
      number: 2,
      title: "Select your Role",
      description:
        "Choose a job position so we can tailor the questions for you.",
    },
    {
      number: 3,
      title: "Review Interview Guidelines",
      description: "Before you begin, we'll show tips and a practice question.",
    },
    {
      number: 4,
      title: "Start Your Mock Interview",
      description: "Enable your mic or use your keyboard to answer questions.",
    },
    {
      number: 5,
      title: "Track Your Progress",
      description: "Check your performance and identify areas to improve.",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">How it Works</h2>
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.number} className="space-y-1">
            <h3 className="font-medium text-gray-900">
              Step {step.number}: {step.title}
            </h3>
            <ul className="list-disc list-inside ml-2">
              <li className="text-sm text-gray-600">{step.description}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
