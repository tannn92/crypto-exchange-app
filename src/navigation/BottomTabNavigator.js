import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTabBarHeight, hasGestureNavigation } from '../utils/SafeAreaHelper';
import { SafeHomeScreen, SafeAssetsScreen, SafeHistoryScreen } from './SafeScreens';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const hasGestures = hasGestureNavigation(insets);
  const tabBarHeight = getTabBarHeight(insets);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Assets') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.bottomNavInactive,
        tabBarStyle: {
          backgroundColor: theme.bottomNavBackground,
          borderTopColor: theme.border,
          // Dynamic padding based on gesture navigation
          paddingBottom: hasGestures ? Math.max(insets.bottom - 5, 8) : 12,
          paddingTop: 8,
          // Dynamic height based on safe areas
          height: tabBarHeight,
          // Add subtle elevation for gesture nav devices
          ...(hasGestures && Platform.OS === 'android' && {
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: hasGestures ? 2 : 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={SafeHomeScreen}
        options={{
          tabBarTestID: 'home-tab',
        }}
      />
      <Tab.Screen 
        name="Assets" 
        component={SafeAssetsScreen}
        options={{
          tabBarTestID: 'assets-tab',
        }}
      />
      <Tab.Screen 
        name="History" 
        component={SafeHistoryScreen}
        options={{
          tabBarTestID: 'history-tab',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
