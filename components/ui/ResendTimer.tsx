import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

type ResendTimerProps = {
  handleResendOtp: () => Promise<number>;
  verificationToken: string | null;
  resending: boolean;
  cooldown?: number;
};

export const ResendTimer: React.FC<ResendTimerProps> = ({
  handleResendOtp,
  verificationToken,
  resending,
  cooldown = 0,
}) => {
  const [time, setTime] = useState<number>(120);
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const initialized = useRef(false);

  const storageKey = useMemo(
    () => (verificationToken ? `otpTimer:${verificationToken}` : "otpTimer"),
    [verificationToken],
  );

  // Initialize timer on mount and sync with cooldown
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      if (typeof window === "undefined") return;

      // Check for existing timer first
      const saved = sessionStorage.getItem(storageKey);
      const savedMs = saved ? parseInt(saved, 10) : NaN;

      if (!isNaN(savedMs)) {
        const secondsLeft = Math.max(
          0,
          Math.ceil((savedMs - Date.now()) / 1000),
        );

        setTime(secondsLeft || 0);

        return;
      }
    }

    // Handle cooldown updates
    if (cooldown > 0) {
      setTime(cooldown);
      const expiresAtMs = Date.now() + cooldown * 1000;

      sessionStorage.setItem(storageKey, String(expiresAtMs));
    }
  }, [cooldown, storageKey]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (time > 0 && !resending) {
      timer = setInterval(() => {
        setTime((prev) => {
          const newTime = Math.max(0, prev - 1);

          if (newTime === 0) {
            setDisabled(false);
          }

          return newTime;
        });
      }, 1000);
    } else if (time === 0) {
      setDisabled(false);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [time, resending]);

  const handleClick = useCallback(async () => {
    if (!verificationToken || isDisabled) {
      return;
    }

    setDisabled(true);

    try {
      const cooldown = await handleResendOtp();
      const expiresAtMs = Date.now() + cooldown * 1000;

      sessionStorage.setItem(storageKey, String(expiresAtMs));
      setTime(cooldown);
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setDisabled(false);
    }
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
