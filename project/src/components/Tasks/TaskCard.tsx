import React from 'react';
import { Clock, Calendar, Flag, Trash2, Edit3 } from 'lucide-react';
import { Task } from '../../types';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const categoryIcons = {
    personal: '👤',
    work: '💼',
    religious: '🙏',
    cultural: '🎭'
  };

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md ${
      task.completed ? 'opacity-60' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            {task.completed && <span className="text-xs">✓</span>}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              <span className="text-lg">{categoryIcons[task.category]}</span>
            </div>
            
            {task.description && (
              <p className="text-gray-600 text-sm mb-2">{task.description}</p>
            )}
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{format(task.dueDate, 'MMM dd, yyyy')}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{format(task.dueDate, 'h:mm a')}</span>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                <Flag size={10} className="inline mr-1" />
                {task.priority}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-3">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;