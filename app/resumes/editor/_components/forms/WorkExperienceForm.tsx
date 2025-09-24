import { workSchema, WorkExperienceData } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Input, Textarea, Checkbox, DatePicker } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { EditorFormProps } from "@/lib/resume/types";
import { useEffect } from "react";

export default function WorkExperienceForm({ resumeData, setResumeData }: EditorFormProps) {
  const form = useForm<WorkExperienceData>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      jobTitle: resumeData.jobTitle || "",
      employer: resumeData.employer || "",
      startDate: resumeData.startDate || undefined,
      endDate: resumeData.endDate || undefined,
      isCurrentlyWorkingHere: resumeData.isCurrentlyWorkingHere || false,
      description: resumeData.description || "",
    },
  });

  useEffect(() => {
      const { unsubscribe } = form.watch(async (values) => {
        const isValid = await form.trigger();
        if (!isValid) return;
        setResumeData({ ...resumeData, ...values });
      });
      return unsubscribe;
    }, [form, resumeData, setResumeData]);
    
  // Function to count words in the description
  const getWordCount = (text: string): number => {
    if (!text || text.trim() === "") return 0;
    return text.trim().split(/\s+/).length;
  };
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Work Experience</h2>
        <p className="text-sm text-default-500">
          Start with your most recent job, then add as many work experiences as
          you like.
        </p>
      </div>

      <form className="space-y-3">
        <Input
          {...form.register("jobTitle")}
          label="Job Title"
          placeholder="Software Engineer"
          autoFocus
          isInvalid={!!form.formState.errors.jobTitle}
          errorMessage={form.formState.errors.jobTitle?.message}
        />

        <Input
          {...form.register("employer")}
          label="Employer"
          placeholder="Company Name"
          isInvalid={!!form.formState.errors.employer}
          errorMessage={form.formState.errors.employer?.message}
        />

        <div className="grid grid-cols-2 gap-3">
          <Controller
            control={form.control}
            name="startDate"
            render={({ field, fieldState }) => {
              let value = field.value;
              // Double check the implementation of DatePicker and CalendarDate when backend is complete
              if (!(value instanceof CalendarDate)) {
                value = undefined;
              }
              const handleChange = (val: unknown) => {
                if (val instanceof Date) {
                  field.onChange(
                    new CalendarDate(
                      val.getFullYear(),
                      val.getMonth() + 1,
                      val.getDate()
                    )
                  );
                } else {
                  field.onChange(val);
                }
              };
              return (
                <DatePicker
                  label="Start Date"
                  value={value}
                  onChange={handleChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              );
            }}
          />

          <Controller
            control={form.control}
            name="endDate"
            render={({ field, fieldState }) => {
              let value = field.value;
              // Double check the implementation of DatePicker and CalendarDate when backend is complete
              if (!(value instanceof CalendarDate)) {
                value = undefined;
              }
              const handleChange = (val: unknown) => {
                if (val instanceof Date) {
                  field.onChange(
                    new CalendarDate(
                      val.getFullYear(),
                      val.getMonth() + 1,
                      val.getDate()
                    )
                  );
                } else {
                  field.onChange(val);
                }
              };
              return (
                <DatePicker
                  label="End Date"
                  value={value}
                  onChange={handleChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  // Disables the End Date picker if "Currently working here" is checked
                  isDisabled={form.watch("isCurrentlyWorkingHere")}
                />
              );
            }}
          />
        </div>
        
        <Checkbox
          {...form.register("isCurrentlyWorkingHere")}
          isSelected={form.watch("isCurrentlyWorkingHere")}
          onValueChange={(value) => form.setValue("isCurrentlyWorkingHere", value)}
        >
          Currently working here?
        </Checkbox>

        <Textarea
          {...form.register("description")}
          label="Job Description"
          description={`${form.watch("description") ? `${getWordCount(form.watch("description") || "")} / 100 words` : "Maximum 100 words"}`}
          placeholder="Describe your key responsibilities and achievements..."
          minRows={4}
          isInvalid={!!form.formState.errors.description}
          errorMessage={form.formState.errors.description?.message}
        />
      </form>
    </div>
  );
}
