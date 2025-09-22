import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Timer from '../components/Timer';
import ChatBox from '../components/ChatBox';
import ParticipantsList from '../components/ParticipantsList';
import type { Message, Room, TimerMode } from '../types';

interface Props {
  room: Room;
  onLeave: () => void;

  // timer
  minutes: number; seconds: number; isRunning: boolean; mode: TimerMode;
  onStart: () => void; onPause: () => void; onReset: () => void;

  // stats block
  todayMinutes: number; dailyGoal: number;

  // chat
  messages: Message[]; newMessage: string;
  setNewMessage: (v: string) => void;
  onSend: () => void;
  onEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  currentUser: string;
}

const StudyView: React.FC<Props> = (props) => {
  const {
    room, onLeave,
    minutes, seconds, isRunning, mode, onStart, onPause, onReset,
    todayMinutes, dailyGoal,
    messages, newMessage, setNewMessage, onSend, onEnter,
    currentUser
  } = props;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800">{room.name}</h2>
          <button onClick={onLeave} className="flex items-center space-x-2 text-red-600 hover:text-red-700">
            <ArrowLeft size={16} /><span>退出</span>
          </button>
        </div>
        <p className="text-gray-600 text-sm">{room.description}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Timer
            minutes={minutes} seconds={seconds}
            isRunning={isRunning} mode={mode}
            onStart={onStart} onPause={onPause} onReset={onReset}
          />

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">今日の学習</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{todayMinutes}</div>
                <div className="text-sm text-gray-600">分</div>
                <div className="text-xs text-gray-500">学習時間</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.floor(todayMinutes / 25)}</div>
                <div className="text-sm text-gray-600">セッション</div>
                <div className="text-xs text-gray-500">完了数</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>目標進捗</span>
                <span>{Math.round((todayMinutes / dailyGoal) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                     style={{ width: `${Math.min((todayMinutes / dailyGoal) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ParticipantsList participants={room.participants} currentUser={currentUser} />
          <ChatBox
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSend={onSend}
            onEnter={onEnter}
          />
        </div>
      </div>
    </div>
  );
};

export default StudyView;
