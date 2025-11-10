"use client";

import { Button, Input } from "@heroui/react";
import { SkillFormData, skillSchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EditorFormProps } from "@/lib/resume/types";
import { useEffect, useState, useCallback, useMemo } from "react";
import AISuggestions from "../AISuggestions";
import { debounce } from "@/lib/utils/debounce";
import ProficiencyRating from "../ProficiencyRating";
import { Plus, Trash2 } from "lucide-react";
import { Skill } from "@/types/resume";

export default function SkillsForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const [skills, setSkills] = useState<Skill[]>(resumeData.skills || []);

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skills: resumeData.skills || [],
    },
  });

  const aiSuggestedSkills: string[] = ["JavaScript", "React", "Node.js"];

  const handleAddSkill = () => {
    const newSkill: Skill = {
      skill: "",
      proficiency: 0,
      order: skills.length,
    };

    setSkills([...skills, newSkill]);
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);

    setSkills(updatedSkills);
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...skills];

    updatedSkills[index] = {
      ...updatedSkills[index],
      skill: value,
    };
    setSkills(updatedSkills);
  };

  const handleProficiencyChange = (index: number, value: number) => {
    const updatedSkills = [...skills];

    updatedSkills[index] = {
      ...updatedSkills[index],
      proficiency: value || 0,
    };
    setSkills(updatedSkills);
  };

  const handleApplySkill = (skill: string) => {
    const newSkill: Skill = {
      skill,
      proficiency: 0,
      order: skills.length,
    };

    setSkills([...skills, newSkill]);
  };

  useEffect(() => {
    form.setValue("skills", skills);
  }, [skills, form]);

  const syncFormData = useCallback(async () => {
    const isValid = await form.trigger();

    if (isValid) {
      const values = form.getValues();

      setResumeData({
        ...resumeData,
        skills:
          values.skills?.filter(
            (skill) => skill && skill.skill && skill.skill.trim() !== "",
          ) || [],
      });
    }
  }, [form, resumeData, setResumeData]);

  const debouncedSync = useMemo(
    () => debounce(syncFormData, 300),
    [syncFormData],
  );

  useEffect(() => {
    const { unsubscribe } = form.watch(() => {
      debouncedSync();
    });

    return unsubscribe;
  }, [form, debouncedSync]);

  useEffect(() => {
    if (resumeData.skills && resumeData.skills.length > 0) {
      const skillsData = resumeData.skills;
      setSkills(skillsData);
      form.reset({
        skills: skillsData,
      });
    }
  }, [resumeData, form]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-default-500">
          Nice Work! You're almost there. Best if you add 4-6 skills for the job
          you're applying for.
        </p>
      </div>

      <form className="space-y-6">
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  errorMessage={
                    form.formState.errors.skills?.[index]?.skill?.message
                  }
                  isInvalid={!!form.formState.errors.skills?.[index]?.skill}
                  label={`Skill ${index + 1}`}
                  placeholder="e.g., JavaScript, React, Python"
                  value={skill.skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1 items-center">
                <span className="text-xs text-default-500">Proficiency</span>
                <ProficiencyRating
                  color={resumeData.colorHex || "#7c3aed"}
                  value={skill.proficiency || 0}
                  onChange={(value) => handleProficiencyChange(index, value)}
                />
              </div>
              <Button
                isIconOnly
                aria-label="Remove skill"
                color="danger"
                size="sm"
                variant="light"
                onPress={() => handleRemoveSkill(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button
            className="w-full"
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            variant="bordered"
            onPress={handleAddSkill}
          >
            Add Skill
          </Button>
        </div>

        <div className="text-xs text-default-500 bg-default-100 p-3 rounded-lg">
          <p className="font-medium mb-1">Tip:</p>
          <p>
            Proficiency ratings are optional and will be displayed as visual
            bars in the Hybrid template. Leave them at 0 if you prefer not to
            show proficiency levels.
          </p>
        </div>

        {aiSuggestedSkills.length > 0 && (
          <AISuggestions
            subtitle="Our AI is here to help, but your final resume is up to you — review before submitting!"
            suggestions={aiSuggestedSkills}
            title="AI Recommendations for Skills"
            onApplySuggestion={handleApplySkill}
          />
        )}
      </form>
    </div>
  );
}
