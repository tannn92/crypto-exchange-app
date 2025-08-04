import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const StandardHeader = ({ 
  title,
  onBackPress,
  rightElement = null,
  showBackButton = true,
  testID = 'standard-header'
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel="Go back"
          testID={`${testID}-back-button`}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} />
      )}
      
      <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
        {title}
      </Text>
      
      <View style={styles.headerRight}>
        {rightElement}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 60,
    alignItems: 'flex-start',
    zIndex: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
});

export default StandardHeader;