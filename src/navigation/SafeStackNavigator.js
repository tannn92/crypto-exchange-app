import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScreenWrapper from '../components/ScreenWrapper';

/**
 * Creates a stack navigator that automatically wraps all screens with safe area handling
 */
export const createSafeStackNavigator = () => {
  const Stack = createStackNavigator();
  
  // Override the Screen component to automatically wrap with ScreenWrapper
  const originalScreen = Stack.Screen;
  Stack.Screen = ({ component: Component, ...props }) => {
    const WrappedComponent = (screenProps) => (
      <ScreenWrapper route={screenProps.route}>
        <Component {...screenProps} />
      </ScreenWrapper>
    );
    
    return <originalScreen {...props} component={WrappedComponent} />;
  };
  
  return Stack;
};

/**
 * Safe Stack Navigator with default screen options for better UX
 */
export const SafeStack = createSafeStackNavigator();

/**
 * Default screen options that work well with safe areas
 */
export const defaultScreenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: 'transparent' },
  cardOverlayEnabled: false,
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
};