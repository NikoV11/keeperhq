"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to `value` once scrolled into view.
 *
 * The initial state is the real figure, not zero — so the server-rendered HTML,
 * a no-JS visitor, and anyone with reduced motion all see the true number. The
 * animation only rewinds to zero on the client, immediately before it plays.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1400,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!node || reduced || typeof IntersectionObserver === "undefined") return;

    let frame = 0;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(tick);
        else setDisplay(value);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setDisplay(0);
        run();
      },
      { threshold: 0.4 }
    );
    observer.observe(node);

    // If anything prevents the animation from starting, the real figure must still
    // be on screen — restore it rather than leaving a zero.
    const safety = window.setTimeout(() => {
      if (!started) setDisplay(value);
    }, 2500);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(safety);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
