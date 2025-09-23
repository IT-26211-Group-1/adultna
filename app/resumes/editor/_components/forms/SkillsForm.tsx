"use client";

import { Input, Textarea } from "@heroui/react";
import { SkillFormData, skillSchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";


export default function SkillsForm() {
  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skill: "",
    },
  });

  // Function to parse comma-separated skills into an array Ilalagay ito sa preview/frontend na currently
  // This will store it in the database as a string and display as array in the frontend
  const parseSkills = (skillsText: string): string[] => {
    return skillsText
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  };
  // Function to get skills count for display
  const getSkillsCount = (skillsText: string): number => {
    return parseSkills(skillsText).length;
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-default-500">
          Nice Work! You’re almost there. Best if you add 4-6 skills for the job you’re applying for..
        </p>
      </div>

      <form className="space-y-3">
        <Textarea
          {...form.register("skill")}
          label="Skills"
          placeholder="JavaScript, React, Node.js, Python, SQL, Git"
          description={`Enter skills separated by commas. ${form.watch("skill") ? `${getSkillsCount(form.watch("skill") || "")} skill(s) detected.` : ""}`}
          minRows={4}
          autoFocus
          isInvalid={!!form.formState.errors.skill}
          errorMessage={form.formState.errors.skill?.message}
        />

        {/* Checks the parseSkills function */}
        {/* {form.watch("skill") && (
          <div className="mt-4">
            <p className="text-sm font-medium text-default-700 mb-2">Preview:</p>
            <div className="flex flex-wrap gap-2">
              {parseSkills(form.watch("skill") || "").map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-100 text-primary-800 rounded-md text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )} */}
      </form>
    </div>
  );
}