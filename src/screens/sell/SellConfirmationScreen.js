import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import CoinIcon from '../../components/CoinIcon';
import ProcessingGuarantee from '../../components/ProcessingGuarantee';

const SellConfirmationScreen = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();
  const {
    coin,
    cryptoAmount,
    vndAmount,
    exchangeRate,
    receiveMethod,
    accountName,
    accountNumber,
  } = route.params;

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

  // Calculate fees and totals based on the screenshot
  const fee = Math.round(vndAmount * 0.01); // 1% fee
  const cashback = 10000; // 10,000 VND cashback
  const youGet = vndAmount - fee + cashback;

  const handleConfirm = () => {
    // Navigate to processing screen (to be implemented)
    console.log('Sell confirmed');
    navigation.navigate('SellProcessing', route.params);
  };

  const handleCancel = () => {
    console.log('Back button pressed - SellConfirmation');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              console.log('Back button touched - SellConfirmation');
              handleCancel();
            }}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Confirmation</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.content}>
          {/* Coin Icon and Amount */}
          <View style={styles.amountSection}>
            <View style={styles.coinIconContainer}>
              <CoinIcon coinId={coin.id} size={60} />
            </View>
            <Text style={[styles.transactionType, { color: theme.textSecondary }]}>
              Sell {coin.symbol} and receive to Bank account
            </Text>
            <Text style={[styles.cryptoAmount, { color: theme.textPrimary }]}>
              {cryptoAmount} {coin.symbol}
            </Text>
          </View>

          {/* Transaction Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>With price</Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                1 {coin.symbol} = {formatNumber(Math.round(exchangeRate))} VND
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Receive method</Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {getBankName(receiveMethod)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Account number</Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {accountNumber.replace('***', '0999966')}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Account name</Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {accountName}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                Fee
                <TouchableOpacity style={styles.infoIcon}>
                  <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              </Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {formatNumber(fee)} VND
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                Cashback
                <TouchableOpacity style={styles.infoIcon}>
                  <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              </Text>
              <Text style={[styles.detailValue, { color: theme.success }]}>
                {formatNumber(cashback)} VND
              </Text>
            </View>

            <View style={[styles.detailRow, styles.totalRow]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>You get</Text>
              <Text style={[styles.totalAmount, { color: theme.textPrimary }]}>
                {formatNumber(youGet)} VND
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Processing time</Text>
              <Text style={[styles.detailValue, { color: theme.info }]}>≤ 5 min</Text>
            </View>
          </View>

          {/* Processing Guarantee */}
          <ProcessingGuarantee />

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: theme.primary }]}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
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
    position: 'relative',
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
    zIndex: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  amountSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  coinIconContainer: {
    marginBottom: 15,
  },
  transactionType: {
    fontSize: 16,
    marginBottom: 10,
  },
  cryptoAmount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  detailsSection: {
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoIcon: {
    marginLeft: 5,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 10,
    paddingTop: 15,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  guaranteeBox: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
  },
  guaranteeText: {
    flex: 1,
    marginLeft: 10,
  },
  guaranteeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  guaranteeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SellConfirmationScreen;
