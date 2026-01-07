
export interface LottoBallData {
  number: number;
  color: string;
}

export enum GameStatus {
  IDLE = 'IDLE',
  SPINNING = 'SPINNING',
  DRAWING = 'DRAWING',
  FINISHED = 'FINISHED'
}

export const BALL_COLORS = {
  YELLOW: 'bg-yellow-400 border-yellow-500 text-slate-900',
  BLUE: 'bg-blue-500 border-blue-600 text-white',
  RED: 'bg-red-500 border-red-600 text-white',
  GRAY: 'bg-gray-400 border-gray-500 text-white',
  GREEN: 'bg-emerald-500 border-emerald-600 text-white'
};

export const getBallColorClass = (num: number): string => {
  if (num <= 10) return BALL_COLORS.YELLOW;
  if (num <= 20) return BALL_COLORS.BLUE;
  if (num <= 30) return BALL_COLORS.RED;
  if (num <= 40) return BALL_COLORS.GRAY;
  return BALL_COLORS.GREEN;
};
