import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ProfileIcon from '../components/ProfileIcon';

const ProfileMenuScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const showComingSoon = (featureName) => {
    Alert.alert(
      'Coming Soon',
      `${featureName} feature will be available soon!`,
      [
        { text: 'OK', style: 'default' },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    {
      id: 'profile',
      title: 'Profile',
      iconId: 'profile',
      badge: 'Verified',
      badgeColor: '#10B981',
      onPress: () => showComingSoon('Profile'),
    },
    {
      id: 'security',
      title: 'Security',
      iconId: 'security',
      onPress: () => showComingSoon('Security'),
    },
    {
      id: 'vouchers',
      title: 'Vouchers',
      iconId: 'vouchers',
      badge: 'NEW',
      badgeColor: '#FF6B35',
      onPress: () => showComingSoon('Vouchers'),
    },
    {
      id: 'refer',
      title: 'Refer a friend',
      iconId: 'refer',
      onPress: () => showComingSoon('Refer a friend'),
    },
    {
      id: 'recipients',
      title: 'Saved recipients',
      iconId: 'recipients',
      onPress: () => showComingSoon('Saved recipients'),
    },
    {
      id: 'settings',
      title: 'Settings',
      iconId: 'settings',
      onPress: () => showComingSoon('Settings'),
    },
    {
      id: 'support',
      title: 'Support center',
      iconId: 'support',
      onPress: () => showComingSoon('Support center'),
    },
    {
      id: 'logout',
      title: 'Logout',
      iconId: 'logout',
      onPress: () => showComingSoon('Logout'),
      isLogout: true,
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <ProfileIcon iconId={item.iconId} size={24} color={theme.textSecondary} />
        <Text style={[styles.menuItemText, { color: theme.textPrimary }]}>
          {item.title}
        </Text>
      </View>
      {item.badge && (
        <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderSection = (items) => (
    <View style={styles.section}>
      {items.map((item) => renderMenuItem(item))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.textPrimary }]}>
            John Smith
          </Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
            johnsmith.uk@cryptovn.com
          </Text>
        </View>

        {/* Menu Sections */}
        {/* Section 1: Profile & Security */}
        {renderSection(menuItems.slice(0, 2))}

        <View style={[styles.sectionDivider, { backgroundColor: theme.border }]} />

        {/* Section 2: Vouchers, Refer, Recipients */}
        {renderSection(menuItems.slice(2, 5))}

        <View style={[styles.sectionDivider, { backgroundColor: theme.border }]} />

        {/* Section 3: Settings & Support */}
        {renderSection(menuItems.slice(5, 7))}

        <View style={[styles.sectionDivider, { backgroundColor: theme.border }]} />

        {/* Section 4: Logout */}
        {renderSection(menuItems.slice(7))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userInfo: {
    paddingVertical: 8,
    paddingBottom: 32,
  },
  userName: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '400',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 17,
    fontWeight: '400',
    marginLeft: 16,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    // Container for each section
  },
  sectionDivider: {
    height: 0.5,
    marginVertical: 16,
  },
});

export default ProfileMenuScreen;
