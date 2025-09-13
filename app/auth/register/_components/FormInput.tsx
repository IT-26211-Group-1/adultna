import { useState } from 'react';
import { Input } from '@heroui/react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps {
  register: any;
  name: string;
  placeholder: string;
  type?: string;
  error?: string;
  className?: string;
}

const getDetailedValidationMessage = (error: string, fieldName: string, value?: string) => {
  if (!error) return null;

  // Email validation details
  if (fieldName === 'email') {
    if (error.includes('Invalid email')) {
      if (!value?.includes('@')) return 'Email must contain @ symbol';
      if (!value?.includes('.')) return 'Email must contain a domain (e.g., .com)';
      return 'Please enter a valid email format (e.g., user@example.com)';
    }
  }

  // Password validation details
  if (fieldName === 'password') {
    if (error.includes('at least 8 characters')) return 'Password must be at least 8 characters long';
    if (error.includes('uppercase')) return 'Password must contain at least one uppercase letter (A-Z)';
    if (error.includes('lowercase')) return 'Password must contain at least one lowercase letter (a-z)';
    if (error.includes('number')) return 'Password must contain at least one number (0-9)';
    if (error.includes('special')) return 'Password must contain at least one special character (!@#$%^&*)';
    return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
  }

  // Confirm password validation
  if (fieldName === 'confirmPassword') {
    if (error.includes('match')) return 'Passwords do not match. Please re-enter your password';
  }

  // Name validation
  if (fieldName.includes('Name')) {
    if (error.includes('required')) return `${fieldName.replace(/([A-Z])/g, ' $1').trim()} is required`;
    if (error.includes('min')) return `${fieldName.replace(/([A-Z])/g, ' $1').trim()} must be at least 2 characters`;
  }

  return error;
};

export const FormInput = ({ 
  register, 
  name, 
  placeholder, 
  type = "text", 
  error,
  className = ""
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [fieldValue, setFieldValue] = useState('');
  
  const isPasswordField = type === 'password';

  return (
    <div className={className}>
      <Input
        {...register(name)}
        type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
        label={placeholder}
        placeholder={placeholder}
        size="sm"
        variant="flat"
        color={error ? "danger" : "default"}
        isRequired
        errorMessage={error ? getDetailedValidationMessage(error, name, fieldValue) : undefined}
        isInvalid={!!error}
        classNames={{
          base: "mb-1",
          label: "text-xs font-medium text-gray-700 mb-1",
          input: "text-sm bg-gray-50 focus:bg-white transition-colors",
          inputWrapper: "bg-gray-50 hover:bg-gray-100 focus-within:!bg-white border-0 shadow-none h-10",
          errorMessage: "text-xs mt-1",
          innerWrapper: "items-center"
        }}
        endContent={
          isPasswordField && (
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 flex items-center justify-center min-w-unit-6 h-6"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )
        }
        onChange={(e) => {
          setFieldValue(e.target.value);
          register(name).onChange(e);
        }}
      />
    </div>
  );
};

