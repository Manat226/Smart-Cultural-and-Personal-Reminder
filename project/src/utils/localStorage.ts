import { Task, Event, WishCard } from '../types';

const STORAGE_KEYS = {
  TASKS: 'cultural-reminder-tasks',
  EVENTS: 'cultural-reminder-events',
  WISHES: 'cultural-reminder-wishes'
};

export const localStorage = {
  // Tasks
  getTasks: (): Task[] => {
    const stored = window.localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!stored) return [];
    return JSON.parse(stored).map((task: any) => ({
      ...task,
      dueDate: new Date(task.dueDate),
      createdAt: new Date(task.createdAt)
    }));
  },

  saveTasks: (tasks: Task[]): void => {
    window.localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  // Events
  getEvents: (): Event[] => {
    const stored = window.localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!stored) return [];
    return JSON.parse(stored).map((event: any) => ({
      ...event,
      date: new Date(event.date)
    }));
  },

  saveEvents: (events: Event[]): void => {
    window.localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  // Wishes
  getWishes: (): WishCard[] => {
    const stored = window.localStorage.getItem(STORAGE_KEYS.WISHES);
    if (!stored) return [];
    return JSON.parse(stored).map((wish: any) => ({
      ...wish,
      createdAt: new Date(wish.createdAt)
    }));
  },

  saveWishes: (wishes: WishCard[]): void => {
    window.localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(wishes));
  }
};