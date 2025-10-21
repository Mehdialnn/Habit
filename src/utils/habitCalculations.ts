import { Habit, CompletionRecord } from '../types';

/**
 * Calculate the current streak for a habit
 */
export const calculateStreak = (completionHistory: CompletionRecord[]): number => {
  if (!completionHistory || completionHistory.length === 0) return 0;

  // Sort by date descending
  const sorted = [...completionHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const recordDate = new Date(sorted[i].date);
    recordDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    if (recordDate.getTime() === expectedDate.getTime() && sorted[i].completed) {
      streak++;
    } else if (recordDate.getTime() < expectedDate.getTime()) {
      // Gap in streak
      break;
    }
  }

  return streak;
};

/**
 * Calculate the maximum streak for a habit
 */
export const calculateMaxStreak = (completionHistory: CompletionRecord[]): number => {
  if (!completionHistory || completionHistory.length === 0) return 0;

  // Sort by date ascending
  const sorted = [...completionHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let maxStreak = 0;
  let currentStreak = 0;
  let previousDate: Date | null = null;

  for (const record of sorted) {
    if (!record.completed) {
      currentStreak = 0;
      previousDate = null;
      continue;
    }

    const recordDate = new Date(record.date);
    recordDate.setHours(0, 0, 0, 0);

    if (previousDate) {
      const dayDiff = Math.floor(
        (recordDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    maxStreak = Math.max(maxStreak, currentStreak);
    previousDate = recordDate;
  }

  return maxStreak;
};

/**
 * Calculate completion rate for a habit
 */
export const calculateCompletionRate = (completionHistory: CompletionRecord[]): number => {
  if (!completionHistory || completionHistory.length === 0) return 0;

  const completed = completionHistory.filter((r) => r.completed).length;
  return (completed / completionHistory.length) * 100;
};

/**
 * Get the age of a habit in days
 */
export const getHabitAge = (createdAt: string): number => {
  const created = new Date(createdAt);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Calculate the strength score for a habit
 * Formula: (daysOld * 0.3) + (completionRate * 0.5) + (currentStreak * 0.2)
 */
export const calculateStrengthScore = (habit: Habit): number => {
  const daysOld = getHabitAge(habit.createdAt);
  const completionRate = calculateCompletionRate(habit.completionHistory);
  const currentStreak = habit.streakCount;

  const score = (daysOld * 0.3) + (completionRate * 0.5) + (currentStreak * 0.2);

  // Cap at 100
  return Math.min(Math.round(score * 10) / 10, 100);
};

/**
 * Get today's completion record for a habit
 */
export const getTodayCompletion = (habit: Habit): CompletionRecord | undefined => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  return habit.completionHistory.find((r) => r.date === todayStr);
};

/**
 * Check if a habit is completed today
 */
export const isCompletedToday = (habit: Habit): boolean => {
  const todayRecord = getTodayCompletion(habit);
  return todayRecord?.completed || false;
};

/**
 * Get completion percentage for today (for quantifiable habits)
 */
export const getTodayProgress = (habit: Habit): number => {
  if (habit.type === 'boolean') {
    return isCompletedToday(habit) ? 100 : 0;
  }

  const todayRecord = getTodayCompletion(habit);
  if (!todayRecord || !todayRecord.value || !habit.target) {
    return 0;
  }

  return Math.min((todayRecord.value / habit.target) * 100, 100);
};

/**
 * Get completion data for the last N days
 */
export const getLastNDaysCompletion = (
  habit: Habit,
  days: number
): { date: string; completed: boolean }[] => {
  const result: { date: string; completed: boolean }[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split('T')[0];

    const record = habit.completionHistory.find((r) => r.date === dateStr);
    result.push({
      date: dateStr,
      completed: record?.completed || false,
    });
  }

  return result;
};

/**
 * Format time remaining for a timer
 */
export const formatTimeRemaining = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};
