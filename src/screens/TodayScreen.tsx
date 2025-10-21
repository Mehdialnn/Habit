import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import { useHabitStore } from '../store/habitStore';
import HabitCard from '../components/HabitCard';
import { formatTimeRemaining } from '../utils/habitCalculations';
import AddHabitScreen from './AddHabitScreen';

const TodayScreen: React.FC = () => {
  const habits = useHabitStore((state) => state.habits);
  const activeTimer = useHabitStore((state) => state.activeTimer);
  const toggleHabitCompletion = useHabitStore((state) => state.toggleHabitCompletion);
  const stopTimer = useHabitStore((state) => state.stopTimer);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showAddHabit, setShowAddHabit] = useState(false);

  useEffect(() => {
    if (activeTimer && activeTimer.isActive) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeTimer.startTime) / 1000);
        const remaining = Math.max(activeTimer.duration - elapsed, 0);
        setTimeRemaining(remaining);

        if (remaining === 0) {
          stopTimer();
          Alert.alert('Timer Complete', 'Your habit block has finished!');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeTimer]);

  const handleHabitPress = (habitId: string) => {
    toggleHabitCompletion(habitId);
  };

  const handleAddHabit = () => {
    setShowAddHabit(true);
  };

  const activeHabits = habits.filter((h) => h.isActive);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Today</Text>
          <Ionicons name="chevron-down" size={20} color={Colors.textPrimary} />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleAddHabit} style={styles.iconButton}>
            <Ionicons name="add" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-circle" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTimer && activeTimer.isActive && (
          <View style={styles.timerCard}>
            <View style={styles.timerContent}>
              <View style={styles.timerInfo}>
                <Text style={styles.timerStatus}>Block Active</Text>
                <Text style={styles.timerTime}>
                  {formatTimeRemaining(timeRemaining)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={stopTimer}
                style={styles.stopButton}
              >
                <Ionicons name="stop-circle" size={32} color={Colors.red} />
              </TouchableOpacity>
            </View>
            <View style={styles.timerProgress}>
              <View
                style={[
                  styles.timerProgressBar,
                  {
                    width: `${((activeTimer.duration - timeRemaining) / activeTimer.duration) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}

        <View style={styles.habitsSection}>
          <Text style={styles.sectionTitle}>Your Habits</Text>
          {activeHabits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No habits yet. Tap the + button to add your first habit!
              </Text>
            </View>
          ) : (
            activeHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onPress={() => handleHabitPress(habit.id)}
              />
            ))
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <Modal
        visible={showAddHabit}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AddHabitScreen onClose={() => setShowAddHabit(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.default,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  timerCard: {
    backgroundColor: Colors.green + '20',
    borderRadius: BorderRadius.lg,
    padding: Spacing.default,
    marginTop: Spacing.xl,
    marginBottom: Spacing.default,
    borderWidth: 2,
    borderColor: Colors.green,
  },
  timerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  timerInfo: {
    flex: 1,
  },
  timerStatus: {
    color: Colors.green,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    marginBottom: 4,
  },
  timerTime: {
    color: Colors.textPrimary,
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
  },
  stopButton: {
    padding: Spacing.sm,
  },
  timerProgress: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  timerProgressBar: {
    height: '100%',
    backgroundColor: Colors.green,
    borderRadius: BorderRadius.full,
  },
  habitsSection: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.default,
  },
  emptyState: {
    paddingVertical: Spacing.xxxl,
    alignItems: 'center',
  },
  emptyStateText: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: Spacing.xxxl,
  },
});

export default TodayScreen;
