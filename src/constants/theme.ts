export const Colors = {
  // Background
  background: '#1a1a1a',
  cardBackground: '#2a2a2a',
  darkCard: '#1f1f1f',

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#a0a0a0',
  textTertiary: '#707070',

  // Accent Colors
  green: '#4ade80',
  greenBright: '#00ff00',
  orange: '#ff9500',
  orangeAlt: '#fb923c',
  purple: '#a855f7',
  yellow: '#fbbf24',
  blue: '#3b82f6',
  red: '#ef4444',
  pink: '#ec4899',
  cyan: '#06b6d4',

  // Category Colors
  exercise: '#4ade80',
  meditation: '#a855f7',
  nutrition: '#a855f7',
  social: '#06b6d4',
  productivity: '#fb923c',

  // Strength Score Colors
  strengthNew: '#ec4899', // Pink/Red for new habits
  strengthBuilding: '#fbbf24', // Yellow for building
  strengthEstablished: '#4ade80', // Green for established
  strengthStrong: '#3b82f6', // Blue for strong

  // UI Elements
  border: '#3a3a3a',
  divider: '#2a2a2a',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  default: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Typography = {
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,

  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 8,
  },
};

export const getStrengthColor = (score: number): string => {
  if (score < 20) return Colors.strengthNew;
  if (score < 40) return Colors.strengthBuilding;
  if (score < 70) return Colors.strengthEstablished;
  return Colors.strengthStrong;
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'exercise':
      return Colors.exercise;
    case 'meditation':
    case 'nutrition':
      return Colors.meditation;
    case 'social':
      return Colors.social;
    case 'productivity':
      return Colors.productivity;
    default:
      return Colors.blue;
  }
};
