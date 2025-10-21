# Habit Tracker App

A production-ready React Native habit tracking application built with Expo and TypeScript. Track your daily habits, build streaks, and achieve your goals with beautiful visualizations and AI coaching features.

## Features

### Core Functionality
- **Daily Habit Tracking**: Track boolean, quantifiable, and time-based habits
- **Streak Tracking**: Build and maintain daily streaks with visual feedback
- **Habit Strength Score**: See how strong your habits are becoming over time
- **Progress Visualizations**: Beautiful charts, graphs, and grids showing your progress
- **Habit Timer**: Active timer for time-based habits with countdown display

### Screens

#### 1. Onboarding (6 Slides)
- Reset your life in 8 weeks
- Start a personal habit stack
- Lock in with your AI life coach
- Track your progress daily
- Build momentum with streaks
- Experiment with new protocols

#### 2. Today Screen
- View all active habits for today
- Check off completed habits
- Track progress on quantifiable habits (steps, minutes, etc.)
- Active timer display for time-based habits
- Add new habits with + button

#### 3. Progress Screen (3 Tabs)
- **Habit Strength**: View strength scores for each habit with color-coded progress bars
- **Streaks**: Visualize streaks with emoji grids showing completion patterns
- **Last 30 Days**: See detailed 30-day completion history with grid visualization

#### 4. Coach Screen
- AI coaching feature preview
- Personalized guidance and support
- Progress analysis and insights

#### 5. Toolkit Screen
- Pre-made habit protocols (Energize, Motivate, De-Stress, Mindfulness, etc.)
- Beautiful gradient cards for each protocol
- Quick-start habit stacks

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **State Management**: Zustand
- **Storage**: AsyncStorage
- **UI Components**: React Native core components + custom components
- **Icons**: Expo Vector Icons
- **Gradients**: Expo Linear Gradient

## Installation

```bash
# Install dependencies
npm install

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── HabitCard.tsx
│   ├── ProgressRing.tsx
│   ├── ProgressBar.tsx
│   ├── StreakGrid.tsx
│   └── CompletionGrid.tsx
├── screens/            # App screens
│   ├── OnboardingScreen.tsx
│   ├── TodayScreen.tsx
│   ├── ProgressScreen.tsx
│   ├── CoachScreen.tsx
│   ├── ToolkitScreen.tsx
│   └── AddHabitScreen.tsx
├── navigation/         # Navigation configuration
│   └── MainNavigator.tsx
├── store/             # Zustand state management
│   └── habitStore.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── constants/         # Design system constants
│   └── theme.ts
└── utils/             # Utility functions
    └── habitCalculations.ts
```

## Data Models

### Habit
```typescript
interface Habit {
  id: string;
  name: string;
  description: string;
  category: 'exercise' | 'meditation' | 'nutrition' | 'social' | 'productivity';
  icon: string;
  color: string;
  type: 'boolean' | 'quantifiable' | 'timed';
  target?: number;
  unit?: string;
  createdAt: string;
  streakCount: number;
  maxStreak: number;
  strengthScore: number;
  completionHistory: CompletionRecord[];
  isActive: boolean;
}
```

### CompletionRecord
```typescript
interface CompletionRecord {
  date: string;
  completed: boolean;
  value?: number;
}
```

## Key Algorithms

### Streak Calculation
Calculates current consecutive days of completion, accounting for gaps in the streak.

### Strength Score
Formula: `(daysOld * 0.3) + (completionRate * 0.5) + (currentStreak * 0.2)`
- Factors in habit age, completion rate, and current streak
- Capped at 100
- Color-coded: Red/Pink (new), Yellow (building), Green (established), Blue (strong)

## Design System

### Colors
- Background: `#1a1a1a` (dark)
- Cards: `#2a2a2a`
- Accent Colors: Green, Orange, Purple, Yellow, Blue, Red, Pink, Cyan

### Typography
- Font sizes: 12-64px
- Weights: Regular (400), Medium (500), Semibold (600), Bold (700)

### Spacing
- Consistent 4px grid system
- Default padding: 16px
- Screen padding: 24px

## Features Implemented

✅ Habit creation and management
✅ Daily tracking (boolean, quantifiable, timed)
✅ Streak calculation and visualization
✅ Strength score algorithm
✅ Progress visualizations (rings, bars, grids)
✅ Timer functionality for time-based habits
✅ Data persistence with AsyncStorage
✅ Onboarding flow
✅ Bottom tab navigation
✅ Dark theme design system
✅ Mock data initialization

## Future Enhancements

- Local notifications for habit reminders
- Ability to edit and delete habits
- Archive/pause habits functionality
- Export data feature
- Actual AI coach implementation
- Protocol adoption from toolkit
- Advanced analytics and insights
- Social features and sharing
- Cloud sync
- Multiple theme options

## Development

The app uses mock data on first launch to demonstrate all features. The mock data includes:
- Morning Workout (6 days old)
- Meditation (32 days old)
- Walk 8,000 steps (90 days old)
- No social media before 10am (15 days old)

All data is persisted locally using AsyncStorage and survives app restarts.

## License

MIT
