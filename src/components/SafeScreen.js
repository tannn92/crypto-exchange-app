import React from 'react';
import { View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getSafePadding } from '../utils/SafeAreaHelper';

/**
 * A wrapper component that handles safe areas consistently across all screens
 * Replaces SafeAreaView with more granular control
 */
const SafeScreen = ({ 
  children, 
  style, 
  includeTop = true, 
  includeBottom = false, 
  includeHorizontal = false,
  minBottomPadding = 0,
  backgroundColor,
  statusBarStyle,
}) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  
  const safePadding = getSafePadding(insets, {
    includeTop,
    includeBottom,
    includeHorizontal,
    minBottomPadding,
  });

  const defaultStatusBarStyle = isDarkMode ? 'light-content' : 'dark-content';
  const screenBackgroundColor = backgroundColor || theme.background;

  return (
    <View 
      style={[
        {
          flex: 1,
          backgroundColor: screenBackgroundColor,
          ...safePadding,
        },
        style,
      ]}
    >
      <StatusBar 
        barStyle={statusBarStyle || defaultStatusBarStyle}
        backgroundColor={screenBackgroundColor}
        translucent={true}
      />
      {children}
    </View>
  );
};

export default SafeScreen;