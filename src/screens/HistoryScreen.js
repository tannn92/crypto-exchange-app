import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import StandardHeader from '../components/StandardHeader';
import Svg, { Path } from 'react-native-svg';

// Custom SVG Icons from Homepage
const BuyIcon = ({ size = 24, color = '#4CAF50' }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Path d="M12.9995 26.25C12.8095 26.25 12.6195 26.18 12.4695 26.03C12.1795 25.74 12.1795 25.26 12.4695 24.97L26.4695 10.97C26.7595 10.68 27.2395 10.68 27.5295 10.97C27.8195 11.26 27.8195 11.74 27.5295 12.03L13.5295 26.03C13.3795 26.18 13.1895 26.25 12.9995 26.25Z" fill={color}/>
    <Path d="M23.27 26.25H13C12.59 26.25 12.25 25.91 12.25 25.5V15.23C12.25 14.82 12.59 14.48 13 14.48C13.41 14.48 13.75 14.82 13.75 15.23V24.75H23.27C23.68 24.75 24.02 25.09 24.02 25.5C24.02 25.91 23.68 26.25 23.27 26.25Z" fill={color}/>
    <Path d="M28.5 30.75H11.5C11.09 30.75 10.75 30.41 10.75 30C10.75 29.59 11.09 29.25 11.5 29.25H28.5C28.91 29.25 29.25 29.59 29.25 30C29.25 30.41 28.91 30.75 28.5 30.75Z" fill={color}/>
  </Svg>
);

const SellIcon = ({ size = 24, color = '#FF6B35' }) => (
  <Svg width={size} height={size} viewBox="0 0 41 40" fill="none">
    <Path d="M29.25 30.75H12.25C11.84 30.75 11.5 30.41 11.5 30C11.5 29.59 11.84 29.25 12.25 29.25H29.25C29.66 29.25 30 29.59 30 30C30 30.41 29.66 30.75 29.25 30.75Z" fill={color}/>
    <Path d="M13.7475 26.25C13.9375 26.25 14.1275 26.18 14.2775 26.03L28.2775 12.03C28.5675 11.74 28.5675 11.26 28.2775 10.97C27.9875 10.68 27.5075 10.68 27.2175 10.97L13.2175 24.97C12.9275 25.26 12.9275 25.74 13.2175 26.03C13.3675 26.18 13.5575 26.25 13.7475 26.25Z" fill={color}/>
    <Path d="M27.7475 22.52C28.1575 22.52 28.4975 22.18 28.4975 21.77V11.5C28.4975 11.09 28.1575 10.75 27.7475 10.75H17.4775C17.0675 10.75 16.7275 11.09 16.7275 11.5C16.7275 11.91 17.0675 12.25 17.4775 12.25H26.9975V21.77C26.9975 22.18 27.3375 22.52 27.7475 22.52Z" fill={color}/>
  </Svg>
);

const ConvertIcon = ({ size = 24, color = '#FF6B35' }) => (
  <Svg width={size} height={size} viewBox="0 0 41 40" fill="none">
    <Path d="M25.9201 12.4099H13.8901L15.7701 10.53C16.0601 10.24 16.0601 9.75994 15.7701 9.46994C15.4801 9.17994 15.0001 9.17994 14.7101 9.46994L11.5501 12.63C11.4801 12.7 11.4301 12.78 11.3901 12.87C11.3501 12.96 11.3301 13.0599 11.3301 13.1599C11.3301 13.2599 11.3501 13.36 11.3901 13.45C11.4301 13.54 11.4801 13.62 11.5501 13.69L14.7101 16.8499C14.8601 16.9999 15.0501 17.07 15.2401 17.07C15.4301 17.07 15.6201 16.9999 15.7701 16.8499C16.0601 16.5599 16.0601 16.0799 15.7701 15.7899L13.8901 13.9099H25.9201C27.1601 13.9099 28.1701 14.9199 28.1701 16.1599V19.48C28.1701 19.89 28.5101 20.23 28.9201 20.23C29.3301 20.23 29.6701 19.89 29.6701 19.48V16.1599C29.6701 14.0899 27.9901 12.4099 25.9201 12.4099Z" fill={color}/>
    <Path d="M29.6701 26.84C29.6701 26.74 29.6501 26.64 29.6101 26.55C29.5701 26.46 29.5201 26.38 29.4501 26.31L26.2901 23.15C26.0001 22.86 25.5201 22.86 25.2301 23.15C24.9401 23.44 24.9401 23.92 25.2301 24.21L27.1101 26.09H15.0801C13.8401 26.09 12.8301 25.08 12.8301 23.84V20.52C12.8301 20.11 12.4901 19.77 12.0801 19.77C11.6701 19.77 11.3301 20.11 11.3301 20.52V23.84C11.3301 25.91 13.0101 27.59 15.0801 27.59H27.1101L25.2301 29.47C24.9401 29.76 24.9401 30.24 25.2301 30.53C25.3801 30.68 25.5701 30.75 25.7601 30.75C25.9501 30.75 26.1401 30.68 26.2901 30.53L29.4501 27.37C29.5201 27.3 29.5701 27.22 29.6101 27.13C29.6501 27.04 29.6701 26.94 29.6701 26.84Z" fill={color}/>
  </Svg>
);

const DepositIcon = ({ size = 24, color = '#4CAF50' }) => (
  <Svg width={size} height={size} viewBox="0 0 41 40" fill="none">
    <Path d="M28.25 19H21.25V12C21.25 11.4533 20.7967 11 20.25 11C19.7033 11 19.25 11.4533 19.25 12V19H12.25C11.7033 19 11.25 19.4533 11.25 20C11.25 20.5467 11.7033 21 12.25 21H19.25V28C19.25 28.5467 19.7033 29 20.25 29C20.7967 29 21.25 28.5467 21.25 28V21H28.25C28.7967 21 29.25 20.5467 29.25 20C29.25 19.4533 28.7967 19 28.25 19Z" fill={color}/>
  </Svg>
);

const WithdrawIcon = ({ size = 24, color = '#FF6B35' }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Path d="M21 19H28C28.5467 19 29 19.4533 29 20C29 20.5467 28.5467 21 28 21H21H19H12C11.4533 21 11 20.5467 11 20C11 19.4533 11.4533 19 12 19H19H21Z" fill={color}/>
  </Svg>
);

const HistoryScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState(route.params?.selectedTab || 'Buy');


  // Transaction type tabs
  const transactionTabs = ['Buy', 'Sell', 'Convert', 'Deposit', 'Withdrawal'];

  // Mock transaction data organized by type
  const allTransactions = {
    Buy: [
      {
        id: '1',
        type: 'Buy ETH',
        amount: '+0.9 ETH',
        date: '5 min ago',
        status: 'Success',
        isPositive: true,
        month: 'Feb 2025',
      },
      {
        id: '2',
        type: 'Buy USDT',
        amount: '+525.50 USDT',
        date: 'Yesterday - 07:15',
        status: 'Success',
        isPositive: true,
        month: 'Feb 2025',
      },
      {
        id: '3',
        type: 'Buy USDT',
        amount: '+200 USDT',
        date: '3/2/2025 - 10:10',
        status: 'Success',
        isPositive: true,
        month: 'Feb 2025',
      },
      {
        id: '4',
        type: 'Buy BTC',
        amount: '+0.025 BTC',
        date: '1/1/2025 - 10:10',
        status: 'Success',
        isPositive: true,
        month: 'Jan 2025',
      },
      {
        id: '5',
        type: 'Buy ETH',
        amount: '+200 USDT',
        date: '1/1/2025 - 10:10',
        status: 'Success',
        isPositive: true,
        month: 'Jan 2025',
      },
      {
        id: '6',
        type: 'Buy XRP',
        amount: '+200 XRP',
        date: '1/1/2025 - 10:10',
        status: 'Success',
        isPositive: true,
        month: 'Jan 2025',
      },
    ],
    Sell: [
      {
        id: '7',
        type: 'Sell ETH',
        amount: '-0.9 ETH',
        date: '5 min ago',
        status: 'Success',
        isPositive: false,
        month: 'Feb 2025',
      },
      {
        id: '8',
        type: 'Sell USDT',
        amount: '-525.50 USDT',
        date: 'Yesterday - 07:15',
        status: 'Success',
        isPositive: false,
        month: 'Feb 2025',
      },
      {
        id: '9',
        type: 'Sell USDT',
        amount: '-200 USDT',
        date: '3/2/2025 - 10:10',
        status: 'Success',
        isPositive: false,
        month: 'Feb 2025',
      },
      {
        id: '10',
        type: 'Sell XRP',
        amount: '-200 XRP',
        date: '1/1/2025 - 10:10',
        status: 'Success',
        isPositive: false,
        month: 'Jan 2025',
      },
      {
        id: '11',
        type: 'Sell USDT',
        amount: '-200 USDT',
        date: '1/1/2025 - 10:10',
        status: 'Success',
        isPositive: false,
        month: 'Jan 2025',
      },
      {
        id: '12',
        type: 'Sell BTC',
        amount: '-0.025 BTC',
        date: '1/1/2025 - 10:10',
        status: 'Success',
        isPositive: false,
        month: 'Jan 2025',
      },
    ],
    Convert: [
      {
        id: '13',
        type: 'Convert BTC → USDT',
        amount: '-0.03100025 BTC',
        date: 'Yesterday - 09:10',
        status: 'Success',
        isPositive: false,
        month: 'Feb 2025',
      },
      {
        id: '14',
        type: 'Convert BTC → USDT',
        amount: '-0.03100025 BTC',
        date: '3/2/2025 - 10:10',
        status: 'Success',
        isPositive: false,
        month: 'Feb 2025',
      },
      {
        id: '15',
        type: 'Convert BTC → USDT',
        amount: '-0.03100025 BTC',
        date: '3/2/2025 - 10:10',
        status: 'Success',
        isPositive: false,
        month: 'Feb 2025',
      },
      {
        id: '16',
        type: 'Convert BTC → USDT',
        amount: '-0.03100025 BTC',
        date: '3/2/2025 - 10:10',
        status: 'Success',
        isPositive: false,
        month: 'Feb 2025',
      },
    ],
    Deposit: [
      {
        id: '17',
        type: 'Deposit ETH',
        amount: '+0.9 ETH',
        date: '5 min ago',
        status: 'Success',
        isPositive: true,
        month: 'Feb 2025',
      },
      {
        id: '18',
        type: 'Deposit USDT',
        amount: '+525.50 USDT',
        date: 'Yesterday - 07:15',
        status: 'Success',
        isPositive: true,
        month: 'Feb 2025',
      },
      {
        id: '19',
        type: 'Deposit USDT',
        amount: '+200 USDT',
        date: '3/2/2025 - 10:10',
        status: 'Success',
        isPositive: true,
        month: 'Feb 2025',
      },
    ],
    Withdrawal: [
      {
        id: '20',
        type: 'Withdraw ETH',
        amount: '-0.9 ETH',
        date: '5 min ago',
        status: 'Success',
        isPositive: false,
        month: 'Feb 2025',
      },
      {
        id: '21',
        type: 'Withdraw USDT',
        amount: '-525.50 USDT',
        date: 'Yesterday - 07:15',
        status: 'Success',
        isPositive: false,
        month: 'Feb 2025',
      },
      {
        id: '22',
        type: 'Withdraw USDT',
        amount: '-200 USDT',
        date: '3/2/2025 - 10:10',
        status: 'Success',
        isPositive: false,
        month: 'Feb 2025',
      },
      {
        id: '23',
        type: 'Withdraw XRP',
        amount: '-200 XRP',
        date: '1/1/2025 - 10:10',
        status: 'Success',
        isPositive: false,
        month: 'Jan 2025',
      },
      {
        id: '24',
        type: 'Withdraw USDT',
        amount: '-200 USDT',
        date: '1/1/2025 - 10:10',
        status: 'Success',
        isPositive: false,
        month: 'Jan 2025',
      },
    ],
  };

  // Get transactions for selected tab
  const currentTransactions = allTransactions[selectedTab] || [];

  // Group transactions by month
  const groupedTransactions = currentTransactions.reduce((groups, transaction) => {
    const month = transaction.month;
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(transaction);
    return groups;
  }, {});

  const getTransactionIcon = (type) => {
    if (type.includes('Buy')) {return BuyIcon;}
    if (type.includes('Sell')) {return SellIcon;}
    if (type.includes('Convert')) {return ConvertIcon;}
    if (type.includes('Deposit')) {return DepositIcon;}
    if (type.includes('Withdraw')) {return WithdrawIcon;}
    return null;
  };

  const getTransactionIconColor = (type) => {
    if (type.includes('Buy')) {return '#4CAF50';}
    if (type.includes('Sell')) {return '#FF6B35';}
    if (type.includes('Convert')) {return '#FF6B35';}
    if (type.includes('Deposit')) {return '#4CAF50';}
    if (type.includes('Withdraw')) {return '#FF6B35';}
    return theme.textSecondary;
  };

  const getTransactionIconBackground = (type) => {
    if (type.includes('Buy')) {return '#E8F5E9';}
    if (type.includes('Sell')) {return '#FFEBEE';}
    if (type.includes('Convert')) {return '#FFEBEE';}
    if (type.includes('Deposit')) {return '#E8F5E9';}
    if (type.includes('Withdraw')) {return '#FFEBEE';}
    return '#F5F5F5';
  };

  // Helper function to extract coin from transaction type
  const extractCoinFromType = (type) => {
    const match = type.match(/(BTC|ETH|USDT|XRP|BNB|SOL|VNF)/);
    return match ? match[1] : 'USDT';
  };

  // Navigation handler for transaction items
  const handleTransactionPress = (transaction) => {
    const coinSymbol = extractCoinFromType(transaction.type);
    const coinData = getCoinData(coinSymbol);
    
    // Generate fake completion data based on transaction
    const completionData = {
      coin: coinData,
      amount: transaction.amount.replace(/[\+\-]/g, ''), // Remove +/- signs
      date: transaction.date,
      transactionId: `#R${transaction.id.padStart(9, '0')}121`,
      status: transaction.status,
    };

    if (transaction.type.includes('Buy')) {
      navigation.navigate('BuyFlow', {
        screen: 'PaymentCompleted',
        params: {
          ...completionData,
          cryptoAmount: parseFloat(completionData.amount),
          vndAmount: parseFloat(completionData.amount) * 25000, // Fake VND amount
          exchangeRate: 25000,
          paymentMethod: 'Bank Transfer',
          fromHistory: true,
        }
      });
    } else if (transaction.type.includes('Sell')) {
      navigation.navigate('SellFlow', {
        screen: 'SellCompleted',
        params: {
          ...completionData,
          cryptoAmount: parseFloat(completionData.amount),
          vndAmount: parseFloat(completionData.amount) * 25000, // Fake VND amount
          exchangeRate: 25000,
          receiveMethod: 'Bank Transfer',
          accountName: 'John Doe',
          accountNumber: '1234567890',
          fromHistory: true,
        }
      });
    } else if (transaction.type.includes('Convert')) {
      const [fromCoin, toCoin] = transaction.type.includes('→') 
        ? transaction.type.split('→').map(s => s.replace('Convert ', '').trim())
        : ['BTC', 'USDT'];
      
      navigation.navigate('ConvertFlow', {
        screen: 'ConvertSuccess',
        params: {
          sourceCoin: getCoinData(fromCoin),
          destinationCoin: getCoinData(toCoin),
          sourceAmount: parseFloat(completionData.amount),
          destinationAmount: parseFloat(completionData.amount) * 50000, // Fake conversion
          exchangeRate: 50000,
          fee: parseFloat(completionData.amount) * 0.001,
          transactionId: completionData.transactionId,
          transactionTime: completionData.date,
          fromHistory: true,
        }
      });
    } else if (transaction.type.includes('Deposit')) {
      // Navigate to dedicated DepositCompletedScreen
      navigation.navigate('DepositFlow', {
        screen: 'DepositCompleted',
        params: {
          ...completionData,
          cryptoAmount: parseFloat(completionData.amount),
          network: 'Ethereum',
          depositAddress: '0x3ccc...s24145',
          transactionHash: '2d801...0735fn',
          fromHistory: true,
        }
      });
    } else if (transaction.type.includes('Withdraw') || transaction.type.includes('Send')) {
      navigation.navigate('WithdrawFlow', {
        screen: 'WithdrawSuccess',
        params: {
          ...completionData,
          cryptoAmount: parseFloat(completionData.amount),
          networkFee: parseFloat(completionData.amount) * 0.001,
          recipientAddress: '0x742d35Cc6608C673B8cbE4f4E2E4b0b8f90D8F90',
          network: 'Ethereum',
          fromHistory: true,
        }
      });
    }
  };

  // Helper function to get coin data
  const getCoinData = (symbol) => {
    const coinMap = {
      'BTC': { id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 95000 },
      'ETH': { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 3500 },
      'USDT': { id: 'usdt', symbol: 'USDT', name: 'Tether', price: 1 },
      'XRP': { id: 'xrp', symbol: 'XRP', name: 'XRP', price: 2.5 },
      'BNB': { id: 'bnb', symbol: 'BNB', name: 'BNB', price: 650 },
      'SOL': { id: 'sol', symbol: 'SOL', name: 'Solana', price: 200 },
      'VNF': { id: 'vnf', symbol: 'VNF', name: 'VNF Token', price: 0.5 },
    };
    return coinMap[symbol] || coinMap['USDT'];
  };

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => handleTransactionPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.transactionLeft}>
        <View style={[
          styles.transactionIcon,
          { backgroundColor: getTransactionIconBackground(item.type) },
        ]}>
          {(() => {
            const IconComponent = getTransactionIcon(item.type);
            const iconColor = getTransactionIconColor(item.type);
            return IconComponent ? <IconComponent size={24} color={iconColor} /> : null;
          })()}
        </View>
        <View style={styles.transactionDetails}>
          <Text style={[styles.transactionType, { color: theme.textPrimary }]}>
            {item.type}
          </Text>
          <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>
            {item.date}
          </Text>
        </View>
      </View>

      <View style={styles.transactionRight}>
        <Text style={[
          styles.transactionAmount,
          { color: item.isPositive ? theme.success : '#FF3B30' },
        ]}>
          {item.amount}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} style={styles.chevronIcon} />
      </View>
    </TouchableOpacity>
  );

  const renderSection = ({ item }) => {
    const [month, transactions] = item;

    return (
      <View style={styles.monthSection}>
        <Text style={[styles.monthHeader, { color: theme.textPrimary }]}>
          {month}
        </Text>
        {transactions.map((transaction) => (
          <View key={transaction.id}>
            {renderTransactionItem({ item: transaction })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      {/* Header */}
      <StandardHeader
        title="History"
        onBackPress={() => navigation.goBack()}
        testID="history-header"
      />

      {/* Transaction Type Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {transactionTabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.activeTab,
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


      {/* Transaction List */}
      <FlatList
        data={Object.entries(groupedTransactions)}
        renderItem={renderSection}
        keyExtractor={([month]) => month}
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    maxHeight: 50,
  },
  tabsContent: {
    gap: 8,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
    height: 36,
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
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  monthSection: {
    marginBottom: 30,
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 14,
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  chevronIcon: {
    marginLeft: 4,
  },
});

export default HistoryScreen;
