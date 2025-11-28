import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface ImageContainerProps {
  step?: "email" | "otp" | "reset";
}

export const ImageContainer = ({ step }: ImageContainerProps = {}) => {
  // Determine which image to show based on the step
  const getImageSrc = () => {
    if (step === "reset") {
      return "/user-reset-password.png";
    }

    return "/user-auth-image.png";
  };

  const getAltText = () => {
    if (step === "reset") {
      return "Reset Password";
    }

    return "Authentication";
  };

  return (
    <div className="hidden lg:flex lg:w-1/2 p-4">
      <div className="w-full h-[95vh] relative overflow-hidden rounded-2xl">
        <OptimizedImage
          fill
          priority
          alt={getAltText()}
          className="object-cover"
          sizes="50vw"
          src={getImageSrc()}
        />
        {/* Decorative elements overlay */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/20 rounded-full blur-lg" />
      </div>
    </div>
  );
};
