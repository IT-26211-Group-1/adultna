import { Button, Spinner } from '@heroui/react';

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
  className = ""
}: AuthButtonProps) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      isLoading={loading}
      spinner={<Spinner size="sm" color="white" />}
      size="md"
      radius="lg"
      color="default"
      variant={variant === "primary" ? "solid" : "bordered"}
      className={`w-full font-medium text-md h-12 ${variant === "primary" ? "bg-adult-green text-white hover:bg-green-950" : "border-gray-100 hover:border-gray-200 text-white hover:bg-adult-green/100"} ${className}`}
    >
      {loading ? "Processing..." : children}
    </Button>
  );
};