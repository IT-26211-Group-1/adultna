import { Link } from "@heroui/react";

export const AuthFooter = () => {
  return (
    <div className="text-center mt-10">
      <p className="text-sm text-gray-700">
        Already have an account? {"     "}
        <Link
          className="text-green-700 hover:text-green-800 font-medium"
          href="/auth/login"
          size="sm"
        >
          Sign in here!
        </Link>
      </p>
    </div>
  );
};
