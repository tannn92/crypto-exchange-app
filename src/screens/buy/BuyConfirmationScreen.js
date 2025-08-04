import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import CoinIcon from '../../components/CoinIcon';

const BuyConfirmationScreen = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();
  const { coin, vndAmount, cryptoAmount, exchangeRate, paymentMethod } = route.params;

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleConfirm = () => {
    // Navigate to payment processing screen
    navigation.navigate('PaymentProcessing', {
      ...route.params,
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
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
              Buy {coin.symbol} via Bank Transfer
            </Text>
            <Text style={[styles.cryptoAmount, { color: theme.textPrimary }]}>
              {cryptoAmount.toFixed(6)} {coin.symbol}
            </Text>
          </View>

          {/* Transaction Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>With price</Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                1 {coin.symbol} = {formatNumber(exchangeRate)} VND
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Transfer to</Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>Vietcombank</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                Fee
                <TouchableOpacity style={styles.infoIcon}>
                  <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              </Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {formatNumber(0)} VND
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
                10,000.00 VND
              </Text>
            </View>

            <View style={[styles.detailRow, styles.totalRow]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>You pay</Text>
              <Text style={[styles.totalAmount, { color: theme.textPrimary }]}>
                {formatNumber((vndAmount - 10000).toFixed(0))} VND
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Processing time</Text>
              <Text style={[styles.detailValue, { color: theme.info }]}>≤ 5 min</Text>
            </View>
          </View>


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
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    position: 'relative',
  },
  backButton: {
    width: 40,
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

export default BuyConfirmationScreen;
