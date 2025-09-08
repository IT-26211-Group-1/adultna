import React, { useCallback, useEffect, useMemo, useState } from "react";

type ResendTimerProps = {
  handleResendOtp: () => Promise<number>;
  verificationToken: string | null;
  resending: boolean;
};

export const ResendTimer: React.FC<ResendTimerProps> = ({
  handleResendOtp,
  verificationToken,
  resending,
}) => {
  const [time, setTime] = useState<number>(120);
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const storageKey = useMemo(
    () => (verificationToken ? `otpTimer:${verificationToken}` : "otpTimer"),
    [verificationToken]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = sessionStorage.getItem(storageKey);
    const savedMs = saved ? parseInt(saved, 10) : NaN;

    if (!isNaN(savedMs)) {
      const secondsLeft = Math.max(0, Math.ceil((savedMs - Date.now()) / 1000));
      setTime(secondsLeft || 0);
    } else {
      setTime(120);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (time > 0 && !resending) {
      timer = setInterval(() => {
        setTime((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else {
      setDisabled(false);
    }

    return () => clearInterval(timer);
  }, [time, resending]);

  const handleClick = useCallback(async () => {
    if (!verificationToken || isDisabled) return;

    setDisabled(true);
    const cooldown = await handleResendOtp();

    const expiresAtMs = Date.now() + cooldown * 1000;
    sessionStorage.setItem(storageKey, String(expiresAtMs));
    setTime(cooldown);
  }, [handleResendOtp, isDisabled, storageKey, verificationToken]);

  return (
    <div className="text-center text-sm text-gray-500 mt-4">
      <span>
        Didn&apos;t receive a code?{" "}
        <button
          className={`text-blue-600 underline cursor-pointer ${
            isDisabled || time > 0 ? "text-gray-400 cursor-not-allowed" : ""
          }`}
          disabled={isDisabled || resending || !verificationToken || time > 0}
          type="button"
          onClick={handleClick}
        >
          {time > 0
            ? `Resend in ${time} seconds`
            : resending
              ? "Resending..."
              : "Resend"}{" "}
        </button>
      </span>
    </div>
  );
};
