import React from 'react';
import { CheckSquare, Calendar, User, Heart } from 'lucide-react';
import { ViewType } from '../types';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'avatar', label: 'Avatar', icon: User },
    { id: 'wishes', label: 'Wishes', icon: Heart }
  ] as const;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CR</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              Cultural Reminder
            </h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onViewChange(id as ViewType)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentView === id
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:block font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;