
import React, { useMemo } from 'react';
import { getBallColorClass } from '../types';

interface RouletteMachineProps {
  isSpinning: boolean;
  isDrawing: boolean;
}

export const RouletteMachine: React.FC<RouletteMachineProps> = ({ isSpinning, isDrawing }) => {
  // Generate random floating balls for background effect
  const decorativeBalls = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 20 + 10,
      left: Math.random() * 80 + 10,
      top: Math.random() * 80 + 10,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 1,
      color: Object.values(['bg-yellow-400', 'bg-blue-500', 'bg-red-500', 'bg-emerald-500', 'bg-gray-400'])[Math.floor(Math.random() * 5)]
    }));
  }, []);

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
      {/* Outer Glow */}
      <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${isSpinning ? 'bg-blue-500 scale-110' : 'bg-slate-700'}`}></div>
      
      {/* The Machine Case */}
      <div className="absolute inset-0 border-8 border-slate-700 bg-slate-900/80 rounded-full overflow-hidden shadow-2xl backdrop-blur-sm flex items-center justify-center">
        <div className={`relative w-full h-full transition-all duration-1000 ${isSpinning ? 'animate-[spin_1s_linear_infinite]' : ''}`}>
          {decorativeBalls.map(ball => (
            <div
              key={ball.id}
              className={`absolute rounded-full opacity-60 ${ball.color} ${isSpinning ? 'animate-pulse' : ''}`}
              style={{
                width: `${ball.size}px`,
                height: `${ball.size}px`,
                left: `${ball.left}%`,
                top: `${ball.top}%`,
                transition: 'all 0.5s ease'
              }}
            />
          ))}
          {/* Central Mechanism */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-16 h-16 bg-slate-800 rounded-full border-4 border-slate-600 shadow-inner"></div>
          </div>
        </div>
      </div>

      {/* Exit Port */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-16 bg-gradient-to-t from-slate-800 to-slate-700 rounded-lg border-x-4 border-t-4 border-slate-600 flex items-end justify-center pb-1">
        <div className={`w-12 h-4 rounded-full bg-black/40 ${isDrawing ? 'animate-pulse' : ''}`}></div>
      </div>

      {/* Speed Lines */}
      {isSpinning && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="w-full h-1 bg-blue-400/20 absolute rotate-45 animate-pulse"></div>
          <div className="w-full h-1 bg-blue-400/20 absolute -rotate-45 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};
