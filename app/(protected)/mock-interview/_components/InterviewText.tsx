import {Card, CardHeader, CardBody} from "@heroui/card";
import { Divider } from "@heroui/react";

export function InterviewText() {
  const steps = [
    "Choose A Field",
    "Select Your Role",
    "Review Interview Guidelines",
    "Start Your Mock Interview",
    "Track Your Progress",
  ];

  const instructions = [
    "Select an industry you're preparing for.",
    "Choose a job position so we can tailor the interview questions accordingly.",
    "Before you begin, we'll show tips and a practice question to get you ready.",
    "Enable your microphone or use your keyboard to answer questions.",
    "Check your performance and identify areas for improvement after each interview.",
  ];

  return (
    <div className="w-full h-full">
      <Card className="h-full flex flex-col p-6">
      <CardHeader className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold">Practice Job Interviews with <span className="text-ultra-violet/70 italic">Confidence</span></h1>
        <p className="text-gray-700 italic text-sm self-start text-left">Your safe space to prepare for job interviews and first impressions.</p>
      </CardHeader>
      <div className="px-6">
        <Divider />
      </div>
      <CardBody className="flex-1">
        <h2 className="text-2xl font-semibold my-3">How it Works</h2>
        <ol className="list-decimal list-inside my-2 space-y-4">
          {steps.map((step, index) => (
            <li key={index} className="text-lg">
              <span className="font-medium text-xl text-adult-green/70">{step}</span>
              {instructions[index] && (
                <p className="text-base text-gray-700 ml-5">
                  {instructions[index]}
                </p>
              )}
            </li>
          ))}
        </ol>
      </CardBody>
    </Card>
    </div>
  );
}