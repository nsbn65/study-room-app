import React from 'react';

interface Props {
  participants: string[];
  currentUser: string;
}

const ParticipantsList: React.FC<Props> = ({ participants, currentUser }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">参加者 ({participants.length})</h3>
      <div className="space-y-2">
        {participants.map((p, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {p[0]}
            </div>
            <span className="text-sm text-gray-700">
              {p}
              {p === currentUser && <span className="text-blue-600 ml-1">(あなた)</span>}
            </span>
            {/* 擬似ステータスはここで表現するなら prop で受ける */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsList;
