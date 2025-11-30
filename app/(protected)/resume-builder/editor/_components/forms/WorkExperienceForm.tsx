import {
  workSchema,
  WorkExperienceData,
  ResumeData,
} from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  Controller,
  useFieldArray,
  UseFormReturn,
} from "react-hook-form";
import { Input, Textarea, Checkbox, DatePicker, Button } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { EditorFormProps } from "@/lib/resume/types";
import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import { PlusIcon, TrashIcon, GripHorizontal, Sparkles } from "lucide-react";
import { debounce } from "@/lib/utils/debounce";
import { useGenerateWorkDescriptionSuggestions } from "@/hooks/queries/useAIQueries";
import { addToast } from "@heroui/toast";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import AISuggestions from "../AISuggestions";

export default function WorkExperienceForm({
  resumeData,
  setResumeData,
  onValidationChange,
}: EditorFormProps) {
  const isSyncingRef = useRef(false);
  const previousDataRef = useRef<string>("");

  const form = useForm<WorkExperienceData>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      workExperiences: resumeData.workExperiences || [
        {
          jobTitle: "",
          employer: "",
          startDate: undefined,
          endDate: undefined,
          isCurrentlyWorkingHere: false,
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      move(oldIndex, newIndex);
    }
  }

  const syncFormData = useCallback(async () => {
    const isValid = await form.trigger();

    if (isValid) {
      isSyncingRef.current = true;
      const values = form.getValues();

      setResumeData({
        ...resumeData,
        workExperiences:
          (values.workExperiences?.filter(
            (exp) => exp && exp.jobTitle && exp.jobTitle.trim() !== "",
          ) as any[]) || [],
      });

      setTimeout(() => {
        isSyncingRef.current = false;
      }, 100);
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
      const values = form.getValues();
      const hasAtLeastOneValidExperience = !!(
        values.workExperiences &&
        values.workExperiences.some(
          (exp) =>
            exp.jobTitle?.trim() &&
            exp.employer?.trim() &&
            exp.startDate &&
            exp.description?.trim(),
        )
      );
      const hasNoErrors = Object.keys(form.formState.errors).length === 0;
      const isValid = hasAtLeastOneValidExperience && hasNoErrors;

      onValidationChange(isValid);
    }
  }, [form.formState.errors, form, onValidationChange]);

  useEffect(() => {
    if (
      !isSyncingRef.current &&
      resumeData.workExperiences &&
      resumeData.workExperiences.length > 0
    ) {
      const currentData = JSON.stringify(resumeData.workExperiences);

      if (previousDataRef.current !== currentData) {
        form.reset({
          workExperiences: resumeData.workExperiences.map((exp) => ({
            ...exp,
            startDate:
              exp.startDate instanceof Date
                ? new CalendarDate(
                    exp.startDate.getFullYear(),
                    exp.startDate.getMonth() + 1,
                    exp.startDate.getDate(),
                  )
                : exp.startDate,
            endDate:
              exp.endDate instanceof Date
                ? new CalendarDate(
                    exp.endDate.getFullYear(),
                    exp.endDate.getMonth() + 1,
                    exp.endDate.getDate(),
                  )
                : exp.endDate,
          })) as any,
        });
        previousDataRef.current = currentData;
      }
    }
  }, [resumeData.workExperiences, form]);

  // Function to count words in the description
  const getWordCount = (text: string): number => {
    if (!text || text.trim() === "") return 0;

    return text.trim().split(/\s+/).length;
  };

  const addWorkExperience = () => {
    append({
      jobTitle: "",
      employer: "",
      startDate: undefined,
      endDate: undefined,
      isCurrentlyWorkingHere: false,
      description: "",
    });
  };

  const [aiSuggestionsMap, setAiSuggestionsMap] = useState<
    Record<number, string[]>
  >({});
  const [loadingIndexes, setLoadingIndexes] = useState<Set<number>>(new Set());

  const generateAISuggestions = useGenerateWorkDescriptionSuggestions(
    resumeData.id || "",
  );

  const handleGenerateSuggestions = async (workExpIndex: number) => {
    const workExp = form.watch(`workExperiences.${workExpIndex}`);

    if (!workExp) {
      return;
    }

    const currentDescription = workExp.description?.trim();

    if (!currentDescription && !workExp.jobTitle && !workExp.employer) {
      addToast({
        title: "Missing information",
        description:
          "Please add a job title or employer before generating suggestions",
        color: "warning",
      });

      return;
    }

    setLoadingIndexes((prev) => new Set(prev).add(workExpIndex));

    try {
      const suggestions = await generateAISuggestions.mutateAsync({
        jobTitle: workExp.jobTitle,
        employer: workExp.employer,
        startDate: workExp.startDate,
        endDate: workExp.endDate,
        isCurrentlyWorkingHere: workExp.isCurrentlyWorkingHere,
        existingDescription: currentDescription || undefined,
      });

      setAiSuggestionsMap((prev) => ({
        ...prev,
        [workExpIndex]: suggestions,
      }));

      addToast({
        title: "AI suggestions generated",
        description: "Click + to add suggestions",
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
      setLoadingIndexes((prev) => {
        const newSet = new Set(prev);

        newSet.delete(workExpIndex);

        return newSet;
      });
    }
  };

  const handleApplyDescription = (
    description: string,
    currentIndex: number,
  ) => {
    const currentDescription =
      form.watch(`workExperiences.${currentIndex}.description`) || "";
    const newDescription = currentDescription.trim()
      ? `${currentDescription}\n${description}`
      : description;

    form.setValue(
      `workExperiences.${currentIndex}.description`,
      newDescription,
      { shouldValidate: true, shouldDirty: true, shouldTouch: true },
    );
  };

  return (
    <div className="mx-auto max-w-xl space-y-3">
      <div className="space-y-1 text-center mb-6">
        <h2 className="text-xl font-semibold">Work Experience</h2>
        <p className="text-xs text-default-500">
          Start with your most recent job, then add as many work experiences as
          you like.
        </p>
      </div>

      <form className="space-y-3">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field, index) => (
              <WorkExperienceItem
                key={field.id}
                aiSuggestions={aiSuggestionsMap[index] || []}
                form={form}
                getWordCount={getWordCount}
                id={field.id}
                index={index}
                isGeneratingAI={loadingIndexes.has(index)}
                remove={remove}
                resumeData={resumeData}
                onApplyDescription={handleApplyDescription}
                onGenerateAI={handleGenerateSuggestions}
              />
            ))}
          </SortableContext>
        </DndContext>

        <div className="flex justify-center">
          <Button
            color="primary"
            startContent={<PlusIcon size={14} />}
            type="button"
            variant="flat"
            size="sm"
            onClick={addWorkExperience}
          >
            <span className="text-xs">Add Another Work Experience</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

interface WorkExperienceItemProps {
  id: string;
  form: UseFormReturn<WorkExperienceData>;
  index: number;
  remove: (index: number) => void;
  getWordCount: (text: string) => number;
  aiSuggestions: string[];
  isGeneratingAI: boolean;
  resumeData: ResumeData;
  onApplyDescription: (description: string, index: number) => void;
  onGenerateAI: (index: number) => void;
}

function WorkExperienceItem({
  id,
  form,
  index,
  remove,
  getWordCount,
  aiSuggestions,
  isGeneratingAI,
  resumeData,
  onApplyDescription,
  onGenerateAI,
}: WorkExperienceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "space-y-2 p-4 bg-white rounded-lg shadow-sm border border-gray-100",
        isDragging && "relative z-50 cursor-grab shadow-xl opacity-50",
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium mb-4">Work Experience {index + 1}</h3>
        <div className="flex items-center gap-2">
          <GripHorizontal
            className="size-3.5 cursor-grab text-default-400 hover:text-default-600 focus:outline-none"
            {...attributes}
            {...listeners}
          />
          <Button
            isIconOnly
            color="danger"
            size="sm"
            type="button"
            variant="flat"
            onClick={() => remove(index)}
          >
            <TrashIcon size={12} />
          </Button>
        </div>
      </div>

      <Input
        {...form.register(`workExperiences.${index}.jobTitle`)}
        isRequired
        errorMessage={
          form.formState.errors.workExperiences?.[index]?.jobTitle?.message
        }
        isInvalid={!!form.formState.errors.workExperiences?.[index]?.jobTitle}
        label="Job Title"
        placeholder="Software Engineer"
        size="sm"
      />

      <Input
        {...form.register(`workExperiences.${index}.employer`)}
        isRequired
        errorMessage={
          form.formState.errors.workExperiences?.[index]?.employer?.message
        }
        isInvalid={!!form.formState.errors.workExperiences?.[index]?.employer}
        label="Employer"
        placeholder="Company Name"
        size="sm"
      />

      <div className="grid grid-cols-2 gap-2">
        <Controller
          control={form.control}
          name={`workExperiences.${index}.startDate`}
          render={({ field, fieldState }) => {
            let value = field.value;

            if (!(value instanceof CalendarDate)) {
              value = undefined;
            }
            const handleChange = (val: unknown) => {
              if (val instanceof Date) {
                field.onChange(
                  new CalendarDate(
                    val.getFullYear(),
                    val.getMonth() + 1,
                    val.getDate(),
                  ),
                );
              } else {
                field.onChange(val);
              }
            };

            return (
              <DatePicker
                isRequired
                errorMessage={fieldState.error?.message}
                isInvalid={!!fieldState.error}
                label="Start Date"
                value={value}
                onBlur={field.onBlur}
                onChange={handleChange}
                size="sm"
              />
            );
          }}
        />

        <Controller
          control={form.control}
          name={`workExperiences.${index}.endDate`}
          render={({ field, fieldState }) => {
            let value = field.value;

            if (!(value instanceof CalendarDate)) {
              value = undefined;
            }
            const handleChange = (val: unknown) => {
              if (val instanceof Date) {
                field.onChange(
                  new CalendarDate(
                    val.getFullYear(),
                    val.getMonth() + 1,
                    val.getDate(),
                  ),
                );
              } else {
                field.onChange(val);
              }
            };

            return (
              <DatePicker
                errorMessage={fieldState.error?.message}
                isDisabled={form.watch(
                  `workExperiences.${index}.isCurrentlyWorkingHere`,
                )}
                isInvalid={!!fieldState.error}
                label="End Date"
                value={value}
                onBlur={field.onBlur}
                onChange={handleChange}
                size="sm"
              />
            );
          }}
        />
      </div>

      <Checkbox
        {...form.register(`workExperiences.${index}.isCurrentlyWorkingHere`)}
        isSelected={form.watch(
          `workExperiences.${index}.isCurrentlyWorkingHere`,
        )}
        onValueChange={(value) =>
          form.setValue(
            `workExperiences.${index}.isCurrentlyWorkingHere`,
            value,
          )
        }
        size="sm"
      >
        <span className="text-xs">Currently working here?</span>
      </Checkbox>

      <div className="space-y-1 mt-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium">
            Job Description <span className="text-danger">*</span>
          </span>
          <Button
            color="success"
            isLoading={isGeneratingAI}
            size="sm"
            startContent={isGeneratingAI ? null : <Sparkles size={12} />}
            type="button"
            variant="flat"
            onClick={() => onGenerateAI(index)}
          >
            <span className="text-xs">{isGeneratingAI ? "Generating..." : "Get AI Suggestions"}</span>
          </Button>
        </div>
        <Controller
          control={form.control}
          name={`workExperiences.${index}.description`}
          render={({ field, fieldState }) => (
            <Textarea
              description={`${field.value ? `${getWordCount(field.value || "")} / 100 words` : "Maximum 100 words"}`}
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
              minRows={2}
              placeholder="Describe your key responsibilities and achievements..."
              value={field.value || ""}
              onBlur={field.onBlur}
              onChange={field.onChange}
              size="sm"
            />
          )}
        />
      </div>

      {/* Only show AISuggestions when aiSuggestions has data */}
      {aiSuggestions.length > 0 && (
        <AISuggestions
          buttonType="plus"
          className="mt-3"
          subtitle="Our AI is here to help, but your final resume is up to you — review before submitting!"
          suggestions={aiSuggestions}
          title={
            `AI Recommendations for ${resumeData.firstName || ""} ${resumeData.lastName || ""}`.trim() +
            "'s Work Description"
          }
          onApplySuggestion={(suggestion: string) =>
            onApplyDescription(suggestion, index)
          }
        />
      )}
    </div>
  );
}
