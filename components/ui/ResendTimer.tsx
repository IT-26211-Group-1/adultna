import React, { useEffect, useState } from "react";

type ResendTimerProps = {
  handleResendOtp: () => void;
  verificationToken: string | null;
  resending: boolean;
};

export const ResendTimer: React.FC<ResendTimerProps> = ({
  handleResendOtp,
  verificationToken,
  resending,
}) => {
  const savedTime = parseInt(sessionStorage.getItem("otpTimer") || "120", 10);

  const [time, setTime] = useState(savedTime);
  const [isDisabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (time > 0 && !resending) {
      timer = setInterval(() => {
        setTime((prev) => {
          const newTime = prev - 1;

          sessionStorage.setItem("otpTimer", newTime.toString());

          return newTime;
        });
      }, 1000);
    } else {
      setDisabled(false);
    }

    return () => clearInterval(timer);
  }, [time, resending]);

  const handleClick = () => {
    if (!resending && verificationToken) {
      handleResendOtp();
      setDisabled(true);
      setTime(120);
      sessionStorage.setItem("otpTimer", "120");
    }
  };

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
