import React from 'react';
import { Users } from 'lucide-react';
import type { Room } from '../types';

interface Props {
  room: Room;
  onJoin: (room: Room) => void;
}

const RoomCard: React.FC<Props> = ({ room, onJoin }) => {
  const categoryBadge = (cat: Room['category']) => {
    switch (cat) {
      case 'programming': return 'bg-blue-100 text-blue-800';
      case 'certification': return 'bg-green-100 text-green-800';
      case 'language': return 'bg-purple-100 text-purple-800';
      case 'test': return 'bg-yellow-100 text-yellow-800';
      case 'report': return 'bg-red-100 text-red-800';
      case 'self-development': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 border-l-blue-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${categoryBadge(room.category)}`}>
              {{
                programming: 'プログラミング',
                certification: '資格試験',
                language: '語学学習',
                test: 'テスト勉強',
                report: 'レポート作成',
                'self-development': '自己啓発',
                other: 'その他',
              }[room.category]}
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
            {room.participants.slice(0, 3).map((p, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
              >
                {p[0]}
              </div>
            ))}
            {room.participants.length > 3 && (
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                +{room.participants.length - 3}
              </div>
            )}
          </div>
          <span className="text-sm text-gray-500">{room.currentStudying}人が学習中</span>
        </div>

        <button
          onClick={() => onJoin(room)}
          disabled={room.participants.length >= room.maxParticipants}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors w-full sm:w-auto"
        >
          {room.participants.length >= room.maxParticipants ? '満員' : '参加する'}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
