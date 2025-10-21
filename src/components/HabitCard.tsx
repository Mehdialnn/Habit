import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Habit } from '../types';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import { isCompletedToday, getTodayProgress } from '../utils/habitCalculations';
import ProgressRing from './ProgressRing';

interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onPress }) => {
  const completed = isCompletedToday(habit);
  const progress = getTodayProgress(habit);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, { backgroundColor: habit.color + '20' }]}>
          <Text style={styles.icon}>{habit.icon}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.habitName}>{habit.name}</Text>
        {!completed && habit.type === 'quantifiable' && (
          <Text style={styles.target}>
            {habit.target?.toLocaleString()} {habit.unit}
          </Text>
        )}
        {completed && (
          <Text style={[styles.target, { color: Colors.green }]}>Completed ✓</Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {completed ? (
          <View style={[styles.checkmark, { backgroundColor: Colors.green }]}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        ) : (
          <ProgressRing
            progress={progress}
            size={48}
            strokeWidth={4}
            color={habit.color}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.default,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  habitName: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    marginBottom: 4,
  },
  target: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
  },
  rightSection: {
    marginLeft: Spacing.md,
  },
  checkmark: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: Typography.bold,
  },
});

export default HabitCard;
