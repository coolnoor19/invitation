"use client";

import { useEffect, useState } from "react";

export default function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const diff = now === null ? null : Math.max(0, new Date(to).getTime() - now);
  const pad = (n: number) => String(n).padStart(2, "0");

  const units =
    diff === null
      ? ["--", "--", "--", "--"]
      : [
          pad(Math.floor(diff / 86_400_000)),
          pad(Math.floor(diff / 3_600_000) % 24),
          pad(Math.floor(diff / 60_000) % 60),
          pad(Math.floor(diff / 1000) % 60),
        ];
  const labels = ["Days", "Hours", "Minutes", "Seconds"];

  return (
    <div className="countdown" role="timer" aria-label="Time until the event">
      {units.map((value, i) => (
        <div className="count-cell" key={labels[i]}>
          <span className="count-num">{value}</span>
          <span className="count-label">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
