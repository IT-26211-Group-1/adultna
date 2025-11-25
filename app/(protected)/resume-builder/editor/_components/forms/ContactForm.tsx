"use client";

import { Input, DatePicker } from "@heroui/react";
import { contactSchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { CalendarDate } from "@internationalized/date";
import { EditorFormProps } from "@/lib/resume/types";
import { debounce } from "@/lib/utils/debounce";

export default function ContactForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const isSyncingRef = useRef(false);
  const previousDataRef = useRef<string>("");
  const [showJobPosition, setShowJobPosition] = useState(
    !!resumeData.jobPosition,
  );
  const [showBirthDate, setShowBirthDate] = useState(!!resumeData.birthDate);
  const [showLinkedIn, setShowLinkedIn] = useState(!!resumeData.linkedin);
  const [showPortfolio, setShowPortfolio] = useState(!!resumeData.portfolio);

  const form = useForm<any>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: resumeData.email || "",
      phone: resumeData.phone ? resumeData.phone.replace(/^\+63/, "") : "",
      firstName: resumeData.firstName || "",
      lastName: resumeData.lastName || "",
      jobPosition: resumeData.jobPosition || "",
      city: resumeData.city || "",
      region: resumeData.region || "",
      birthDate:
        resumeData.birthDate instanceof Date
          ? new CalendarDate(
              resumeData.birthDate.getFullYear(),
              resumeData.birthDate.getMonth() + 1,
              resumeData.birthDate.getDate(),
            )
          : undefined,
      linkedin: resumeData.linkedin || "",
      portfolio: resumeData.portfolio || "",
    },
  });

  const syncFormData = useCallback(() => {
    // Only sync if there are no validation errors already present
    if (Object.keys(form.formState.errors).length === 0) {
      isSyncingRef.current = true;
      const values = form.getValues();

      // Format phone number with +63 prefix if it doesn't already have it
      if (values.phone && !values.phone.startsWith("+63")) {
        // Remove leading 0 if present and add +63
        values.phone = `+63${values.phone.replace(/^0/, "")}`;
      }

      setResumeData({ ...resumeData, ...values });

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
    if (!isSyncingRef.current) {
      const currentData = JSON.stringify({
        firstName: resumeData.firstName,
        lastName: resumeData.lastName,
        email: resumeData.email,
        phone: resumeData.phone,
        jobPosition: resumeData.jobPosition,
        city: resumeData.city,
        region: resumeData.region,
        birthDate: resumeData.birthDate,
        linkedin: resumeData.linkedin,
        portfolio: resumeData.portfolio,
      });

      if (previousDataRef.current !== currentData) {
        form.reset({
          email: resumeData.email || "",
          phone: resumeData.phone ? resumeData.phone.replace(/^\+63/, "") : "",
          firstName: resumeData.firstName || "",
          lastName: resumeData.lastName || "",
          jobPosition: resumeData.jobPosition || "",
          city: resumeData.city || "",
          region: resumeData.region || "",
          birthDate:
            resumeData.birthDate instanceof Date
              ? new CalendarDate(
                  resumeData.birthDate.getFullYear(),
                  resumeData.birthDate.getMonth() + 1,
                  resumeData.birthDate.getDate(),
                )
              : undefined,
          linkedin: resumeData.linkedin || "",
          portfolio: resumeData.portfolio || "",
        });
        previousDataRef.current = currentData;
      }
    }
  }, [resumeData, form]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Contact Information</h2>
        <p className="text-sm text-default-500">
          Let&apos;s kick things off! Start by entering your name, email, and
          phone number to set up your resume and keep everything organized.
        </p>
      </div>

      <form className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input
            {...form.register("firstName")}
            isRequired
            errorMessage={form.formState.errors.firstName?.message as string}
            isInvalid={!!form.formState.errors.firstName}
            label="First Name"
            placeholder="Enter your First Name"
          />

          <Input
            {...form.register("lastName")}
            isRequired
            errorMessage={form.formState.errors.lastName?.message as string}
            isInvalid={!!form.formState.errors.lastName}
            label="Last Name"
            placeholder="Enter your Last Name"
          />
        </div>

        {showJobPosition && (
          <Input
            {...form.register("jobPosition")}
            errorMessage={form.formState.errors.jobPosition?.message as string}
            isInvalid={!!form.formState.errors.jobPosition}
            label="Job Position"
            placeholder="e.g., Senior Software Engineer"
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            {...form.register("city")}
            errorMessage={form.formState.errors.city?.message as string}
            isInvalid={!!form.formState.errors.city}
            label="City"
            placeholder="Enter your City"
          />

          <Input
            {...form.register("region")}
            errorMessage={form.formState.errors.region?.message as string}
            isInvalid={!!form.formState.errors.region}
            label="Region"
            placeholder="Enter your Region"
          />
        </div>

        <Input
          {...form.register("email")}
          isRequired
          errorMessage={form.formState.errors.email?.message as string}
          isInvalid={!!form.formState.errors.email}
          label="Email"
          placeholder="email@email.com"
          type="email"
        />

        <Input
          {...form.register("phone")}
          isRequired
          errorMessage={form.formState.errors.phone?.message as string}
          isInvalid={!!form.formState.errors.phone}
          label="Phone"
          placeholder="9XX-XXX-XXXX"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">+63</span>
            </div>
          }
          type="tel"
        />

        {/* Optional Fields */}
        {showBirthDate && (
          <Controller
            control={form.control}
            name="birthDate"
            render={({ field, fieldState }) => {
              let value = field.value;

              // Only allow CalendarDate, null, or undefined for value
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

              const today = new Date();
              const maxDate = new CalendarDate(
                today.getFullYear(),
                today.getMonth() + 1,
                today.getDate(),
              );

              return (
                <DatePicker
                  errorMessage={fieldState.error?.message as string}
                  isInvalid={!!fieldState.error}
                  label="Birth date"
                  maxValue={maxDate}
                  value={value}
                  onBlur={field.onBlur}
                  onChange={handleChange}
                />
              );
            }}
          />
        )}

        {showLinkedIn && (
          <Input
            {...form.register("linkedin")}
            errorMessage={form.formState.errors.linkedin?.message as string}
            isInvalid={!!form.formState.errors.linkedin}
            label="LinkedIn"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        )}

        {showPortfolio && (
          <Input
            {...form.register("portfolio")}
            errorMessage={form.formState.errors.portfolio?.message as string}
            isInvalid={!!form.formState.errors.portfolio}
            label="Portfolio"
            placeholder="https://yourportfolio.com"
          />
        )}

        {/* Optional Fields Section */}
        <div className="flex flex-wrap gap-2 mt-4">
          {!showJobPosition && (
            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              type="button"
              onClick={() => setShowJobPosition(true)}
            >
              + Job Position
            </button>
          )}
          {!showBirthDate && (
            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              type="button"
              onClick={() => setShowBirthDate(true)}
            >
              + Date of Birth
            </button>
          )}
          {!showLinkedIn && (
            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              type="button"
              onClick={() => setShowLinkedIn(true)}
            >
              + LinkedIn
            </button>
          )}
          {!showPortfolio && (
            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              type="button"
              onClick={() => setShowPortfolio(true)}
            >
              + Portfolio/Website
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
