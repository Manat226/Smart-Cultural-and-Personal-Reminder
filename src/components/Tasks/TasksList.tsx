import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Task } from '../../types';
import { localStorage } from '../../utils/localStorage';
import { notificationManager } from '../../utils/notifications';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

interface TasksListProps {
  onNotification: {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showReminder: (message: string) => void;
    showInfo: (message: string) => void;
  };
}

const TasksList: React.FC<TasksListProps> = ({ onNotification }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    const storedTasks = localStorage.getTasks();
    setTasks(storedTasks);
    
    // Request notification permission on component mount
    notificationManager.requestPermission();
  }, []);

  useEffect(() => {
    localStorage.saveTasks(tasks);
  }, [tasks]);

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    let savedTask: Task; // ✅ fixed: define task to use later

    if (editTask) {
      savedTask = {
        ...taskData,
        id: editTask.id,
        createdAt: editTask.createdAt
      };
      setTasks(prev => prev.map(task => 
        task.id === editTask.id ? savedTask : task
      ));
      onNotification.showSuccess(`Task "${savedTask.title}" has been updated successfully!`);
      setEditTask(null);
    } else {
      savedTask = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: new Date()
      };
      setTasks(prev => [...prev, savedTask]);
      onNotification.showSuccess(`Task "${savedTask.title}" has been added successfully!`);
    }

    setIsFormOpen(false);
    
    // Schedule notifications for the new/updated task
    if (!editTask) {
      notificationManager.scheduleReminders(
        savedTask.id,
        savedTask.title,
        savedTask.dueDate,
        savedTask.reminders
      );
    }
  };

  const handleToggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    if (task) {
      if (task.completed) {
        onNotification.showInfo(`Task "${task.title}" marked as pending`);
      } else {
        onNotification.showSuccess(`Task "${task.title}" completed! 🎉`);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    // Cancel any scheduled notifications for this task
    notificationManager.cancelScheduledNotification(id);
    
    if (task) {
      onNotification.showInfo(`Task "${task.title}" has been deleted`);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Tasks</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="personal">👤 Personal</option>
            <option value="work">💼 Work</option>
            <option value="religious">🙏 Religious</option>
            <option value="cultural">🎭 Cultural</option>
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="space-y-6">
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Pending Tasks ({pendingTasks.length})
            </h2>
            <div className="grid gap-3">
              {pendingTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Completed Tasks ({completedTasks.length})
            </h2>
            <div className="grid gap-3">
              {completedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>
        )}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks found</h3>
            <p className="text-gray-500">Create your first task to get started!</p>
          </div>
        )}
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditTask(null);
        }}
        onSave={handleSaveTask}
        editTask={editTask}
        onNotification={onNotification}
      />
    </div>
  );
};

export default TasksList;
