"use client";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/react";
import { useRouter } from "next/navigation";

export function CoachMenu() {
  const router = useRouter();

  // List of fields for the coach menu
  const fields = [
    "Information Technology",
    "Arts & Design",
    "Business Management",
    "Communications",
    "Education",
    "Tourism & Hospitality",
    "General"
  ];

  // Mapping of field names to their corresponding slugs
  const fieldToSlug: Record<string, string> = {
    "Information Technology": "infotech",
    "Arts & Design": "arts",
    "Business Management": "bsman",
    Communications: "comms",
    Education: "educ",
    "Tourism & Hospitality": "tours",
    General: "general",
  };

  return (
    <div className="w-full h-full">
      <Card className="h-full flex flex-col p-6">
      <CardHeader className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-left self-start">Choose Your <span className="text-adult-green italic">Field</span></h1>
        <p className="text-gray-700 italic text-sm self-start text-left">Select a field to tailor your mock interview experience.</p>
      </CardHeader>
      <div className="px-6 m-2">
        <Divider />
        </div>
      <CardBody className="flex-1">
        <div className="flex flex-col gap-2 h-full">
          {fields.map((field, index) => (
            <button
              key={index}
              className="text-left cursor-pointer hover:bg-olivine/50 p-2 rounded border-1 border-gray-300 hover:border-black hover:border-1 transition-colors mt-1 p-5"
              // Navigate to the field-specific mock interview page - used fieldToSlug mapping
              onClick={() => {
                const slug = fieldToSlug[field];

                if (!slug) return;
                if (slug === "general") {
                  router.push(`/mock-interview/fields/general/general-interview`);
                } else {
                  router.push(`/mock-interview/fields/${slug}`);
                }
              }}
            >
              {field}
            </button>
          ))}
        </div>
      </CardBody>
    </Card>
    </div>
    
  );
}