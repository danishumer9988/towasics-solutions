import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TypewriterFadeGradient from './animations/TypewriterFadeGradient';

const HERO_WORDS = [
  'SUPER INTELLIGENCE',
  'INTELLIGENT AUTOMATION',
  'INSIGHTS',
  'COMPETITIVE ADVANTAGE',
  'SI-BOTS',
  'AUTONOMOUS SYSTEMS',
];

export default function HomeHero() {
  return (
    /* 100% original background and spacing */
    <section className="relative custombackgroud min-h-[500px] lg:min-h-[620px] flex items-center py-10 lg:pt-16 lg:pb-0">
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

              {/* 🌟 Typewriter + Fade + Gradient 🌟 */}
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