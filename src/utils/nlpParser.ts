import { Task } from '../types';

export const parseNaturalLanguage = (input: string): Partial<Task> | null => {
  const lowerInput = input.toLowerCase().trim();
  
  // Parse "Remind me to [task] at [time]"
  const reminderPattern = /remind me to (.+?) (?:at|on) (.+)/i;
  const match = input.match(reminderPattern);
  
  if (match) {
    const taskTitle = match[1].trim();
    const timeStr = match[2].trim();
    
    // Simple time parsing (can be enhanced)
    let dueDate = new Date();
    
    if (timeStr.includes('tomorrow')) {
      dueDate.setDate(dueDate.getDate() + 1);
      if (timeStr.includes('pm') || timeStr.includes('evening')) {
        dueDate.setHours(18, 0, 0, 0);
      } else if (timeStr.includes('am') || timeStr.includes('morning')) {
        dueDate.setHours(9, 0, 0, 0);
      }
    } else if (timeStr.includes('next week')) {
      dueDate.setDate(dueDate.getDate() + 7);
    }
    
    // Determine category based on keywords
    let category: Task['category'] = 'personal';
    if (lowerInput.includes('pray') || lowerInput.includes('prayer') || lowerInput.includes('worship')) {
      category = 'religious';
    } else if (lowerInput.includes('work') || lowerInput.includes('meeting') || lowerInput.includes('office')) {
      category = 'work';
    } else if (lowerInput.includes('festival') || lowerInput.includes('celebration')) {
      category = 'cultural';
    }
    
    return {
      title: taskTitle,
      description: `Created from: "${input}"`,
      dueDate,
      category,
      priority: 'medium',
      completed: false,
      reminders: [{ id: crypto.randomUUID(), time: '1hour', enabled: true }]
    };
  }
  
  return null;
};