import React from 'react';
import type { StudyLog } from '../types';

interface Props {
  studyLog: StudyLog[];
  dailyGoal: number;
  setDailyGoal: (v: number) => void;
  todayMinutes: number;
}

const StatsView: React.FC<Props> = ({ studyLog, dailyGoal, setDailyGoal, todayMinutes }) => {
  // 集計
  const totalMinutes = studyLog.reduce((t, l) => t + l.minutes, 0);
  const averageDaily = totalMinutes / 7;
  const totalSessions = Math.floor(totalMinutes / 25);
  const streakDays = 5;

  // ダミーデータ
  const weeklyData = [
    { day: '月', minutes: 45 },
    { day: '火', minutes: 80 },
    { day: '水', minutes: 120 },
    { day: '木', minutes: 60 },
    { day: '金', minutes: 150 },
    { day: '土', minutes: 90 },
    { day: '日', minutes: todayMinutes },
  ];

  const monthlyStats = [
    { week: '第1週', minutes: 420 },
    { week: '第2週', minutes: 580 },
    { week: '第3週', minutes: 650 },
    { week: '第4週', minutes: 720 },
  ];

  const categoryData = [
    { category: 'プログラミング', minutes: 340, color: 'bg-blue-500' },
    { category: '資格試験', minutes: 180, color: 'bg-green-500' },
    { category: '語学学習', minutes: 120, color: 'bg-purple-500' },
  ];
  const maxCategory = Math.max(...categoryData.map((c) => c.minutes));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">学習統計</h2>
        <p className="text-gray-600">あなたの学習進捗を確認しましょう</p>
      </div>

      {/* 総合統計カード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="総学習時間" value={totalMinutes} unit="分" color="text-blue-600" />
        <StatCard label="完了セッション" value={totalSessions} unit="回" color="text-green-600" />
        <StatCard label="平均学習時間" value={Math.round(averageDaily)} unit="分/日" color="text-purple-600" />
        <StatCard label="継続日数" value={streakDays} unit="日" color="text-orange-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 週間学習時間（バー） */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">週間学習時間</h3>
          <div className="space-y-3">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 text-sm text-gray-600">{d.day}</div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-4 relative">
                    <div
                      className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((d.minutes / 150) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-700">{d.minutes}分</div>
              </div>
            ))}
          </div>
        </div>

        {/* 月間進捗 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">月間進捗</h3>
          <div className="space-y-3">
            {monthlyStats.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">{d.week}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{d.minutes}分</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(d.minutes / 800) * 100}%` }}
                    />
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
          {categoryData.map((c, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{c.category}</span>
                <span className="text-sm text-gray-600">{c.minutes}分</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${c.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${(c.minutes / maxCategory) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 最近の学習記録 */}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">1日の学習目標 (分)</label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min={30}
                max={480}
                step={15}
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
                {todayMinutes}/{dailyGoal}分 ({Math.round((todayMinutes / dailyGoal) * 100)}%)
              </span>
            </div>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((todayMinutes / dailyGoal) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number; unit: string; color: string }> = ({
  label,
  value,
  unit,
  color,
}) => (
  <div className="bg-white rounded-lg shadow-md p-4 text-center">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-xs text-gray-500">{unit}</div>
  </div>
);

export default StatsView;