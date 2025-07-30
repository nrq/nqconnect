export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  storage: {
    used: number; // in MB
    total: number; // in MB
  };
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  language?: 'Urdu' | 'Arabic' | 'Norwegian' | 'French' | 'German' | 'English';
}

export interface Chat {
  id: string;
  type: 'private' | 'group';
  name: string;
  avatar: string;
  unreadCount: number;
  messages: Message[];
  participants: User[];
}

export interface CommunityEvent {
    id: string;
    title: string;
    date: string;
    description: string;
    location: string;
}
