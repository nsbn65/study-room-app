import React from 'react';
import { Home, Trophy, LogOut, Menu, X } from 'lucide-react';
import type { ViewType } from '../types';

interface Props {
  userName: string;
  currentView: ViewType;
  setCurrentView: (v: ViewType) => void;
  onLogout: () => void;

  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (v: boolean) => void;
}

const Header: React.FC<Props> = ({
  userName, currentView, setCurrentView, onLogout,
  isMobileMenuOpen, setIsMobileMenuOpen
}) => {
  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Desktop */}
        <div className="hidden md:flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">オンライン学習部屋</h1>
          <div className="flex items-center space-x-8">
            <nav className="flex space-x-2">
              <NavButton active={currentView === 'rooms'} onClick={() => setCurrentView('rooms')}>
                <Home size={16} className="inline mr-1" />部屋一覧
              </NavButton>
              <NavButton active={currentView === 'stats'} onClick={() => setCurrentView('stats')}>
                <Trophy size={16} className="inline mr-1" />統計
              </NavButton>
            </nav>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">こんにちは、{userName}さん</span>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md"
              >
                <LogOut size={16} /><span className="text-sm">ログアウト</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden justify-between items-center">
          <h1 className="text-lg font-bold text-gray-800">オンライン学習部屋</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50">
          <div className="px-4 py-3 space-y-3">
            <nav className="space-y-2">
              <NavItem
                active={currentView === 'rooms'}
                onClick={() => { setCurrentView('rooms'); setIsMobileMenuOpen(false); }}
              >
                <Home size={16} className="mr-2" />部屋一覧
              </NavItem>
              <NavItem
                active={currentView === 'stats'}
                onClick={() => { setCurrentView('stats'); setIsMobileMenuOpen(false); }}
              >
                <Trophy size={16} className="mr-2" />統計
              </NavItem>
            </nav>

            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-sm text-gray-600">こんにちは、{userName}さん</span>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md"
              >
                <LogOut size={16} /><span className="text-sm">ログアウト</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-md text-sm transition-colors ${active ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
  >
    {children}
  </button>
);

const NavItem: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${active ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
  >
    {children}
  </button>
);

export default Header;
