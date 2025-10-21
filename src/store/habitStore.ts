import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, Protocol, Timer, CompletionRecord } from '../types';
import {
  calculateStreak,
  calculateMaxStreak,
  calculateStrengthScore,
} from '../utils/habitCalculations';

interface HabitStore {
  habits: Habit[];
  protocols: Protocol[];
  hasCompletedOnboarding: boolean;
  activeTimer: Timer | null;

  // Actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streakCount' | 'maxStreak' | 'strengthScore' | 'completionHistory'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string) => void;
  updateHabitProgress: (id: string, value: number) => void;
  setOnboardingComplete: () => void;
  startTimer: (habitId: string, duration: number) => void;
  stopTimer: () => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  initializeWithMockData: () => void;
}

const STORAGE_KEY = '@habit_tracker_store';

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  protocols: [],
  hasCompletedOnboarding: false,
  activeTimer: null,

  addHabit: (habitData) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      streakCount: 0,
      maxStreak: 0,
      strengthScore: 0,
      completionHistory: [],
      isActive: true,
    };

    set((state) => ({
      habits: [...state.habits, newHabit],
    }));

    get().saveToStorage();
  },

  updateHabit: (id, updates) => {
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === id ? { ...habit, ...updates } : habit
      ),
    }));

    get().saveToStorage();
  },

  deleteHabit: (id) => {
    set((state) => ({
      habits: state.habits.filter((habit) => habit.id !== id),
    }));

    get().saveToStorage();
  },

  toggleHabitCompletion: (id) => {
    set((state) => {
      const habits = state.habits.map((habit) => {
        if (habit.id !== id) return habit;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        const existingRecordIndex = habit.completionHistory.findIndex(
          (r) => r.date === todayStr
        );

        let updatedHistory: CompletionRecord[];

        if (existingRecordIndex >= 0) {
          // Toggle existing record
          updatedHistory = habit.completionHistory.map((r, i) =>
            i === existingRecordIndex ? { ...r, completed: !r.completed } : r
          );
        } else {
          // Add new record
          updatedHistory = [
            ...habit.completionHistory,
            {
              date: todayStr,
              completed: true,
              value: habit.type === 'boolean' ? undefined : habit.target,
            },
          ];
        }

        const streakCount = calculateStreak(updatedHistory);
        const maxStreak = calculateMaxStreak(updatedHistory);
        const updatedHabit = {
          ...habit,
          completionHistory: updatedHistory,
          streakCount,
          maxStreak: Math.max(maxStreak, habit.maxStreak),
        };

        return {
          ...updatedHabit,
          strengthScore: calculateStrengthScore(updatedHabit),
        };
      });

      return { habits };
    });

    get().saveToStorage();
  },

  updateHabitProgress: (id, value) => {
    set((state) => {
      const habits = state.habits.map((habit) => {
        if (habit.id !== id) return habit;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        const existingRecordIndex = habit.completionHistory.findIndex(
          (r) => r.date === todayStr
        );

        let updatedHistory: CompletionRecord[];

        if (existingRecordIndex >= 0) {
          // Update existing record
          updatedHistory = habit.completionHistory.map((r, i) =>
            i === existingRecordIndex
              ? {
                  ...r,
                  value,
                  completed: habit.target ? value >= habit.target : true,
                }
              : r
          );
        } else {
          // Add new record
          updatedHistory = [
            ...habit.completionHistory,
            {
              date: todayStr,
              value,
              completed: habit.target ? value >= habit.target : true,
            },
          ];
        }

        const streakCount = calculateStreak(updatedHistory);
        const maxStreak = calculateMaxStreak(updatedHistory);
        const updatedHabit = {
          ...habit,
          completionHistory: updatedHistory,
          streakCount,
          maxStreak: Math.max(maxStreak, habit.maxStreak),
        };

        return {
          ...updatedHabit,
          strengthScore: calculateStrengthScore(updatedHabit),
        };
      });

      return { habits };
    });

    get().saveToStorage();
  },

  setOnboardingComplete: () => {
    set({ hasCompletedOnboarding: true });
    get().saveToStorage();
  },

  startTimer: (habitId, duration) => {
    set({
      activeTimer: {
        habitId,
        startTime: Date.now(),
        duration,
        isActive: true,
      },
    });
  },

  stopTimer: () => {
    set({ activeTimer: null });
  },

  saveToStorage: async () => {
    try {
      const state = get();
      const dataToSave = {
        habits: state.habits,
        protocols: state.protocols,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set({
          habits: parsed.habits || [],
          protocols: parsed.protocols || [],
          hasCompletedOnboarding: parsed.hasCompletedOnboarding || false,
        });
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  },

  initializeWithMockData: () => {
    const mockHabits: Habit[] = [
      {
        id: '1',
        name: 'Morning Workout',
        description: '30 minutes of exercise',
        category: 'exercise',
        icon: '💪',
        color: '#4ade80',
        type: 'boolean',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        streakCount: 4,
        maxStreak: 5,
        strengthScore: 17.6,
        completionHistory: [
          { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: true },
          { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: true },
          { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: true },
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: true },
          { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
        ],
        isActive: true,
      },
      {
        id: '2',
        name: 'Meditation',
        description: '10 minutes of mindfulness',
        category: 'meditation',
        icon: '🧘',
        color: '#a855f7',
        type: 'timed',
        target: 10,
        unit: 'min',
        createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
        streakCount: 12,
        maxStreak: 15,
        strengthScore: 29.4,
        completionHistory: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: i % 3 !== 0, // Skip every 3rd day
          value: 10,
        })),
        isActive: true,
      },
      {
        id: '3',
        name: 'Walk 8,000 steps',
        description: 'Daily step goal',
        category: 'exercise',
        icon: '🚶',
        color: '#4ade80',
        type: 'quantifiable',
        target: 8000,
        unit: 'steps',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        streakCount: 45,
        maxStreak: 50,
        strengthScore: 79.0,
        completionHistory: Array.from({ length: 90 }, (_, i) => ({
          date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: i % 5 !== 0, // Skip every 5th day
          value: i % 5 !== 0 ? 8500 : 4000,
        })),
        isActive: true,
      },
      {
        id: '4',
        name: 'No social media before 10am',
        description: 'Avoid distractions',
        category: 'productivity',
        icon: '📵',
        color: '#06b6d4',
        type: 'timed',
        target: 600,
        unit: 'min',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        streakCount: 8,
        maxStreak: 10,
        strengthScore: 22.5,
        completionHistory: Array.from({ length: 15 }, (_, i) => ({
          date: new Date(Date.now() - (14 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: i % 2 === 0,
          value: 600,
        })),
        isActive: true,
      },
    ];

    set({ habits: mockHabits });
    get().saveToStorage();
  },
}));
