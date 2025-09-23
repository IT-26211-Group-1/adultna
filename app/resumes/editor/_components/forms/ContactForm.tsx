
"use client";

import { Input, DatePicker } from "@heroui/react";
import { ContactFormData, contactSchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { CalendarDate } from "@internationalized/date";

export default function ContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      city: "",
      region: "",
      birthDate: undefined,
      linkedin: "",
      portfolio: "",
    },
  });
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Contact Information</h2>
        <p className="text-sm text-default-500">
          Let’s kick things off! Start by entering your name, email, and phone number to set up your resume and keep everything organized.
        </p>
      </div>

      <form className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input
            {...form.register("firstName")}
            label="First Name"
            placeholder="Juan"
            autoFocus
            isInvalid={!!form.formState.errors.firstName}
            errorMessage={form.formState.errors.firstName?.message}
          />

          <Input
            {...form.register("lastName")}
            label="Last Name"
            placeholder="Dela Cruz"
            isInvalid={!!form.formState.errors.lastName}
            errorMessage={form.formState.errors.lastName?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            {...form.register("city")}
            label="City"
            placeholder="Manila"
            isInvalid={!!form.formState.errors.city}
            errorMessage={form.formState.errors.city?.message}
          />

          <Input
            {...form.register("region")}
            label="Region"
            placeholder="NCR"
            isInvalid={!!form.formState.errors.region}
            errorMessage={form.formState.errors.region?.message}
          />
        </div>

        <Input
          {...form.register("email")}
          label="Email"
          type="email"
          placeholder="your@email.com"
          isInvalid={!!form.formState.errors.email}
          errorMessage={form.formState.errors.email?.message}
        />

        <Input
          {...form.register("phone")}
          label="Phone"
          type="tel"
          placeholder="09XXXXXXXXX"
          isInvalid={!!form.formState.errors.phone}
          errorMessage={form.formState.errors.phone?.message}
        />
              
        {/* Double check the implementation of DatePicker and CalendarDate when backend is complete */}
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
            return (
              <DatePicker
                label="Birth date"
                value={value}
                onChange={handleChange}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              />
            );
          }}
        />

        <Input
          {...form.register("linkedin")}
          label="LinkedIn"
          placeholder="https://linkedin.com/in/yourprofile"
          isInvalid={!!form.formState.errors.linkedin}
          errorMessage={form.formState.errors.linkedin?.message}
        />

        <Input
          {...form.register("portfolio")}
          label="Portfolio"
          placeholder="https://yourportfolio.com"
          isInvalid={!!form.formState.errors.portfolio}
          errorMessage={form.formState.errors.portfolio?.message}
        />
        
      </form>
    </div>
  );
}
