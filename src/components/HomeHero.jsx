import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* =========================================================
   1. INLINE CSS (Cleaned for single colors)
   ========================================================= */
const animationStyles = `
  .rtx-hero {
    display: inline-flex;
    align-items: baseline;
    vertical-align: baseline;
    max-width: 100%;
    position: relative;
  }
  .rtx-hero__stage {
    display: inline-block;
    white-space: pre;
    min-width: 0;
  }
  .rtx-hero__char {
    display: inline-block;
    white-space: pre;
    vertical-align: baseline;
    backface-visibility: hidden;
    will-change: opacity, transform, filter;
    animation: rtxHeroCharIn 340ms cubic-bezier(0.22, 1, 0.36, 1) both;
    /* Drop shadow so the bright colors pop against dark backgrounds */
    filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));
  }
  @keyframes rtxHeroCharIn {
    from {
      opacity: 0;
      transform: translateY(0.14em) scale(0.94);
      filter: blur(3px) drop-shadow(0px 2px 4px rgba(0,0,0,0.3));
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0) drop-shadow(0px 2px 4px rgba(0,0,0,0.3));
    }
  }
  .rtx-hero__cursor {
    display: inline-block;
    width: 0.055em;
    min-width: 2px;
    height: 1em;
    margin-left: 0.06em;
    vertical-align: -0.15em;
    animation: rtxHeroCaret 1s steps(1, end) infinite;
    transition: background-color 0.3s ease;
  }
  @keyframes rtxHeroCaret {
    0%,  49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
  .rtx-hero__sr {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .rtx-hero__char {
      animation: none !important;
      opacity: 1 !important;
      filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3)) !important;
      transform: none !important;
    }
    .rtx-hero__cursor {
      animation: none;
      opacity: 1;
    }
  }
`;

/* =========================================================
   2. SHINY SINGLE COLORS (One for each word)
   ========================================================= */
const SINGLE_COLORS = [
  '#538d22', // Electric Cyan
  '#0e606b', // Indigo
  '#1697a6', // Royal Blue
  '#001e45', // Emerald Green
  '#1f0037', // Deep Violet
  '#003246', // Sunset Orange
];

/* =========================================================
   3. COMPONENT
   ========================================================= */
const DEFAULT_WORDS = [
  'SUPER INTELLIGENCE',
  'INTELLIGENT AUTOMATION',
  'INSIGHTS',
  'COMPETITIVE ADVANTAGE',
  'SI-BOTS',
  'AUTONOMOUS SYSTEMS',
];

function TypewriterFadeGradient({
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

  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; });

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

  useEffect(() => {
    if (startDelay <= 0) { setStarted(true); return undefined; }
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  const wordsKey = useMemo(() => words.join('\u0001'), [words]);

  useEffect(() => {
    if (!started || words.length === 0) return undefined;
    const currentWord = words[index] ?? '';

    if (subIndex === currentWord.length && !reverse) {
      const t = setTimeout(() => setReverse(true), pauseDuration);
      return () => clearTimeout(t);
    }

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
  }, [subIndex, index, reverse, wordsKey, started, typingSpeed, deletingSpeed, pauseDuration]);

  const currentWord = words[index] ?? '';
  const visibleChars = currentWord.slice(0, subIndex);

  // Get the single color for the current word
  const currentColor = SINGLE_COLORS[index % SINGLE_COLORS.length];

  const charSpans = [...visibleChars].map((ch, i) => {
    const isSpace = ch === ' ';

    // Apply the single color directly to the text
    const style = reduced ? undefined : {
      color: currentColor,
      WebkitTextFillColor: currentColor,
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
        <span
          className="rtx-hero__cursor"
          aria-hidden="true"
          style={{ backgroundColor: currentColor }}
        />
      )}

      <span className="rtx-hero__sr">{currentWord}</span>
    </span>
  );
}

/* =========================================================
   4. MAIN HERO COMPONENT
   ========================================================= */
const HERO_WORDS = [
  'SUPER INTELLIGENCE',
  'INTELLIGENT AUTOMATION',
  'INSIGHTS',
  'COMPETITIVE ADVANTAGE',
  'SUPER INTELLIGENCE BOTS',
  'AUTONOMOUS SYSTEMS',
];

export default function HomeHero() {
  return (
    <section className="relative custombackgroud min-h-[500px] lg:min-h-[620px] flex items-center py-10 lg:pt-16 lg:pb-0">

      <style>{animationStyles}</style>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mainabove z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-4 sm:space-y-6 text-center lg:text-left animate-fadeInLeft"
          >
            <motion.h1
              style={{ lineHeight: '1.15' }}
              className="font-inter font-bold text-3xl sm:text-4xl md:text-[45px] lg:text-[50px] text-white tracking-normal capitalize mb-4 sm:mb-6 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              UNLOCKING THE <br className="hidden sm:inline" /> POWER OF DATA AND
              <br className="hidden sm:block" />

              <span className="inline-block mt-2">
                <TypewriterFadeGradient
                  words={HERO_WORDS}
                  typingSpeed={85}
                  deletingSpeed={38}
                  pauseDuration={2400}
                  cursor
                />
              </span>
            </motion.h1>

            <div className="pt-2 sm:pt-4">
              <Link to="/contactus">
                <motion.button
                  className="bg-white hover:bg-gray-100 text-[#0a85a7] font-bold px-8 py-3.5 rounded-full text-base sm:text-lg shadow-lg font-inter"
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  variants={{
                    hidden:  { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, delay: 0.6 },
                    },
                    hover: {
                      scale: 1.08,
                      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.35)',
                      transition: { duration: 0.12, ease: 'easeOut' },
                    },
                    tap: {
                      scale: 0.95,
                      transition: { duration: 0.08, ease: 'easeOut' },
                    },
                  }}
                >
                  Let's Talk
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center lg:justify-end mt-4 lg:mt-0 relative z-20"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.img
              src="/assets/heroperso.png"
              alt="Data extraction and super intelligence illustration"
              className="heroimage animate-float max-h-[380px] sm:max-h-[480px] lg:max-h-[580px] xl:max-h-[620px] object-contain transform translate-y-6 lg:translate-y-16 -mb-6 lg:-mb-16"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}