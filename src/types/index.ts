export type HabitCategory = 'exercise' | 'meditation' | 'nutrition' | 'social' | 'productivity';

export type HabitType = 'boolean' | 'quantifiable' | 'timed';

export interface CompletionRecord {
  date: string; // ISO date string
  completed: boolean;
  value?: number; // For quantifiable habits
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  icon: string; // Emoji or icon name
  color: string;
  type: HabitType;
  target?: number; // For quantifiable/timed habits
  unit?: string; // e.g., 'steps', 'min', 'pages'
  createdAt: string; // ISO date string
  streakCount: number;
  maxStreak: number;
  strengthScore: number; // 0-100
  completionHistory: CompletionRecord[];
  isActive: boolean;
}

export interface Protocol {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  habits: Omit<Habit, 'id' | 'createdAt' | 'streakCount' | 'maxStreak' | 'strengthScore' | 'completionHistory'>[];
}

export interface OnboardingSlide {
  id: number;
  title: string;
  subtitle?: string;
  accentColor: string;
}

export interface Timer {
  habitId: string;
  startTime: number;
  duration: number; // in seconds
  isActive: boolean;
}

export interface AppState {
  habits: Habit[];
  protocols: Protocol[];
  hasCompletedOnboarding: boolean;
  activeTimer: Timer | null;
}
