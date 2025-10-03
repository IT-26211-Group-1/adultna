"use client";

import { Input, Textarea } from "@heroui/react";
import { SkillFormData, skillSchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { EditorFormProps } from "@/lib/resume/types";
import { useEffect, useState, useCallback, useMemo } from "react";

export default function SkillsForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const [skillsText, setSkillsText] = useState<string>(
    resumeData.skills?.join(", ") || ""
  );

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skills: resumeData.skills || [],
    },
  });

  // Memoized function to parse comma-separated skills into an array
  const parseSkills = useCallback((skillsText: string): string[] => {
    return skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
  }, []);

  // Memoized skills array - only recalculates when skillsText changes
  const skillsArray = useMemo(() => parseSkills(skillsText), [skillsText, parseSkills]);

  // Function to get skills count for display not rendered by default will finalize once the final UI is decided
  const getSkillsCount = useCallback((skillsText: string): number => {
    return parseSkills(skillsText).length;
  }, [parseSkills]);

  // Get custom error message for skills validation
  const getSkillsErrorMessage = useMemo(() => {
    const errors = form.formState.errors.skills;
    if (!errors) return undefined;
    
    if (Array.isArray(errors)) {
      const longSkills = skillsArray
        .map((skill, index) => errors[index] ? skill : null)
        .filter(Boolean);
      
      if (longSkills.length > 0) {
        return `These skills are too long: ${longSkills.join(", ")} (max 50 characters each)`;
      }
    }
    
    // Handle non-array errors
    if (typeof errors === 'object' && 'message' in errors) {
      return errors.message;
    }
    
    return "Invalid skills format";
  }, [form.formState.errors.skills, skillsArray]);

  // Update preview when skillsArray changes
  useEffect(() => {
    form.setValue("skills", skillsArray);
    // Trigger validation to update error state
    form.trigger("skills");
  }, [skillsArray, form]);

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        skills: values.skills?.filter((skill): skill is string => 
          skill !== undefined && skill.trim() !== ""
        ) || [],
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-default-500">
          Nice Work! You’re almost there. Best if you add 4-6 skills for the job
          you’re applying for..
        </p>
      </div>

      <form className="space-y-3">
        <Textarea
          label="Skills"
          placeholder="JavaScript, React, Node.js, Python, SQL, Git"
          description="Enter skills separated by commas."
          minRows={4}
          autoFocus
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          isInvalid={!!form.formState.errors.skills}
          errorMessage={getSkillsErrorMessage}
        />
      </form>
    </div>
  );
}
