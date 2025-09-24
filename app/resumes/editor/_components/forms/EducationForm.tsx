"use client";

import { Input, Select, SelectItem } from "@heroui/react";
import { EducationFormData, educationSchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CalendarDate } from "@internationalized/date";
import { EditorFormProps } from "@/lib/resume/types";
import { useEffect } from "react";

export default function EducationForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      schoolName: resumeData.schoolName || "",
      schoolLocation: resumeData.schoolLocation || "",
      degree: resumeData.degree || "",
      fieldOfStudy: resumeData.fieldOfStudy || "",
      graduationDate: resumeData.graduationDate || undefined,
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

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Education</h2>
        <p className="text-sm text-default-500">
          Where did you attend college or university? Don’t worry! You can still
          add, edit, or delete your education summary.
        </p>
      </div>

      <form className="space-y-3">
        <Input
          {...form.register("schoolName")}
          label="School Name"
          placeholder="University of the Philippines"
          autoFocus
          isInvalid={!!form.formState.errors.schoolName}
          errorMessage={form.formState.errors.schoolName?.message}
        />

        <Input
          {...form.register("schoolLocation")}
          label="School Location"
          placeholder="Quezon City, Philippines"
          isInvalid={!!form.formState.errors.schoolLocation}
          errorMessage={form.formState.errors.schoolLocation?.message}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            {...form.register("degree")}
            label="Degree"
            placeholder="Bachelor of Science"
            isInvalid={!!form.formState.errors.degree}
            errorMessage={form.formState.errors.degree?.message}
          />

          <Input
            {...form.register("fieldOfStudy")}
            label="Field of Study"
            placeholder="Computer Science"
            isInvalid={!!form.formState.errors.fieldOfStudy}
            errorMessage={form.formState.errors.fieldOfStudy?.message}
          />
        </div>

        {/* Graduation Month and Year unsure if I still need to change it to an actual calendar since the mockups only needed the month and year*/}
        <div className="grid grid-cols-2 gap-3">
          <Controller
            control={form.control}
            name="graduationDate"
            render={({ field, fieldState }) => {
              const currentDate =
                field.value instanceof CalendarDate ? field.value : undefined;
              const selectedMonth = currentDate
                ? currentDate.month.toString().padStart(2, "0")
                : "";

              const handleMonthChange = (month: string) => {
                const year = currentDate?.year || new Date().getFullYear();
                field.onChange(new CalendarDate(year, parseInt(month), 1));
              };

              return (
                <Select
                  label="Graduation Month"
                  placeholder="Select month"
                  selectedKeys={selectedMonth ? [selectedMonth] : []}
                  onSelectionChange={(keys) => {
                    const month = Array.from(keys)[0] as string;
                    if (month) handleMonthChange(month);
                  }}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                >
                  <SelectItem key="01" textValue="January">
                    January
                  </SelectItem>
                  <SelectItem key="02" textValue="February">
                    February
                  </SelectItem>
                  <SelectItem key="03" textValue="March">
                    March
                  </SelectItem>
                  <SelectItem key="04" textValue="April">
                    April
                  </SelectItem>
                  <SelectItem key="05" textValue="May">
                    May
                  </SelectItem>
                  <SelectItem key="06" textValue="June">
                    June
                  </SelectItem>
                  <SelectItem key="07" textValue="July">
                    July
                  </SelectItem>
                  <SelectItem key="08" textValue="August">
                    August
                  </SelectItem>
                  <SelectItem key="09" textValue="September">
                    September
                  </SelectItem>
                  <SelectItem key="10" textValue="October">
                    October
                  </SelectItem>
                  <SelectItem key="11" textValue="November">
                    November
                  </SelectItem>
                  <SelectItem key="12" textValue="December">
                    December
                  </SelectItem>
                </Select>
              );
            }}
          />

          <Controller
            control={form.control}
            name="graduationDate"
            render={({ field, fieldState }) => {
              const currentDate =
                field.value instanceof CalendarDate ? field.value : undefined;
              const selectedYear = currentDate
                ? currentDate.year.toString()
                : "";

              const handleYearChange = (year: string) => {
                const month = currentDate?.month || 1;
                field.onChange(new CalendarDate(parseInt(year), month, 1));
              };

              // Generate years from 1950 to current year + 10
              const currentYear = new Date().getFullYear();
              const years = Array.from(
                { length: currentYear + 10 - 1950 + 1 },
                (_, i) => 1950 + i
              ).reverse();

              return (
                <Select
                  label="Graduation Year"
                  placeholder="Select year"
                  selectedKeys={selectedYear ? [selectedYear] : []}
                  onSelectionChange={(keys) => {
                    const year = Array.from(keys)[0] as string;
                    if (year) handleYearChange(year);
                  }}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                >
                  {years.map((year) => (
                    <SelectItem
                      key={year.toString()}
                      textValue={year.toString()}
                    >
                      {year}
                    </SelectItem>
                  ))}
                </Select>
              );
            }}
          />
        </div>
      </form>
    </div>
  );
}
