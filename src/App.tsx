import React, { useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import Header from './layout/Header';
import RoomsView from './views/RoomsView';
import StudyView from './views/StudyView';
import StatsView from './views/StatsView';
import CreateRoomModal from './components/CreateRoomModal';
import type { Message, Room, StudyLog, TimerMode, ViewType } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('rooms');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // timer
  const [timerMinutes, setTimerMinutes] = useState<number>(25);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<TimerMode>('study');

  // logs / stats
  const [studyLog, setStudyLog] = useState<StudyLog[]>([]);
  const [dailyGoal, setDailyGoal] = useState<number>(120);
  const [totalStudyTime, setTotalStudyTime] = useState<number>(0);

  // chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  // modal
  const [showCreateRoomModal, setShowCreateRoomModal] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomDescription, setNewRoomDescription] = useState<string>('');
  const [newRoomCategory, setNewRoomCategory] = useState<Room['category']>('programming');
  const [newRoomMaxParticipants, setNewRoomMaxParticipants] = useState<number>(6);

  // seed rooms
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: 'プログラミング学習部屋', description: 'Web開発・アプリ開発を学ぶ人たちの部屋', participants: ['太郎', 'はなこ', 'ゆうた'], currentStudying: 2, maxParticipants: 6, category: 'programming' },
    { id: 2, name: '資格試験対策部屋', description: '各種資格試験の勉強をする部屋', participants: ['みか', 'けんじ'], currentStudying: 1, maxParticipants: 8, category: 'certification' },
    { id: 3, name: '語学学習部屋', description: '英語・その他言語学習の部屋', participants: ['あい', 'さとし', 'まり', 'りょう'], currentStudying: 3, maxParticipants: 10, category: 'language' },
  ]);

  // timer effect
  useEffect(() => {
    let interval: number | undefined;

    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setTimerSeconds((s) => {
          if (s > 0) return s - 1;
          // seconds 0
          return 59;
        });
        setTimerMinutes((m) => {
          if (timerSeconds > 0) return m; // seconds reduce case
          if (m > 0) return m - 1;
          // m === 0 && seconds was 0 => finished
          clearInterval(interval);
          setIsTimerRunning(false);

          if (timerMode === 'study') {
            setTotalStudyTime((t) => t + 25);
            addStudyLog(25);
            setTimerMode('break');
            setTimerMinutes(5);
            setTimerSeconds(0);
            setMessages((prev) => [
              ...prev,
              { id: Date.now(), user: 'システム', message: `${userName}さんが25分の学習を完了しました！お疲れ様です🎉`, timestamp: new Date().toLocaleTimeString().slice(0, 5) },
            ]);
          } else {
            setTimerMode('study');
            setTimerMinutes(25);
            setTimerSeconds(0);
          }
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, timerMode, timerSeconds, userName]);

  const addStudyLog = (minutes: number) => {
    const today = new Date().toDateString();
    const newLog: StudyLog = {
      id: Date.now(),
      date: today,
      minutes,
      subject: currentRoom?.name || '個人学習',
      timestamp: new Date().toLocaleTimeString(),
    };
    setStudyLog((prev) => [newLog, ...prev]);
  };

  // restore login
  useEffect(() => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    const savedUserName = localStorage.getItem('userName');
    if (savedLogin === 'true' && savedUserName) {
      setIsLoggedIn(true);
      setUserName(savedUserName);
      setMessages([
        { id: 1, user: 'システム', message: 'みなさん、集中して頑張りましょう！', timestamp: '10:30' },
        { id: 2, user: 'はなこ', message: 'おはようございます！今日もよろしくお願いします', timestamp: '10:32' },
        { id: 3, user: 'ゆうた', message: 'React勉強中です。一緒に頑張りましょう', timestamp: '10:35' },
      ]);
    }
  }, []);

  const handleLogin = () => {
    if (!userName.trim()) return;
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', userName);
    setMessages([
      { id: 1, user: 'システム', message: 'みなさん、集中して頑張りましょう！', timestamp: '10:30' },
      { id: 2, user: 'はなこ', message: 'おはようございます！今日もよろしくお願いします', timestamp: '10:32' },
      { id: 3, user: 'ゆうた', message: 'React勉強中です。一緒に頑張りましょう', timestamp: '10:35' },
    ]);
  };

  const handleLogout = () => {
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

  const createRoom = () => {
    if (!newRoomName.trim() || !newRoomDescription.trim()) return;
    const newRoom: Room = {
      id: Date.now(),
      name: newRoomName,
      description: newRoomDescription,
      participants: [],
      currentStudying: 0,
      maxParticipants: newRoomMaxParticipants,
      category: newRoomCategory,
    };
    setRooms((prev) => [...prev, newRoom]);
    setNewRoomName('');
    setNewRoomDescription('');
    setNewRoomCategory('programming');
    setNewRoomMaxParticipants(6);
    setShowCreateRoomModal(false);
  };

  const joinRoom = (room: Room) => {
    setCurrentRoom(room);
    setCurrentView('study');
    setRooms((prev) =>
      prev.map((r) =>
        r.id === room.id
          ? { ...r, participants: [...r.participants, userName], currentStudying: r.currentStudying + 1 }
          : r
      )
    );
    setMessages((prev) => [...prev, { id: Date.now(), user: 'システム', message: `${userName}さんが参加しました！`, timestamp: new Date().toLocaleTimeString().slice(0, 5) }]);
  };

  const leaveRoom = () => {
    if (currentRoom) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === currentRoom.id
            ? {
                ...r,
                participants: r.participants.filter((p) => p !== userName),
                currentStudying: Math.max(0, r.currentStudying - 1),
              }
            : r
        )
      );
    }
    setCurrentRoom(null);
    setCurrentView('rooms');
    setIsTimerRunning(false);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const m: Message = { id: Date.now(), user: userName, message: newMessage, timestamp: new Date().toLocaleTimeString().slice(0, 5) };
    setMessages((prev) => [...prev, m]);
    setNewMessage('');
  };

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(timerMode === 'study' ? 25 : 5);
    setTimerSeconds(0);
  };

  const getTodayStudyTime = () => {
    const today = new Date().toDateString();
    return studyLog.filter((l) => l.date === today).reduce((t, l) => t + l.minutes, 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    if (currentView === 'rooms' && !isLoggedIn) {
      handleLogin();
    } else {
      sendMessage();
    }
  };

  // 未ログイン画面だけはここに（元コードのまま）
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
              <label className="block text-sm font-medium text-gray-700 mb-2">ニックネーム</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="学習仲間に表示される名前"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={handleKeyPress}
              />
            </div>

            <button onClick={handleLogin} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
              学習部屋に入る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userName={userName}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="max-w-6xl mx-auto min-h-screen px-4 py-8 md:px-6 md:py-12">
        {currentView === 'rooms' && (
          <RoomsView
            rooms={rooms}
            onOpenCreate={() => setShowCreateRoomModal(true)}
            onJoin={joinRoom}
          />
        )}
        {currentView === 'study' && currentRoom && (
          <StudyView
            room={currentRoom}
            onLeave={leaveRoom}
            minutes={timerMinutes}
            seconds={timerSeconds}
            isRunning={isTimerRunning}
            mode={timerMode}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={resetTimer}
            todayMinutes={getTodayStudyTime()}
            dailyGoal={dailyGoal}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSend={sendMessage}
            onEnter={handleKeyPress}
            currentUser={userName}
          />
        )}
        {currentView === 'stats' && (
          <StatsView
            studyLog={studyLog}
            dailyGoal={dailyGoal}
            setDailyGoal={setDailyGoal}
            todayMinutes={getTodayStudyTime()}
          />
        )}
      </main>

      <CreateRoomModal
        show={showCreateRoomModal}
        onClose={() => setShowCreateRoomModal(false)}
        newRoomName={newRoomName}
        setNewRoomName={setNewRoomName}
        newRoomDescription={newRoomDescription}
        setNewRoomDescription={setNewRoomDescription}
        newRoomCategory={newRoomCategory}
        setNewRoomCategory={setNewRoomCategory}
        newRoomMaxParticipants={newRoomMaxParticipants}
        setNewRoomMaxParticipants={setNewRoomMaxParticipants}
        onCreate={createRoom}
      />
    </div>
  );
};

export default App;
