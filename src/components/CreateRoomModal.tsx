import React from 'react';
import type { Room } from '../types';

type Category = Room['category'];

interface Props {
  show: boolean;
  onClose: () => void;
  newRoomName: string;
  setNewRoomName: (v: string) => void;
  newRoomDescription: string;
  setNewRoomDescription: (v: string) => void;
  newRoomCategory: Category;
  setNewRoomCategory: (v: Category) => void;
  newRoomMaxParticipants: number;
  setNewRoomMaxParticipants: (v: number) => void;
  onCreate: () => void;
}

const CreateRoomModal: React.FC<Props> = ({
  show,
  onClose,
  newRoomName,
  setNewRoomName,
  newRoomDescription,
  setNewRoomDescription,
  newRoomCategory,
  setNewRoomCategory,
  newRoomMaxParticipants,
  setNewRoomMaxParticipants,
  onCreate,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">新しい学習部屋を作成</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">部屋名</label>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="例: React学習部屋"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">説明</label>
            <textarea
              value={newRoomDescription}
              onChange={(e) => setNewRoomDescription(e.target.value)}
              placeholder="部屋の説明を入力してください"
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
            <select
              value={newRoomCategory}
              onChange={(e) => setNewRoomCategory(e.target.value as Category)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              min={2}
              max={20}
              value={newRoomMaxParticipants}
              onChange={(e) => setNewRoomMaxParticipants(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>2人</span><span>20人</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
            キャンセル
          </button>
          <button
            onClick={onCreate}
            disabled={!newRoomName.trim() || !newRoomDescription.trim()}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md"
          >
            作成
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;
