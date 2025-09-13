import { Link } from '@heroui/react';

export const AuthFooter = () => {
  return (
    <div className="text-center mt-6">
      <p className="text-xs text-gray-600">
        Already have an account?{' '}
        <Link 
          href="/auth/login" 
          className="text-green-700 hover:text-green-800 font-medium"
          size="sm"
        >
          Sign in here!
        </Link>
      </p>
    </div>
  );
};