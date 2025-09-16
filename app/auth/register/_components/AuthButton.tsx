import { Button, Spinner } from "@heroui/react";

interface AuthButtonProps {
  loading: boolean;
  children: React.ReactNode;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}

export const AuthButton = ({
  loading,
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
}: AuthButtonProps) => {
  return (
    <Button
      className={`w-full font-medium text-md h-12 ${variant === "primary" ? "bg-adult-green text-white hover:bg-green-950" : "border-gray-100 hover:border-gray-200 text-white hover:bg-adult-green/100"} ${className}`}
      color="default"
      isLoading={loading}
      radius="lg"
      size="md"
      spinner={<Spinner color="white" size="sm" />}
      type={type}
      variant={variant === "primary" ? "solid" : "bordered"}
      onClick={onClick}
    >
      {loading ? "Processing..." : children}
    </Button>
  );
};
