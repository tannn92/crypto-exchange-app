import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const BalanceHeader = ({
  currency,
  setCurrency,
  showCurrencyDropdown,
  setShowCurrencyDropdown,
  totalBalance,
  balanceVisible,
  toggleBalanceVisibility,
  balanceChange,
  balanceChangePercent,
  formatBalance,
  formatChange,
}) => {
  const { theme } = useTheme();

  const handleCurrencySelect = (selectedCurrency) => {
    setCurrency(selectedCurrency);
    setShowCurrencyDropdown(false);
  };

  const formatBalanceDisplay = (amount) => {
    if (!balanceVisible) {
      return '*********';
    }

    if (currency === 'VND') {
      // For VND, show only integer part
      return Math.floor(amount).toLocaleString();
    } else {
      // For USDT, show with decimals
      return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  return (
    <>
      <View style={styles.balanceHeader}>
        <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Total balance in</Text>
        <TouchableOpacity
          style={styles.currencySelector}
          onPress={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
        >
          <Text style={[styles.currencyText, { color: theme.primary }]}>{currency}</Text>
          <Ionicons name="chevron-down" size={16} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceAmountContainer}>
        <Text style={[styles.balanceAmount, { color: theme.textPrimary }]}>
          {currency === 'VND' ? '' : '$'}{formatBalanceDisplay(totalBalance)}{currency === 'VND' ? ' VND' : ''}
        </Text>
        <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.eyeIcon}>
          <Ionicons
            name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.balanceChange, { color: '#16C784' }]}>
        {formatChange(balanceChange, balanceChangePercent)}
      </Text>

      {showCurrencyDropdown && (
        <View style={[styles.currencyDropdown, { backgroundColor: theme.backgroundCard }]}>
          <TouchableOpacity
            style={[styles.currencyOption, currency === 'USDT' && styles.activeCurrencyOption]}
            onPress={() => handleCurrencySelect('USDT')}
          >
            <Text style={[styles.currencyOptionText, { color: theme.textPrimary }]}>USDT</Text>
            {currency === 'USDT' && <Ionicons name="checkmark" size={20} color={theme.primary} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.currencyOption, currency === 'VND' && styles.activeCurrencyOption]}
            onPress={() => handleCurrencySelect('VND')}
          >
            <Text style={[styles.currencyOptionText, { color: theme.textPrimary }]}>VND</Text>
            {currency === 'VND' && <Ionicons name="checkmark" size={20} color={theme.primary} />}
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  balanceLabel: {
    fontSize: 14, // Match HomeScreen exactly
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  balanceAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  balanceChange: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  currencyDropdown: {
    position: 'absolute',
    top: 70,
    right: 20,
    left: 20,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  currencyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  currencyOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeCurrencyOption: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
});

export default BalanceHeader;
