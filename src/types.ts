export interface Room {
  id: number;
  name: string;
  description: string;
  participants: string[];
  currentStudying: number;
  maxParticipants: number;
  category:
    | 'programming'
    | 'certification'
    | 'language'
    | 'test'
    | 'report'
    | 'self-development'
    | 'other';
}

export interface Message {
  id: number;
  user: string;
  message: string;
  timestamp: string;
}

export interface StudyLog {
  id: number;
  date: string;
  minutes: number;
  subject: string;
  timestamp: string;
}

export type TimerMode = 'study' | 'break';
export type ViewType = 'rooms' | 'study' | 'stats';
