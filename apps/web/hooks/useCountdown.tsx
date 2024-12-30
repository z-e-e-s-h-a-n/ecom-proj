import { useState, useEffect } from "react";
import { intervalToDuration } from "date-fns";

type CountdownState = "COUNTING" | "ENDED" | "NOT_STARTED";

type CountdownData = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  state: CountdownState;
};

const defaultData: CountdownData = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  state: "NOT_STARTED",
};

export const useCountdown = (startDate: Date, endDate: Date): CountdownData => {
  const [timeLeft, setTimeLeft] = useState<CountdownData>(defaultData);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const isBeforeStart = now < startDate;
      const isAfterEnd = now > endDate;

      if (isBeforeStart || isAfterEnd) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          state: isBeforeStart ? "NOT_STARTED" : "ENDED",
        });
      } else {
        const duration = intervalToDuration({ start: now, end: endDate });
        setTimeLeft({
          days: duration.days || 0,
          hours: duration.hours || 0,
          minutes: duration.minutes || 0,
          seconds: duration.seconds || 0,
          state: "COUNTING",
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return timeLeft;
};
