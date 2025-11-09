"use client";

import { Textarea } from "@heroui/react";
import { SkillFormData, skillSchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EditorFormProps } from "@/lib/resume/types";
import { useEffect, useState, useCallback, useMemo } from "react";
import AISuggestions from "../AISuggestions";
import { debounce } from "@/lib/utils/debounce";

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
  const skillsArray = useMemo(
    () => parseSkills(skillsText),
    [skillsText, parseSkills]
  );

  // Test lang for the design
  const aiSuggestedSkills: string[] = ["JavaScript", "React", "Node.js"];

  const handleApplySkill = (skill: string) => {
    const currentSkills = skillsText.trim();
    const newSkillsText = currentSkills ? `${currentSkills}, ${skill}` : skill;

    setSkillsText(newSkillsText);
  };

  // Update preview when skillsArray changes
  useEffect(() => {
    form.setValue("skills", skillsArray);
  }, [skillsArray, form]);

  const syncFormData = useCallback(async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const values = form.getValues();
      setResumeData({
        ...resumeData,
        skills:
          values.skills?.filter(
            (skill): skill is string =>
              skill !== undefined && skill.trim() !== ""
          ) || [],
      });
    }
  }, [form, resumeData, setResumeData]);

  const debouncedSync = useMemo(
    () => debounce(syncFormData, 500),
    [syncFormData]
  );

  useEffect(() => {
    const { unsubscribe } = form.watch(() => {
      debouncedSync();
    });

    return unsubscribe;
  }, [form, debouncedSync]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-default-500">
          Nice Work! You’re almost there. Best if you add 4-6 skills for the job
          you’re applying for..
        </p>
      </div>

      <form className="space-y-6">
        <Textarea
          description="Enter skills separated by commas."
          errorMessage={form.formState.errors.skills?.message}
          isInvalid={!!form.formState.errors.skills}
          label="Skills"
          minRows={4}
          placeholder="JavaScript, React, Node.js, Python, SQL, Git"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
        />

        {/* TODO: Backend Developer - Only show AISuggestions when aiSuggestedSkills has data */}
        {aiSuggestedSkills.length > 0 && (
          <AISuggestions
            subtitle="Our AI is here to help, but your final resume is up to you — review before submitting!"
            suggestions={aiSuggestedSkills}
            title="AI Recommendations for Juan Miguel's Skills"
            onApplySuggestion={handleApplySkill}
          />
        )}
      </form>
    </div>
  );
}
