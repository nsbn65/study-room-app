import React from 'react';
import { MessageCircle, Send } from 'lucide-react';
import type { Message } from '../types';

interface Props {
  messages: Message[];
  newMessage: string;
  setNewMessage: (v: string) => void;
  onSend: () => void;
  onEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ChatBox: React.FC<Props> = ({ messages, newMessage, setNewMessage, onSend, onEnter }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <MessageCircle size={18} className="mr-2" />
        チャット
      </h3>

      <div className="h-64 overflow-y-auto border border-gray-200 rounded-md p-3 mb-3 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0">
              {m.user[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-800">{m.user}</span>
                <span className="text-xs text-gray-500">{m.timestamp}</span>
              </div>
              <p className="text-sm text-gray-700 break-words">{m.message}</p>
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
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          onKeyPress={onEnter}
        />
        <button onClick={onSend} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
