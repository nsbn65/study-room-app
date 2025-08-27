import React, { useState, useEffect } from 'react';
import { Clock, Users, Play, Pause, Square, MessageCircle, Trophy, Home, PlusCircle, ArrowLeft, Send, LogOut, Menu, X } from 'lucide-react';
import { FaPen } from 'react-icons/fa';

// 型定義
interface Room {
  id: number;
  name: string;
  description: string;
  participants: string[];
  currentStudying: number;
  maxParticipants: number;
  category: 'programming' | 'certification' | 'language' | 'test' | 'report' | 'self-development' | 'other';
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

type TimerMode = 'study' | 'break';
type ViewType = 'rooms' | 'study' | 'stats';

const CreateRoomModal: React.FC<{
  showCreateRoomModal: boolean;
  setShowCreateRoomModal: (show: boolean) => void;
  newRoomName: string;
  setNewRoomName: (name: string) => void;
  newRoomDescription: string;
  setNewRoomDescription: (desc: string) => void;
  newRoomCategory: 'programming' | 'certification' | 'language' | 'test' | 'report' | 'self-development' | 'other';
  setNewRoomCategory: (cat: 'programming' | 'certification' | 'language' | 'test' | 'report' | 'self-development' | 'other') => void;
  newRoomMaxParticipants: number;
  setNewRoomMaxParticipants: (max: number) => void;
  createRoom: () => void;
}> = ({
  showCreateRoomModal,
  setShowCreateRoomModal,
  newRoomName,
  setNewRoomName,
  newRoomDescription,
  setNewRoomDescription,
  newRoomCategory,
  setNewRoomCategory,
  newRoomMaxParticipants,
  setNewRoomMaxParticipants,
  createRoom
}) => {
  if (!showCreateRoomModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">新しい学習部屋を作成</h3>
          <button
            onClick={() => setShowCreateRoomModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              部屋名
            </label>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="例: React学習部屋"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明
            </label>
            <textarea
              value={newRoomDescription}
              onChange={(e) => setNewRoomDescription(e.target.value)}
              placeholder="部屋の説明を入力してください"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリ
            </label>
            <select
              value={newRoomCategory}
              onChange={(e) => setNewRoomCategory(e.target.value as 'programming' | 'certification' | 'language')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="programming">プログラミング</option>
              <option value="certification">資格試験</option>
              <option value="language">語学学習</option>
              <option value="test">テスト勉強</option>
              <option value="report">レポート作成</option>
              <option value="self-development">自己啓発</option>
              <option value="other">その他</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              最大参加者数: {newRoomMaxParticipants}人
            </label>
            <input
              type="range"
              min="2"
              max="20"
              value={newRoomMaxParticipants}
              onChange={(e) => setNewRoomMaxParticipants(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>2人</span>
              <span>20人</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setShowCreateRoomModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={createRoom}
            disabled={!newRoomName.trim() || !newRoomDescription.trim()}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md transition-colors"
          >
            作成
          </button>
        </div>
      </div>
    </div>
  );
};

const StudyRoomApp: React.FC = () => {
  // 状態管理（型指定付き）
  const [currentView, setCurrentView] = useState<ViewType>('rooms');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // SPのハンバーガーメニュー
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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
  
  // 部屋作成モーダル
  const [showCreateRoomModal, setShowCreateRoomModal] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomDescription, setNewRoomDescription] = useState<string>('');
  const [newRoomCategory, setNewRoomCategory] = useState<'programming' | 'certification' | 'language' | 'test' | 'report' | 'self-development' | 'other'>('programming');
  const [newRoomMaxParticipants, setNewRoomMaxParticipants] = useState<number>(6);
  
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
            // タイマー終了の通知メッセージ
            const completionMessage: Message = {
              id: Date.now(),
              user: 'システム',
              message: `${userName}さんが25分の学習を完了しました！お疲れ様です🎉`,
              timestamp: new Date().toLocaleTimeString().slice(0, 5)
            };
            setMessages(prev => [...prev, completionMessage]);
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
  }, [isTimerRunning, timerMinutes, timerSeconds, timerMode, userName]);

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

  // 初期化時のローカルストレージチェック
  useEffect(() => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    const savedUserName = localStorage.getItem('userName');
    if (savedLogin === 'true' && savedUserName) {
      setIsLoggedIn(true);
      setUserName(savedUserName);
      setMessages([
        { id: 1, user: 'システム', message: 'みなさん、集中して頑張りましょう！', timestamp: '10:30' },
        { id: 2, user: 'はなこ', message: 'おはようございます！今日もよろしくお願いします', timestamp: '10:32' },
        { id: 3, user: 'ゆうた', message: 'React勉強中です。一緒に頑張りましょう', timestamp: '10:35' }
      ]);
    }
  }, []);
  
  // ログイン処理
  const handleLogin = (): void => {
    if (userName.trim()) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', userName);
      setMessages([
        { id: 1, user: 'システム', message: 'みなさん、集中して頑張りましょう！', timestamp: '10:30' },
        { id: 2, user: 'はなこ', message: 'おはようございます！今日もよろしくお願いします', timestamp: '10:32' },
        { id: 3, user: 'ゆうた', message: 'React勉強中です。一緒に頑張りましょう', timestamp: '10:35' }
      ]);
    }
  };

  // ログアウト処理
  const handleLogout = (): void => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    setCurrentView('rooms');
    setCurrentRoom(null);
    setIsTimerRunning(false);
    setMessages([]);
    setStudyLog([]);
  };

  // 部屋作成処理
  const createRoom = (): void => {
    if (newRoomName.trim() && newRoomDescription.trim()) {
      const newRoom: Room = {
        id: Date.now(),
        name: newRoomName,
        description: newRoomDescription,
        participants: [],
        currentStudying: 0,
        maxParticipants: newRoomMaxParticipants,
        category: newRoomCategory
      };
      
      setRooms(prev => [...prev, newRoom]);
      
      // フォームリセット
      setNewRoomName('');
      setNewRoomDescription('');
      setNewRoomCategory('programming');
      setNewRoomMaxParticipants(6);
      setShowCreateRoomModal(false);
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
    
    // 参加メッセージを追加
    const joinMessage: Message = {
      id: Date.now(),
      user: 'システム',
      message: `${userName}さんが参加しました！`,
      timestamp: new Date().toLocaleTimeString().slice(0, 5)
    };
    setMessages(prev => [...prev, joinMessage]);
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
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4 text-center"><FaPen className='text-blue-500 mx-auto' /></div>
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

  // 統計画面
  const StatsView: React.FC = () => {
    // 週間データを生成（実際のアプリでは実データを使用）
    const weeklyData = [
      { day: '月', minutes: 45 },
      { day: '火', minutes: 80 },
      { day: '水', minutes: 120 },
      { day: '木', minutes: 60 },
      { day: '金', minutes: 150 },
      { day: '土', minutes: 90 },
      { day: '日', minutes: getTodayStudyTime() }
    ];

    // 月間学習記録（サンプルデータ）
    const monthlyStats = [
      { week: '第1週', minutes: 420 },
      { week: '第2週', minutes: 580 },
      { week: '第3週', minutes: 650 },
      { week: '第4週', minutes: 720 }
    ];

    // カテゴリ別学習時間
    const categoryData = [
      { category: 'プログラミング', minutes: 340, color: 'bg-blue-500' },
      { category: '資格試験', minutes: 180, color: 'bg-green-500' },
      { category: '語学学習', minutes: 120, color: 'bg-purple-500' }
    ];

    const totalMinutes = studyLog.reduce((total, log) => total + log.minutes, 0);
    const averageDaily = totalMinutes / 7; // 簡易計算
    const totalSessions = Math.floor(totalMinutes / 25);
    const streakDays = 5; // 継続日数（サンプル）

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">学習統計</h2>
          <p className="text-gray-600">あなたの学習進捗を確認しましょう</p>
        </div>

        {/* 総合統計カード */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalMinutes}</div>
            <div className="text-sm text-gray-600">総学習時間</div>
            <div className="text-xs text-gray-500">分</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalSessions}</div>
            <div className="text-sm text-gray-600">完了セッション</div>
            <div className="text-xs text-gray-500">回</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{Math.round(averageDaily)}</div>
            <div className="text-sm text-gray-600">平均学習時間</div>
            <div className="text-xs text-gray-500">分/日</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{streakDays}</div>
            <div className="text-sm text-gray-600">継続日数</div>
            <div className="text-xs text-gray-500">日</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 週間学習時間グラフ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">週間学習時間</h3>
            <div className="space-y-3">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 text-sm text-gray-600">{data.day}</div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-4 relative">
                      <div 
                        className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((data.minutes / 150) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-700">{data.minutes}分</div>
                </div>
              ))}
            </div>
          </div>

          {/* 月間進捗 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">月間進捗</h3>
            <div className="space-y-3">
              {monthlyStats.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-700">{data.week}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{data.minutes}分</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(data.minutes / 800) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* カテゴリ別学習時間 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">カテゴリ別学習時間</h3>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{category.category}</span>
                  <span className="text-sm text-gray-600">{category.minutes}分</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${category.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${(category.minutes / Math.max(...categoryData.map(c => c.minutes))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 学習記録一覧 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">最近の学習記録</h3>
          {studyLog.length > 0 ? (
            <div className="space-y-2">
              {studyLog.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {log.minutes}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{log.subject}</div>
                      <div className="text-xs text-gray-500">{log.date}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{log.timestamp}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">📊</div>
              <p className="text-gray-500">まだ学習記録がありません</p>
              <p className="text-sm text-gray-400">学習を開始して記録を蓄積しましょう！</p>
            </div>
          )}
        </div>

        {/* 目標設定 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">目標設定</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1日の学習目標 (分)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="30"
                  max="480"
                  step="15"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-700 w-16">{dailyGoal}分</span>
              </div>
            </div>
            <div className="bg-blue-50 rounded-md p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-800">今日の進捗</span>
                <span className="font-medium text-blue-800">
                  {getTodayStudyTime()}/{dailyGoal}分 ({Math.round((getTodayStudyTime() / dailyGoal) * 100)}%)
                </span>
              </div>
              <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((getTodayStudyTime() / dailyGoal) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 学習部屋一覧画面
  const RoomsView: React.FC = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">学習部屋を選択</h2>
        <p className="text-gray-600">仲間と一緒に集中して学習しましょう</p>
      </div>

      {/* 部屋作成ボタン */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowCreateRoomModal(true)}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md transition-colors shadow-md"
        >
          <PlusCircle size={20} />
          <span>新しい部屋を作成</span>
        </button>
      </div>
  
      <div className="grid gap-4 md:gap-6">
        {rooms.map((room: Room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 border-l-blue-500">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    room.category === 'programming' ? 'bg-blue-100 text-blue-800' :
                    room.category === 'certification' ? 'bg-green-100 text-green-800' :
                    room.category === 'language' ? 'bg-purple-100 text-purple-800' :
                    room.category === 'test' ? 'bg-yellow-100 text-yellow-800' :
                    room.category === 'report' ? 'bg-red-100 text-red-800' :
                    room.category === 'self-development' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {room.category === 'programming' ? 'プログラミング' :
                     room.category === 'certification' ? '資格試験' :
                     room.category === 'language' ? '語学学習' :
                     room.category === 'test' ? 'テスト勉強' :
                     room.category === 'report' ? 'レポート作成' :
                     room.category === 'self-development' ? '自己啓発' :
                     'その他'}
                  </span>
                </div>
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
                disabled={room.participants.length >= room.maxParticipants}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors w-full sm:w-auto"
              >
                {room.participants.length >= room.maxParticipants ? '満員' : '参加する'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 学習画面
  const StudyView: React.FC = () => {
    if (!currentRoom) return null;

    return (
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-800">{currentRoom.name}</h2>
            <button
              onClick={leaveRoom}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>退出</span>
            </button>
          </div>
          <p className="text-gray-600 text-sm">{currentRoom.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* タイマーセクション */}
          <div className="lg:col-span-2 space-y-6">
            {/* ポモドーロタイマー */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {timerMode === 'study' ? '📚 学習時間' : '☕ 休憩時間'}
                </h3>
                
                <div className="timer-display text-6xl font-mono font-bold text-gray-800 mb-6">
                  {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                </div>
                
                <div className="flex justify-center space-x-4 mb-4">
                  <button
                    onClick={startTimer}
                    disabled={isTimerRunning}
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <Play size={16} />
                    <span>開始</span>
                  </button>
                  
                  <button
                    onClick={pauseTimer}
                    disabled={!isTimerRunning}
                    className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <Pause size={16} />
                    <span>一時停止</span>
                  </button>
                  
                  <button
                    onClick={resetTimer}
                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <Square size={16} />
                    <span>リセット</span>
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  {timerMode === 'study' ? '集中して学習しましょう！' : 'リフレッシュしましょう！'}
                </div>
              </div>
            </div>

            {/* 今日の学習統計 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">今日の学習</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{getTodayStudyTime()}</div>
                  <div className="text-sm text-gray-600">分</div>
                  <div className="text-xs text-gray-500">学習時間</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.floor(getTodayStudyTime() / 25)}</div>
                  <div className="text-sm text-gray-600">セッション</div>
                  <div className="text-xs text-gray-500">完了数</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>目標進捗</span>
                  <span>{Math.round((getTodayStudyTime() / dailyGoal) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((getTodayStudyTime() / dailyGoal) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 参加者一覧 */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Users size={18} className="mr-2" />
                参加者 ({currentRoom.participants.length})
              </h3>
              <div className="space-y-2">
                {currentRoom.participants.map((participant, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {participant[0]}
                    </div>
                    <span className="text-sm text-gray-700">
                      {participant}
                      {participant === userName && <span className="text-blue-600 ml-1">(あなた)</span>}
                    </span>
                    {Math.random() > 0.5 && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="学習中"></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* チャット */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MessageCircle size={18} className="mr-2" />
                チャット
              </h3>
              
              <div className="h-64 overflow-y-auto border border-gray-200 rounded-md p-3 mb-3 space-y-2">
                {messages.map((message) => (
                  <div key={message.id} className="chat-message">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0">
                        {message.user[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-800">{message.user}</span>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700 break-words">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="メッセージを入力..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b relative">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* デスクトップ表示 (md以上) */}
          <div className="hidden md:flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">オンライン学習部屋</h1>
            
            <div className="flex items-center space-x-8">
              {/* ナビゲーションメニュー */}
              <nav className="flex space-x-2">
                <button
                  onClick={() => setCurrentView('rooms')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    currentView === 'rooms' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Home size={16} className="inline mr-1" />
                  部屋一覧
                </button>
                <button
                  onClick={() => setCurrentView('stats')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    currentView === 'stats' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Trophy size={16} className="inline mr-1" />
                  統計
                </button>
              </nav>
              
              {/* ユーザー情報とログアウト */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">こんにちは、{userName}さん</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                  title="ログアウト"
                >
                  <LogOut size={16} />
                  <span className="text-sm">ログアウト</span>
                </button>
              </div>
            </div>
          </div>

          {/* モバイル表示 (md未満) */}
          <div className="flex md:hidden justify-between items-center">
            <h1 className="text-lg font-bold text-gray-800">オンライン学習部屋</h1>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* モバイルメニューのオーバーレイと本体 */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="md:hidden fixed inset-0 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            {/* モバイルメニュー本体 */}
            <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50">
              <div className="px-4 py-3 space-y-3">
                {/* ナビゲーションメニュー */}
                <nav className="space-y-2">
                  <button
                    onClick={() => {
                      setCurrentView('rooms');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center ${
                      currentView === 'rooms' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Home size={16} className="mr-2" />
                    部屋一覧
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('stats');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center ${
                      currentView === 'stats' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Trophy size={16} className="mr-2" />
                    統計
                  </button>
                </nav>

                {/* ユーザー情報 */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm text-gray-600">こんにちは、{userName}さん</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">ログアウト</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      <main className="max-w-6xl mx-auto min-h-screen px-4 py-8 md:px-6 md:py-12">
        {currentView === 'rooms' && <RoomsView />}
        {currentView === 'study' && <StudyView />}
        {currentView === 'stats' && <StatsView />}
      </main>
      
      {/* 部屋作成モーダル */}
      <CreateRoomModal 
        showCreateRoomModal={showCreateRoomModal}
        setShowCreateRoomModal={setShowCreateRoomModal}
        newRoomName={newRoomName}
        setNewRoomName={setNewRoomName}
        newRoomDescription={newRoomDescription}
        setNewRoomDescription={setNewRoomDescription}
        newRoomCategory={newRoomCategory}
        setNewRoomCategory={setNewRoomCategory}
        newRoomMaxParticipants={newRoomMaxParticipants}
        setNewRoomMaxParticipants={setNewRoomMaxParticipants}
        createRoom={createRoom}
      />
    </div>
  );
};

export default StudyRoomApp;