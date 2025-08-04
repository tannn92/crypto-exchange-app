import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getDeviceInfo } from '../utils/SafeAreaHelper';

/**
 * Debug component to display safe area information
 * Useful for testing on different devices
 */
const SafeAreaDebugger = ({ visible = false }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const deviceInfo = getDeviceInfo(insets);

  if (!visible) return null;

  return (
    <View style={[styles.debugContainer, { backgroundColor: theme.backgroundCard }]}>
      <Text style={[styles.debugTitle, { color: theme.textPrimary }]}>
        Safe Area Debug Info
      </Text>
      <Text style={[styles.debugText, { color: theme.textSecondary }]}>
        Platform: {deviceInfo.platform} {deviceInfo.version}
      </Text>
      <Text style={[styles.debugText, { color: theme.textSecondary }]}>
        Screen: {deviceInfo.dimensions.width}×{deviceInfo.dimensions.height}
      </Text>
      <Text style={[styles.debugText, { color: theme.textSecondary }]}>
        Insets: T:{insets.top} B:{insets.bottom} L:{insets.left} R:{insets.right}
      </Text>
      <Text style={[styles.debugText, { color: theme.textSecondary }]}>
        Has Gesture Nav: {deviceInfo.hasGestureNav ? 'Yes' : 'No'}
      </Text>
      <Text style={[styles.debugText, { color: theme.textSecondary }]}>
        Has Notch/Cutout: {deviceInfo.hasNotch ? 'Yes' : 'No'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  debugContainer: {
    position: 'absolute',
    top: 100,
    right: 10,
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
    maxWidth: 200,
    opacity: 0.9,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  debugText: {
    fontSize: 12,
    marginBottom: 2,
  },
});

export default SafeAreaDebugger;