"use client";

import { Input, Select, SelectItem, Button } from "@heroui/react";
import { EducationFormData, educationSchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { CalendarDate } from "@internationalized/date";
import { EditorFormProps } from "@/lib/resume/types";
import { useEffect } from "react";
import { PlusIcon, TrashIcon, GripHorizontal } from "lucide-react";
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
  arrayMove,
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
}: EditorFormProps) {
  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educationItems: resumeData.educationItems || [{
        schoolName: "",
        schoolLocation: "",
        degree: "",
        fieldOfStudy: "",
        graduationDate: undefined,
      }],
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

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        educationItems: values.educationItems?.filter((edu) => edu && edu.schoolName && edu.schoolName.trim() !== "") as any[] || [],
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

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
          Where did you attend college or university? Add as many educational experiences as you like.
        </p>
      </div>

      <form className="space-y-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={fields}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field, index) => (
              <EducationItem
                key={field.id}
                id={field.id}
                index={index}
                form={form}
                remove={remove}
              />
            ))}
          </SortableContext>
        </DndContext>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="flat"
            color="primary"
            onClick={addEducation}
            startContent={<PlusIcon size={16} />}
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

function EducationItem({
  id,
  form,
  index,
  remove,
}: EducationItemProps) {
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
      className={cn(
        "space-y-3 p-4 border border-default-200 rounded-lg bg-background",
        isDragging && "relative z-50 cursor-grab shadow-xl opacity-50",
      )}
      ref={setNodeRef}
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
            type="button"
            isIconOnly
            size="sm"
            variant="flat"
            color="danger"
            onClick={() => remove(index)}
          >
            <TrashIcon size={16} />
          </Button>
        </div>
      </div>

      <Input
        {...form.register(`educationItems.${index}.schoolName`)}
        label="School Name"
        placeholder="University of the Philippines"
        isInvalid={!!form.formState.errors.educationItems?.[index]?.schoolName}
        errorMessage={form.formState.errors.educationItems?.[index]?.schoolName?.message}
      />

      <Input
        {...form.register(`educationItems.${index}.schoolLocation`)}
        label="School Location"
        placeholder="Quezon City, Philippines"
        isInvalid={!!form.formState.errors.educationItems?.[index]?.schoolLocation}
        errorMessage={form.formState.errors.educationItems?.[index]?.schoolLocation?.message}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          {...form.register(`educationItems.${index}.degree`)}
          label="Degree"
          placeholder="Bachelor of Science"
          isInvalid={!!form.formState.errors.educationItems?.[index]?.degree}
          errorMessage={form.formState.errors.educationItems?.[index]?.degree?.message}
        />

        <Input
          {...form.register(`educationItems.${index}.fieldOfStudy`)}
          label="Field of Study"
          placeholder="Computer Science"
          isInvalid={!!form.formState.errors.educationItems?.[index]?.fieldOfStudy}
          errorMessage={form.formState.errors.educationItems?.[index]?.fieldOfStudy?.message}
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
                <SelectItem key="01" textValue="January">January</SelectItem>
                <SelectItem key="02" textValue="February">February</SelectItem>
                <SelectItem key="03" textValue="March">March</SelectItem>
                <SelectItem key="04" textValue="April">April</SelectItem>
                <SelectItem key="05" textValue="May">May</SelectItem>
                <SelectItem key="06" textValue="June">June</SelectItem>
                <SelectItem key="07" textValue="July">July</SelectItem>
                <SelectItem key="08" textValue="August">August</SelectItem>
                <SelectItem key="09" textValue="September">September</SelectItem>
                <SelectItem key="10" textValue="October">October</SelectItem>
                <SelectItem key="11" textValue="November">November</SelectItem>
                <SelectItem key="12" textValue="December">December</SelectItem>
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
            const selectedYear = currentDate
              ? currentDate.year.toString()
              : "";

            const handleYearChange = (year: string) => {
              const month = currentDate?.month || 1;
              field.onChange(new CalendarDate(parseInt(year), month, 1));
            };

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
    </div>
  );
}