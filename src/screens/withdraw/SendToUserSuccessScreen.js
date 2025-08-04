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

const SendToUserSuccessScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { coin, username, amount, message, fee, totalAmount, transactionId, transactionTime } = route.params;

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleGoToHomepage = () => {
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
          onPress={() => navigation.navigate('MainTabs')}
          style={styles.backButton}
          testID="send-user-success-back-button"
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.iconSection}>
          <View style={styles.successIconContainer}>
            <View style={styles.checkmarkIcon}>
              <Ionicons name="checkmark" size={32} color="white" />
            </View>
          </View>
          {/* Decorative stars */}
          <View style={[styles.star, styles.starTopRight]}>
            <Text style={styles.starText}>✦</Text>
          </View>
          <View style={[styles.star, styles.starBottomLeft]}>
            <Text style={[styles.starText, { color: '#4285F4' }]}>✦</Text>
          </View>
        </View>

        {/* Transaction Info */}
        <View style={styles.transactionSection}>
          <Text style={[styles.transactionType, { color: theme.textSecondary }]}>
            Withdraw
          </Text>
          <Text style={[styles.amount, { color: theme.textPrimary }]}>
            {formatNumber(amount)} {coin.symbol}
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
              Internal transfer
            </Text>
          </View>

          {/* Received username */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Received username
            </Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              {username}
            </Text>
          </View>

          {/* Message */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Message
            </Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              {message || 'HPPD'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.backgroundInput }]}
          onPress={handleGoToHomepage}
          testID="send-user-homepage-button"
        >
          <Text style={[styles.saveButtonText, { color: theme.textPrimary }]}>Homepage</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.balanceButton, { backgroundColor: '#FF6B35' }]}
          onPress={handleViewBalance}
          testID="send-user-view-balance-button"
        >
          <Text style={styles.balanceButtonText}>View Balance</Text>
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
    marginVertical: 40,
    position: 'relative',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  checkmarkIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    position: 'absolute',
  },
  starTopRight: {
    top: 10,
    right: 80,
  },
  starBottomLeft: {
    bottom: 10,
    left: 80,
  },
  starText: {
    fontSize: 20,
    color: '#FF9500',
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
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
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

export default SendToUserSuccessScreen;
