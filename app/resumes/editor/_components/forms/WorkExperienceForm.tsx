import { workSchema, WorkExperienceData } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Input, Textarea, Checkbox, DatePicker, Button } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { EditorFormProps } from "@/lib/resume/types";
import { useEffect } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";

export default function WorkExperienceForm({ resumeData, setResumeData }: EditorFormProps) {
  const form = useForm<WorkExperienceData>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      workExperiences: resumeData.workExperiences || [{ 
        jobTitle: "", 
        employer: "", 
        startDate: undefined, 
        endDate: undefined, 
        isCurrentlyWorkingHere: false, 
        description: "" 
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        workExperiences: values.workExperiences?.filter((exp) => exp && exp.jobTitle && exp.jobTitle.trim() !== "") as any[] || [],
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);
    
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
      description: "" 
    });
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Work Experience</h2>
        <p className="text-sm text-default-500">
          Start with your most recent job, then add as many work experiences as you like.
        </p>
      </div>

      <form className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-3 p-4 border border-default-200 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Work Experience {index + 1}</h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="danger"
                  onClick={() => remove(index)}
                >
                  <TrashIcon size={16} />
                </Button>
              )}
            </div>

            <Input
              {...form.register(`workExperiences.${index}.jobTitle`)}
              label="Job Title"
              placeholder="Software Engineer"
              isInvalid={!!form.formState.errors.workExperiences?.[index]?.jobTitle}
              errorMessage={form.formState.errors.workExperiences?.[index]?.jobTitle?.message}
            />

            <Input
              {...form.register(`workExperiences.${index}.employer`)}
              label="Employer"
              placeholder="Company Name"
              isInvalid={!!form.formState.errors.workExperiences?.[index]?.employer}
              errorMessage={form.formState.errors.workExperiences?.[index]?.employer?.message}
            />

            <div className="grid grid-cols-2 gap-3">
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
                      isDisabled={form.watch(`workExperiences.${index}.isCurrentlyWorkingHere`)}
                    />
                  );
                }}
              />
            </div>
            
            <Checkbox
              {...form.register(`workExperiences.${index}.isCurrentlyWorkingHere`)}
              isSelected={form.watch(`workExperiences.${index}.isCurrentlyWorkingHere`)}
              onValueChange={(value) => form.setValue(`workExperiences.${index}.isCurrentlyWorkingHere`, value)}
            >
              Currently working here?
            </Checkbox>

            <Textarea
              {...form.register(`workExperiences.${index}.description`)}
              label="Job Description"
              description={`${form.watch(`workExperiences.${index}.description`) ? `${getWordCount(form.watch(`workExperiences.${index}.description`) || "")} / 100 words` : "Maximum 100 words"}`}
              placeholder="Describe your key responsibilities and achievements..."
              minRows={4}
              isInvalid={!!form.formState.errors.workExperiences?.[index]?.description}
              errorMessage={form.formState.errors.workExperiences?.[index]?.description?.message}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="flat"
          color="primary"
          onClick={addWorkExperience}
          startContent={<PlusIcon size={16} />}
          fullWidth
        >
          Add Another Work Experience
        </Button>
      </form>
    </div>
  );
}
