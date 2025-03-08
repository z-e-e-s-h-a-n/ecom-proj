"use client";
import React from "react";
import useCountdown from "@/hooks/useCountdown";
import Semicolon from "@/components/icon/Semicolon";

const CountdownTimer = ({ startDate, endDate }: CountdownTimerProps) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { days, hours, minutes, seconds } = useCountdown(start, end);

  const timerDisplay = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  const formatValue = (value: number): string => String(value).padStart(2, "0");

  return (
    <div className="flex items-center gap-4">
      {timerDisplay.map(({ label, value }, index) => (
        <div key={label} className="flex flex-col gap-2">
          <span className="subtitle-3 capitalize">{label}</span>
          <div className="flex items-center gap-4">
            <span className="text-[32px] font-semibold leading-[30px]">
              {formatValue(value)}
            </span>
            {index < timerDisplay.length - 1 && (
              <Semicolon className="text-primary" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
