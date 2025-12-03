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
  onValidationChange,
}: EditorFormProps) {
  const isSyncingRef = useRef(false);
  const previousDataRef = useRef<string>("");
  const [showJobPosition, setShowJobPosition] = useState(
    !!resumeData.jobPosition
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
              resumeData.birthDate.getDate()
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
    [syncFormData]
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
      const hasRequiredFields = !!(
        values.firstName &&
        values.lastName &&
        values.email &&
        values.phone
      );
      const hasNoErrors = Object.keys(form.formState.errors).length === 0;
      const isValid = hasRequiredFields && hasNoErrors;

      onValidationChange(isValid);
    }
  }, [form.formState.errors, form, onValidationChange]);

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
                  resumeData.birthDate.getDate()
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
    <div className="mx-auto max-w-lg space-y-4">
      <div className="space-y-1 text-center mb-6">
        <h2 className="text-xl font-semibold">Contact Information</h2>
        <p className="text-xs text-default-500">
          Let&apos;s kick things off! Start by entering your name, email, and
          phone number to set up your resume and keep everything organized.
        </p>
      </div>

      <form className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <Input
            {...form.register("firstName")}
            isRequired
            errorMessage={form.formState.errors.firstName?.message as string}
            isInvalid={!!form.formState.errors.firstName}
            label="First Name"
            placeholder="Enter your First Name"
            size="sm"
          />

          <Input
            {...form.register("lastName")}
            isRequired
            errorMessage={form.formState.errors.lastName?.message as string}
            isInvalid={!!form.formState.errors.lastName}
            label="Last Name"
            placeholder="Enter your Last Name"
            size="sm"
          />
        </div>

        {showJobPosition && (
          <div className="relative">
            <Input
              {...form.register("jobPosition")}
              errorMessage={
                form.formState.errors.jobPosition?.message as string
              }
              isInvalid={!!form.formState.errors.jobPosition}
              label="Job Position"
              placeholder="e.g., Senior Software Engineer"
              size="sm"
            />
            <button
              className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Remove Job Position"
              type="button"
              onClick={() => {
                setShowJobPosition(false);
                form.setValue("jobPosition", "");
                setResumeData({ ...resumeData, jobPosition: "" });
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Input
              {...form.register("city")}
              errorMessage={form.formState.errors.city?.message as string}
              isInvalid={!!form.formState.errors.city}
              label="City"
              placeholder="Enter your City"
              size="sm"
            />
            <p className="text-xs text-right text-gray-500">
              {(form.watch("city") || "").length} / 50
            </p>
          </div>

          <div className="space-y-1">
            <Input
              {...form.register("region")}
              errorMessage={form.formState.errors.region?.message as string}
              isInvalid={!!form.formState.errors.region}
              label="Region"
              placeholder="Enter your Region"
              size="sm"
            />
            <p className="text-xs text-right text-gray-500">
              {(form.watch("region") || "").length} / 100
            </p>
          </div>
        </div>

        <Input
          {...form.register("email")}
          isRequired
          errorMessage={form.formState.errors.email?.message as string}
          isInvalid={!!form.formState.errors.email}
          label="Email"
          placeholder="email@email.com"
          size="sm"
          type="email"
        />

        <Input
          {...form.register("phone")}
          isRequired
          errorMessage={form.formState.errors.phone?.message as string}
          isInvalid={!!form.formState.errors.phone}
          label="Phone"
          maxLength={10}
          placeholder="9XX-XXX-XXXX"
          size="sm"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">+63</span>
            </div>
          }
          type="tel"
          onInput={(e) => {
            const target = e.target as HTMLInputElement;

            target.value = target.value.replace(/\D/g, "").slice(0, 10);
          }}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />

        {/* Optional Fields */}
        {showBirthDate && (
          <div className="relative">
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
                        val.getDate()
                      )
                    );
                  } else {
                    field.onChange(val);
                  }
                };

                const today = new Date();
                const maxDate = new CalendarDate(
                  today.getFullYear(),
                  today.getMonth() + 1,
                  today.getDate()
                );

                return (
                  <div className="relative">
                    <DatePicker
                      errorMessage={fieldState.error?.message as string}
                      isInvalid={!!fieldState.error}
                      label="Birth date"
                      maxValue={maxDate}
                      size="sm"
                      value={value}
                      onBlur={field.onBlur}
                      onChange={handleChange}
                    />
                    <button
                      className="absolute right-9 top-[22px] text-gray-400 hover:text-red-500 transition-colors p-1 z-10"
                      title="Remove Birth Date"
                      type="button"
                      onClick={() => {
                        setShowBirthDate(false);
                        form.setValue("birthDate", undefined);
                        setResumeData({ ...resumeData, birthDate: undefined });
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M6 18L18 6M6 6l12 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </button>
                  </div>
                );
              }}
            />
          </div>
        )}

        {showLinkedIn && (
          <div className="relative">
            <Input
              {...form.register("linkedin")}
              errorMessage={form.formState.errors.linkedin?.message as string}
              isInvalid={!!form.formState.errors.linkedin}
              label="LinkedIn"
              placeholder="https://linkedin.com/in/yourprofile"
              size="sm"
            />
            <button
              className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Remove LinkedIn"
              type="button"
              onClick={() => {
                setShowLinkedIn(false);
                form.setValue("linkedin", "");
                setResumeData({ ...resumeData, linkedin: "" });
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>
        )}

        {showPortfolio && (
          <div className="relative">
            <Input
              {...form.register("portfolio")}
              errorMessage={form.formState.errors.portfolio?.message as string}
              isInvalid={!!form.formState.errors.portfolio}
              label="Portfolio"
              placeholder="https://yourportfolio.com"
              size="sm"
            />
            <button
              className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Remove Portfolio"
              type="button"
              onClick={() => {
                setShowPortfolio(false);
                form.setValue("portfolio", "");
                setResumeData({ ...resumeData, portfolio: "" });
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>
        )}

        {/* Optional Fields Section */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {!showJobPosition && (
            <button
              className="px-2 py-0.5 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              type="button"
              onClick={() => setShowJobPosition(true)}
            >
              + Job Position
            </button>
          )}
          {!showBirthDate && (
            <button
              className="px-2 py-0.5 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              type="button"
              onClick={() => setShowBirthDate(true)}
            >
              + Date of Birth
            </button>
          )}
          {!showLinkedIn && (
            <button
              className="px-2 py-0.5 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              type="button"
              onClick={() => setShowLinkedIn(true)}
            >
              + LinkedIn
            </button>
          )}
          {!showPortfolio && (
            <button
              className="px-2 py-0.5 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
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
