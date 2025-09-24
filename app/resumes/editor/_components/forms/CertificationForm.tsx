"use client";

import { Input } from "@heroui/react";
import { CertificationFormData, certificationSchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { EditorFormProps } from "@/lib/resume/types";
import { useEffect } from "react";

export default function CertificationForm({resumeData, setResumeData}: EditorFormProps) {
  const form = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      certificate: "",
      issuingOrganization: "",
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
        <h2 className="text-2xl font-semibold">Certifications</h2>
        <p className="text-sm text-default-500">
          Great Job! Now you can add certain certifications that is related to what your job requires.
        </p>
      </div>

      <form className="space-y-3">
        <Input
          {...form.register("certificate")}
          label="Certificate Name"
          placeholder="AWS Certified Solutions Architect"
          autoFocus
          isInvalid={!!form.formState.errors.certificate}
          errorMessage={form.formState.errors.certificate?.message}
        />

        <Input
          {...form.register("issuingOrganization")}
          label="Issuing Organization"
          placeholder="Amazon Web Services"
          isInvalid={!!form.formState.errors.issuingOrganization}
          errorMessage={form.formState.errors.issuingOrganization?.message}
        />
      </form>
    </div>
  );
}
