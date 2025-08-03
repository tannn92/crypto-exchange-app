import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import CoinIcon from '../../components/CoinIcon';
import { getCoinById } from '../../data/coinPrices';

const ConvertScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  
  // Default coins
  const defaultSourceCoin = { id: 'btc', symbol: 'BTC', name: 'Bitcoin' };
  const defaultDestinationCoin = { id: 'usdt', symbol: 'USDT', name: 'Tether' };
  
  const [sourceCoin, setSourceCoin] = useState(defaultSourceCoin);
  const [destinationCoin, setDestinationCoin] = useState(defaultDestinationCoin);
  const [sourceAmount, setSourceAmount] = useState('');
  const [destinationAmount, setDestinationAmount] = useState('');
  const [isSourceEditing, setIsSourceEditing] = useState(false);
  const [isRateFlipped, setIsRateFlipped] = useState(false);
  const [showPriceTooltip, setShowPriceTooltip] = useState(false);

  // Mock balances
  const balances = {
    'usdt': 1000,
    'btc': 0.05,
    'eth': 2.5,
    'xrp': 5000,
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getBalance = (coinId) => {
    return balances[coinId] || 0;
  };

  const getExchangeRateDisplay = () => {
    if (sourceCoin.id === destinationCoin.id) {
      return `1 ${destinationCoin.symbol} = 1 ${sourceCoin.symbol}`;
    }

    // Get real coin prices from data module
    const sourceCoinData = getCoinById(sourceCoin.id);
    const destCoinData = getCoinById(destinationCoin.id);
    
    if (!sourceCoinData || !destCoinData) {
      return `1 ${sourceCoin.symbol} = 1 ${destinationCoin.symbol}`;
    }

    // Calculate the rate between source and destination using real prices
    const conversionRate = sourceCoinData.price / destCoinData.price;

    if (isRateFlipped) {
      // Show 1 destination = X source
      const flippedRate = 1 / conversionRate;
      return `1 ${destinationCoin.symbol} = ${flippedRate.toLocaleString('en-US', { 
        minimumFractionDigits: flippedRate < 1 ? 6 : 2,
        maximumFractionDigits: flippedRate < 1 ? 6 : 2
      })} ${sourceCoin.symbol}`;
    } else {
      // Show 1 source = X destination
      return `1 ${sourceCoin.symbol} = ${conversionRate.toLocaleString('en-US', { 
        minimumFractionDigits: conversionRate < 1 ? 6 : 2,
        maximumFractionDigits: conversionRate < 1 ? 6 : 2
      })} ${destinationCoin.symbol}`;
    }
  };

  // Handle amount changes
  useEffect(() => {
    // Handle returned coin selections
    if (route.params?.selectedCoin && route.params?.flow) {
      if (route.params.flow === 'convert-source') {
        setSourceCoin(route.params.selectedCoin);
        setSourceAmount('');
        setDestinationAmount('');
      } else if (route.params.flow === 'convert-destination') {
        setDestinationCoin(route.params.selectedCoin);
        setSourceAmount('');
        setDestinationAmount('');
      }
    }
  }, [route.params?.selectedCoin, route.params?.flow]);

  useEffect(() => {
    if (sourceAmount && !isNaN(sourceAmount) && parseFloat(sourceAmount) > 0) {
      const amount = parseFloat(sourceAmount);
      
      if (sourceCoin.id === destinationCoin.id) {
        setDestinationAmount(sourceAmount);
        return;
      }

      // Get real coin prices from data module
      const sourceCoinData = getCoinById(sourceCoin.id);
      const destCoinData = getCoinById(destinationCoin.id);
      
      if (!sourceCoinData || !destCoinData) {
        setDestinationAmount('');
        return;
      }

      // Convert using real market prices
      const sourceValue = amount * sourceCoinData.price; // Convert to USD value
      const converted = sourceValue / destCoinData.price; // Convert to destination currency

      // Format based on destination currency
      let decimals = 6; // default
      if (destinationCoin.id === 'btc') decimals = 8;
      else if (destinationCoin.id === 'eth') decimals = 6;
      else if (destinationCoin.id === 'xrp') decimals = 2;
      else if (destinationCoin.id === 'usdt') decimals = 6;

      setDestinationAmount(converted.toFixed(decimals));
    } else {
      setDestinationAmount('');
    }
  }, [sourceAmount, sourceCoin, destinationCoin]);

  const handleSourceCoinSelect = () => {
    navigation.navigate('CoinSelectionModal', {
      flow: 'convert-source',
      currentCoin: sourceCoin,
      excludeCoin: destinationCoin, // Exclude destination coin from source selection
      returnScreen: 'ConvertScreen',
    });
  };

  const handleDestinationCoinSelect = () => {
    navigation.navigate('CoinSelectionModal', {
      flow: 'convert-destination',
      currentCoin: destinationCoin,
      excludeCoin: sourceCoin, // Exclude source coin from destination selection
      returnScreen: 'ConvertScreen',
    });
  };

  const handleSwapCurrencies = () => {
    const tempCoin = sourceCoin;
    setSourceCoin(destinationCoin);
    setDestinationCoin(tempCoin);
    setSourceAmount('');
    setDestinationAmount('');
  };

  const handleSwapRateDisplay = () => {
    setIsRateFlipped(prev => !prev);
  };

  const handleMaxPress = () => {
    const balance = getBalance(sourceCoin.id);
    setSourceAmount(balance.toString());
    setIsSourceEditing(false);
  };

  const handlePreviewConversion = () => {
    if (!sourceAmount || !destinationAmount) {
      return;
    }
    
    // Get real exchange rate from coin data
    const sourceCoinData = getCoinById(sourceCoin.id);
    const destCoinData = getCoinById(destinationCoin.id);
    
    let conversionRate = 1;
    if (sourceCoinData && destCoinData) {
      conversionRate = sourceCoinData.price / destCoinData.price;
    }
    
    navigation.navigate('ConvertConfirmation', {
      sourceCoin,
      destinationCoin,
      sourceAmount: parseFloat(sourceAmount),
      destinationAmount: parseFloat(destinationAmount),
      exchangeRate: conversionRate,
    });
  };

  const isPreviewEnabled = sourceAmount && parseFloat(sourceAmount) > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Convert</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerIcon}
            onPress={() => navigation.getParent()?.navigate('MainTabs', {
              screen: 'History',
              params: { selectedTab: 'Convert' }
            })}
          >
            <Ionicons name="time-outline" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Source Currency */}
        <View style={[styles.currencyCard, { backgroundColor: theme.backgroundInput }]}>
          <View style={styles.currencyHeader}>
            <TouchableOpacity 
              style={styles.currencySelector}
              onPress={handleSourceCoinSelect}
            >
              <CoinIcon coinId={sourceCoin.id} size={24} />
              <View style={[styles.currencyLabel, { backgroundColor: theme.backgroundForm }]}>
                <Text style={[styles.currencySymbol, { color: theme.textPrimary }]}>
                  {sourceCoin.symbol}
                </Text>
                <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
              </View>
            </TouchableOpacity>
            <View style={styles.balanceContainer}>
              <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>
                Balance
              </Text>
              <Text style={[styles.balanceAmount, { color: theme.textPrimary }]}>
                {formatNumber(getBalance(sourceCoin.id))}
              </Text>
            </View>
          </View>
          
          <View style={styles.amountContainer}>
            <TextInput
              style={[styles.amountInput, { color: theme.textPrimary }]}
              value={sourceAmount}
              onChangeText={(text) => {
                setSourceAmount(text);
                setIsSourceEditing(true);
              }}
              placeholder="0.00"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
            />
            <TouchableOpacity 
              style={[styles.maxButton, { backgroundColor: theme.primary }]}
              onPress={handleMaxPress}
            >
              <Text style={styles.maxButtonText}>MAX</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Swap Button */}
        <View style={styles.swapContainer}>
          <TouchableOpacity 
            style={[styles.swapButton, { backgroundColor: '#4285F4' }]}
            onPress={handleSwapCurrencies}
          >
            <Ionicons name="swap-vertical" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Destination Currency */}
        <View style={[styles.currencyCard, { backgroundColor: theme.backgroundInput }]}>
          <View style={styles.currencyHeader}>
            <TouchableOpacity 
              style={styles.currencySelector}
              onPress={handleDestinationCoinSelect}
            >
              <CoinIcon coinId={destinationCoin.id} size={24} />
              <View style={[styles.currencyLabel, { backgroundColor: theme.backgroundForm }]}>
                <Text style={[styles.currencySymbol, { color: theme.textPrimary }]}>
                  {destinationCoin.symbol}
                </Text>
                <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.amountContainer}>
            <TextInput
              style={[styles.amountInput, { color: theme.textPrimary }]}
              value={destinationAmount}
              placeholder="0.00"
              placeholderTextColor={theme.textSecondary}
              editable={false}
            />
          </View>
          
          <View style={styles.feeContainer}>
            <Text style={[styles.feeLabel, { color: theme.textSecondary }]}>
              Fee
            </Text>
            <Text style={[styles.feeAmount, { color: theme.textPrimary }]}>
              {sourceAmount && parseFloat(sourceAmount) > 0 
                ? `${(parseFloat(sourceAmount) * 0.001).toFixed(sourceCoin.id === 'btc' ? 8 : sourceCoin.id === 'usdt' ? 6 : sourceCoin.id === 'xrp' ? 2 : 6)} ${sourceCoin.symbol}`
                : `0 ${sourceCoin.symbol}`
              }
            </Text>
          </View>
        </View>

        {/* Exchange Rate */}
        <View style={styles.exchangeRate}>
          <View style={styles.exchangeRateRow}>
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
              onPress={handleSwapRateDisplay}
            >
              <Text style={[styles.exchangeRateValue, { color: theme.textPrimary }]}>
                {getExchangeRateDisplay()}
              </Text>
              <Ionicons name="repeat-outline" size={16} color={theme.primary} style={styles.swapIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preview Button */}
        <TouchableOpacity 
          style={[
            styles.previewButton, 
            { 
              backgroundColor: isPreviewEnabled ? '#FF6B00' : 'rgba(255, 107, 0, 0.4)',
            }
          ]}
          onPress={handlePreviewConversion}
          disabled={!isPreviewEnabled}
        >
          <Text style={styles.previewButtonText}>Preview conversion</Text>
        </TouchableOpacity>
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
  currencyCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  currencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 6,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
  },
  maxButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  maxButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  feeLabel: {
    fontSize: 16,
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: -16,
    position: 'relative',
    zIndex: 10,
    height: 32,
    justifyContent: 'center',
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  exchangeRate: {
    marginTop: 20,
    marginBottom: 15,
  },
  priceInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  exchangeRateLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  infoButton: {
    padding: 2,
  },
  tooltip: {
    position: 'absolute',
    top: 25,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  tooltipText: {
    fontSize: 12,
    textAlign: 'center',
  },
  tooltipArrow: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  exchangeRateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exchangeRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  exchangeRateValue: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  swapIcon: {
    marginLeft: 8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  previewButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    marginHorizontal: 0,
  },
  previewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConvertScreen;