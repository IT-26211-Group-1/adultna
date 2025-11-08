"use client";

import { Input, DatePicker } from "@heroui/react";
import { ContactFormData, contactSchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CalendarDate } from "@internationalized/date";
import { EditorFormProps } from "@/lib/resume/types";

export default function ContactForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const [showBirthDate, setShowBirthDate] = useState(!!resumeData.birthDate);
  const [showLinkedIn, setShowLinkedIn] = useState(!!resumeData.linkedin);
  const [showPortfolio, setShowPortfolio] = useState(!!resumeData.portfolio);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: resumeData.email || "",
      phone: resumeData.phone || "",
      firstName: resumeData.firstName || "",
      lastName: resumeData.lastName || "",
      city: resumeData.city || "",
      region: resumeData.region || "",
      birthDate: resumeData.birthDate || undefined,
      linkedin: resumeData.linkedin || "",
      portfolio: resumeData.portfolio || "",
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
            errorMessage={form.formState.errors.firstName?.message}
            isInvalid={!!form.formState.errors.firstName}
            label="First Name"
            placeholder="Juan"
          />

          <Input
            {...form.register("lastName")}
            errorMessage={form.formState.errors.lastName?.message}
            isInvalid={!!form.formState.errors.lastName}
            label="Last Name"
            placeholder="Dela Cruz"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            {...form.register("city")}
            errorMessage={form.formState.errors.city?.message}
            isInvalid={!!form.formState.errors.city}
            label="City"
            placeholder="Manila"
          />

          <Input
            {...form.register("region")}
            errorMessage={form.formState.errors.region?.message}
            isInvalid={!!form.formState.errors.region}
            label="Region"
            placeholder="NCR"
          />
        </div>

        <Input
          {...form.register("email")}
          errorMessage={form.formState.errors.email?.message}
          isInvalid={!!form.formState.errors.email}
          label="Email"
          placeholder="your@email.com"
          type="email"
        />

        <Input
          {...form.register("phone")}
          errorMessage={form.formState.errors.phone?.message}
          isInvalid={!!form.formState.errors.phone}
          label="Phone"
          placeholder="09XXXXXXXXX"
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

              return (
                <DatePicker
                  errorMessage={fieldState.error?.message}
                  isInvalid={!!fieldState.error}
                  label="Birth date"
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
            errorMessage={form.formState.errors.linkedin?.message}
            isInvalid={!!form.formState.errors.linkedin}
            label="LinkedIn"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        )}

        {showPortfolio && (
          <Input
            {...form.register("portfolio")}
            errorMessage={form.formState.errors.portfolio?.message}
            isInvalid={!!form.formState.errors.portfolio}
            label="Portfolio"
            placeholder="https://yourportfolio.com"
          />
        )}

        {/* Optional Fields Section */}
        <div className="flex flex-wrap gap-2 mt-4">
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
