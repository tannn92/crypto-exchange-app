import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import CoinIcon from '../../components/CoinIcon';

const DepositCompletedScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { 
    coin, 
    cryptoAmount,
    network = 'Ethereum',
    depositAddress = '0x3ccc...s24145',
    transactionHash = '2d801...0735fn',
    transactionId,
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
          <Text style={[styles.errorText, { color: theme.textPrimary }]}>Invalid deposit data</Text>
        </View>
      </View>
    );
  }

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleBack = () => {
    if (fromNotification) {
      // Navigate back to Notification screen
      navigation.navigate('Notification');
    } else if (fromCoinDetails) {
      // Navigate back to CoinDetails screen
      navigation.goBack();
    } else if (fromHistory) {
      // Navigate back to History screen
      navigation.goBack();
    } else {
      // Default behavior - go to main tabs
      navigation.navigate('MainTabs');
    }
  };

  const handleViewBalance = () => {
    navigation.navigate('MainTabs', { screen: 'Assets' });
  };

  const handleHomepage = () => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  const copyToClipboard = (text, type) => {
    // In a real app, you'd use a clipboard library
    console.log(`Copied ${type}: ${text}`);
  };

  // Get proper network name based on coin
  const getNetworkName = (coinSymbol) => {
    const networkMap = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum', 
      'USDT': 'TRX Tron (TRC20)',
      'BNB': 'BNB Smart Chain',
      'SOL': 'Solana',
      'XRP': 'XRP Ledger',
      'MATIC': 'Polygon',
    };
    return networkMap[coinSymbol?.toUpperCase()] || 'Ethereum';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            console.log('Back button touched - DepositCompletedScreen');
            handleBack();
          }}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Deposit Success</Text>
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
        <View style={styles.transactionInfo}>
          <Text style={[styles.transactionLabel, { color: theme.textSecondary }]}>
            Deposit
          </Text>
          <Text style={[styles.transactionAmount, { color: theme.textPrimary }]}>
            {formatNumber(cryptoAmount)} {coin.symbol}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: theme.success + '20' }]}>
            <Text style={[styles.statusText, { color: theme.success }]}>Completed</Text>
          </View>
        </View>

        {/* Timeline - Following SellProcessingScreen pattern */}
        <View style={styles.timeline}>
          {/* Step 1 - Deposit request */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.stepDot, styles.stepCompleted]}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
              <View style={[styles.connector, styles.firstConnector, { backgroundColor: theme.success }]} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.stepTitle, { color: theme.success }]}>
                Deposit request
              </Text>
              <Text style={[styles.stepTime, { color: theme.textSecondary }]}>
                04/10/2024 - 13:49
              </Text>
            </View>
          </View>

          {/* Step 2 - Confirmed */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.stepDot, styles.stepCompleted]}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
              <View style={[styles.connector, styles.secondConnector, { backgroundColor: theme.success }]} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.stepTitle, { color: theme.success }]}>
                Confirmed
              </Text>
              <Text style={[styles.stepTime, { color: theme.textSecondary }]}>
                Done (200/200) - 3/8/2023 - 09:39:39
              </Text>
            </View>
          </View>

          {/* Step 3 - Completed */}
          <View style={[styles.timelineItem, styles.lastTimelineItem]}>
            <View style={styles.timelineLeft}>
              <View style={[styles.stepDot, styles.stepCompleted]}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.stepTitle, { color: theme.success }]}>
                Completed
              </Text>
              <Text style={[styles.stepTime, { color: theme.textSecondary }]}>
                Credited to your balance
              </Text>
            </View>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        {/* Transaction Details - Fixed layout to match design */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Network</Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              {getNetworkName(coin.symbol)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Deposit address</Text>
            <View style={styles.detailValueWithCopy}>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {depositAddress}
              </Text>
              <TouchableOpacity 
                onPress={() => copyToClipboard(depositAddress, 'Address')}
                style={styles.copyButton}
              >
                <Ionicons name="copy-outline" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Hash</Text>
            <View style={styles.detailValueWithCopy}>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {transactionHash}
              </Text>
              <TouchableOpacity 
                onPress={() => copyToClipboard(transactionHash, 'Hash')}
                style={styles.copyButton}
              >
                <Ionicons name="copy-outline" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: theme.border }]}
            onPress={handleViewBalance}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.textPrimary }]}>
              View Balance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={handleHomepage}
          >
            <Text style={styles.primaryButtonText}>Homepage</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  // Icon Section
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
  // Transaction Info
  transactionInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  transactionLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  transactionAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Timeline Styles - Following SellProcessingScreen pattern
  timeline: {
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  lastTimelineItem: {
    marginBottom: 0,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 20,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepCompleted: {
    backgroundColor: '#4CAF50',
  },
  connector: {
    width: 2,
    height: 40,
    marginTop: 0,
  },
  firstConnector: {
    height: 30,
  },
  secondConnector: {
    height: 40,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 2,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepTime: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    marginBottom: 24,
  },
  // Details Section - Fixed layout to match design
  detailsSection: {
    marginBottom: 40,
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
  detailValueWithCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  copyButton: {
    padding: 8,
    marginLeft: 8,
  },
  shareButton: {
    padding: 8,
    marginLeft: 4,
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DepositCompletedScreen;