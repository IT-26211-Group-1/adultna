"use client";

import { Button, Input } from "@heroui/react";
import { SkillFormData, skillSchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EditorFormProps } from "@/lib/resume/types";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import AISuggestions from "../AISuggestions";
import { debounce } from "@/lib/utils/debounce";
import ProficiencyRating from "../ProficiencyRating";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { Skill } from "@/types/resume";
import { useGenerateSkillsSuggestions } from "@/hooks/queries/useAIQueries";
import { addToast } from "@heroui/toast";

export default function SkillsForm({
  resumeData,
  setResumeData,
  onValidationChange,
}: EditorFormProps) {
  const previousDataRef = useRef<string>("");
  const [skills, setSkills] = useState<Skill[]>(resumeData.skills || []);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skills: resumeData.skills || [],
    },
  });

  const generateSkillsSuggestions = useGenerateSkillsSuggestions(
    resumeData.id || "",
  );

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

  const handleGenerateAISuggestions = async () => {
    if (
      !resumeData.jobPosition &&
      (!resumeData.workExperiences || resumeData.workExperiences.length === 0)
    ) {
      addToast({
        title: "Missing information",
        description:
          "Please add a job position or work experience before generating skill suggestions",
        color: "warning",
      });

      return;
    }

    setIsGeneratingAI(true);

    try {
      const suggestions = await generateSkillsSuggestions.mutateAsync({
        jobPosition: resumeData.jobPosition,
        workExperiences: resumeData.workExperiences?.map((exp) => ({
          jobTitle: exp.jobTitle,
          employer: exp.employer,
          description: exp.description,
        })),
        educationItems: resumeData.educationItems?.map((edu) => ({
          degree: edu.degree,
          institution: edu.schoolName,
          fieldOfStudy: edu.fieldOfStudy,
        })),
        existingSkills: skills.map((s) => s.skill).filter(Boolean),
      });

      setAiSuggestions(suggestions);

      addToast({
        title: "AI suggestions generated",
        description: "Click + to add skills to your resume",
        color: "success",
      });
    } catch (error: any) {
      if (error?.message?.includes("RATE_LIMIT_EXCEEDED")) {
        addToast({
          title: "Too many requests",
          description: "Please try again in a moment.",
          color: "warning",
        });
      } else {
        addToast({
          title: "Failed to generate suggestions",
          description: "Please try again",
          color: "danger",
        });
      }
    } finally {
      setIsGeneratingAI(false);
    }
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
    if (onValidationChange) {
      const hasAtLeastOneValidSkill = !!(
        skills && skills.some((skill) => skill.skill?.trim())
      );
      const hasNoErrors = Object.keys(form.formState.errors).length === 0;
      const isValid = hasAtLeastOneValidSkill && hasNoErrors;

      onValidationChange(isValid);
    }
  }, [form.formState.errors, skills, onValidationChange]);

  useEffect(() => {
    if (resumeData.skills && resumeData.skills.length > 0) {
      const currentData = JSON.stringify(resumeData.skills);

      if (previousDataRef.current !== currentData) {
        const skillsData = resumeData.skills;

        setSkills(skillsData);
        form.reset({
          skills: skillsData,
        });
        previousDataRef.current = currentData;
      }
    }
  }, [resumeData.skills, form]);

  return (
    <div className="mx-auto max-w-xl space-y-3">
      <div className="space-y-1 text-center mb-6">
        <h2 className="text-xl font-semibold">Skills</h2>
        <p className="text-xs text-default-500">
          Nice Work! You&apos;re almost there. Best if you add 4-6 skills for
          the job you&apos;re applying for.
        </p>
      </div>

      <form className="space-y-3">
        <div className="flex justify-center">
          <Button
            color="success"
            isLoading={isGeneratingAI}
            size="sm"
            startContent={isGeneratingAI ? null : <Sparkles size={16} />}
            type="button"
            variant="flat"
            onPress={handleGenerateAISuggestions}
          >
            {isGeneratingAI ? "Generating..." : "Get AI Suggestions"}
          </Button>
        </div>

        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  isRequired
                  errorMessage={
                    form.formState.errors.skills?.[index]?.skill?.message
                  }
                  isInvalid={!!form.formState.errors.skills?.[index]?.skill}
                  label={`Skill ${index + 1}`}
                  placeholder="e.g., JavaScript, React, Python"
                  size="sm"
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
            startContent={<Plus className="w-3 h-3" />}
            variant="bordered"
            size="sm"
            onPress={handleAddSkill}
          >
            <span className="text-xs">Add Skill</span>
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

        {aiSuggestions.length > 0 && (
          <AISuggestions
            buttonType="plus"
            subtitle="Our AI is here to help, but your final resume is up to you — review before submitting!"
            suggestions={aiSuggestions}
            title="AI Recommendations for Skills"
            onApplySuggestion={handleApplySkill}
          />
        )}
      </form>
    </div>
  );
}
