
import React from 'react';
import { getBallColorClass } from '../types';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const LottoBall: React.FC<LottoBallProps> = ({ number, size = 'md', animated = false }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm border-2',
    md: 'w-14 h-14 text-xl border-[3px]',
    lg: 'w-20 h-20 text-3xl border-4'
  };

  const colorClass = getBallColorClass(number);

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${colorClass} 
        rounded-full flex items-center justify-center font-extrabold 
        ball-shadow shadow-lg transition-all duration-500
        ${animated ? 'animate-bounce' : ''}
      `}
    >
      {number}
    </div>
  );
};
