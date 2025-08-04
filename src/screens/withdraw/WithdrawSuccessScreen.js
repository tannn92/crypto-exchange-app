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

const WithdrawSuccessScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { 
    coin, 
    network = 'Ethereum', 
    address = '0x742d35Cc6608C673B8cbE4f4E2E4b0b8f90D8F90',
    amount,
    cryptoAmount,
    recipientAddress,
    networkFee,
    transactionTime,
    date,
    fromHistory = false,
    fromNotification = false,
    fromCoinDetails = false
  } = route.params || {};

  // Safety check for required parameters
  if (!coin || !coin.id) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[styles.errorText, { color: theme.textPrimary }]}>Invalid withdraw data</Text>
        </View>
      </View>
    );
  }

  // Use the appropriate amount and address values
  const displayAmount = cryptoAmount || amount;
  const displayAddress = recipientAddress || address;

  // Get proper network name based on coin
  const getNetworkName = (coinSymbol, networkString) => {
    const networkMap = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'USDT': 'Ethereum (ERC-20)',
      'BNB': 'BNB Smart Chain',
      'SOL': 'Solana',
      'XRP': 'XRP Ledger',
      'MATIC': 'Polygon',
      'ADA': 'Cardano',
      'DOT': 'Polkadot',
      'AVAX': 'Avalanche',
    };
    
    return networkMap[coinSymbol?.toUpperCase()] || networkString || 'Ethereum';
  };

  const displayNetwork = getNetworkName(coin?.symbol, network);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Format address for display (show first 6 and last 6 characters)
  const formatAddress = (addr) => {
    if (!addr) {return '';}
    if (addr.length <= 20) {return addr;}
    return `${addr.substring(0, 20)}${addr.substring(addr.length - 20)}`;
  };

  // Generate a realistic transaction hash
  const generateTxHash = () => {
    return '2d80x1287fgehdaayltzfhgi07mbvza0735fh';
  };

  const handleBack = () => {
    if (fromCoinDetails) {
      // Navigate back to CoinDetails screen
      navigation.goBack();
    } else if (fromHistory) {
      // Navigate back to History screen
      navigation.navigate('MainTabs', { screen: 'History' });
    } else {
      // Default behavior - go to main tabs
      navigation.navigate('MainTabs');
    }
  };

  const handleHomepage = () => {
    // Navigate to homepage
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  const handleViewBalance = () => {
    // Navigate to assets screen
    navigation.navigate('MainTabs', { screen: 'Assets' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            console.log('Back button touched - WithdrawSuccessScreen');
            handleBack();
          }}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel="Go back"
          testID="withdraw-success-back-button"
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Withdraw Success</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Coin Icon */}
        <View style={styles.iconSection}>
          <View style={styles.coinIconContainer}>
            <CoinIcon coinId={coin.id} size={40} />
          </View>
        </View>

        {/* Transaction Info */}
        <View style={styles.transactionSection}>
          <Text style={[styles.transactionType, { color: theme.textSecondary }]}>
            Withdraw
          </Text>
          <Text style={[styles.amount, { color: theme.textPrimary }]}>
            {formatNumber(displayAmount)} {coin.symbol}
          </Text>
          <View style={[styles.statusLabel, { backgroundColor: '#E8F5E8' }]}>
            <Text style={[styles.statusText, { color: '#4CAF50' }]}>
              Completed
            </Text>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={[styles.detailsCard, { backgroundColor: theme.backgroundInput }]}>
          {/* Time */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Time
            </Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              {transactionTime || new Date().toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })}
            </Text>
          </View>

          {/* Type */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Type
            </Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              External transfer
            </Text>
          </View>

          {/* Network */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Network
            </Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              {displayNetwork}
            </Text>
          </View>

          {/* To Address */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              To address
            </Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]} numberOfLines={2}>
              {formatAddress(displayAddress)}
            </Text>
          </View>

          {/* Hash */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Hash
            </Text>
            <View style={styles.hashContainer}>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {generateTxHash()}
              </Text>
              <TouchableOpacity style={styles.copyButton}>
                <View style={styles.copyIcon}>
                  <Ionicons name="copy-outline" size={12} color="#FF6B35" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.backgroundInput }]}
            onPress={handleHomepage}
            testID="withdraw-homepage-button"
          >
            <Text style={[styles.saveButtonText, { color: theme.textPrimary }]}>Homepage</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.balanceButton, { backgroundColor: '#FF6B35' }]}
            onPress={handleViewBalance}
            testID="withdraw-view-balance-button"
          >
            <Text style={styles.balanceButtonText}>View balance</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  iconSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  coinIconContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
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
  amount: {
    fontSize: 32,
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
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 16,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1.5,
  },
  hashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.5,
    justifyContent: 'flex-end',
  },
  copyButton: {
    marginLeft: 8,
  },
  copyIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF0E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    paddingBottom: 30,
    gap: 15,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  balanceButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  balanceButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WithdrawSuccessScreen;
