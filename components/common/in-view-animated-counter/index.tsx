// components/common/in-view-animated-counter/index.tsx
'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { AnimatedCounter } from '@/components/common/animated-counter';

interface InViewAnimatedCounterProps {
  value: number | null;
  hasPlus?: boolean;
  className?: string;
}

export const InViewAnimatedCounter: React.FC<InViewAnimatedCounterProps> = ({
  value,
  hasPlus = false,
  className = '',
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {inView ? (
        <AnimatedCounter value={value} hasPlus={hasPlus} className={className} />
      ) : (
        <>0{hasPlus && '+'}</>
      )}
    </div>
  );
};
