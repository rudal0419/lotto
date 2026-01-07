import React, { useState, useCallback, useEffect } from 'react';
import { GameStatus } from './types';
import { LottoBall } from './components/LottoBall';
import { RouletteMachine } from './components/RouletteMachine';
import { getLuckyFortune } from './geminiService';
import { Play, Square, RotateCcw, Sparkles, Key, ExternalLink, Info, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'SUPER_LOTTO_API_KEY';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [tempResults, setTempResults] = useState<number[]>([]);
  const [fortune, setFortune] = useState<string | null>(null);
  const [isLoadingFortune, setIsLoadingFortune] = useState(false);
  
  // API Key 관련 상태
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState(true);
  const [inputError, setInputError] = useState(false);

  // 컴포넌트 마운트 시 저장된 API Key 확인
  useEffect(() => {
    const savedKey = localStorage.getItem(STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
      setShowKeyModal(false);
    }
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim().length < 10) {
      setInputError(true);
      return;
    }
    localStorage.setItem(STORAGE_KEY, apiKey.trim());
    setInputError(false);
    setShowKeyModal(false);
  };

  const startSpinning = () => {
    setTempResults([]);
    setFortune(null);
    setStatus(GameStatus.SPINNING);
  };

  const drawOneByOne = useCallback(async () => {
    setStatus(GameStatus.DRAWING);
    
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const selected: number[] = [];
    
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * allNumbers.length);
      const picked = allNumbers.splice(randomIndex, 1)[0];
      selected.push(picked);
    }

    for (let i = 0; i < 6; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setTempResults(prev => [...prev, selected[i]]);
    }

    setStatus(GameStatus.FINISHED);

    setIsLoadingFortune(true);
    // 저장된 API Key를 서비스에 전달
    const luckyMsg = await getLuckyFortune(selected, apiKey);
    
    if (luckyMsg.includes("API_KEY_ERROR")) {
      setShowKeyModal(true);
      setFortune("API 키가 유효하지 않습니다. 다시 설정해주세요.");
    } else {
      setFortune(luckyMsg);
    }
    setIsLoadingFortune(false);
  }, [apiKey]);

  const handleStop = () => {
    if (status === GameStatus.SPINNING) {
      drawOneByOne();
    }
  };

  const resetGame = () => {
    setStatus(GameStatus.IDLE);
    setTempResults([]);
    setFortune(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 md:p-8 relative text-slate-100 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* API Key Input Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-500 flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 animate-float border border-blue-500/20">
              <Key className="text-blue-400" size={40} />
            </div>
            
            <h2 className="text-3xl font-black mb-4 tracking-tight text-center">API Key 설정</h2>
            <p className="text-slate-400 mb-8 leading-relaxed text-center">
              AI 행운 분석 기능을 사용하기 위해 <br/>
              <span className="text-blue-400 font-semibold text-sm">Gemini API Key</span>를 입력해주세요.
            </p>
            
            <form onSubmit={handleSaveApiKey} className="w-full space-y-6">
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AI Studio에서 발급받은 키 입력"
                  className={`w-full bg-slate-900/50 border ${inputError ? 'border-red-500' : 'border-slate-600'} rounded-2xl px-5 py-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                />
                {inputError && <p className="text-red-500 text-xs mt-2 ml-1">올바른 API Key를 입력해주세요.</p>}
              </div>
              
              <button
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
              >
                <CheckCircle2 size={20} />
                설정 완료 및 시작하기
              </button>
              
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                <div className="flex items-start gap-3 text-xs text-slate-500 leading-normal">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <p>
                    입력하신 키는 브라우저에만 저장되며 외부로 유출되지 않습니다. <br/>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-0.5">
                      키 발급받기 <ExternalLink size={10} />
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-10 text-center animate-in fade-in slide-in-from-top duration-1000">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent mb-4 tracking-tighter">
          SUPER LOTTO <span className="text-blue-500">6/45</span>
        </h1>
        <p className="text-slate-500 font-medium">Gemini AI와 함께하는 프리미엄 번호 추첨기</p>
      </header>

      {/* Main Game Area */}
      <main className="w-full max-w-4xl flex flex-col items-center gap-14">
        <section className="relative">
          <RouletteMachine 
            isSpinning={status === GameStatus.SPINNING} 
            isDrawing={status === GameStatus.DRAWING}
          />
        </section>

        <section className="flex items-center gap-4 bg-slate-800/40 p-5 rounded-[2rem] border border-slate-700/50 backdrop-blur-xl shadow-2xl relative z-10">
          {status === GameStatus.IDLE || status === GameStatus.FINISHED ? (
            <button
              onClick={startSpinning}
              className="group flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black rounded-2xl transition-all active:scale-95 shadow-2xl shadow-blue-500/30"
            >
              <Play className="fill-current group-hover:scale-110 transition-transform" />
              추첨 시작하기
            </button>
          ) : (
            <button
              onClick={handleStop}
              disabled={status === GameStatus.DRAWING}
              className={`flex items-center gap-3 px-10 py-5 ${status === GameStatus.DRAWING ? 'bg-slate-700 opacity-50 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'} text-white font-black rounded-2xl transition-all active:scale-95 shadow-2xl shadow-red-500/30`}
            >
              <Square className="fill-current" />
              번호 추출
            </button>
          )}

          {status === GameStatus.FINISHED && (
            <button
              onClick={resetGame}
              className="p-5 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-2xl transition-all border border-slate-600/50"
              title="초기화"
            >
              <RotateCcw size={24} />
            </button>
          )}
        </section>

        <section className="w-full flex flex-col items-center gap-8 relative z-10">
          <div className="flex flex-wrap justify-center gap-4 min-h-[100px]">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="relative group">
                {tempResults[idx] ? (
                  <div className="animate-in zoom-in spin-in-6 duration-500">
                    <LottoBall number={tempResults[idx]} size="lg" />
                  </div>
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-dashed border-slate-700/50 flex items-center justify-center text-slate-700 bg-slate-800/10 group-hover:border-slate-600 transition-colors">
                    <span className="text-2xl font-black">?</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {(fortune || isLoadingFortune) && (
            <div className="max-w-2xl w-full bg-slate-800/40 border border-slate-700/50 rounded-[2rem] p-8 text-center animate-in slide-in-from-bottom-4 duration-700 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-center gap-2.5 text-blue-400 font-black text-sm tracking-widest mb-4 uppercase">
                <Sparkles size={18} className="animate-pulse" />
                <span>AI 행운 분석 결과</span>
              </div>
              {isLoadingFortune ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  </div>
                  <p className="text-slate-500 text-sm italic">Gemini가 번호의 기운을 해석하는 중...</p>
                </div>
              ) : (
                <p className="text-slate-200 text-lg leading-relaxed font-semibold">
                  "{fortune}"
                </p>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="mt-auto pt-12 pb-4 text-slate-500 text-xs flex flex-col items-center gap-4 relative z-10 w-full max-w-2xl">
        <div className="flex flex-wrap justify-center gap-6 px-6 py-3 bg-slate-800/30 rounded-full border border-slate-700/30">
          <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> 1-10</span>
          <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> 11-20</span>
          <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> 21-30</span>
          <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span> 31-40</span>
          <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 41-45</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-50">
          <p>© 2024 Super Lotto Master</p>
          <button 
            onClick={() => setShowKeyModal(true)} 
            className="hover:text-blue-400 underline transition-colors"
          >
            API 키 변경하기
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;