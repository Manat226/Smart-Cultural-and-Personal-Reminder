export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  reminders: Reminder[];
  category: 'personal' | 'work' | 'religious' | 'cultural';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface Event {
  id: string;
  name: string;
  date: Date;
  history: string;
  origin: string;
  religion: string;
  culture: string;
  celebrationDetails: string;
  icon: string;
  category: 'upcoming' | 'past';
  type: 'cultural' | 'religious' | 'personal';
}

export interface Reminder {
  id: string;
  time: '1hour' | '1day' | '1week';
  enabled: boolean;
  customMessage?: string;
}

export interface WishCard {
  id: string;
  title: string;
  message: string;
  eventType: string;
  template: string;
  customImage?: string;
  createdAt: Date;
}

export interface AvatarResponse {
  text: string;
  audioUrl?: string;
}

export type ViewType = 'tasks' | 'events' | 'avatar' | 'wishes';