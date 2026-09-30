import React, { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

export interface TextRepelSegment {
  text: string;
  className?: string;
  letterClassName?: string;
}

export interface TextRepelProps {
  /** The text content to display (single string) */
  text?: string;
  /** Multi-line or styled text segments */
  segments?: TextRepelSegment[];
  /** Additional CSS classes for the container */
  className?: string;
  /** CSS classes applied to each individual letter */
  letterClassName?: string;
  /** Cursor influence radius in pixels — letters within this distance react */
  radius?: number;
  /** Maximum displacement in pixels at closest proximity */
  strength?: number;
  /** Interaction mode — push letters away or pull them toward the cursor */
  mode?: "repel" | "attract";
  /** Spring stiffness — higher values make letters snap back faster */
  stiffness?: number;
  /** Spring damping — lower values produce bouncier motion */
  damping?: number;
  /** Spring mass — higher values make letters feel heavier */
  mass?: number;
}

interface RepelLetterProps {
  letter: string;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  radius: number;
  strength: number;
  mode: "repel" | "attract";
  stiffness: number;
  damping: number;
  mass: number;
  className?: string;
}

function RepelLetter({
  letter,
  mouseX,
  mouseY,
  radius,
  strength,
  mode,
  stiffness,
  damping,
  mass,
  className,
}: RepelLetterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const originX = useRef(0);
  const originY = useRef(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness, damping, mass });
  const springY = useSpring(y, { stiffness, damping, mass });

  // Subtle tilt proportional to horizontal displacement
  const rotate = useTransform(springX, (v) => v * 0.3);

  // Capture original position relative to the container
  useEffect(() => {
    const capture = () => {
      if (!ref.current) return;
      const container = ref.current.closest("[data-text-repel]");
      if (!container) return;
      const cr = container.getBoundingClientRect();
      const lr = ref.current.getBoundingClientRect();
      originX.current = lr.left - cr.left + lr.width / 2;
      originY.current = lr.top - cr.top + lr.height / 2;
    };

    const raf = requestAnimationFrame(capture);
    window.addEventListener("resize", capture);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", capture);
    };
  }, []);

  // React to cursor position changes via motion value subscriptions
  useEffect(() => {
    const update = () => {
      const mx = mouseX.get();
      const my = mouseY.get();
      const dx = originX.current - mx;
      const dy = originY.current - my;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius && distance > 0) {
        // Quadratic falloff for natural-feeling magnetic force
        const force = ((1 - distance / radius) ** 2) * strength;
        const angle = Math.atan2(dy, dx);
        const dir = mode === "attract" ? -1 : 1;
        x.set(Math.cos(angle) * force * dir);
        y.set(Math.sin(angle) * force * dir);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const unsub1 = mouseX.on("change", update);
    const unsub2 = mouseY.on("change", update);
    return () => {
      unsub1();
      unsub2();
    };
  }, [mouseX, mouseY, radius, strength, mode, x, y]);

  if (letter === " ") {
    return <span className="inline-block whitespace-pre"> </span>;
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-block whitespace-pre will-change-transform select-none ${className || ""}`}
      style={{ x: springX, y: springY, rotate }}
      aria-hidden="true"
    >
      {letter}
    </motion.span>
  );
}

export function TextRepel({
  text,
  segments,
  className = "",
  letterClassName = "",
  radius = 120,
  strength = 45,
  mode = "repel",
  stiffness = 180,
  damping = 14,
  mass = 0.4,
}: TextRepelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  const fullAriaLabel = text || segments?.map((s) => s.text).join(" ") || "";

  const handlePointerMove = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(clientX - rect.left);
    mouseY.set(clientY - rect.top);
  };

  const handlePointerLeave = () => {
    mouseX.set(-9999);
    mouseY.set(-9999);
  };

  return (
    <div
      ref={containerRef}
      data-text-repel
      className={`cursor-default select-none relative ${className}`}
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
      onMouseLeave={handlePointerLeave}
      onTouchMove={(e) => {
        if (e.touches[0]) {
          handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchEnd={handlePointerLeave}
      aria-label={fullAriaLabel}
    >
      {segments && segments.length > 0 ? (
        <div className="flex flex-col items-center justify-center gap-1.5 w-full">
          {segments.map((seg, sIdx) => (
            <div
              key={sIdx}
              className={`inline-flex flex-wrap items-center justify-center ${seg.className || ""}`}
            >
              {seg.text.split("").map((letter, lIdx) => (
                <RepelLetter
                  key={`${sIdx}-${lIdx}`}
                  letter={letter}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  radius={radius}
                  strength={strength}
                  mode={mode}
                  stiffness={stiffness}
                  damping={damping}
                  mass={mass}
                  className={seg.letterClassName || letterClassName}
                />
              ))}
            </div>
          ))}
        </div>
      ) : text ? (
        <div className="inline-flex flex-wrap items-center justify-center">
          {text.split("").map((letter, i) => (
            <RepelLetter
              key={i}
              letter={letter}
              mouseX={mouseX}
              mouseY={mouseY}
              radius={radius}
              strength={strength}
              mode={mode}
              stiffness={stiffness}
              damping={damping}
              mass={mass}
              className={letterClassName}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
export default TextRepel;
