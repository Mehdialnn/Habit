import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';

const CoachScreen: React.FC = () => {
  const handleGetCoach = () => {
    Alert.alert(
      'AI Coach',
      'AI coaching features coming soon! This will provide personalized guidance and support for your habits.'
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={[Colors.pink, Colors.orange, Colors.yellow]}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.logoText}>AI</Text>
          </LinearGradient>
        </View>

        <Text style={styles.heading}>
          Lock in success with 1:1 AI coaching
        </Text>

        <Text style={styles.subtext}>
          +230% increased likelihood of success when working with a coach
        </Text>

        <View style={styles.featuresList}>
          <FeatureItem
            icon="🎯"
            text="Personalized habit recommendations"
          />
          <FeatureItem
            icon="💬"
            text="Daily check-ins and motivation"
          />
          <FeatureItem
            icon="📊"
            text="Progress analysis and insights"
          />
          <FeatureItem
            icon="🔧"
            text="Adaptive strategies for challenges"
          />
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleGetCoach}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaButtonText}>Get your AI coach</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Free trial available • Cancel anytime
        </Text>
      </View>
    </View>
  );
};

interface FeatureItemProps {
  icon: string;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl * 2,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: Spacing.xxxl,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: Typography.huge,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  heading: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 40,
  },
  subtext: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
  featuresList: {
    width: '100%',
    marginBottom: Spacing.xxxl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    backgroundColor: Colors.cardBackground,
    padding: Spacing.default,
    borderRadius: BorderRadius.lg,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: Spacing.default,
  },
  featureText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    flex: 1,
  },
  ctaButton: {
    backgroundColor: Colors.textPrimary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    borderRadius: BorderRadius.lg,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.default,
  },
  ctaButtonText: {
    color: Colors.background,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  disclaimer: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default CoachScreen;
