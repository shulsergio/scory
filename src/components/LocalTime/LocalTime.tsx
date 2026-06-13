"use client";

import { useEffect, useState } from "react";

interface LocalTimeProps {
  kickoffTime: string;
  dateType: "fullDate" | "shortDate";
}

export default function LocalTime({ kickoffTime, dateType }: LocalTimeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted) {
    return <span>--:--</span>;
  }

  return (
    <span>
      {new Date(kickoffTime)
        .toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
          ...(dateType === "fullDate" && {
            day: "2-digit",
            month: "2-digit",
          }),
        })
        .replace(",", "")}
    </span>
  );
}
