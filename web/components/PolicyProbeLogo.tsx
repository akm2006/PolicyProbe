"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

export type LogoState = "neutral" | "evaluating" | "pass" | "fail";

interface PolicyProbeLogoProps {
  state?: LogoState;
  size?: number;
  className?: string;
  interactive?: boolean;
}

export const PolicyProbeLogo: React.FC<PolicyProbeLogoProps> = ({
  state = "neutral",
  size = 48,
  className = "",
  interactive = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Color mapping based on DESIGN.md §8 (Violet for Brand/Observed, Green for PASS, Red for FAIL)
  const getAssertionFill = () => {
    switch (state) {
      case "pass":
        return "#22C55E"; // --pp-pass
      case "fail":
        return "#EF4444"; // --pp-fail
      case "evaluating":
        return "#A855F7"; // Active pulsing
      default:
        return "#734AF9"; // Canonical probe violet
    }
  };

  // Spatial offsets communicating conformance vs mismatch (DESIGN.md §6.3)
  const observedVariants = {
    neutral: { x: 0, y: 0, opacity: 1 },
    evaluating: { x: [0, 4, 0], y: [0, -3, 0], transition: { repeat: Infinity, duration: 1.2 } },
    fail: { x: 7, y: -5, opacity: 1 },
    pass: { x: 0, y: 0, opacity: 1 },
  };

  const expectedVariants = {
    neutral: { x: 0, y: 0, opacity: 1 },
    evaluating: { x: [0, -4, 0], y: [0, 3, 0], transition: { repeat: Infinity, duration: 1.2 } },
    fail: { x: -7, y: 5, opacity: 1 },
    pass: { x: 0, y: 0, opacity: 1 },
  };

  const assertionVariants = {
    neutral: { scale: 1, opacity: 1 },
    evaluating: { opacity: [0.4, 1, 0.4], transition: { repeat: Infinity, duration: 0.6 } },
    fail: { scale: 0.96, opacity: 1 },
    pass: { scale: [1, 1.05, 1], transition: { duration: 0.3 } },
  };

  const computedHeight = Math.round((size * 853) / 666);

  return (
    <motion.svg
      width={size}
      height={computedHeight}
      viewBox="0 0 666 853"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none shrink-0 ${className}`}
      whileHover={interactive && !shouldReduceMotion ? { scale: 1.04 } : undefined}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
    >
      {/* Path 1: Expected State (inherits text color so it reads on light and dark grounds) */}
      <motion.path
        d="M0 180L351 297.5L207.5 362L97 323.5V638.5L245 685V597.5L374.5 646.5V853L0 730.5V180Z"
        fill="currentColor"
        variants={shouldReduceMotion ? {} : expectedVariants}
        animate={state}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      />

      {/* Path 2: Observed State (Violet Form) */}
      <motion.path
        d="M301 580L429.5 520.5L560 562.5V234.5L391 180V264L275.5 218.5V0L666 122.5V712L301 580Z"
        fill="#734AF9"
        variants={shouldReduceMotion ? {} : observedVariants}
        animate={state}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      />

      {/* Path 3: Assertion / Comparison Point */}
      <motion.path
        d="M245 390L391 332.5V489L245 542.5V390Z"
        fill={getAssertionFill()}
        variants={shouldReduceMotion ? {} : assertionVariants}
        animate={state}
        transition={{ duration: 0.25 }}
      />
    </motion.svg>
  );
};
