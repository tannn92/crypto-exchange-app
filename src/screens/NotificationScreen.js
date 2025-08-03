import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const NotificationScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState(route.params?.selectedTab || 'All');

  // Notification type tabs
  const notificationTabs = ['All', 'Activities', 'Announcements'];

  // Mock notification data
  const allNotifications = {
    Activities: [
      {
        id: '1',
        type: 'buy',
        title: 'Buy BTC',
        description: 'You bought 0.000041 BTC successfully',
        amount: '+0.000041 BTC',
        time: '2 hours ago',
        isPositive: true,
        icon: 'arrow-up',
      },
      {
        id: '2',
        type: 'sell',
        title: 'Sell ETH',
        description: 'You sold 0.5 ETH successfully',
        amount: '-0.5 ETH',
        time: '1 day ago',
        isPositive: false,
        icon: 'arrow-down',
      },
      {
        id: '3',
        type: 'deposit',
        title: 'Deposit VND',
        description: 'You deposited 1,000,000 VND to your wallet',
        amount: '+1,000,000 VND',
        time: '2 days ago',
        isPositive: true,
        icon: 'arrow-up',
      },
      {
        id: '4',
        type: 'withdraw',
        title: 'Withdraw USDT',
        description: 'You withdrew 500 USDT from your wallet',
        amount: '-500 USDT',
        time: '3 days ago',
        isPositive: false,
        icon: 'arrow-down',
      },
    ],
    Announcements: [
      {
        id: '5',
        type: 'announcement',
        title: 'CryptoVN has been successfully updated to version 1.0.5',
        description: 'Bugs fixed and performance improvements.',
        time: '17:08 - 12/7/2023',
        isCryptoVN: true,
      },
      {
        id: '6',
        type: 'announcement',
        title: 'The referral program has started! Tap to join now!',
        description: 'Invite friends and earn rewards together.',
        time: '22:30 - 5/7/2023',
        isCryptoVN: true,
      },
      {
        id: '7',
        type: 'announcement',
        title: 'New trading pairs available',
        description: 'We added BNB/VND and SOL/VND trading pairs.',
        time: '14:15 - 3/7/2023',
        isCryptoVN: true,
      },
    ],
  };

  // Combine all notifications for "All" tab
  const getAllNotifications = () => {
    const activities = allNotifications.Activities || [];
    const announcements = allNotifications.Announcements || [];
    return [...activities, ...announcements].sort((a, b) => {
      // Sort by time (newest first) - simplified sorting
      return b.id - a.id;
    });
  };

  const getNotificationData = () => {
    if (selectedTab === 'All') {
      return getAllNotifications();
    }
    return allNotifications[selectedTab] || [];
  };

  const getTransactionIconColor = (type, isPositive) => {
    if (type === 'buy' || type === 'deposit') return '#4CAF50';
    if (type === 'sell' || type === 'withdraw') return '#FF6B35';
    return theme.textSecondary;
  };

  const getTransactionIconBackground = (type, isPositive) => {
    if (type === 'buy' || type === 'deposit') return '#E8F5E9';
    if (type === 'sell' || type === 'withdraw') return '#FFEBEE';
    return '#F5F5F5';
  };

  const renderNotificationItem = ({ item }) => {
    if (item.isCryptoVN) {
      // Announcement notification
      return (
        <View style={styles.notificationItem}>
          <View style={styles.notificationLeft}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.cryptoVNFullLogo}
              resizeMode="contain"
            />
            <View style={styles.notificationDetails}>
              <Text style={[styles.notificationTitle, { color: theme.textPrimary }]}>
                {item.title}
              </Text>
              <Text style={[styles.notificationDescription, { color: theme.textSecondary }]}>
                {item.description}
              </Text>
              <Text style={[styles.notificationTime, { color: theme.textSecondary }]}>
                {item.time}
              </Text>
            </View>
          </View>
        </View>
      );
    } else {
      // Activity notification
      return (
        <View style={styles.notificationItem}>
          <View style={styles.notificationLeft}>
            <View style={[
              styles.activityIcon, 
              { backgroundColor: getTransactionIconBackground(item.type, item.isPositive) }
            ]}>
              <Ionicons 
                name={item.icon} 
                size={20} 
                color={getTransactionIconColor(item.type, item.isPositive)} 
              />
            </View>
            <View style={styles.notificationDetails}>
              <Text style={[styles.notificationTitle, { color: theme.textPrimary }]}>
                {item.title}
              </Text>
              <Text style={[styles.notificationDescription, { color: theme.textSecondary }]}>
                {item.description}
              </Text>
              <Text style={[styles.notificationTime, { color: theme.textSecondary }]}>
                {item.time}
              </Text>
            </View>
          </View>
          <View style={styles.notificationRight}>
            <Text style={[
              styles.notificationAmount, 
              { color: item.isPositive ? '#4CAF50' : '#FF6B35' }
            ]}>
              {item.amount}
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Notification
        </Text>
        
        <View style={styles.headerRight}>
        </View>
      </View>

      {/* Notification Type Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {notificationTabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && [styles.activeTab, { backgroundColor: '#FF6B35' }]
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab ? styles.activeTabText : { color: theme.textPrimary }
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Section Header for Announcements tab */}
      {selectedTab === 'Announcements' && (
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Announcement
          </Text>
        </View>
      )}

      {/* Notification List */}
      <FlatList
        data={getNotificationData()}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.notificationsContent}
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerLeft: {
    width: 80,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 80,
    alignItems: 'flex-end',
  },
  tabsContainer: {
    maxHeight: 50,
    marginHorizontal: 20,
    marginBottom: 0,
  },
  tabsContent: {
    gap: 12,
    paddingHorizontal: 0,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
  },
  notificationsContent: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notificationLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cryptoVNFullLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  notificationDetails: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationDescription: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  notificationRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginLeft: 12,
  },
  notificationAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NotificationScreen;