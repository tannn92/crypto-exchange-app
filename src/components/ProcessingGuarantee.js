import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const ProcessingGuarantee = ({ text = "Processing guaranteed ≤ 5 min", style = {} }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.guaranteeContainer, style]}>
      <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
      <Text style={[styles.guaranteeText, { color: theme.textSecondary }]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  guaranteeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  guaranteeText: {
    fontSize: 14,
  },
});

export default ProcessingGuarantee;