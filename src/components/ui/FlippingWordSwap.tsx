import React, { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';

const graphemeSegmenter =
  typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

function segmentCharacters(text: string) {
  if (!graphemeSegmenter) return Array.from(text);
  return Array.from(graphemeSegmenter.segment(text), ({ segment }) => segment);
}

export interface FlippingWordSwapProps {
  /** The word or phrase shown at rest. */
  word1: string;
  /** The word or phrase revealed on flip. */
  word2: string;
  /** Duration of each character flip in milliseconds. */
  duration?: number;
  /** Delay between neighboring character flips in milliseconds. */
  stagger?: number;
  /** Automatic swap interval in milliseconds (default 5000ms = 5 sec). 0 to disable. */
  autoInterval?: number;
  /** Additional classes applied to the interactive container. */
  className?: string;
  /** Additional classes applied only to the revealed word. */
  toClassName?: string;
  /** Inline styles applied to the interactive container. */
  style?: CSSProperties;
  /** Inline styles applied only to the revealed word. */
  toStyle?: CSSProperties;
}

/**
 * FlippingWordSwap Component
 * Inspired by componentry.dev/docs/components/flipping-word-swap
 * Performs a clean, accessible character-by-character 3D flip between two words powered by GSAP.
 */
export function FlippingWordSwap({
  word1,
  word2,
  duration = 400,
  stagger = 44,
  autoInterval = 5000,
  className = '',
  toClassName = '',
  style,
  toStyle,
}: FlippingWordSwapProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const swappedRef = useRef(false);
  const [isSwapped, setIsSwapped] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resolvedDuration = prefersReducedMotion
      ? 0
      : Math.max(180, duration) / 1000;
    const resolvedStagger = prefersReducedMotion
      ? 0
      : Math.max(0, stagger) / 1000;

    const context = gsap.context(() => {
      const firstWord = gsap.utils.toArray<HTMLElement>(
        '[data-flip-word="first"]'
      );
      const secondWord = gsap.utils.toArray<HTMLElement>(
        '[data-flip-word="second"]'
      );

      gsap.set(firstWord, {
        rotationX: 0,
        opacity: 1,
        transformOrigin: 'center top',
      });
      gsap.set(secondWord, {
        rotationX: -82,
        opacity: 0,
        transformOrigin: 'center bottom',
      });

      const timeline = gsap.timeline({ paused: true });
      timeline
        .to(firstWord, {
          rotationX: 82,
          opacity: 0,
          duration: resolvedDuration,
          stagger: resolvedStagger,
          ease: 'power2.in',
        })
        .to(
          secondWord,
          {
            rotationX: 0,
            opacity: 1,
            duration: resolvedDuration,
            stagger: resolvedStagger,
            ease: 'power2.out',
          },
          `<${resolvedDuration * 0.62}`
        );

      if (swappedRef.current) timeline.progress(1);
      timelineRef.current = timeline;
    }, containerRef);

    return () => {
      timelineRef.current = null;
      context.revert();
    };
  }, [duration, stagger, word1, word2]);

  const updateSwap = useCallback((next: boolean) => {
    swappedRef.current = next;
    setIsSwapped(next);

    if (next) {
      timelineRef.current?.play();
    } else {
      timelineRef.current?.reverse();
    }
  }, []);

  // Automatic swap interval (every 5 seconds)
  useEffect(() => {
    if (!autoInterval || autoInterval <= 0) return;

    const interval = setInterval(() => {
      updateSwap(!swappedRef.current);
    }, autoInterval);

    return () => clearInterval(interval);
  }, [autoInterval, updateSwap]);

  const renderCharacters = (text: string, layer: 'first' | 'second') =>
    segmentCharacters(text).map((character, index) => (
      <span
        key={`${layer}-${index}-${character}`}
        data-flip-word={layer}
        className="inline-block whitespace-pre [backface-visibility:hidden] [will-change:transform,opacity]"
      >
        {character === ' ' ? '\u00a0' : character}
      </span>
    ));

  return (
    <span
      ref={containerRef}
      role="button"
      tabIndex={0}
      className={`relative inline-grid cursor-pointer select-none border-0 bg-transparent p-0 align-baseline font-[inherit] leading-[inherit] tracking-[inherit] rounded-[0.08em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/30 transition-transform duration-200 active:scale-[0.98] ${className}`}
      aria-label={isSwapped ? word2 : word1}
      aria-pressed={isSwapped}
      style={style}
      onClick={() => updateSwap(!swappedRef.current)}
      onMouseEnter={() => updateSwap(true)}
      onMouseLeave={() => updateSwap(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          updateSwap(!swappedRef.current);
        }
      }}
    >
      <span className="col-start-1 row-start-1 inline-grid overflow-visible [perspective:900px] py-0.5">
        <span
          className="col-start-1 row-start-1 inline-flex items-baseline justify-start gap-[0.012em] whitespace-pre"
          aria-hidden="true"
        >
          {renderCharacters(word1, 'first')}
        </span>
        <span
          className={`col-start-1 row-start-1 inline-flex items-baseline justify-start gap-[0.012em] whitespace-pre ${toClassName}`}
          aria-hidden="true"
          style={toStyle}
        >
          {renderCharacters(word2, 'second')}
        </span>
      </span>
    </span>
  );
}
