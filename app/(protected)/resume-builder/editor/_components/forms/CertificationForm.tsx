"use client";

import { Input, Button } from "@heroui/react";
import {
  CertificationFormData,
  certificationSchema,
} from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { EditorFormProps } from "@/lib/resume/types";
import { useEffect, useCallback, useMemo, useRef } from "react";
import { PlusIcon, TrashIcon, GripHorizontal } from "lucide-react";
import { debounce } from "@/lib/utils/debounce";
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

export default function CertificationForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const previousDataRef = useRef<string>("");

  const form = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      certificates: resumeData.certificates || [
        {
          certificate: "",
          issuingOrganization: "",
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "certificates",
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
      const values = form.getValues();

      setResumeData({
        ...resumeData,
        certificates:
          (values.certificates?.filter(
            (cert) =>
              cert && cert.certificate && cert.certificate.trim() !== "",
          ) as any[]) || [],
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
    if (resumeData.certificates && resumeData.certificates.length > 0) {
      const currentData = JSON.stringify(resumeData.certificates);

      if (previousDataRef.current !== currentData) {
        form.reset({
          certificates: resumeData.certificates,
        });
        previousDataRef.current = currentData;
      }
    }
  }, [resumeData.certificates, form]);

  const addCertification = () => {
    append({
      certificate: "",
      issuingOrganization: "",
    });
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Certifications</h2>
        <p className="text-sm text-default-500">
          Great Job! Add certifications that are related to your job
          requirements.
        </p>
      </div>

      <form className="space-y-6">
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
              <CertificationItem
                key={field.id}
                form={form}
                id={field.id}
                index={index}
                remove={remove}
              />
            ))}
          </SortableContext>
        </DndContext>

        <div className="flex justify-center">
          <Button
            color="primary"
            startContent={<PlusIcon size={16} />}
            type="button"
            variant="flat"
            onClick={addCertification}
          >
            Add Another Certification
          </Button>
        </div>
      </form>
    </div>
  );
}

interface CertificationItemProps {
  id: string;
  form: UseFormReturn<CertificationFormData>;
  index: number;
  remove: (index: number) => void;
}

function CertificationItem({
  id,
  form,
  index,
  remove,
}: CertificationItemProps) {
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
        "space-y-3 p-4 border border-default-200 rounded-lg bg-background",
        isDragging && "relative z-50 cursor-grab shadow-xl opacity-50",
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Certification {index + 1}</h3>
        <div className="flex items-center gap-2">
          <GripHorizontal
            className="size-5 cursor-grab text-default-400 hover:text-default-600 focus:outline-none"
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
            <TrashIcon size={16} />
          </Button>
        </div>
      </div>

      <Input
        {...form.register(`certificates.${index}.certificate`)}
        isRequired
        errorMessage={
          form.formState.errors.certificates?.[index]?.certificate?.message
        }
        isInvalid={!!form.formState.errors.certificates?.[index]?.certificate}
        label="Certificate Name"
        placeholder="AWS Certified Solutions Architect"
      />

      <Input
        {...form.register(`certificates.${index}.issuingOrganization`)}
        errorMessage={
          form.formState.errors.certificates?.[index]?.issuingOrganization
            ?.message
        }
        isInvalid={
          !!form.formState.errors.certificates?.[index]?.issuingOrganization
        }
        label="Issuing Organization"
        placeholder="Amazon Web Services"
      />
    </div>
  );
}
