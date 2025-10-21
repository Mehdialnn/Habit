import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import { useHabitStore } from '../store/habitStore';
import ProgressBar from '../components/ProgressBar';
import StreakGrid from '../components/StreakGrid';
import CompletionGrid from '../components/CompletionGrid';

const { width } = Dimensions.get('window');

interface OnboardingSlideData {
  id: number;
  title: string;
  subtitle?: string;
  accentColor: string;
  renderContent: () => React.ReactNode;
}

const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const setOnboardingComplete = useHabitStore((state) => state.setOnboardingComplete);
  const flatListRef = useRef<FlatList>(null);

  const mockCompletionData = Array.from({ length: 56 }, (_, i) => ({
    date: `2024-${Math.floor(i / 30) + 1}-${(i % 30) + 1}`,
    completed: i % 3 !== 0,
  }));

  const slides: OnboardingSlideData[] = [
    {
      id: 1,
      title: 'Reset your life in 8 weeks',
      accentColor: Colors.orange,
      renderContent: () => (
        <View style={styles.slideContent}>
          <View style={styles.weekGrid}>
            {Array.from({ length: 8 }).map((_, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                <Text style={styles.weekLabel}>Week {weekIndex + 1}</Text>
                <ProgressBar
                  progress={Math.min((weekIndex + 1) * 12.5, 100)}
                  color={Colors.green}
                  height={24}
                />
              </View>
            ))}
          </View>
        </View>
      ),
    },
    {
      id: 2,
      title: 'Start a personal habit stack',
      subtitle: 'Build your daily routine with custom habits',
      accentColor: Colors.green,
      renderContent: () => (
        <View style={styles.slideContent}>
          {[
            { icon: '💪', name: 'Morning Workout', time: '30 min remaining' },
            { icon: '🧘', name: 'Meditation', time: '10 min remaining' },
            { icon: '📚', name: 'Read 20 pages', time: null },
            { icon: '💧', name: 'Drink 8 glasses of water', time: null },
          ].map((habit, index) => (
            <View key={index} style={styles.habitRow}>
              <View style={styles.habitIcon}>
                <Text style={styles.habitEmoji}>{habit.icon}</Text>
              </View>
              <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{habit.name}</Text>
                {habit.time && <Text style={styles.habitTime}>{habit.time}</Text>}
              </View>
              <View style={styles.checkbox} />
            </View>
          ))}
        </View>
      ),
    },
    {
      id: 3,
      title: 'Lock in with your AI life coach',
      subtitle: 'Get personalized guidance and support',
      accentColor: Colors.purple,
      renderContent: () => (
        <View style={styles.slideContent}>
          <View style={styles.chatMockup}>
            <View style={styles.chatBubbleBot}>
              <Text style={styles.chatText}>
                How did your morning workout go today?
              </Text>
            </View>
            <View style={styles.chatBubbleUser}>
              <Text style={styles.chatText}>Great! Finished 30 minutes.</Text>
            </View>
            <View style={styles.chatBubbleBot}>
              <Text style={styles.chatText}>
                Excellent! You're building a strong streak. Keep it up!
              </Text>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: 4,
      title: 'Track your progress daily',
      subtitle: 'See your consistency trend over time',
      accentColor: Colors.blue,
      renderContent: () => (
        <View style={styles.slideContent}>
          <View style={styles.scoreDisplay}>
            <Text style={styles.scoreNumber}>27.2</Text>
            <Text style={styles.scoreLabel}>Habit Strength Score</Text>
          </View>
          <View style={styles.trendLine}>
            <View style={[styles.trendBar, { height: 40 }]} />
            <View style={[styles.trendBar, { height: 60 }]} />
            <View style={[styles.trendBar, { height: 80 }]} />
            <View style={[styles.trendBar, { height: 100 }]} />
            <View style={[styles.trendBar, { height: 120 }]} />
          </View>
          <Text style={styles.consistencyMessage}>
            12 days of consistency until habit is Strong
          </Text>
        </View>
      ),
    },
    {
      id: 5,
      title: 'Build momentum with streaks',
      subtitle: 'Keep your daily streak alive',
      accentColor: Colors.orange,
      renderContent: () => (
        <View style={[styles.slideContent, styles.streakContent]}>
          <View style={styles.streakCounter}>
            <Text style={styles.streakNumber}>🔥 15</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
          <View style={styles.streakGridContainer}>
            <StreakGrid completionData={mockCompletionData.slice(0, 21)} emoji="😊" />
          </View>
        </View>
      ),
    },
    {
      id: 6,
      title: 'Experiment with new protocols',
      subtitle: 'Try pre-made habit stacks',
      accentColor: Colors.cyan,
      renderContent: () => (
        <View style={styles.slideContent}>
          <View style={styles.protocolGrid}>
            {[
              { title: 'Energize', color: Colors.orange },
              { title: 'Motivate', color: Colors.pink },
              { title: 'De-Stress', color: Colors.purple },
              { title: 'Mindfulness', color: Colors.blue },
            ].map((protocol, index) => (
              <View
                key={index}
                style={[styles.protocolCard, { backgroundColor: protocol.color + '30' }]}
              >
                <Text style={styles.protocolTitle}>{protocol.title}</Text>
              </View>
            ))}
          </View>
        </View>
      ),
    },
  ];

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      setOnboardingComplete();
    }
  };

  const handleSkip = () => {
    setOnboardingComplete();
  };

  const renderSlide = ({ item }: { item: OnboardingSlideData }) => (
    <View style={styles.slide}>
      <View style={styles.slideHeader}>
        <Text style={[styles.title, { color: item.accentColor }]}>{item.title}</Text>
        {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
      </View>
      {item.renderContent()}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentIndex < slides.length - 1 && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slide: {
    width,
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
  },
  slideHeader: {
    marginBottom: Spacing.xxxl,
  },
  title: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
  },
  slideContent: {
    flex: 1,
  },
  weekGrid: {
    gap: Spacing.md,
  },
  weekRow: {
    gap: Spacing.sm,
  },
  weekLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    marginBottom: Spacing.xs,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: Spacing.default,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  habitIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  habitEmoji: {
    fontSize: 24,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  habitTime: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  chatMockup: {
    gap: Spacing.md,
  },
  chatBubbleBot: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.default,
    borderRadius: BorderRadius.lg,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  chatBubbleUser: {
    backgroundColor: Colors.purple,
    padding: Spacing.default,
    borderRadius: BorderRadius.lg,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  chatText: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
  },
  scoreDisplay: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  scoreNumber: {
    fontSize: Typography.massive,
    fontWeight: Typography.bold,
    color: Colors.blue,
  },
  scoreLabel: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  trendLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 150,
    marginBottom: Spacing.xl,
  },
  trendBar: {
    width: 40,
    backgroundColor: Colors.blue,
    borderRadius: BorderRadius.sm,
  },
  consistencyMessage: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    textAlign: 'center',
  },
  streakContent: {
    alignItems: 'center',
  },
  streakCounter: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  streakNumber: {
    fontSize: Typography.massive,
    fontWeight: Typography.bold,
    color: Colors.orange,
  },
  streakLabel: {
    fontSize: Typography.xl,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  streakGridContainer: {
    alignItems: 'center',
  },
  protocolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.default,
  },
  protocolCard: {
    width: (width - Spacing.xl * 2 - Spacing.default) / 2,
    height: 120,
    borderRadius: BorderRadius.lg,
    padding: Spacing.default,
    justifyContent: 'flex-end',
  },
  protocolTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    paddingTop: Spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.border,
  },
  paginationDotActive: {
    backgroundColor: Colors.orange,
    width: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.default,
  },
  skipButton: {
    flex: 1,
    paddingVertical: Spacing.default,
    alignItems: 'center',
  },
  skipText: {
    color: Colors.textSecondary,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
  },
  nextButton: {
    flex: 2,
    backgroundColor: Colors.orange,
    paddingVertical: Spacing.default,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  nextText: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
  },
});

export default OnboardingScreen;
