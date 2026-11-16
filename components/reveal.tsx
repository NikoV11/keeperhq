"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades and lifts its children in when they first scroll into view.
 *
 * The element is visible from the start for anyone with reduced motion
 * preferred or without IntersectionObserver — the animation is decoration,
 * never the thing that makes content appear.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`kh-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--kh-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
