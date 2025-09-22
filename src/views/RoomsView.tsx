// src/views/RoomsView.tsx
import React from 'react';
import { PlusCircle } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import type { Room } from '../types';

interface Props {
  rooms: Room[];
  onOpenCreate: () => void;
  onJoin: (room: Room) => void;
}

const RoomsView: React.FC<Props> = ({ rooms, onOpenCreate, onJoin }) => (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">学習部屋を選択</h2>
      <p className="text-gray-600">仲間と一緒に集中して学習しましょう</p>
    </div>

    <div className="flex justify-center">
      <button onClick={onOpenCreate} className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md shadow-md">
        <PlusCircle size={20} /><span>新しい部屋を作成</span>
      </button>
    </div>

    <div className="grid gap-4 md:gap-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onJoin={onJoin} />
      ))}
    </div>
  </div>
);

export default RoomsView;
