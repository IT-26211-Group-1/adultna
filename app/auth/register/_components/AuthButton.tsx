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
      color={variant === "primary" ? "success" : "default"}
      variant={variant === "primary" ? "solid" : "bordered"}
      className={`w-full font-medium text-md ${variant === "primary" ? "bg-adult-green/90" : "border-gray-200 hover:border-gray-300 text-white hover:bg-gray-50"} ${className}`}
      // Removed unsupported classNames prop
    >
      {loading ? "Processing..." : children}
    </Button>
  );
};