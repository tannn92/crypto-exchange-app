import React from 'react';
import { View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

/**
 * Universal screen wrapper that handles safe areas for ALL screens
 * This component is applied automatically at the navigation level
 */
const ScreenWrapper = ({ children, route, isModal = false }) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Determine if this is a modal or full screen
  const isModalScreen = isModal || route?.params?._isModal || false;
  const isFullScreen = route?.params?._isFullScreen || false;
  
  // Skip safe area handling for full screen content (like videos, games)
  if (isFullScreen) {
    return children;
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: insets.top,
      // Only add bottom padding for modals, tab navigator handles bottom for regular screens
      paddingBottom: isModalScreen ? insets.bottom : 0,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      {children}
    </View>
  );
};

export default ScreenWrapper;