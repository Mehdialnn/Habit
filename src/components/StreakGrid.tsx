import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

interface StreakGridProps {
  completionData: { date: string; completed: boolean }[];
  emoji?: string;
  columns?: number;
}

const StreakGrid: React.FC<StreakGridProps> = ({
  completionData,
  emoji = '😊',
  columns = 7,
}) => {
  return (
    <View style={styles.grid}>
      {completionData.map((item, index) => (
        <View
          key={item.date}
          style={[
            styles.emojiCircle,
            !item.completed && styles.emptyCircle,
          ]}
        >
          {item.completed && <Text style={styles.emoji}>{emoji}</Text>}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  emojiCircle: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.orange + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    backgroundColor: Colors.border,
  },
  emoji: {
    fontSize: 20,
  },
});

export default StreakGrid;
