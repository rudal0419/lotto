
import React, { useState, useCallback, useEffect } from 'react';
import { GameStatus, getBallColorClass } from './types';
import { LottoBall } from './components/LottoBall';
import { RouletteMachine } from './components/RouletteMachine';
import { getLuckyFortune } from './geminiService';
import { Play, Square, RotateCcw, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [results, setResults] = useState<number[]>([]);
  const [tempResults, setTempResults] = useState<number[]>([]);
  const [fortune, setFortune] = useState<string | null>(null);
  const [isLoadingFortune, setIsLoadingFortune] = useState(false);

  // Sound effects would go here in a production app

  const startSpinning = () => {
    setResults([]);
    setTempResults([]);
    setFortune(null);
    setStatus(GameStatus.SPINNING);
  };

  const drawOneByOne = useCallback(async () => {
    setStatus(GameStatus.DRAWING);
    
    // Select 6 unique random numbers
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const selected: number[] = [];
    
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * allNumbers.length);
      const picked = allNumbers.splice(randomIndex, 1)[0];
      selected.push(picked);
    }

    // Sequence the drawing animation
    for (let i = 0; i < 6; i++) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Pause between each ball
      setTempResults(prev => [...prev, selected[i]]);
    }

    setResults(selected);
    setStatus(GameStatus.FINISHED);

    // Get AI Fortune
    setIsLoadingFortune(true);
    const luckyMsg = await getLuckyFortune(selected);
    setFortune(luckyMsg);
    setIsLoadingFortune(false);
  }, []);

  const handleStop = () => {
    if (status === GameStatus.SPINNING) {
      drawOneByOne();
    }
  };

  const resetGame = () => {
    setStatus(GameStatus.IDLE);
    setResults([]);
    setTempResults([]);
    setFortune(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 text-center animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 italic">
          SUPER LOTTO 6/45
        </h1>
        <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">
          Ultimate Probability Simulator
        </p>
      </header>

      {/* Main Game Area */}
      <main className="w-full max-w-4xl flex flex-col items-center gap-12">
        
        {/* Roulette Visualization */}
        <section className="relative group">
          <RouletteMachine 
            isSpinning={status === GameStatus.SPINNING} 
            isDrawing={status === GameStatus.DRAWING}
          />
        </section>

        {/* Control Panel */}
        <section className="flex items-center gap-4 bg-slate-800/50 p-6 rounded-3xl border border-slate-700 backdrop-blur-md shadow-2xl">
          {status === GameStatus.IDLE || status === GameStatus.FINISHED ? (
            <button
              onClick={startSpinning}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              <Play className="fill-current group-hover:animate-pulse" />
              START GAME
            </button>
          ) : (
            <button
              onClick={handleStop}
              disabled={status === GameStatus.DRAWING}
              className={`flex items-center gap-2 px-8 py-4 ${status === GameStatus.DRAWING ? 'bg-slate-600 opacity-50 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'} text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-500/20`}
            >
              <Square className="fill-current" />
              STOP & DRAW
            </button>
          )}

          {status === GameStatus.FINISHED && (
            <button
              onClick={resetGame}
              className="p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl transition-all"
              title="Reset"
            >
              <RotateCcw size={24} />
            </button>
          )}
        </section>

        {/* Drawn Numbers Display */}
        <section className="w-full flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-3 min-h-[80px]">
            {/* Draw 6 slots if no results, otherwise show tempResults as they come */}
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="relative">
                {tempResults[idx] ? (
                  <div className="animate-[bounce_0.5s_ease-out]">
                    <LottoBall number={tempResults[idx]} size="lg" />
                  </div>
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-700 bg-slate-800/20">
                    ?
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* AI Fortune Message */}
          {(fortune || isLoadingFortune) && (
            <div className="max-w-xl w-full bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 text-center animate-in zoom-in duration-500">
              <div className="flex items-center justify-center gap-2 text-blue-400 font-bold mb-2">
                <Sparkles size={18} />
                <span>LUCKY FORTUNE</span>
              </div>
              {isLoadingFortune ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                  <p className="text-slate-400 italic">Gemini가 번호를 분석하는 중...</p>
                </div>
              ) : (
                <p className="text-slate-200 text-lg leading-relaxed font-medium">
                  {fortune}
                </p>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Footer Info */}
      <footer className="mt-auto pt-8 text-slate-500 text-sm flex flex-col items-center gap-2">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> 1-10</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 11-20</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> 21-30</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400"></span> 31-40</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> 41-45</span>
        </div>
        <p>© 2024 Super Lotto Master • Powered by Gemini Flash</p>
      </footer>
    </div>
  );
};

export default App;
