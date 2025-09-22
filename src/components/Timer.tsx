import React from 'react';
import { Play, Pause, Square } from 'lucide-react';
import type { TimerMode } from '../types';

interface Props {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  mode: TimerMode;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const Timer: React.FC<Props> = ({ minutes, seconds, isRunning, mode, onStart, onPause, onReset }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {mode === 'study' ? '📚 学習時間' : '☕ 休憩時間'}
        </h3>
        <div className="text-6xl font-mono font-bold text-gray-800 mb-6">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={onStart}
            disabled={isRunning}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            <Play size={16} /><span>開始</span>
          </button>
          <button
            onClick={onPause}
            disabled={!isRunning}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            <Pause size={16} /><span>一時停止</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            <Square size={16} /><span>リセット</span>
          </button>
        </div>

        <div className="text-sm text-gray-600">
          {mode === 'study' ? '集中して学習しましょう！' : 'リフレッシュしましょう！'}
        </div>
      </div>
    </div>
  );
};

export default Timer;
