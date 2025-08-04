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

  // Mock notification data with mixed order
  const allNotifications = {
    Activities: [
      {
        id: '1',
        type: 'withdraw',
        title: 'Withdraw USDT',
        description: 'You withdrew 500 USDT from your wallet',
        amount: '-500 USDT',
        time: '3 days ago',
        isPositive: false,
        icon: 'arrow-down',
        timestamp: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        id: '6',
        type: 'buy',
        title: 'Buy BTC',
        description: 'You bought 0.000041 BTC successfully',
        amount: '+0.000041 BTC',
        time: '2 hours ago',
        isPositive: true,
        icon: 'arrow-up',
        timestamp: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: '7',
        type: 'sell',
        title: 'Sell ETH',
        description: 'You sold 0.5 ETH successfully',
        amount: '-0.5 ETH',
        time: '5 hours ago',
        isPositive: false,
        icon: 'arrow-down',
        timestamp: Date.now() - (5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        id: '9',
        type: 'withdraw',
        title: 'Withdraw USDT',
        description: 'You withdrew 200 USDT from your wallet',
        amount: '-200 USDT',
        time: '9 hours ago',
        isPositive: false,
        icon: 'arrow-down',
        timestamp: Date.now() - (9 * 60 * 60 * 1000), // 9 hours ago
      },
      {
        id: '10',
        type: 'buy',
        title: 'Buy ETH',
        description: 'You bought 0.25 ETH successfully',
        amount: '+0.25 ETH',
        time: '11 hours ago',
        isPositive: true,
        icon: 'arrow-up',
        timestamp: Date.now() - (11 * 60 * 60 * 1000), // 11 hours ago
      },
      {
        id: '12',
        type: 'sell',
        title: 'Sell BNB',
        description: 'You sold 1.5 BNB successfully',
        amount: '-1.5 BNB',
        time: '15 hours ago',
        isPositive: false,
        icon: 'arrow-down',
        timestamp: Date.now() - (15 * 60 * 60 * 1000), // 15 hours ago
      },
      {
        id: '13',
        type: 'convert',
        title: 'Convert BTC to USDT',
        description: 'You converted 0.001 BTC to 97.15 USDT successfully',
        amount: '+97.15 USDT',
        time: '17 hours ago',
        isPositive: true,
        icon: 'swap-horizontal',
        timestamp: Date.now() - (17 * 60 * 60 * 1000), // 17 hours ago
      },
    ],
    Announcements: [
      {
        id: '8',
        type: 'announcement',
        title: 'Security upgrade completed',
        description: 'Enhanced security measures now active.',
        time: '3 hours ago',
        isCryptoVN: true,
        timestamp: Date.now() - (3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        id: '11',
        type: 'announcement',
        title: 'Trading pairs maintenance',
        description: 'Scheduled maintenance for BTC/VND pair completed.',
        time: '7 hours ago',
        isCryptoVN: true,
        timestamp: Date.now() - (7 * 60 * 60 * 1000), // 7 hours ago
      },
      {
        id: '5',
        type: 'announcement',
        title: 'CryptoVN has been successfully updated to version 1.0.5',
        description: 'Bugs fixed and performance improvements.',
        time: '10 hours ago',
        isCryptoVN: true,
        timestamp: Date.now() - (10 * 60 * 60 * 1000), // 10 hours ago
      },
      {
        id: '14',
        type: 'announcement',
        title: 'New feature: Price alerts',
        description: 'Set custom price alerts for your favorite cryptocurrencies.',
        time: '13 hours ago',
        isCryptoVN: true,
        timestamp: Date.now() - (13 * 60 * 60 * 1000), // 13 hours ago
      },
      {
        id: '3',
        type: 'announcement',
        title: 'The referral program has started! Tap to join now!',
        description: 'Invite friends and earn rewards together.',
        time: '16 hours ago',
        isCryptoVN: true,
        timestamp: Date.now() - (16 * 60 * 60 * 1000), // 16 hours ago
      },
      {
        id: '2',
        type: 'announcement',
        title: 'New trading pairs available',
        description: 'We added BNB/VND and SOL/VND trading pairs.',
        time: '18 hours ago',
        isCryptoVN: true,
        timestamp: Date.now() - (18 * 60 * 60 * 1000), // 18 hours ago
      },
    ],
  };

  // Combine all notifications for "All" tab
  const getAllNotifications = () => {
    const activities = allNotifications.Activities || [];
    const announcements = allNotifications.Announcements || [];
    return [...activities, ...announcements].sort((a, b) => {
      // Sort by timestamp (newest first)
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
  };

  const getNotificationData = () => {
    if (selectedTab === 'All') {
      return getAllNotifications();
    }
    return allNotifications[selectedTab] || [];
  };

  const getTransactionIconColor = (type, isPositive) => {
    if (type === 'buy' || type === 'deposit') {return '#4CAF50';}
    if (type === 'sell' || type === 'withdraw') {return '#FF6B35';}
    if (type === 'convert') {return '#2196F3';}
    return theme.textSecondary;
  };

  const getTransactionIconBackground = (type, isPositive) => {
    if (type === 'buy' || type === 'deposit') {return '#E8F5E9';}
    if (type === 'sell' || type === 'withdraw') {return '#FFEBEE';}
    if (type === 'convert') {return '#E3F2FD';}
    return '#F5F5F5';
  };

  // Handle notification click
  const handleNotificationPress = (item) => {
    if (item.isCryptoVN) {
      // Handle system announcement clicks - navigate to info page
      navigation.navigate('AnnouncementDetail', {
        title: item.title,
        description: item.description,
        time: item.time,
        type: 'announcement'
      });
    } else {
      // Handle activity notifications - navigate to completion screens like history
      handleActivityNotificationPress(item);
    }
  };

  // Handle activity notification clicks (similar to history navigation)
  const handleActivityNotificationPress = (item) => {
    // Extract coin symbol from amount
    const coinMatch = item.amount.match(/(BTC|ETH|USDT|VND|XRP|BNB|SOL)/);
    const coinSymbol = coinMatch ? coinMatch[1] : 'USDT';
    
    // Get coin data
    const getCoinData = (symbol) => {
      const coinMap = {
        'BTC': { id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 95000 },
        'ETH': { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 3500 },
        'USDT': { id: 'usdt', symbol: 'USDT', name: 'Tether', price: 1 },
        'VND': { id: 'vnd', symbol: 'VND', name: 'Vietnamese Dong', price: 0.00004 },
        'XRP': { id: 'xrp', symbol: 'XRP', name: 'XRP', price: 2.5 },
        'BNB': { id: 'bnb', symbol: 'BNB', name: 'BNB', price: 650 },
        'SOL': { id: 'sol', symbol: 'SOL', name: 'Solana', price: 200 },
      };
      return coinMap[symbol] || coinMap['USDT'];
    };

    const coin = getCoinData(coinSymbol);
    const amount = parseFloat(item.amount.replace(/[+\-,]/g, '').split(' ')[0]);

    // Generate completion data
    const completionData = {
      coin: coin,
      amount: amount,
      date: item.time,
      transactionId: `#N${item.id.padStart(9, '0')}121`,
      status: 'Completed',
      fromNotification: true,
    };

    // Navigate to appropriate completion screen
    if (item.type === 'buy') {
      navigation.navigate('BuyFlow', {
        screen: 'PaymentCompleted',
        params: {
          ...completionData,
          cryptoAmount: amount,
          vndAmount: amount * 25000,
          exchangeRate: 25000,
          paymentMethod: 'Bank Transfer',
        }
      });
    } else if (item.type === 'sell') {
      navigation.navigate('SellFlow', {
        screen: 'SellCompleted',
        params: {
          ...completionData,
          cryptoAmount: amount,
          vndAmount: amount * 25000,
          exchangeRate: 25000,
          receiveMethod: 'Bank Transfer',
          accountName: 'John Doe',
          accountNumber: '1234567890',
        }
      });
    } else if (item.type === 'convert') {
      // Extract source and destination coins from description
      const sourceCoin = { id: 'btc', symbol: 'BTC', name: 'Bitcoin' };
      const destinationCoin = { id: 'usdt', symbol: 'USDT', name: 'Tether' };
      navigation.navigate('ConvertFlow', {
        screen: 'ConvertSuccess',
        params: {
          sourceCoin: sourceCoin,
          destinationCoin: destinationCoin,
          sourceAmount: 0.001,
          destinationAmount: 97.15,
          exchangeRate: 97150,
          fee: 0.97,
          finalAmount: 97.15,
          transactionId: completionData.transactionId,
          transactionTime: completionData.date,
          fromNotification: true,
        }
      });
    } else if (item.type === 'deposit') {
      if (coinSymbol === 'VND') {
        // VND deposit - go to a simple success screen
        navigation.navigate('BuyFlow', {
          screen: 'PaymentCompleted',
          params: {
            ...completionData,
            cryptoAmount: 0,
            vndAmount: amount,
            exchangeRate: 1,
            paymentMethod: 'Bank Transfer',
            isDeposit: true,
          }
        });
      } else {
        // Crypto deposit
        navigation.navigate('BuyFlow', {
          screen: 'PaymentCompleted',
          params: {
            ...completionData,
            cryptoAmount: amount,
            vndAmount: 0,
            exchangeRate: 1,
            paymentMethod: 'Crypto Network',
            isDeposit: true,
          }
        });
      }
    } else if (item.type === 'withdraw') {
      navigation.navigate('WithdrawFlow', {
        screen: 'WithdrawSuccess',
        params: {
          ...completionData,
          cryptoAmount: amount,
          networkFee: amount * 0.001,
          recipientAddress: '0x742d35Cc6608C673B8cbE4f4E2E4b0b8f90D8F90',
          network: 'Ethereum',
        }
      });
    }
  };

  const renderNotificationItem = ({ item }) => {
    if (item.isCryptoVN) {
      // Announcement notification
      return (
        <TouchableOpacity 
          style={styles.notificationItem}
          onPress={() => handleNotificationPress(item)}
          activeOpacity={0.7}
        >
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
          <View style={styles.notificationRight}>
          </View>
        </TouchableOpacity>
      );
    } else {
      // Activity notification
      return (
        <TouchableOpacity 
          style={styles.notificationItem}
          onPress={() => handleNotificationPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.notificationLeft}>
            <View style={[
              styles.activityIcon,
              { backgroundColor: getTransactionIconBackground(item.type, item.isPositive) },
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
              { color: item.isPositive ? '#4CAF50' : '#FF6B35' },
            ]}>
              {item.amount}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => {
              console.log('Back button touched - NotificationScreen');
              navigation.navigate('MainTabs', { screen: 'Home' });
            }}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Notification
        </Text>

        <View style={styles.headerRight} />
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
              selectedTab === tab && [styles.activeTab, { backgroundColor: '#FF6B35' }],
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab ? styles.activeTabText : { color: theme.textPrimary },
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
    width: 60,
    alignItems: 'flex-start',
    zIndex: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
