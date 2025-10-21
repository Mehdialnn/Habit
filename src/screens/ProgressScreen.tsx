import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import { useHabitStore } from '../store/habitStore';
import { getStrengthColor } from '../constants/theme';
import { getHabitAge, getLastNDaysCompletion, calculateCompletionRate } from '../utils/habitCalculations';
import ProgressBar from '../components/ProgressBar';
import StreakGrid from '../components/StreakGrid';
import CompletionGrid from '../components/CompletionGrid';

type TabType = 'strength' | 'streaks' | 'last30';

const ProgressScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('strength');
  const habits = useHabitStore((state) => state.habits);

  const renderStrengthTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.tabDescription}>
        Track how strong each habit has become based on consistency and age
      </Text>
      {habits.map((habit) => {
        const age = getHabitAge(habit.createdAt);
        const color = getStrengthColor(habit.strengthScore);

        return (
          <View key={habit.id} style={styles.habitStrengthCard}>
            <View style={styles.habitHeader}>
              <View style={styles.habitTitleRow}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <Text style={styles.habitName}>{habit.name}</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={[styles.scoreNumber, { color }]}>
                  {habit.strengthScore.toFixed(1)}
                </Text>
              </View>
            </View>
            <ProgressBar progress={habit.strengthScore} color={color} height={12} />
            <Text style={styles.habitAge}>{age} days old</Text>
          </View>
        );
      })}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderStreaksTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.tabDescription}>
        Visualize your consistency streaks for each habit
      </Text>
      {habits.map((habit) => {
        const last21Days = getLastNDaysCompletion(habit, 21);

        return (
          <View key={habit.id} style={styles.habitStreakCard}>
            <View style={styles.habitHeader}>
              <View style={styles.habitTitleRow}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <Text style={styles.habitName}>{habit.name}</Text>
              </View>
              <View style={styles.streakBadge}>
                <Text style={styles.streakNumber}>🔥 {habit.streakCount}</Text>
              </View>
            </View>
            <View style={styles.streakGridContainer}>
              <StreakGrid completionData={last21Days} emoji="😊" />
            </View>
            <Text style={styles.maxStreak}>Max streak: {habit.maxStreak} days</Text>
          </View>
        );
      })}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderLast30DaysTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.tabDescription}>
        View your completion rate over the last 30 days
      </Text>
      {habits.map((habit) => {
        const last30Days = getLastNDaysCompletion(habit, 30);
        const completionRate = calculateCompletionRate(
          habit.completionHistory.filter((r) => {
            const recordDate = new Date(r.date);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return recordDate >= thirtyDaysAgo;
          })
        );

        return (
          <View key={habit.id} style={styles.habitLast30Card}>
            <View style={styles.habitHeader}>
              <View style={styles.habitTitleRow}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <Text style={styles.habitName}>{habit.name}</Text>
              </View>
              <View style={styles.percentageContainer}>
                <Text style={styles.percentageNumber}>
                  {Math.round(completionRate)}%
                </Text>
              </View>
            </View>
            <View style={styles.completionGridContainer}>
              <CompletionGrid completionData={last30Days} columns={10} />
            </View>
            <Text style={styles.gridLabel}>Last 30 days</Text>
          </View>
        );
      })}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'strength' && styles.activeTab]}
          onPress={() => setActiveTab('strength')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'strength' && styles.activeTabText,
            ]}
          >
            Habit Strength
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'streaks' && styles.activeTab]}
          onPress={() => setActiveTab('streaks')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'streaks' && styles.activeTabText,
            ]}
          >
            Streaks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'last30' && styles.activeTab]}
          onPress={() => setActiveTab('last30')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'last30' && styles.activeTabText,
            ]}
          >
            Last 30 Days
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'strength' && renderStrengthTab()}
      {activeTab === 'streaks' && renderStreaksTab()}
      {activeTab === 'last30' && renderLast30DaysTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.default,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.orange,
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  activeTabText: {
    color: Colors.orange,
    fontWeight: Typography.semibold,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  tabDescription: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    marginTop: Spacing.xl,
    marginBottom: Spacing.default,
  },
  habitStrengthCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.default,
    marginBottom: Spacing.md,
  },
  habitStreakCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.default,
    marginBottom: Spacing.md,
  },
  habitLast30Card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.default,
    marginBottom: Spacing.md,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  habitTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  habitName: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    flex: 1,
  },
  scoreContainer: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
  scoreNumber: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  habitAge: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    marginTop: Spacing.sm,
  },
  streakBadge: {
    backgroundColor: Colors.orange + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },
  streakNumber: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  streakGridContainer: {
    marginBottom: Spacing.md,
  },
  maxStreak: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
  },
  percentageContainer: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  percentageNumber: {
    color: Colors.green,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  completionGridContainer: {
    marginBottom: Spacing.md,
  },
  gridLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
  },
  bottomSpacing: {
    height: Spacing.xxxl,
  },
});

export default ProgressScreen;
