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

const ConvertSuccessScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const {
    sourceCoin,
    destinationCoin,
    sourceAmount,
    destinationAmount,
    exchangeRate,
    fee,
    finalAmount,
    transactionId,
    transactionTime,
  } = route.params;

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ConvertFlow', { screen: 'Convert' })}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Currency Icons */}
        <View style={styles.iconSection}>
          <View style={styles.currencyIcons}>
            <View style={styles.sourceIconContainer}>
              <CoinIcon coinId={sourceCoin.id} size={32} />
            </View>
            <View style={styles.destinationIconContainer}>
              <CoinIcon coinId={destinationCoin.id} size={32} />
            </View>
          </View>
        </View>

        {/* Transaction Info */}
        <View style={styles.transactionSection}>
          <Text style={[styles.transactionType, { color: theme.textSecondary }]}>
            Convert {sourceCoin.symbol} → {destinationCoin.symbol}
          </Text>
          <Text style={[styles.amount, { color: theme.textPrimary }]}>
            {formatNumber(sourceAmount)} {sourceCoin.symbol}
          </Text>
          <View style={[styles.statusLabel, { backgroundColor: '#E8F5E8' }]}>
            <Text style={[styles.statusText, { color: '#4CAF50' }]}>
              Success
            </Text>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={[styles.detailsCard, { backgroundColor: theme.backgroundInput }]}>
          {/* Transaction ID */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Transaction ID
            </Text>
            <View style={styles.detailValueContainer}>
              <Text style={[styles.transactionId, { color: '#FF6B35' }]}>
                {transactionId}
              </Text>
              <TouchableOpacity>
                <Ionicons name="copy-outline" size={16} color="#FF6B35" style={styles.copyIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Exchange Rate */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              With price
            </Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              1 {destinationCoin.symbol} = {formatNumber(Math.round(exchangeRate))} {sourceCoin.symbol}
            </Text>
          </View>

          {/* Fee */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Fee
            </Text>
            <View style={styles.detailValueContainer}>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {fee.toFixed(sourceCoin.id === 'btc' ? 8 : sourceCoin.id === 'usdt' ? 6 : sourceCoin.id === 'xrp' ? 2 : 6)} {sourceCoin.symbol}
              </Text>
              <TouchableOpacity>
                <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>


          {/* Transaction Time */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Transaction time
            </Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              {transactionTime}
            </Text>
          </View>
        </View>

        {/* Transaction Information */}
        <View style={[styles.detailsCard, { backgroundColor: theme.backgroundInput }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Transaction information
          </Text>

          {/* You Pay */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              You pay
            </Text>
            <View style={styles.detailValueContainer}>
              <TouchableOpacity>
                <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
              <Text style={[styles.detailValue, { color: theme.textPrimary, marginLeft: 8 }]}>
                {formatNumber(sourceAmount)} {sourceCoin.symbol}
              </Text>
            </View>
          </View>

          {/* You Get */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              You get
            </Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              {finalAmount} {destinationCoin.symbol}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.balanceButton, { backgroundColor: theme.backgroundInput }]}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Assets' })}
        >
          <Text style={[styles.balanceButtonText, { color: theme.textPrimary }]}>View Balance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.convertMoreButton, { backgroundColor: '#FF6B35' }]}
          onPress={() => navigation.navigate('ConvertFlow', { screen: 'Convert' })}
        >
          <Text style={styles.convertMoreButtonText}>Convert more</Text>
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
  },
  backButton: {
    padding: 5,
  },
  headerRight: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iconSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  currencyIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  sourceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sourceIconText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  destinationIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginLeft: -15,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionId: {
    fontSize: 16,
    fontWeight: '600',
  },
  copyIcon: {
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 15,
  },
  balanceButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  balanceButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  convertMoreButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  convertMoreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConvertSuccessScreen;
