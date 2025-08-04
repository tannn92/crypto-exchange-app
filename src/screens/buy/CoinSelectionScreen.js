import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { cryptoList, cryptoData } from '../../data/coinPrices';
import CoinIcon from '../../components/CoinIcon';

const popularCoins = ['BTC', 'ETH', 'BNB', 'USDT'];
const VND_TO_USDT_RATE = 1 / 25290; // 1 VND = 0.0000395257 USDT (25,290 VND = 1 USDT)

const CoinSelectionScreen = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USDT'); // 'USDT' or 'VND'
  const [selectedPopularCoin, setSelectedPopularCoin] = useState(null);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  // Detect if we're in buy or sell flow from route params
  const flow = route.params?.flow || 'buy';
  const isSellFlow = flow === 'sell';
  const excludeCoin = route.params?.excludeCoin; // Coin to exclude from the list (for convert flow)

  // Use cryptoData from HomeScreen to ensure consistency
  const allCoins = cryptoData.map(coin => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    price: coin.price,
    change: coin.change,
    icon: coin.icon || coin.symbol.charAt(0),
    iconBg: coin.iconBg || '#999',
  }));

  const convertPrice = (price) => {
    if (selectedCurrency === 'VND') {
      return price * 25290; // Convert USDT to VND
    }
    return price;
  };

  const formatPrice = (price) => {
    const convertedPrice = convertPrice(price);
    if (selectedCurrency === 'VND') {
      return convertedPrice.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    return convertedPrice.toLocaleString('en-US');
  };

  const filteredCoins = allCoins.filter(coin => {
    // First filter by search text
    const matchesSearch = coin.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
      coin.name.toLowerCase().includes(searchText.toLowerCase());

    // Then exclude the specified coin (for convert flow to prevent A->A conversion)
    const isNotExcluded = !excludeCoin || coin.id !== excludeCoin.id;

    return matchesSearch && isNotExcluded;
  });

  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin);

    // Check if this is a modal (has flow in params but not as main navigation)
    if (route.params?.flow && (route.params.flow === 'withdraw' || route.params.flow === 'send' || route.params.flow === 'convert-source' || route.params.flow === 'convert-destination' || route.params.flow === 'deposit')) {
      // Navigate back to the appropriate flow with the selected coin
      if (route.params.flow === 'withdraw') {
        // Close modal first
        navigation.goBack();

        // Navigate back to WithdrawFlow with the selected coin
        setTimeout(() => {
          navigation.navigate('WithdrawFlow', {
            screen: 'Withdraw',
            params: { selectedCoin: coin },
          });
        }, 100);
      } else if (route.params.flow === 'send') {
        // Close modal first
        navigation.goBack();

        // Navigate back to SendToUserFlow with the selected coin
        setTimeout(() => {
          navigation.navigate('SendToUserFlow', {
            screen: 'SendToUser',
            params: { selectedCoin: coin },
          });
        }, 100);
      } else if (route.params.flow === 'convert-source' || route.params.flow === 'convert-destination') {
        // Close modal first
        navigation.goBack();

        // Navigate back to ConvertFlow with the selected coin and flow
        setTimeout(() => {
          navigation.navigate('ConvertFlow', {
            screen: 'Convert',
            params: { selectedCoin: coin, flow: route.params.flow },
          });
        }, 100);
      } else if (route.params.flow === 'deposit') {
        // Close modal first
        navigation.goBack();

        // Navigate back to DepositFlow with the selected coin
        setTimeout(() => {
          navigation.navigate('DepositFlow', {
            screen: 'Deposit',
            params: { 
              selectedCoin: {
                id: coin.id,
                symbol: coin.symbol,
                name: coin.name,
                price: coin.price
              }
            },
          });
        }, 100);
      }
      return;
    }

    if (isSellFlow) {
      // Close modal first
      navigation.goBack();

      // Navigate back to SellFlow with the selected coin
      setTimeout(() => {
        navigation.navigate('SellFlow', {
          screen: 'SellAmount',
          params: {
            selectedCoin: coin,
            coin: coin, // Keep original coin param for compatibility
          },
        });
      }, 100);
    } else {
      // Close modal first
      navigation.goBack();

      // Navigate back to BuyFlow with the selected coin
      setTimeout(() => {
        navigation.navigate('BuyFlow', {
          screen: 'BuyAmount',
          params: {
            selectedCoin: coin,
            coin: coin, // Keep original coin param for compatibility
          },
        });
      }, 100);
    }
  };

  const handlePopularCoinSelect = (coinSymbol) => {
    setSelectedPopularCoin(coinSymbol);
    const coin = allCoins.find(c => c.symbol === coinSymbol);
    if (coin) {
      handleSelectCoin(coin);
    }
  };

  const toggleCurrencyDropdown = () => {
    setShowCurrencyDropdown(!showCurrencyDropdown);
  };

  const selectCurrency = (currency) => {
    setSelectedCurrency(currency);
    setShowCurrencyDropdown(false);
  };

  const currencyOptions = [
    { code: 'USDT', name: 'USDT', icon: 'usdt' },
    { code: 'VND', name: 'VND', icon: 'vnd' },
  ];

  const renderCoinItem = ({ item }) => {
    const isPositive = item.change >= 0;

    return (
      <TouchableOpacity
        style={styles.coinItem}
        onPress={() => handleSelectCoin(item)}
        testID={`coin-item-${item.symbol.toLowerCase()}`}
      >
        <View style={styles.coinLeft}>
          <CoinIcon coinId={item.id} size={40} style={{ marginRight: 12 }} />
          <View>
            <Text style={[styles.coinSymbol, { color: theme.textPrimary }]}>{item.symbol}</Text>
            <Text style={[styles.coinName, { color: theme.textSecondary }]}>{item.name}</Text>
          </View>
        </View>
        <View style={styles.coinRight}>
          <Text style={[styles.coinPrice, { color: theme.textPrimary }]}>
            ~{formatPrice(item.price)}
          </Text>
          <Text style={[styles.coinChange, { color: isPositive ? '#16C784' : '#EA3943' }]}>
            {isPositive ? '+' : ''}{item.change.toFixed(2)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              console.log('Back button touched - CoinSelectionScreen');
              navigation.goBack();
            }}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]} testID="coin-selection-title">Select cryptocurrency</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.inputBackground }]}>
            <Ionicons name="search" size={20} color={theme.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              placeholder="Search"
              placeholderTextColor={theme.textTertiary}
              value={searchText}
              onChangeText={setSearchText}
              testID="coin-search-input"
            />
          </View>
        </View>

        <View style={styles.popularContainer}>
          <View style={styles.popularCoins}>
            {popularCoins.map((coinSymbol) => {
              const coin = allCoins.find(c => c.symbol === coinSymbol);
              return (
                <TouchableOpacity
                  key={coinSymbol}
                  style={[
                    styles.popularCoin,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: selectedPopularCoin === coinSymbol ? theme.primary : theme.border,
                      borderWidth: selectedPopularCoin === coinSymbol ? 2 : 1,
                    },
                  ]}
                  onPress={() => handlePopularCoinSelect(coinSymbol)}
                  testID={`popular-coin-${coinSymbol.toLowerCase()}`}
                >
                  <CoinIcon coinId={coin?.id} size={20} style={{ marginRight: 6 }} />
                  <Text style={[
                    styles.popularCoinText,
                    { color: selectedPopularCoin === coinSymbol ? theme.primary : theme.textPrimary },
                  ]}>
                    {coinSymbol}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={[styles.listHeaderText, { color: theme.textPrimary }]}>Coin name</Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={[styles.priceDropdown, { backgroundColor: theme.backgroundSecondary }]}
              onPress={toggleCurrencyDropdown}
            >
              <CoinIcon coinId={selectedCurrency === 'USDT' ? 'usdt' : 'vnd'} size={16} />
              <Text style={[styles.priceDropdownText, { color: theme.textPrimary }]}>{selectedCurrency}</Text>
              <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
            {showCurrencyDropdown && (
              <View style={[styles.dropdownList, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                {currencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.code}
                    style={[
                      styles.dropdownItem,
                      selectedCurrency === option.code && styles.dropdownItemSelected,
                    ]}
                    onPress={() => selectCurrency(option.code)}
                  >
                    <CoinIcon coinId={option.icon} size={16} />
                    <Text style={[
                      styles.dropdownItemText,
                      { color: theme.textPrimary },
                    ]}>
                      {option.name}
                    </Text>
                    {selectedCurrency === option.code && (
                      <Ionicons name="checkmark" size={16} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <FlatList
          data={filteredCoins}
          renderItem={renderCoinItem}
          keyExtractor={(item) => item.id}
          style={styles.coinList}
          contentContainerStyle={styles.coinListContent}
        />
    </View>
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  popularContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  popularCoins: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  popularCoin: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  popularCoinText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  listHeaderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  priceDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    right: 0,
    minWidth: 120,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  priceDropdownText: {
    fontSize: 14,
    fontWeight: '500',
  },
  coinList: {
    flex: 1,
  },
  coinListContent: {
    paddingHorizontal: 20,
  },
  coinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  coinLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coinIconText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coinSymbol: {
    fontSize: 16,
    fontWeight: '600',
  },
  coinName: {
    fontSize: 14,
    marginTop: 2,
  },
  coinRight: {
    alignItems: 'flex-end',
  },
  coinPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  coinChange: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default CoinSelectionScreen;
