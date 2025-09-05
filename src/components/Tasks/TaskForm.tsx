import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Task } from '../../types';
import { notificationManager } from '../../utils/notifications';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  editTask?: Task | null;
  onNotification?: {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showReminder: (message: string) => void;
    showInfo: (message: string) => void;
  };
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSave, editTask, onNotification }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    category: 'personal' as Task['category'],
    priority: 'medium' as Task['priority'],
    reminders: [
      { id: crypto.randomUUID(), time: '1hour' as const, enabled: true }
    ]
  });
  
  const [customReminderMessages, setCustomReminderMessages] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (editTask) {
      const dueDate = new Date(editTask.dueDate);
      setFormData({
        title: editTask.title,
        description: editTask.description,
        dueDate: dueDate.toISOString().split('T')[0],
        dueTime: dueDate.toTimeString().slice(0, 5),
        category: editTask.category,
        priority: editTask.priority,
        reminders: editTask.reminders
      });
      // Load custom reminder messages
      const messages: {[key: string]: string} = {};
      editTask.reminders.forEach(reminder => {
        if (reminder.customMessage) {
          messages[reminder.id] = reminder.customMessage;
        }
      });
      setCustomReminderMessages(messages);
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        dueTime: '',
        category: 'personal',
        priority: 'medium',
        reminders: [{ id: crypto.randomUUID(), time: '1hour', enabled: true }]
      });
      setCustomReminderMessages({});
    }
  }, [editTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      onNotification?.showError('Task title is required');
      return;
    }
    
    if (!formData.dueDate || !formData.dueTime) {
      onNotification?.showError('Due date and time are required');
      return;
    }
    
    const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
    
    if (dueDateTime <= new Date()) {
      onNotification?.showError('Due date must be in the future');
      return;
    }
    
    // Add custom messages to reminders
    const remindersWithMessages = formData.reminders.map(reminder => ({
      ...reminder,
      customMessage: customReminderMessages[reminder.id]
    }));
    
    onSave({
      ...formData,
      dueDate: dueDateTime,
      completed: false,
      reminders: remindersWithMessages
    });
    
    // Schedule notifications for this task
    notificationManager.scheduleReminders(
      editTask?.id || crypto.randomUUID(),
      formData.title,
      dueDateTime,
      remindersWithMessages
    );
    
    // Show reminder notification about scheduled reminders
    const enabledReminders = remindersWithMessages.filter(r => r.enabled);
    if (enabledReminders.length > 0) {
      onNotification?.showReminder(`${enabledReminders.length} reminder(s) scheduled for "${formData.title}"`);
    }
    
    onClose();
  };

  const addReminder = () => {
    const newReminder = { id: crypto.randomUUID(), time: '1hour' as const, enabled: true };
    setFormData(prev => ({
      ...prev,
      reminders: [...prev.reminders, newReminder]
    }));
  };

  const removeReminder = (id: string) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.filter(r => r.id !== id)
    }));
    setCustomReminderMessages(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const updateReminder = (id: string, field: 'time' | 'enabled', value: any) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => 
        r.id === id ? { ...r, [field]: value } : r
      )
    }));
  };

  const updateCustomMessage = (id: string, message: string) => {
    setCustomReminderMessages(prev => ({
      ...prev,
      [id]: message
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {editTask ? 'Edit Task' : 'New Task'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Task description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.dueTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Task['category'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="personal">👤 Personal</option>
                  <option value="work">💼 Work</option>
                  <option value="religious">🙏 Religious</option>
                  <option value="cultural">🎭 Cultural</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>

            {/* Reminders Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Reminders
                </label>
                <button
                  type="button"
                  onClick={addReminder}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  + Add Reminder
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.reminders.map((reminder) => (
                  <div key={reminder.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3 mb-2">
                      <input
                        type="checkbox"
                        checked={reminder.enabled}
                        onChange={(e) => updateReminder(reminder.id, 'enabled', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <select
                        value={reminder.time}
                        onChange={(e) => updateReminder(reminder.id, 'time', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="1hour">1 hour before</option>
                        <option value="1day">1 day before</option>
                        <option value="1week">1 week before</option>
                      </select>
                      {formData.reminders.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeReminder(reminder.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Custom reminder message (optional)"
                      value={customReminderMessages[reminder.id] || ''}
                      onChange={(e) => updateCustomMessage(reminder.id, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>{editTask ? 'Update' : 'Create'} Task</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
