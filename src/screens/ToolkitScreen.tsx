import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';

const { width } = Dimensions.get('window');
const cardWidth = (width - Spacing.xl * 2 - Spacing.default) / 2;

interface ProtocolCardData {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradientColors: [string, string];
}

const protocols: ProtocolCardData[] = [
  {
    id: '1',
    title: 'Energize',
    description: 'Morning routine to boost energy',
    icon: '⚡',
    gradientColors: [Colors.orange, Colors.yellow],
  },
  {
    id: '2',
    title: 'Motivate',
    description: 'Stay focused and driven',
    icon: '🎯',
    gradientColors: [Colors.pink, Colors.red],
  },
  {
    id: '3',
    title: 'De-Stress',
    description: 'Calm your mind and body',
    icon: '🌊',
    gradientColors: [Colors.cyan, Colors.blue],
  },
  {
    id: '4',
    title: 'Mindfulness',
    description: 'Practice presence and awareness',
    icon: '🧘',
    gradientColors: [Colors.purple, Colors.pink],
  },
  {
    id: '5',
    title: 'Gentle Yoga',
    description: 'Stretch and relax',
    icon: '🤸',
    gradientColors: [Colors.green, Colors.cyan],
  },
  {
    id: '6',
    title: 'Focus',
    description: 'Deep work protocols',
    icon: '🎓',
    gradientColors: [Colors.blue, Colors.purple],
  },
  {
    id: '7',
    title: 'Recovery',
    description: 'Rest and rejuvenate',
    icon: '💤',
    gradientColors: [Colors.purple, Colors.blue],
  },
  {
    id: '8',
    title: 'Social',
    description: 'Build connections',
    icon: '👥',
    gradientColors: [Colors.orange, Colors.pink],
  },
];

const ToolkitScreen: React.FC = () => {
  const handleProtocolPress = (protocol: ProtocolCardData) => {
    Alert.alert(
      protocol.title,
      `${protocol.description}\n\nThis feature will allow you to adopt pre-made habit protocols. Coming soon!`
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Habit Toolkit</Text>
        <Text style={styles.headerSubtitle}>
          Try pre-made habit protocols designed by experts
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.protocolGrid}>
          {protocols.map((protocol) => (
            <TouchableOpacity
              key={protocol.id}
              style={styles.protocolCard}
              onPress={() => handleProtocolPress(protocol)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={protocol.gradientColors}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.protocolIcon}>{protocol.icon}</Text>
                  <Text style={styles.protocolTitle}>{protocol.title}</Text>
                  <Text style={styles.protocolDescription}>
                    {protocol.description}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  protocolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.default,
  },
  protocolCard: {
    width: cardWidth,
    height: 160,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    padding: Spacing.default,
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  protocolIcon: {
    fontSize: 40,
  },
  protocolTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  protocolDescription: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    opacity: 0.9,
  },
  bottomSpacing: {
    height: Spacing.xxxl,
  },
});

export default ToolkitScreen;
