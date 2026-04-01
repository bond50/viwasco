// components/common/animated-counter/index.tsx
'use client';

import React from 'react';
import CountUp from 'react-countup';

interface AnimatedCounterProps {
  value: number | null;
  hasPlus?: boolean;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  hasPlus = false,
  className = '',
}) => {
  const displayValue = value ?? 0;

  return (
    <>
      <CountUp start={0} end={displayValue} duration={2} separator="," className={className} />
      {hasPlus && '+'}
    </>
  );
};
