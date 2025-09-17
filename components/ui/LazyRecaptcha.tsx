"use client";

import { lazy, Suspense, forwardRef } from "react";

const ReCAPTCHA = lazy(() => import("react-google-recaptcha"));

interface LazyRecaptchaProps {
  sitekey: string;
  onChange?: (token: string | null) => void;
  onExpired?: () => void;
}

const LazyRecaptcha = forwardRef<any, LazyRecaptchaProps>(
  ({ sitekey, onChange, onExpired }, ref) => {
    return (
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[78px] w-[304px] bg-gray-100 rounded border">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600"></div>
          </div>
        }
      >
        <ReCAPTCHA
          ref={ref}
          sitekey={sitekey}
          onChange={onChange}
          onExpired={onExpired}
        />
      </Suspense>
    );
  }
);

LazyRecaptcha.displayName = "LazyRecaptcha";

export default LazyRecaptcha;