import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useHabitStore } from './src/store/habitStore';
import OnboardingScreen from './src/screens/OnboardingScreen';
import MainNavigator from './src/navigation/MainNavigator';
import { Colors } from './src/constants/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const hasCompletedOnboarding = useHabitStore((state) => state.hasCompletedOnboarding);
  const loadFromStorage = useHabitStore((state) => state.loadFromStorage);
  const initializeWithMockData = useHabitStore((state) => state.initializeWithMockData);

  useEffect(() => {
    const initialize = async () => {
      await loadFromStorage();

      // Initialize with mock data if no habits exist (for demo purposes)
      const habits = useHabitStore.getState().habits;
      if (habits.length === 0) {
        initializeWithMockData();
      }

      setIsLoading(false);
    };

    initialize();
  }, []);

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          {!hasCompletedOnboarding ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : (
            <Stack.Screen name="Main" component={MainNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
