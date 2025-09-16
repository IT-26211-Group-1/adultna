import { Checkbox } from "@heroui/react";

interface CheckboxFieldProps {
  register: any;
  name: string;
  label: string;
  error?: string;
}

export const CheckboxField = ({
  register,
  name,
  label,
  error,
}: CheckboxFieldProps) => {
  return (
    <div className="mb-10">
      <Checkbox
        {...register(name)}
        classNames={{
          base: "max-w-full",
          label: "text-sm text-gray-700 leading-relaxed",
          wrapper: "before:border-gray-400",
        }}
        color={error ? "danger" : "success"}
        size="sm"
      >
        {label}
      </Checkbox>
      {error && (
        <p className="text-xs text-red-500 mt-1 ml-6">
          {error.includes("required")
            ? "You must accept the terms and conditions to continue"
            : error}
        </p>
      )}
    </div>
  );
};
