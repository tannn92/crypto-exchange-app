import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import CoinIcon from '../components/CoinIcon';

const AssetsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [hideSmallAssets, setHideSmallAssets] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  // Mock data
  const totalBalance = 34143.00;
  const balanceChange = 43.96;
  const balanceChangePercent = 1.47;

  // Coin color schemes for gradients (lighter top colors fading to theme appropriate bottom)
  const coinColors = {
    btc: ['#FFE4B5', theme.backgroundInput],
    eth: ['#E6EAFF', theme.backgroundInput],
    usdt: ['#E8F5F0', theme.backgroundInput],
    usdc: ['#E1ECFF', theme.backgroundInput],
    xrp: ['#E8E9EA', theme.backgroundInput],
    sol: ['#F0E6FF', theme.backgroundInput],
    bnb: ['#FFF8E1', theme.backgroundInput],
  };

  // User's portfolio holdings
  const holdings = [
    {
      id: 'btc',
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.3456778,
      lastPrice: 96093.46,
      value: 33192.45,
    },
    {
      id: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 0.0002,
      lastPrice: 3801.38,
      value: 0.76,
    },
    {
      id: 'usdt',
      symbol: 'USDT',
      name: 'Tether',
      amount: 50.75,
      lastPrice: 1.00,
      value: 50.75,
    },
    {
      id: 'sol',
      symbol: 'SOL',
      name: 'Solana',
      amount: 0.003,
      lastPrice: 180.00,
      value: 0.54,
    },
    {
      id: 'xrp',
      symbol: 'XRP',
      name: 'XRP',
      amount: 1.5,
      lastPrice: 0.52,
      value: 0.78,
    },
  ];

  // Popular cryptocurrencies for trading (using consistent IDs with coinPrices)
  const popularCryptos = [
    {
      id: 'btc',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 117512.00,
      change: -2.60,
      isPositive: false,
    },
    {
      id: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3801.38,
      change: 0.69,
      isPositive: true,
    },
    {
      id: 'usdt',
      symbol: 'USDT',
      name: 'Tether USDT',
      price: 0.9999,
      change: 0.00,
      isPositive: true,
    },
    {
      id: 'sol',
      symbol: 'SOL',
      name: 'Solana',
      price: 180.00,
      change: 5.80,
      isPositive: true,
    },
  ];

  // Filter holdings based on hideSmallAssets and search query
  const filteredHoldings = holdings.filter(holding => {
    const matchesSearch = !searchQuery || 
      holding.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      holding.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesVisibility = hideSmallAssets ? holding.value >= 1 : true;
    
    return matchesSearch && matchesVisibility;
  });

  const handleDeposit = (coin = null) => {
    const depositCoin = coin || { id: 'usdt', symbol: 'USDT', name: 'Tether' };
    navigation.navigate('DepositFlow', {
      screen: 'Deposit',
      params: { coin: depositCoin }
    });
  };

  const handleWithdraw = () => {
    navigation.navigate('WithdrawMethodSelectionModal', {
      coin: { id: 'usdt', symbol: 'USDT', name: 'Tether' }
    });
  };

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  const formatBalance = (amount) => {
    if (!balanceVisible) {
      return '*********';
    }
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  const formatChange = (amount, percent) => {
    if (!balanceVisible) {
      return '****** (****)';
    }
    return `$${amount.toFixed(2)} (${percent}%)`;
  };

  const handleBuy = (crypto) => {
    // Create proper coin object for the buy flow
    const coinObject = {
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      price: crypto.price,
    };
    
    navigation.navigate('BuyFlow', {
      screen: 'BuyAmount',
      params: { coin: coinObject }
    });
  };

  const handleCoinDetails = (holding) => {
    navigation.navigate('CoinDetails', {
      coin: {
        id: holding.id,
        symbol: holding.symbol,
        name: holding.name,
        price: holding.lastPrice
      }
    });
  };

  const renderHoldingCard = (holding) => {
    const colors = coinColors[holding.id] || ['#E0E0E0', '#FFFFFF'];
    
    return (
      <TouchableOpacity
        key={holding.id}
        activeOpacity={0.8}
        onPress={() => handleCoinDetails(holding)}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.holdingCard}
        >
          <View style={styles.holdingHeader}>
            <View style={styles.holdingInfo}>
              <CoinIcon coinId={holding.id} size={40} />
              <View style={styles.holdingDetails}>
                <Text style={[styles.holdingSymbol, { color: theme.textPrimary }]}>
                  {holding.symbol}
                </Text>
                <Text style={[styles.holdingName, { color: theme.textSecondary }]}>
                  {holding.name}
                </Text>
              </View>
            </View>
            <View style={styles.holdingPrice}>
              <Text style={[styles.lastPriceLabel, { color: theme.textSecondary }]}>
                Last price
              </Text>
              <Text style={[styles.lastPriceValue, { color: theme.textPrimary }]}>
                {holding.lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT
              </Text>
            </View>
          </View>
          
          <View style={styles.holdingBottom}>
            <View style={styles.holdingAmountSection}>
              <Text style={[styles.amountValue, { color: theme.textPrimary }]}>
                {balanceVisible ? holding.amount : '****'}
              </Text>
              <Text style={[styles.usdValue, { color: theme.textSecondary }]}>
                {balanceVisible ? `$${holding.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$*****'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={(e) => {
                e.stopPropagation();
                handleDeposit({
                  id: holding.id,
                  symbol: holding.symbol,
                  name: holding.name
                });
              }}
            >
              <Ionicons name="add" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderCryptoRow = (crypto) => (
    <View key={crypto.id} style={[styles.cryptoRow, { borderBottomColor: theme.border }]}>
      <View style={styles.cryptoInfo}>
        <CoinIcon coinId={crypto.id} size={40} />
        <View style={styles.cryptoDetails}>
          <Text style={[styles.cryptoSymbol, { color: theme.textPrimary }]}>
            {crypto.symbol}
          </Text>
          <Text style={[styles.cryptoName, { color: theme.textSecondary }]}>
            {crypto.name}
          </Text>
        </View>
      </View>
      
      <View style={styles.cryptoPriceInfo}>
        <Text style={[styles.cryptoPrice, { color: theme.textPrimary }]}>
          {crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={[
          styles.cryptoChange, 
          { color: crypto.isPositive ? '#4CAF50' : '#FF3B30' }
        ]}>
          {crypto.isPositive ? '+' : ''}{crypto.change.toFixed(2)}%
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.buyButton, { backgroundColor: theme.backgroundInput }]}
        onPress={() => handleBuy(crypto)}
      >
        <Text style={[styles.buyButtonText, { color: theme.textPrimary }]}>
          Buy
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.backgroundForm }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Assets
        </Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="headset-outline" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: theme.backgroundInput }]}>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>
            Total balance in <Text style={[styles.currencyText, { color: theme.primary }]}>USDT</Text>
            <Ionicons name="chevron-down" size={16} color={theme.primary} style={styles.currencyDropdown} />
          </Text>
          
          <View style={styles.balanceRow}>
            <Text style={[styles.balanceAmount, { color: theme.textPrimary }]}>
              ${formatBalance(totalBalance)}
            </Text>
            <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.eyeIcon}>
              <Ionicons 
                name={balanceVisible ? "eye-outline" : "eye-off-outline"} 
                size={24} 
                color={theme.textSecondary} 
              />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.balanceChange, { color: '#4CAF50' }]}>
            {formatChange(balanceChange, balanceChangePercent)}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.depositButton, { backgroundColor: theme.primary }]}
              onPress={handleDeposit}
            >
              <Text style={styles.depositButtonText}>Deposit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.withdrawButton, { backgroundColor: theme.backgroundForm }]}
              onPress={handleWithdraw}
            >
              <Text style={[styles.withdrawButtonText, { color: theme.textPrimary }]}>
                Withdraw
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Holdings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TouchableOpacity 
              style={styles.hiddenAssetsIndicator}
              onPress={() => setHideSmallAssets(!hideSmallAssets)}
            >
              <View style={[styles.checkbox, { 
                backgroundColor: hideSmallAssets ? theme.primary : 'transparent',
                borderColor: hideSmallAssets ? theme.primary : '#C0C0C0'
              }]}>
                {hideSmallAssets && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text style={[styles.hiddenAssetsText, { color: theme.textSecondary }]}>
                Hide assets &lt; 1 USDT
              </Text>
            </TouchableOpacity>
            
            <View style={[styles.searchBar, { backgroundColor: theme.backgroundInput }]}>
              <Ionicons name="search-outline" size={18} color={theme.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: theme.textPrimary }]}
                placeholder="Search..."
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
          
          {filteredHoldings.map(renderHoldingCard)}
        </View>

        {/* Popular Cryptocurrencies Card */}
        <View style={[styles.popularCryptoCard, { backgroundColor: theme.backgroundInput }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Trade popular cryptocurrencies
          </Text>
          
          <View style={styles.cryptoHeader}>
            <Text style={[styles.headerLabel, { color: theme.textSecondary }]}>
              Name
            </Text>
            <Text style={[styles.headerLabel, { color: theme.textSecondary }]}>
              Last price
            </Text>
          </View>
          
          {popularCryptos.map(renderCryptoRow)}
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  headerLeft: {
    width: 40,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  notificationButton: {
    padding: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    width: 160,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    minWidth: 100,
    paddingVertical: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  balanceCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyText: {
    fontWeight: '600',
  },
  currencyDropdown: {
    marginLeft: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  eyeIcon: {
    marginLeft: 12,
    padding: 4,
  },
  balanceChange: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  depositButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  depositButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  withdrawButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  hiddenAssetsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenAssetsText: {
    fontSize: 14,
  },
  holdingCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  holdingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  holdingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  holdingDetails: {
    gap: 4,
  },
  holdingSymbol: {
    fontSize: 18,
    fontWeight: '600',
  },
  holdingName: {
    fontSize: 14,
  },
  holdingPrice: {
    alignItems: 'flex-end',
    gap: 4,
  },
  lastPriceLabel: {
    fontSize: 14,
  },
  lastPriceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  holdingBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  holdingAmountSection: {
    flex: 1,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  usdValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularCryptoCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  cryptoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  headerLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  cryptoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // Will be set dynamically
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  cryptoDetails: {
    gap: 4,
  },
  cryptoSymbol: {
    fontSize: 16,
    fontWeight: '600',
  },
  cryptoName: {
    fontSize: 14,
  },
  cryptoPriceInfo: {
    alignItems: 'flex-end',
    gap: 4,
    flex: 1,
  },
  cryptoPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  cryptoChange: {
    fontSize: 14,
    fontWeight: '500',
  },
  buyButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AssetsScreen;