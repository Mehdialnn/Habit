import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import { useHabitStore } from '../store/habitStore';
import { HabitCategory, HabitType } from '../types';

interface AddHabitScreenProps {
  onClose: () => void;
}

const categoryOptions: { value: HabitCategory; label: string; icon: string; color: string }[] = [
  { value: 'exercise', label: 'Exercise', icon: '💪', color: Colors.green },
  { value: 'meditation', label: 'Meditation', icon: '🧘', color: Colors.purple },
  { value: 'nutrition', label: 'Nutrition', icon: '🥗', color: Colors.purple },
  { value: 'social', label: 'Social', icon: '👥', color: Colors.cyan },
  { value: 'productivity', label: 'Productivity', icon: '📝', color: Colors.orange },
];

const typeOptions: { value: HabitType; label: string }[] = [
  { value: 'boolean', label: 'Simple Checkbox' },
  { value: 'quantifiable', label: 'Track Number' },
  { value: 'timed', label: 'Track Time' },
];

const AddHabitScreen: React.FC<AddHabitScreenProps> = ({ onClose }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<HabitCategory>('exercise');
  const [type, setType] = useState<HabitType>('boolean');
  const [icon, setIcon] = useState<string>('💪');
  const [target, setTarget] = useState<string>('');
  const [unit, setUnit] = useState<string>('');

  const addHabit = useHabitStore((state) => state.addHabit);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    if ((type === 'quantifiable' || type === 'timed') && !target) {
      Alert.alert('Error', 'Please enter a target value');
      return;
    }

    const selectedCategory = categoryOptions.find((c) => c.value === category);

    addHabit({
      name: name.trim(),
      description: description.trim(),
      category,
      icon,
      color: selectedCategory?.color || Colors.green,
      type,
      target: target ? parseInt(target) : undefined,
      unit: unit || undefined,
      isActive: true,
    });

    Alert.alert('Success', 'Habit created successfully!');
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add New Habit</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Habit Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Morning Workout"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Optional description"
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Icon</Text>
          <TextInput
            style={styles.input}
            value={icon}
            onChangeText={setIcon}
            placeholder="Choose an emoji"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.optionsGrid}>
            {categoryOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.categoryOption,
                  category === option.value && styles.selectedOption,
                  { borderColor: option.color },
                ]}
                onPress={() => setCategory(option.value)}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeOptions}>
            {typeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.typeOption,
                  type === option.value && styles.selectedTypeOption,
                ]}
                onPress={() => setType(option.value)}
              >
                <Text
                  style={[
                    styles.typeOptionLabel,
                    type === option.value && styles.selectedTypeOptionLabel,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {(type === 'quantifiable' || type === 'timed') && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Target *</Text>
              <TextInput
                style={styles.input}
                value={target}
                onChangeText={setTarget}
                placeholder="e.g., 8000"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Unit</Text>
              <TextInput
                style={styles.input}
                value={unit}
                onChangeText={setUnit}
                placeholder="e.g., steps, min, pages"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Create Habit</Text>
        </TouchableOpacity>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  section: {
    marginTop: Spacing.xl,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.default,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  categoryOption: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.default,
    alignItems: 'center',
    width: '30%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderWidth: 2,
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  optionLabel: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
  },
  typeOptions: {
    gap: Spacing.md,
  },
  typeOption: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.default,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedTypeOption: {
    backgroundColor: Colors.orange + '20',
    borderColor: Colors.orange,
  },
  typeOptionLabel: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  selectedTypeOptionLabel: {
    color: Colors.orange,
    fontWeight: Typography.semibold,
  },
  saveButton: {
    backgroundColor: Colors.orange,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.xxxl,
  },
  saveButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  bottomSpacing: {
    height: Spacing.xxxl,
  },
});

export default AddHabitScreen;
