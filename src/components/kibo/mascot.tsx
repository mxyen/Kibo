"use client";

import { motion } from "framer-motion";

export type MascotEyes = "happy" | "normal" | "sleepy" | "wink";
export type MascotHat = "none" | "cap" | "wizard" | "crown";

export interface MascotProps {
  size?: number;
  color?: string;
  eyes?: MascotEyes;
  hat?: MascotHat;
  glasses?: boolean;
  backpack?: boolean;
  bounce?: boolean;
  className?: string;
}

const EYE_PATHS: Record<MascotEyes, React.ReactNode> = {
  happy: (
    <>
      <path d="M40 62 Q45 52 50 62" stroke="#3a2a52" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M64 62 Q69 52 74 62" stroke="#3a2a52" strokeWidth="5" strokeLinecap="round" fill="none" />
    </>
  ),
  normal: (
    <>
      <ellipse cx="45" cy="60" rx="5.5" ry="8" fill="#3a2a52" />
      <ellipse cx="69" cy="60" rx="5.5" ry="8" fill="#3a2a52" />
    </>
  ),
  sleepy: (
    <>
      <path d="M39 60 H51" stroke="#3a2a52" strokeWidth="5" strokeLinecap="round" />
      <path d="M63 60 H75" stroke="#3a2a52" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  wink: (
    <>
      <ellipse cx="45" cy="60" rx="5.5" ry="8" fill="#3a2a52" />
      <path d="M63 60 H75" stroke="#3a2a52" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
};

export function Mascot({
  size = 120,
  color = "var(--color-primary)",
  eyes = "happy",
  hat = "none",
  glasses = false,
  backpack = false,
  bounce = true,
  className,
}: MascotProps) {
  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      animate={bounce ? { y: [0, -8, 0] } : undefined}
      transition={bounce ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <svg viewBox="0 0 114 114" width={size} height={size} fill="none">
        {backpack && (
          <rect x="6" y="50" width="18" height="34" rx="8" fill="var(--color-secondary)" opacity="0.9" />
        )}

        {/* ears */}
        <path d="M35 30 C28 14 44 8 46 24" fill={color} />
        <path d="M79 30 C86 14 70 8 68 24" fill={color} />

        {/* head */}
        <circle cx="57" cy="60" r="42" fill={color} />

        {/* face */}
        <circle cx="57" cy="62" r="26" fill="white" />

        {EYE_PATHS[eyes]}

        {/* mouth */}
        <path d="M48 74 Q57 80 66 74" stroke="#3a2a52" strokeWidth="4.5" strokeLinecap="round" fill="none" />

        {glasses && (
          <g stroke="#3a2a52" strokeWidth="3" fill="none">
            <circle cx="45" cy="60" r="10" />
            <circle cx="69" cy="60" r="10" />
            <path d="M55 60 H59" />
          </g>
        )}

        {hat === "cap" && (
          <path d="M28 34 Q57 8 86 34 Q57 24 28 34Z" fill="var(--color-secondary)" />
        )}
        {hat === "wizard" && <path d="M40 32 L57 -4 L74 32 Z" fill="var(--color-secondary)" />}
        {hat === "crown" && (
          <path d="M32 30 L40 14 L50 26 L57 12 L64 26 L74 14 L82 30 Z" fill="#f5b301" />
        )}
      </svg>
    </motion.div>
  );
}
