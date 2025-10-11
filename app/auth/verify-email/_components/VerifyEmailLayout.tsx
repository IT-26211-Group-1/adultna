import { UserAuthTitle } from "../../register/_components/UserAuthTitle";
import { ImageContainer } from "../../register/_components/ImageContainer";
import { VerifyEmailForm } from "./VerifyEmailForm";

export const VerifyEmailLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Verify Email Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Title and Subtitle */}
          <div className="text-center mb-6">
            <UserAuthTitle
              title="Verify Your Email"
              subtitle="Enter the 6-digit code sent to your email"
            />
          </div>

          {/* Form */}
          <VerifyEmailForm />
        </div>
      </div>

      {/* Right Side - Image Container */}
      <ImageContainer />
    </div>
  );
};