import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '../constants/theme';

interface CompletionGridProps {
  completionData: { date: string; completed: boolean }[];
  columns?: number;
}

const CompletionGrid: React.FC<CompletionGridProps> = ({
  completionData,
  columns = 10,
}) => {
  return (
    <View style={styles.grid}>
      {completionData.map((item) => (
        <View
          key={item.date}
          style={[
            styles.square,
            { backgroundColor: item.completed ? Colors.green : Colors.border },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  square: {
    width: 16,
    height: 16,
    borderRadius: BorderRadius.sm / 2,
  },
});

export default CompletionGrid;
