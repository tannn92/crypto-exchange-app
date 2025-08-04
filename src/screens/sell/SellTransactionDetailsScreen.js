import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import CoinIcon from '../../components/CoinIcon';
import BankIcon from '../../components/BankIcon';

const SellTransactionDetailsScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { coin, cryptoAmount, vndAmount, exchangeRate, receiveMethod, accountName, accountNumber } = route.params;

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getBankName = (method) => {
    const bankNames = {
      'bank-vietcombank': 'Vietcombank',
      'bank-acb': 'ACB',
      'bank-techcombank': 'Techcombank',
      'bank-vietinbank': 'VietinBank',
      'bank-sacombank': 'Sacombank',
      'bank-mbbank': 'MBBank',
      'bank-vpbank': 'VPBank',
      'bank-vib': 'VIB',
      'bank-msb': 'MSB',
      'bank-shinhanbank': 'ShinhanBank',
    };
    return bankNames[method] || 'Bank';
  };

  const getBankId = (method) => {
    return method.replace('bank-', '');
  };

  // Calculate values
  const totalAmount = parseFloat(vndAmount);
  const fee = totalAmount * 0.01; // 1% fee
  const cashback = 10000; // Fixed 10,000 VND cashback
  const finalAmount = totalAmount - fee + cashback;

  const transactionId = '#R009213121';
  const transactionTime = '2025/1/12 - 9:10';
  const processingTime = '00:02:34';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Transaction Icon */}
        <View style={styles.iconSection}>
          <View style={styles.coinIconContainer}>
            <CoinIcon coinId={coin.id} size={60} />
          </View>
        </View>

        {/* Transaction Info */}
        <View style={styles.transactionSection}>
          <Text style={[styles.transactionType, { color: theme.textSecondary }]}>
            Sell {coin.symbol} and receive to Bank account
          </Text>
          <Text style={[styles.cryptoAmount, { color: theme.textPrimary }]}>
            {cryptoAmount} {coin.symbol}
          </Text>
          <View style={[styles.statusLabel, { backgroundColor: '#E8F5E8' }]}>
            <Text style={[styles.statusText, { color: '#4CAF50' }]}>
              Success
            </Text>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={[styles.detailsCard, { backgroundColor: theme.backgroundSecondary }]}>
          {/* Transaction ID */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Transaction ID
            </Text>
            <View style={styles.detailValueContainer}>
              <Text style={[styles.transactionId, { color: '#FF6B35' }]}>
                {transactionId}
              </Text>
              <TouchableOpacity>
                <Ionicons name="copy-outline" size={16} color="#FF6B35" style={styles.copyIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Exchange Rate */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              With price
            </Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              1 {coin.symbol} = {formatNumber(Math.round(exchangeRate))} VNF
            </Text>
          </View>

          {/* Fee */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Fee
            </Text>
            <View style={styles.detailValueContainer}>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {formatNumber(Math.round(fee))} VNF
              </Text>
              <TouchableOpacity>
                <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Cashback */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Cashback
            </Text>
            <View style={styles.detailValueContainer}>
              <Text style={[styles.cashbackValue, { color: '#4CAF50' }]}>
                {formatNumber(cashback)} VNF
              </Text>
              <TouchableOpacity>
                <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Transaction Time */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Transaction time
            </Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              {transactionTime}
            </Text>
          </View>

          {/* Processing Time */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Processing time
            </Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              {processingTime}
            </Text>
          </View>
        </View>

        {/* Recipient Details */}
        <View style={[styles.detailsCard, { backgroundColor: theme.backgroundSecondary }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Recipient details
          </Text>

          {/* Bank Name */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Bank name
            </Text>
            <View style={styles.detailValueContainer}>
              <BankIcon bankId={getBankId(receiveMethod)} size={20} />
              <Text style={[styles.detailValue, { color: theme.textPrimary, marginLeft: 8 }]}>
                {getBankName(receiveMethod)}
              </Text>
            </View>
          </View>

          {/* Account Number */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Account number
            </Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              {accountNumber}
            </Text>
          </View>

          {/* Account Name */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Account name
            </Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              {accountName}
            </Text>
          </View>

          {/* Final Amount */}
          <View style={[styles.detailRow, styles.finalAmountRow]}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              You get
            </Text>
            <Text style={[styles.finalAmount, { color: theme.textPrimary }]}>
              {formatNumber(Math.round(finalAmount))} VND
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.homeButton, { backgroundColor: theme.backgroundSecondary }]}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={[styles.homeButtonText, { color: theme.textPrimary }]}>Homepage</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.walletButton, { backgroundColor: '#FF6B35' }]}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Assets' })}
        >
          <Text style={styles.walletButtonText}>Back to Wallet</Text>
        </TouchableOpacity>
      </View>
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
  backButton: {
    padding: 5,
  },
  headerRight: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iconSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  coinIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  transactionSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  transactionType: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  cryptoAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusLabel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 16,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionId: {
    fontSize: 16,
    fontWeight: '600',
  },
  copyIcon: {
    marginLeft: 8,
  },
  cashbackValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  finalAmountRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 10,
    paddingTop: 20,
  },
  finalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 15,
  },
  homeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  walletButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  walletButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SellTransactionDetailsScreen;
