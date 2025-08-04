import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import CoinIcon from '../components/CoinIcon';
import { getCoinById } from '../data/coinPrices';

const CoinDetailsScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { coin } = route.params || {};

  if (!coin) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[styles.errorText, { color: theme.textPrimary }]}>No coin selected</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mock data for the specific coin - in real app this would come from API/state
  const mockBalances = {
    btc: { amount: 0.3456778, value: 33192.45, currency: 'BTC' },
    eth: { amount: 0.0002, value: 0.76, currency: 'ETH' },
    usdt: { amount: 50.75, value: 50.75, currency: 'USDT' },
    sol: { amount: 0.003, value: 0.54, currency: 'SOL' },
    xrp: { amount: 1.5, value: 0.78, currency: 'XRP' },
  };

  // Mock transaction history - filtered by coin with realistic mix of positive/negative
  const allTransactions = {
    btc: [
      {
        id: '1',
        type: 'withdraw',
        amount: 0.025,
        currency: 'BTC',
        date: 'Today - 09:15',
        status: 'Success',
        description: 'Withdraw BTC',
        isPositive: false,
      },
      {
        id: '2',
        type: 'convert',
        amount: 0.15,
        currency: 'BTC',
        fromCurrency: 'USDT',
        date: 'Yesterday - 14:30',
        status: 'Success',
        description: 'Convert USDT → BTC',
        isPositive: true,
      },
      {
        id: '3',
        type: 'deposit',
        amount: 0.08,
        currency: 'BTC',
        date: '2 days ago - 16:22',
        status: 'Success',
        description: 'Deposit BTC',
        isPositive: true,
      },
      {
        id: '4',
        type: 'convert',
        amount: 0.12,
        currency: 'BTC',
        toCurrency: 'ETH',
        date: '3 days ago - 12:00',
        status: 'Success',
        description: 'Convert BTC → ETH',
        isPositive: false,
      },
      {
        id: '5',
        type: 'withdraw',
        amount: 0.05,
        currency: 'BTC',
        date: '5 days ago - 11:45',
        status: 'Success',
        description: 'Withdraw BTC',
        isPositive: false,
      },
    ],
    eth: [
      {
        id: '6',
        type: 'deposit',
        amount: 0.5,
        currency: 'ETH',
        date: 'Today - 15:20',
        status: 'Success',
        description: 'Deposit ETH',
        isPositive: true,
      },
      {
        id: '7',
        type: 'convert',
        amount: 0.25,
        currency: 'ETH',
        toCurrency: 'USDT',
        date: 'Yesterday - 09:10',
        status: 'Success',
        description: 'Convert ETH → USDT',
        isPositive: false,
      },
      {
        id: '8',
        type: 'convert',
        amount: 0.8,
        currency: 'ETH',
        fromCurrency: 'BTC',
        date: '2 days ago - 13:45',
        status: 'Success',
        description: 'Convert BTC → ETH',
        isPositive: true,
      },
      {
        id: '9',
        type: 'withdraw',
        amount: 0.15,
        currency: 'ETH',
        date: '4 days ago - 16:30',
        status: 'Success',
        description: 'Withdraw ETH',
        isPositive: false,
      },
      {
        id: '10',
        type: 'deposit',
        amount: 0.3,
        currency: 'ETH',
        date: '6 days ago - 10:15',
        status: 'Success',
        description: 'Deposit ETH',
        isPositive: true,
      },
    ],
    usdt: [
      {
        id: '11',
        type: 'convert',
        amount: 1250,
        currency: 'USDT',
        fromCurrency: 'ETH',
        date: 'Today - 11:20',
        status: 'Success',
        description: 'Convert ETH → USDT',
        isPositive: true,
      },
      {
        id: '12',
        type: 'withdraw',
        amount: 500,
        currency: 'USDT',
        date: 'Yesterday - 08:45',
        status: 'Success',
        description: 'Withdraw USDT',
        isPositive: false,
      },
      {
        id: '13',
        type: 'deposit',
        amount: 2000,
        currency: 'USDT',
        date: '2 days ago - 14:30',
        status: 'Success',
        description: 'Deposit USDT',
        isPositive: true,
      },
      {
        id: '14',
        type: 'convert',
        amount: 800,
        currency: 'USDT',
        toCurrency: 'BTC',
        date: '3 days ago - 15:20',
        status: 'Success',
        description: 'Convert USDT → BTC',
        isPositive: false,
      },
      {
        id: '15',
        type: 'withdraw',
        amount: 300,
        currency: 'USDT',
        date: '5 days ago - 12:10',
        status: 'Success',
        description: 'Withdraw USDT',
        isPositive: false,
      },
    ],
    sol: [
      {
        id: '16',
        type: 'convert',
        amount: 5.5,
        currency: 'SOL',
        fromCurrency: 'USDT',
        date: 'Today - 13:25',
        status: 'Success',
        description: 'Convert USDT → SOL',
        isPositive: true,
      },
      {
        id: '17',
        type: 'withdraw',
        amount: 3.2,
        currency: 'SOL',
        date: 'Yesterday - 16:40',
        status: 'Success',
        description: 'Withdraw SOL',
        isPositive: false,
      },
      {
        id: '18',
        type: 'deposit',
        amount: 8.0,
        currency: 'SOL',
        date: '2 days ago - 09:45',
        status: 'Success',
        description: 'Deposit SOL',
        isPositive: true,
      },
      {
        id: '19',
        type: 'convert',
        amount: 2.5,
        currency: 'SOL',
        toCurrency: 'ETH',
        date: '4 days ago - 11:20',
        status: 'Success',
        description: 'Convert SOL → ETH',
        isPositive: false,
      },
      {
        id: '20',
        type: 'deposit',
        amount: 1.8,
        currency: 'SOL',
        date: '6 days ago - 15:35',
        status: 'Success',
        description: 'Deposit SOL',
        isPositive: true,
      },
    ],
    xrp: [
      {
        id: '21',
        type: 'withdraw',
        amount: 150,
        currency: 'XRP',
        date: 'Today - 10:15',
        status: 'Success',
        description: 'Withdraw XRP',
        isPositive: false,
      },
      {
        id: '22',
        type: 'deposit',
        amount: 500,
        currency: 'XRP',
        date: 'Yesterday - 12:30',
        status: 'Success',
        description: 'Deposit XRP',
        isPositive: true,
      },
      {
        id: '23',
        type: 'convert',
        amount: 200,
        currency: 'XRP',
        fromCurrency: 'USDT',
        date: '3 days ago - 14:30',
        status: 'Success',
        description: 'Convert USDT → XRP',
        isPositive: true,
      },
      {
        id: '24',
        type: 'convert',
        amount: 100,
        currency: 'XRP',
        toCurrency: 'USDT',
        date: '4 days ago - 09:45',
        status: 'Success',
        description: 'Convert XRP → USDT',
        isPositive: false,
      },
      {
        id: '25',
        type: 'withdraw',
        amount: 75,
        currency: 'XRP',
        date: '7 days ago - 16:20',
        status: 'Success',
        description: 'Withdraw XRP',
        isPositive: false,
      },
    ],
  };

  const coinBalance = mockBalances[coin.id] || { amount: 0, value: 0, currency: coin.symbol };
  const coinData = getCoinById(coin.id);
  const lastPrice = coinData ? coinData.price : 0;

  // Get transactions for the current coin
  const coinTransactions = allTransactions[coin.id] || [];

  // Calculate USD value - use the actual USD value from the balance
  const balanceInUSD = coinBalance.value;

  const handleDeposit = () => {
    navigation.navigate('DepositFlow', {
      screen: 'Deposit',
      params: { coin },
    });
  };

  const handleWithdraw = () => {
    navigation.navigate('WithdrawMethodSelectionModal', { coin });
  };

  const handleConvert = () => {
    navigation.navigate('ConvertFlow', {
      screen: 'Convert',
      params: { selectedCoin: coin },
    });
  };

  const getTransactionIcon = (type) => {
    const iconMap = {
      deposit: 'arrow-down',
      withdraw: 'arrow-up',
      convert: 'swap-horizontal',
    };
    return iconMap[type] || 'help-circle';
  };

  const getTransactionColor = (type) => {
    const colorMap = {
      deposit: theme.success,
      withdraw: '#FF6B35',
      convert: theme.primary,
    };
    return colorMap[type] || theme.textSecondary;
  };

  const formatAmount = (amount, currency, isPositive) => {
    const formattedAmount = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: currency === 'USDT' ? 2 : 8,
    });
    const sign = isPositive ? '+' : '-';
    return `${sign}${formattedAmount} ${currency}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top Section - Seamless White Background including header */}
        <View style={[styles.topSection, { backgroundColor: theme.backgroundInput }]}>
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Coin Icon and Balance Section */}
          <View style={styles.balanceSection}>
            <View style={styles.coinIconContainer}>
              <CoinIcon coinId={coin.id} size={60} />
            </View>

            <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>
              My balance
            </Text>

            <Text style={[styles.balanceAmount, { color: theme.textPrimary }]}>
              {coinBalance.amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })} {coin.symbol}
            </Text>

            <Text style={[styles.balanceChange, { color: theme.success }]}>
              ~${balanceInUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          {/* Last Price Section */}
          <View style={[styles.priceSection, { borderTopColor: theme.border }]}>
            <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>
              Last price
            </Text>
            <Text style={[styles.priceValue, { color: theme.textPrimary }]}>
              ${lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={handleDeposit}
            >
              <Text style={styles.primaryButtonText}>Deposit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: theme.backgroundForm }]}
              onPress={handleWithdraw}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.textPrimary }]}>
                Withdraw
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: theme.backgroundForm }]}
              onPress={handleConvert}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.textPrimary }]}>
                Convert
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions History */}
        <View style={styles.transactionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Transactions history
          </Text>

          <View style={[styles.transactionsList, { backgroundColor: theme.backgroundInput }]}>
            {coinTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={[
                    styles.transactionIcon,
                    { backgroundColor: getTransactionColor(transaction.type) + '20' },
                  ]}>
                    <Ionicons
                      name={getTransactionIcon(transaction.type)}
                      size={20}
                      color={getTransactionColor(transaction.type)}
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={[styles.transactionDescription, { color: theme.textPrimary }]}>
                      {transaction.description}
                    </Text>
                    <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>
                      {transaction.date}
                    </Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text style={[
                    styles.transactionAmount,
                    { color: transaction.isPositive ? theme.success : '#FF3B30' },
                  ]}>
                    {formatAmount(transaction.amount, transaction.currency, transaction.isPositive)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingBottom: 0,
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  topSection: {
    paddingBottom: 20,
    marginBottom: 20,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  coinIconContainer: {
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balanceChange: {
    fontSize: 16,
    fontWeight: '500',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  priceLabel: {
    fontSize: 16,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionsSection: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  transactionsList: {
    borderRadius: 16,
    padding: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 14,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CoinDetailsScreen;
