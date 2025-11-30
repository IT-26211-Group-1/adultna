"use client";

import { Input, Select, SelectItem, Button } from "@heroui/react";
import { EducationFormData, educationSchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  useForm,
  useFieldArray,
  UseFormReturn,
} from "react-hook-form";
import { CalendarDate } from "@internationalized/date";
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

export default function EducationForm({
  resumeData,
  setResumeData,
  onValidationChange,
}: EditorFormProps) {
  const isSyncingRef = useRef(false);
  const previousDataRef = useRef<string>("");

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educationItems: resumeData.educationItems || [
        {
          schoolName: "",
          schoolLocation: "",
          degree: "",
          fieldOfStudy: "",
          graduationDate: undefined,
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "educationItems",
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
        educationItems:
          (values.educationItems?.filter(
            (edu) => edu && edu.schoolName && edu.schoolName.trim() !== "",
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
      const hasAtLeastOneValidEducation = !!(
        values.educationItems &&
        values.educationItems.some(
          (edu) =>
            edu.schoolName?.trim() &&
            edu.degree?.trim() &&
            edu.fieldOfStudy?.trim() &&
            edu.graduationDate,
        )
      );
      const hasNoErrors = Object.keys(form.formState.errors).length === 0;
      const isValid = hasAtLeastOneValidEducation && hasNoErrors;

      onValidationChange(isValid);
    }
  }, [form.formState.errors, form, onValidationChange]);

  useEffect(() => {
    if (
      !isSyncingRef.current &&
      resumeData.educationItems &&
      resumeData.educationItems.length > 0
    ) {
      const currentData = JSON.stringify(resumeData.educationItems);

      if (previousDataRef.current !== currentData) {
        form.reset({
          educationItems: resumeData.educationItems.map((edu) => ({
            ...edu,
            graduationDate:
              edu.graduationDate instanceof Date
                ? new CalendarDate(
                    edu.graduationDate.getFullYear(),
                    edu.graduationDate.getMonth() + 1,
                    edu.graduationDate.getDate(),
                  )
                : edu.graduationDate,
          })) as any,
        });
        previousDataRef.current = currentData;
      }
    }
  }, [resumeData.educationItems, form]);

  const addEducation = () => {
    append({
      schoolName: "",
      schoolLocation: "",
      degree: "",
      fieldOfStudy: "",
      graduationDate: undefined,
    });
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Education</h2>
        <p className="text-sm text-default-500">
          Where did you attend college or university? Add as many educational
          experiences as you like.
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
              <EducationItem
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
            onClick={addEducation}
          >
            Add Another Education
          </Button>
        </div>
      </form>
    </div>
  );
}

interface EducationItemProps {
  id: string;
  form: UseFormReturn<EducationFormData>;
  index: number;
  remove: (index: number) => void;
}

function EducationItem({ id, form, index, remove }: EducationItemProps) {
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
        <h3 className="text-lg font-medium">Education {index + 1}</h3>
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
        {...form.register(`educationItems.${index}.schoolName`)}
        isRequired
        errorMessage={
          form.formState.errors.educationItems?.[index]?.schoolName?.message
        }
        isInvalid={!!form.formState.errors.educationItems?.[index]?.schoolName}
        label="School Name"
        placeholder="University of the Philippines"
      />

      <Input
        {...form.register(`educationItems.${index}.schoolLocation`)}
        errorMessage={
          form.formState.errors.educationItems?.[index]?.schoolLocation?.message
        }
        isInvalid={
          !!form.formState.errors.educationItems?.[index]?.schoolLocation
        }
        label="School Location"
        placeholder="Quezon City, Philippines"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          {...form.register(`educationItems.${index}.degree`)}
          isRequired
          errorMessage={
            form.formState.errors.educationItems?.[index]?.degree?.message
          }
          isInvalid={!!form.formState.errors.educationItems?.[index]?.degree}
          label="Degree"
          placeholder="Bachelor of Science"
        />

        <Input
          {...form.register(`educationItems.${index}.fieldOfStudy`)}
          errorMessage={
            form.formState.errors.educationItems?.[index]?.fieldOfStudy?.message
          }
          isInvalid={
            !!form.formState.errors.educationItems?.[index]?.fieldOfStudy
          }
          label="Field of Study"
          placeholder="Computer Science"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={form.control}
          name={`educationItems.${index}.graduationDate`}
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
                errorMessage={fieldState.error?.message}
                isInvalid={!!fieldState.error}
                label="Graduation Month"
                placeholder="Select month"
                selectedKeys={selectedMonth ? [selectedMonth] : []}
                onSelectionChange={(keys) => {
                  const month = Array.from(keys)[0] as string;

                  if (month) handleMonthChange(month);
                }}
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
          name={`educationItems.${index}.graduationDate`}
          render={({ field, fieldState }) => {
            const currentDate =
              field.value instanceof CalendarDate ? field.value : undefined;
            const selectedYear = currentDate ? currentDate.year.toString() : "";

            const handleYearChange = (year: string) => {
              const month = currentDate?.month || 1;

              field.onChange(new CalendarDate(parseInt(year), month, 1));
            };

            const years = Array.from(
              { length: 2035 - 1980 + 1 },
              (_, i) => 1980 + i,
            ).reverse();

            return (
              <Select
                isRequired
                errorMessage={fieldState.error?.message}
                isInvalid={!!fieldState.error}
                label="Graduation Year"
                placeholder="Select year"
                selectedKeys={selectedYear ? [selectedYear] : []}
                onSelectionChange={(keys) => {
                  const year = Array.from(keys)[0] as string;

                  if (year) handleYearChange(year);
                }}
              >
                {years.map((year) => (
                  <SelectItem key={year.toString()} textValue={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </Select>
            );
          }}
        />
      </div>
    </div>
  );
}
