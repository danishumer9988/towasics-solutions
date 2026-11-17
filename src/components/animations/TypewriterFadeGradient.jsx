import React, { useEffect, useMemo, useRef, useState } from 'react';
import './typewriter-fade.css';

const DEFAULT_WORDS = [
  'SUPER INTELLIGENCE',
  'INTELLIGENT AUTOMATION',
  'INSIGHTS',
  'COMPETITIVE ADVANTAGE',
  'SI-BOTS',
  'AUTONOMOUS SYSTEMS',
];

export default function TypewriterFadeGradient({
  words = DEFAULT_WORDS,
  typingSpeed = 85,
  deletingSpeed = 38,
  pauseDuration = 2400,
  startDelay = 0,
  cursor = true,
  className = '',
  onComplete,
  respectReducedMotion = true,
}) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [started, setStarted] = useState(startDelay === 0);
  const [reduced, setReduced] = useState(false);

  /* Keep the latest callback without re-triggering the effect */
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; });

  /* Reduced-motion detection */
  useEffect(() => {
    if (!respectReducedMotion || typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);
    const handler = (e) => setReduced(e.matches);
    if (mql.addEventListener) {
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
    mql.addListener(handler);
    return () => mql.removeListener(handler);
  }, [respectReducedMotion]);

  /* Delay before the very first keystroke */
  useEffect(() => {
    if (startDelay <= 0) { setStarted(true); return undefined; }
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  /* Compare words by content — prevents restart on parent re-render
     (e.g. route transitions) when the array reference changes.     */
  const wordsKey = useMemo(() => words.join('\u0001'), [words]);

  /* Main typewriter state machine */
  useEffect(() => {
    if (!started || words.length === 0) return undefined;
    const currentWord = words[index] ?? '';

    // Fully typed → hold, then reverse
    if (subIndex === currentWord.length && !reverse) {
      const t = setTimeout(() => setReverse(true), pauseDuration);
      return () => clearTimeout(t);
    }

    // Fully deleted → move on
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => {
        const next = (prev + 1) % words.length;
        if (next === 0) onCompleteRef.current?.();
        return next;
      });
      return undefined;
    }

    const t = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? deletingSpeed : typingSpeed);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subIndex, index, reverse, wordsKey, started, typingSpeed, deletingSpeed, pauseDuration]);

  const currentWord = words[index] ?? '';
  const totalChars = currentWord.length;
  const visibleChars = currentWord.slice(0, subIndex);

  /* Build one span per visible character.
     The gradient alignment uses %-based background-position so
     each char shows its own slice of the shared gradient.        */
  const charSpans = [...visibleChars].map((ch, i) => {
    const isSpace = ch === ' ';
    const style = reduced
      ? undefined
      : {
          backgroundSize: `${Math.max(totalChars, 1) * 100}% 100%`,
          backgroundPosition:
            totalChars > 1
              ? `${(i / (totalChars - 1)) * 100}% 0`
              : '0% 0',
        };

    return (
      <span
        key={`${index}-${i}`}
        className="rtx-hero__char"
        style={style}
      >
        {isSpace ? '\u00A0' : ch}
      </span>
    );
  });

  return (
    <span className={`rtx-hero ${className}`}>
      <span className="rtx-hero__stage" aria-hidden="true">
        {charSpans}
      </span>

      {cursor && (
        <span className="rtx-hero__cursor" aria-hidden="true" />
      )}

      <span className="rtx-hero__sr">{currentWord}</span>
    </span>
  );
}