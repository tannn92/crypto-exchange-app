import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getCoinById } from '../../data/coinPrices';
import CoinIcon from '../../components/CoinIcon';
import BankIcon from '../../components/BankIcon';
import ProcessingGuarantee from '../../components/ProcessingGuarantee';

const { width: screenWidth } = Dimensions.get('window');

const BuyAmountScreen = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();
  const { coin } = route.params || {};
  const [vndAmount, setVndAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('bank');
  const [selectedCoin, setSelectedCoin] = useState(coin);
  const [paymentCurrency, setPaymentCurrency] = useState('vnd'); // 'vnd' or 'usdt'
  const [isRateFlipped, setIsRateFlipped] = useState(false); // false: 1 COIN = X VND, true: 1 VND = X COIN
  const [showPriceTooltip, setShowPriceTooltip] = useState(false);

  // Get current coin data and calculate exchange rate
  const currentCoinData = getCoinById(selectedCoin?.id);
  const VND_TO_USDT_RATE = 25290; // 1 USDT = 25,290 VND
  const exchangeRate = currentCoinData ? currentCoinData.price * VND_TO_USDT_RATE : 0;
  const balance = 30000000; // 30,000,000 VND
  const fee = 0; // Free for now

  useEffect(() => {
    if (vndAmount) {
      const numAmount = parseFloat(vndAmount.replace(/,/g, ''));
      if (!isNaN(numAmount) && exchangeRate > 0) {
        const crypto = numAmount / exchangeRate;
        setCryptoAmount(crypto.toFixed(6));
      }
    } else {
      setCryptoAmount('');
    }
  }, [vndAmount, exchangeRate]);

  useEffect(() => {
    // Handle returned payment method selection
    if (route.params?.selectedPaymentMethod) {
      setSelectedPayment(route.params.selectedPaymentMethod);
    }
  }, [route.params?.selectedPaymentMethod]);

  // Use focus effect to handle return values from modal screens
  useFocusEffect(
    React.useCallback(() => {
      // Check if we have return params from CoinSelectionModal
      const params = route.params;
      if (params?.selectedCoin && params.selectedCoin !== selectedCoin) {
        setSelectedCoin(params.selectedCoin);
        // Reset amounts when coin changes
        setVndAmount('');
        setCryptoAmount('');
        // Clear the params to prevent re-triggering
        navigation.setParams({ selectedCoin: undefined });
      }
      
      // Check if we have return params from PaymentMethodModal
      if (params?.selectedPaymentMethod && params.selectedPaymentMethod !== selectedPayment) {
        setSelectedPayment(params.selectedPaymentMethod);
        // Clear the params to prevent re-triggering
        navigation.setParams({ selectedPaymentMethod: undefined });
      }
    }, [route.params, selectedCoin, selectedPayment, navigation])
  );
  
  // Bank names mapping
  const bankNames = {
    'bank-shinhanbank': 'ShinhanBank',
    'bank-vietcombank': 'Vietcombank',
    'bank-techcombank': 'Techcombank',
    'bank-msb': 'MSB',
    'bank-vietinbank': 'VietinBank',
    'bank-vpbank': 'VPBank',
    'bank-vib': 'VIB',
    'bank-mbbank': 'MBBank',
    'bank-sacombank': 'Sacombank',
    'bank-acb': 'ACB',
  };

  const bankLogos = ['shinhanbank', 'vietcombank', 'techcombank', 'msb', 'vietinbank', 'vpbank', 'vib', 'mbbank', 'sacombank'];
  
  // Helper functions for payment method display
  const getPaymentIcon = () => {
    if (selectedPayment.startsWith('bank-')) {
      return 'card';
    }
    return selectedPayment === 'bank' ? 'card' : 'wallet';
  };
  
  const getPaymentTitle = () => {
    if (selectedPayment.startsWith('bank-')) {
      return bankNames[selectedPayment] || 'Bank transfer';
    }
    return selectedPayment === 'bank' ? 'Bank transfer' : 'Your Balance';
  };
  
  const getPaymentSubtitle = () => {
    if (selectedPayment.startsWith('bank-')) {
      return 'Bank transfer'; // Show "Bank transfer" as subtitle when specific bank is selected
    }
    return selectedPayment === 'bank' ? 'Select bank' : `${formatNumber(balance)} VND`;
  };
  
  const getBankId = () => {
    if (selectedPayment.startsWith('bank-')) {
      return selectedPayment.replace('bank-', '');
    }
    return null;
  };
  
  // Handle missing coin parameter
  if (!coin) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Error</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[styles.errorText, { color: theme.textPrimary }]}>No coin selected</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleConfirm = () => {
    if (vndAmount && parseFloat(vndAmount.replace(/,/g, '')) > 0) {
      navigation.navigate('BuyConfirmation', {
        coin: selectedCoin,
        vndAmount: parseFloat(vndAmount.replace(/,/g, '')),
        cryptoAmount: parseFloat(cryptoAmount),
        exchangeRate,
        paymentMethod: selectedPayment,
      });
    }
  };

  const handleSwapCurrencies = () => {
    // Flip the exchange rate display: 1 COIN = X VND <-> 1 VND = X COIN
    setIsRateFlipped(prev => !prev);
  };

  const handleSelectDestinationCoin = () => {
    navigation.navigate('CoinSelectionModal', { 
      flow: 'buy',
      currentCoin: selectedCoin,
      returnScreen: 'BuyAmountScreen',
    });
  };

  const handleVndChange = (text) => {
    // Remove non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    setVndAmount(cleaned);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Buy {selectedCoin.symbol}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.headerIcon}
              onPress={() => navigation.getParent()?.navigate('MainTabs', {
                screen: 'History',
                params: { selectedTab: 'Buy' }
              })}
            >
              <Ionicons name="time-outline" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* You Pay Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>You Pay</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.backgroundInput }]}>
              <TextInput
                style={[styles.amountInput, { color: theme.textPrimary }]}
                placeholder="0.00"
                placeholderTextColor={theme.textTertiary}
                value={vndAmount}
                onChangeText={handleVndChange}
                keyboardType="numeric"
              />
              <View style={styles.currencyBadge}>
                <CoinIcon coinId={paymentCurrency} size={24} />
                <Text style={[styles.currencyText, { color: theme.textPrimary }]}>
                  {paymentCurrency.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          {/* You Get Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>You Get</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.backgroundInput }]}>
              <Text style={[styles.amountInput, { color: theme.textPrimary }]}>
                {cryptoAmount || '0.00'}
              </Text>
              <TouchableOpacity style={styles.currencyBadge} onPress={handleSelectDestinationCoin}>
                <CoinIcon coinId={selectedCoin.id} size={24} />
                <Text style={[styles.currencyText, { color: theme.textPrimary }]}>{selectedCoin.symbol}</Text>
                <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
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
                  `1 ${paymentCurrency.toUpperCase()} = ${(1 / exchangeRate).toFixed(8)} ${selectedCoin.symbol}`
                ) : (
                  `1 ${selectedCoin.symbol} = ${formatNumber(Math.round(exchangeRate))} ${paymentCurrency.toUpperCase()}`
                )}
              </Text>
              <Ionicons name="repeat-outline" size={16} color={theme.primary} style={styles.swapIcon} />
            </TouchableOpacity>
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Paying with</Text>
            <TouchableOpacity 
              style={[
                styles.paymentMethod, 
                { 
                  backgroundColor: theme.backgroundInput,
                  borderColor: theme.border,
                  borderWidth: 1,
                }
              ]}
              onPress={() => {
                console.log('Payment method button pressed');
                console.log('Current route:', route.name);
                console.log('Navigation state:', navigation.getState());
                try {
                  navigation.navigate('PaymentMethodModal', {
                    currentPaymentMethod: selectedPayment, // Pass current selection
                    coin: selectedCoin, // Pass the current coin
                    returnScreen: 'BuyAmountScreen',
                  });
                } catch (error) {
                  console.error('Navigation error:', error);
                }
              }}
            >
              <View style={styles.paymentLeft}>
                {selectedPayment.startsWith('bank-') ? (
                  <BankIcon 
                    bankId={getBankId()} 
                    size={40} 
                    style={styles.paymentIcon}
                  />
                ) : (
                  <View style={[styles.paymentIcon, { backgroundColor: theme.primary }]}>
                    <Ionicons name={getPaymentIcon()} size={20} color="#FFF" />
                  </View>
                )}
                <View style={styles.paymentInfo}>
                  <Text style={[styles.paymentTitle, { color: theme.textPrimary }]}>
                    {getPaymentTitle()}
                  </Text>
                  {selectedPayment === 'bank' ? (
                    <View style={styles.bankInfoRow}>
                      <Text style={[styles.paymentSubtitle, { color: theme.textSecondary }]}>
                        Buy crypto 24/7 via:
                      </Text>
                      <View style={styles.bankLogos}>
                        {bankLogos.slice(0, screenWidth < 400 ? 5 : 8).map((bank, index) => (
                          <BankIcon key={bank} bankId={bank} size={16} style={{ marginLeft: 4 }} />
                        ))}
                      </View>
                    </View>
                  ) : (
                    <Text style={[styles.paymentBalance, { color: theme.textSecondary }]}>
                      {getPaymentSubtitle()}
                    </Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity 
            style={[
              styles.confirmButton, 
              { 
                backgroundColor: vndAmount && parseFloat(vndAmount) > 0 ? '#FF6B35' : '#FF9F43',
                opacity: vndAmount && parseFloat(vndAmount) > 0 ? 1 : 0.7,
              }
            ]}
            onPress={handleConfirm}
            disabled={!vndAmount || parseFloat(vndAmount) <= 0}
          >
            <Text style={styles.confirmButtonText}>
              Confirm
            </Text>
          </TouchableOpacity>

          {/* Processing Guarantee */}
          <ProcessingGuarantee />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 15,
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  sectionLabel: {
    fontSize: 14,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 16,
    minHeight: 70,
  },
  amountInput: {
    fontSize: 28,
    fontWeight: '600',
    flex: 1,
    lineHeight: 36,
    textAlignVertical: 'center',
    paddingVertical: 8,
  },
  currencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cryptoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cryptoIconText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  currencyText: {
    fontSize: 16,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    gap: 5,
  },
  exchangeRateValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  swapIcon: {
    marginLeft: 5,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 16,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  paymentBalance: {
    fontSize: 14,
    marginTop: 2,
  },
  paymentSubtitle: {
    fontSize: 14,
    marginRight: 8,
  },
  bankInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  bankLogos: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bankIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BuyAmountScreen;