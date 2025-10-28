"use client";

import { forwardRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface LazyRecaptchaProps {
  sitekey: string;
  onChange?: (token: string | null) => void;
  onExpired?: () => void;
}

const LazyRecaptcha = forwardRef<any, LazyRecaptchaProps>(
  ({ sitekey, onChange, onExpired }, ref) => {
    return (
      <ReCAPTCHA
        ref={ref}
        sitekey={sitekey}
        onChange={onChange}
        onExpired={onExpired}
      />
    );
  },
);

LazyRecaptcha.displayName = "LazyRecaptcha";

export default LazyRecaptcha;
