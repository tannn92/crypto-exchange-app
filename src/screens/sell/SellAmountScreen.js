import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import CoinIcon from '../../components/CoinIcon';
import BankIcon from '../../components/BankIcon';
import ProcessingGuarantee from '../../components/ProcessingGuarantee';

const SellAmountScreen = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();
  const { coin: initialCoin } = route.params || {};

  // Default coin if none provided
  const defaultCoin = {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 96093.46,
  };

  const [selectedCoin, setSelectedCoin] = useState(initialCoin || defaultCoin);
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [vndAmount, setVndAmount] = useState('');
  const [receiveMethod, setReceiveMethod] = useState('bank-vietcombank');
  const [accountName, setAccountName] = useState('NGUYEN THE DUY');
  const [accountNumber, setAccountNumber] = useState('***6868');
  const [showPriceTooltip, setShowPriceTooltip] = useState(false);
  const [isRateFlipped, setIsRateFlipped] = useState(false);

  // Calculate exchange rate based on selected coin
  const exchangeRate = (selectedCoin?.price || 0) * 25290; // Convert USD to VND
  const balance = 560; // Mock balance for now

  useEffect(() => {
    // Calculate VND amount when crypto amount changes
    if (cryptoAmount && !isNaN(cryptoAmount)) {
      const vnd = parseFloat(cryptoAmount) * exchangeRate;
      setVndAmount(vnd.toFixed(0));
    } else {
      setVndAmount('');
    }
  }, [cryptoAmount, exchangeRate]);

  useEffect(() => {
    // Handle returned receive method selection
    if (route.params?.selectedReceiveMethod) {
      setReceiveMethod(route.params.selectedReceiveMethod);

      if (route.params?.selectedReceiveMethodDetails) {
        const details = route.params.selectedReceiveMethodDetails;
        setAccountName(details.accountName || 'RANDOM NAME');
        setAccountNumber(details.accountNumber || '***RANDOM NUM');
      }
    }
  }, [route.params?.selectedReceiveMethod, route.params?.selectedReceiveMethodDetails]);

  // Use focus effect to handle return values from modal screens
  useFocusEffect(
    React.useCallback(() => {
      // Check if we have return params from CoinSelectionModal
      const params = route.params;
      if (params?.selectedCoin && params.selectedCoin !== selectedCoin) {
        setSelectedCoin(params.selectedCoin);
        // Reset amounts when coin changes
        setCryptoAmount('');
        setVndAmount('');
        // Clear the params to prevent re-triggering
        navigation.setParams({ selectedCoin: undefined });
      }
    }, [route.params, selectedCoin, navigation])
  );

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleConfirm = () => {
    navigation.navigate('SellConfirmation', {
      coin: selectedCoin,
      cryptoAmount: parseFloat(cryptoAmount),
      vndAmount: parseFloat(vndAmount),
      exchangeRate,
      receiveMethod,
      accountName,
      accountNumber,
    });
  };

  const handleMax = () => {
    setCryptoAmount(balance.toString());
  };

  const handleSwapCurrencies = () => {
    setIsRateFlipped(prev => !prev);
  };

  const handleSelectSourceCoin = () => {
    navigation.navigate('CoinSelectionModal', {
      flow: 'sell',
      currentCoin: selectedCoin,
    });
  };

  const handleReceiveMethodPress = () => {
    navigation.navigate('ReceiveMethodScreen', {
      currentMethod: receiveMethod,
      returnScreen: 'SellAmount',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                console.log('Back button touched - SellAmountScreen');
                navigation.goBack();
              }}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel="Go back"
              testID="back-button"
            >
              <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              Sell {selectedCoin?.symbol || 'Crypto'}
            </Text>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={() => {
                  console.log('History button touched - SellAmountScreen');
                  navigation.getParent()?.navigate('MainTabs', {
                    screen: 'History',
                    params: { selectedTab: 'Sell' },
                  });
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
                accessible={true}
                accessibilityLabel="View transaction history"
              >
                <Ionicons name="time-outline" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.content}>
            {/* You Sell Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>You Sell</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.backgroundInput }]}>
                <TextInput
                  style={[styles.amountInput, { color: theme.textPrimary }]}
                  value={cryptoAmount}
                  onChangeText={setCryptoAmount}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={theme.textSecondary}
                  testID="sell-amount-input"
                />
                <TouchableOpacity onPress={handleMax} style={styles.maxButton} testID="max-button">
                  <Text style={[styles.maxText, { color: theme.primary }]}>Max</Text>
                </TouchableOpacity>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <TouchableOpacity style={styles.coinSelector} onPress={handleSelectSourceCoin} testID="sell-coin-selector">
                  <CoinIcon coinId={selectedCoin?.id || 'btc'} size={24} />
                  <Text style={[styles.coinSymbol, { color: theme.textPrimary }]}>
                    {selectedCoin?.symbol || 'BTC'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.balanceText, { color: theme.textSecondary }]}>
                Balance: {formatNumber(balance)}
              </Text>
            </View>

            {/* You Get Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>You Get</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.backgroundInput }]}>
                <Text style={[styles.amountDisplay, { color: theme.textPrimary }]}>
                  {vndAmount ? formatNumber(vndAmount) : '0'}
                </Text>
                <View style={styles.currencyBadge}>
                  <CoinIcon coinId="vnd" size={24} />
                  <Text style={[styles.currencyText, { color: theme.textPrimary }]}>VND</Text>
                </View>
              </View>
            </View>

            {/* Exchange Rate */}
            <View style={styles.exchangeRate}>
              <View style={styles.priceInfoContainer}>
                <Text style={[styles.exchangeRateLabel, { color: theme.textSecondary }]}>
                  With price
                </Text>
                <TouchableOpacity
                  style={styles.infoButton}
                  onPress={() => setShowPriceTooltip(!showPriceTooltip)}
                >
                  <Ionicons name="information-circle-outline" size={16} color={theme.primary} />
                </TouchableOpacity>
                {showPriceTooltip && (
                  <View style={[styles.tooltip, { backgroundColor: theme.textPrimary }]}>
                    <Text style={[styles.tooltipText, { color: theme.background }]}>
                      The price displayed doesn't include the transaction fee
                    </Text>
                    <View style={[styles.tooltipArrow, { borderTopColor: theme.textPrimary }]} />
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.exchangeRateContainer}
                onPress={handleSwapCurrencies}
              >
                <Text style={[styles.exchangeRateValue, { color: theme.textPrimary }]}>
                  {isRateFlipped ? (
                    `1 VND = ${(1 / exchangeRate).toFixed(8)} ${selectedCoin?.symbol || 'BTC'}`
                  ) : (
                    `1 ${selectedCoin?.symbol || 'BTC'} = ${formatNumber(Math.round(exchangeRate))} VND`
                  )}
                </Text>
                <Ionicons name="repeat-outline" size={16} color={theme.primary} style={styles.swapIcon} />
              </TouchableOpacity>
            </View>

            {/* Receive Method */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Receive method</Text>
              <TouchableOpacity
                style={[styles.receiveMethodContainer, { backgroundColor: theme.backgroundInput }]}
                onPress={handleReceiveMethodPress}
                testID="receive-method-selector"
              >
                <BankIcon bankId={receiveMethod.replace('bank-', '')} size={32} />
                <View style={styles.bankDetails}>
                  <Text style={[styles.bankName, { color: theme.textPrimary }]}>
                    {receiveMethod === 'bank-vietcombank' ? 'Vietcombank' :
                     receiveMethod === 'bank-acb' ? 'ACB' :
                     receiveMethod === 'bank-techcombank' ? 'Techcombank' :
                     receiveMethod === 'bank-vietinbank' ? 'VietinBank' :
                     receiveMethod === 'bank-bidv' ? 'BIDV' :
                     receiveMethod === 'bank-agribank' ? 'Agribank' :
                     receiveMethod === 'bank-sacombank' ? 'Sacombank' :
                     receiveMethod === 'bank-mbbank' ? 'MBBank' :
                     receiveMethod === 'bank-vpbank' ? 'VPBank' :
                     receiveMethod === 'bank-dongabank' ? 'DongA Bank' : 'Bank'}
                  </Text>
                  <Text style={[styles.accountInfo, { color: theme.textSecondary }]}>
                    {accountName} ({accountNumber})
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color={theme.textSecondary} style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              style={[
                styles.confirmButton,
                {
                  backgroundColor: (!cryptoAmount || parseFloat(cryptoAmount) <= 0)
                    ? 'rgba(255, 107, 0, 0.4)' // Light orange when disabled
                    : theme.primary,             // Full orange when enabled
                },
              ]}
              onPress={handleConfirm}
              disabled={!cryptoAmount || parseFloat(cryptoAmount) <= 0}
              testID="sell-confirm-button"
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>

            {/* Processing Guarantee */}
            <ProcessingGuarantee />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
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
  headerIcon: {
    marginLeft: 15,
    padding: 5,
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 5,
    minHeight: 70,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    textAlignVertical: 'center',
  },
  amountDisplay: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    textAlignVertical: 'center',
  },
  maxButton: {
    marginRight: 10,
  },
  maxText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 20,
    marginHorizontal: 8,
  },
  coinSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinSymbol: {
    fontSize: 18,
    fontWeight: '500',
  },
  balanceText: {
    fontSize: 14,
    marginLeft: 15,
  },
  currencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyText: {
    fontSize: 18,
    fontWeight: '500',
  },
  exchangeRate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  priceInfoContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  exchangeRateLabel: {
    fontSize: 14,
  },
  infoButton: {
    marginLeft: 2,
    padding: 2,
  },
  tooltip: {
    position: 'absolute',
    top: -45,
    left: -20,
    minWidth: 200,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  tooltipText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -8,
    left: 25,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  exchangeRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exchangeRateValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  swapIcon: {
    marginLeft: 5,
  },
  receiveMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 12,
  },
  bankDetails: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  accountInfo: {
    fontSize: 14,
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SellAmountScreen;
