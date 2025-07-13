import React, { useState, useEffect } from 'react';
import { Clock, Users, Play, Pause, Square, MessageCircle, Trophy, Home, PlusCircle } from 'lucide-react';

// 型定義
interface Room {
  id: number;
  name: string;
  description: string;
  participants: string[];
  currentStudying: number;
  maxParticipants: number;
  category: 'programming' | 'certification' | 'language';
}

interface Message {
  id: number;
  user: string;
  message: string;
  timestamp: string;
}

interface StudyLog {
  id: number;
  date: string;
  minutes: number;
  subject: string;
  timestamp: string;
}

interface NewDiary {
  date: string;
  content: string;
  emotion: number;
}

type TimerMode = 'study' | 'break';
type ViewType = 'rooms' | 'study' | 'stats';

const StudyRoomApp: React.FC = () => {
  // 状態管理（型指定付き）
  const [currentView, setCurrentView] = useState<ViewType>('rooms');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // タイマー関連
  const [timerMinutes, setTimerMinutes] = useState<number>(25);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<TimerMode>('study');
  
  // 学習記録
  const [studyLog, setStudyLog] = useState<StudyLog[]>([]);
  const [dailyGoal, setDailyGoal] = useState<number>(120);
  const [totalStudyTime, setTotalStudyTime] = useState<number>(0);
  
  // チャット
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  
  // 学習部屋データ
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      name: 'プログラミング学習部屋',
      description: 'Web開発・アプリ開発を学ぶ人たちの部屋',
      participants: ['太郎', 'はなこ', 'ゆうた'],
      currentStudying: 2,
      maxParticipants: 6,
      category: 'programming'
    },
    {
      id: 2,
      name: '資格試験対策部屋',
      description: '各種資格試験の勉強をする部屋',
      participants: ['みか', 'けんじ'],
      currentStudying: 1,
      maxParticipants: 8,
      category: 'certification'
    },
    {
      id: 3,
      name: '語学学習部屋',
      description: '英語・その他言語学習の部屋',
      participants: ['あい', 'さとし', 'まり', 'りょう'],
      currentStudying: 3,
      maxParticipants: 10,
      category: 'language'
    }
  ]);

  // タイマー効果
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(prev => prev - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(prev => prev - 1);
          setTimerSeconds(59);
        } else {
          // タイマー終了
          setIsTimerRunning(false);
          if (timerMode === 'study') {
            setTotalStudyTime(prev => prev + 25);
            addStudyLog(25);
            setTimerMode('break');
            setTimerMinutes(5);
            setTimerSeconds(0);
          } else {
            setTimerMode('study');
            setTimerMinutes(25);
            setTimerSeconds(0);
          }
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerMinutes, timerSeconds, timerMode]);

  // 学習記録を追加
  const addStudyLog = (minutes: number): void => {
    const today = new Date().toDateString();
    const newLog: StudyLog = {
      id: Date.now(),
      date: today,
      minutes: minutes,
      subject: currentRoom?.name || '個人学習',
      timestamp: new Date().toLocaleTimeString()
    };
    setStudyLog(prev => [newLog, ...prev]);
  };

  // ログイン処理
  const handleLogin = (): void => {
    if (userName.trim()) {
      setIsLoggedIn(true);
      setMessages([
        { id: 1, user: 'システム', message: 'みなさん、集中して頑張りましょう！', timestamp: '10:30' },
        { id: 2, user: 'はなこ', message: 'おはようございます！今日もよろしくお願いします', timestamp: '10:32' },
        { id: 3, user: 'ゆうた', message: 'React勉強中です。一緒に頑張りましょう', timestamp: '10:35' }
      ]);
    }
  };

  // 部屋に参加
  const joinRoom = (room: Room): void => {
    setCurrentRoom(room);
    setCurrentView('study');
    setRooms(prev => prev.map(r => 
      r.id === room.id 
        ? { ...r, participants: [...r.participants, userName], currentStudying: r.currentStudying + 1 }
        : r
    ));
  };

  // 部屋から退出
  const leaveRoom = (): void => {
    if (currentRoom) {
      setRooms(prev => prev.map(r => 
        r.id === currentRoom.id 
          ? { 
              ...r, 
              participants: r.participants.filter(p => p !== userName),
              currentStudying: Math.max(0, r.currentStudying - 1)
            }
          : r
      ));
    }
    setCurrentRoom(null);
    setCurrentView('rooms');
    setIsTimerRunning(false);
  };

  // メッセージ送信
  const sendMessage = (): void => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now(),
        user: userName,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString().slice(0, 5)
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  // タイマー操作
  const startTimer = (): void => setIsTimerRunning(true);
  const pauseTimer = (): void => setIsTimerRunning(false);
  const resetTimer = (): void => {
    setIsTimerRunning(false);
    setTimerMinutes(timerMode === 'study' ? 25 : 5);
    setTimerSeconds(0);
  };

  // 感情スコアから色を取得
  const getEmotionColor = (score: number): string => {
    const colors: Record<number, string> = {
      1: 'bg-red-500',
      2: 'bg-orange-500',
      3: 'bg-yellow-500',
      4: 'bg-blue-500',
      5: 'bg-green-500'
    };
    return colors[score] || 'bg-gray-500';
  };

  // 今日の学習時間を計算
  const getTodayStudyTime = (): number => {
    const today = new Date().toDateString();
    return studyLog
      .filter(log => log.date === today)
      .reduce((total, log) => total + log.minutes, 0);
  };

  // キーボードイベントハンドラー
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      if (currentView === 'rooms' && !isLoggedIn) {
        handleLogin();
      } else {
        sendMessage();
      }
    }
  };

  // ログイン画面
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">📚</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">オンライン学習部屋</h1>
            <p className="text-gray-600">みんなで一緒に勉強しましょう</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ニックネーム
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                placeholder="学習仲間に表示される名前"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={handleKeyPress}
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              学習部屋に入る
            </button>
          </div>
        </div>
      </div>
    );
  }

  const RoomsView: React.FC = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">学習部屋を選択</h2>
        <p className="text-gray-600">仲間と一緒に集中して学習しましょう</p>
      </div>
  
      <div className="grid gap-4 md:gap-6">
        {rooms.map((room: Room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 border-l-blue-500">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
                <p className="text-gray-600 text-sm">{room.description}</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 shrink-0">
                <Users size={16} />
                <span>{room.currentStudying}/{room.maxParticipants}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  {room.participants.slice(0, 3).map((participant: string, index: number) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                    >
                      {participant[0]}
                    </div>
                  ))}
                  {room.participants.length > 3 && (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                      +{room.participants.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {room.currentStudying}人が学習中
                </span>
              </div>
              
              <button
                onClick={() => joinRoom(room)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors w-full sm:w-auto"
              >
                参加する
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 他のコンポーネントも同様にTypeScript化...

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">オンライン学習部屋</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">こんにちは、{userName}さん</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentView === 'rooms' && <RoomsView />}
        {/* 他のビューも同様に */}
      </main>
    </div>
  );
};

export default StudyRoomApp;