import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import AssetsScreen from '../screens/AssetsScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Tab = createBottomTabNavigator();

// Placeholder screens
const PlaceholderScreen = ({ title }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: theme.background }]}>
      <Text style={[styles.placeholderText, { color: theme.textPrimary }]}>{title}</Text>
    </View>
  );
};

// HistoryScreen is now imported from the actual component

const BottomTabNavigator = () => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

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
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 5,
          paddingTop: 5,
          height: Platform.OS === 'ios' ? 40 + insets.bottom : 40,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Assets" component={AssetsScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default BottomTabNavigator;