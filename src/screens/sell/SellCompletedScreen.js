import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const SellCompletedScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { coin, cryptoAmount, vndAmount } = route.params;
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleViewBalance = () => {
    navigation.navigate('MainTabs', { screen: 'Assets' });
  };

  const handleSellMore = () => {
    navigation.navigate('SellFlow', { 
      screen: 'CoinSelection'
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSellMore} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Sell Completed</Text>
        <View style={styles.headerRight} />
      </View>
      
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successSection}>
          <View style={styles.successIcon}>
            <View style={styles.iconBackground}>
              <Ionicons name="checkmark" size={40} color="white" />
            </View>
            {/* Decorative stars */}
            <View style={[styles.star, styles.star1]}>
              <Text style={styles.starText}>✦</Text>
            </View>
            <View style={[styles.star, styles.star2]}>
              <Text style={styles.starText}>✦</Text>
            </View>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.transactionSection}>
          <Text style={[styles.transactionType, { color: theme.textSecondary }]}>
            Sell {coin.symbol} and receive to Bank account
          </Text>
          <Text style={[styles.cryptoAmount, { color: theme.textPrimary }]}>
            {cryptoAmount} {coin.symbol}
          </Text>
          <View style={[styles.statusLabel, { backgroundColor: '#E8F5E8' }]}>
            <Text style={[styles.statusText, { color: '#4CAF50' }]}>
              Success
            </Text>
          </View>
        </View>

        {/* Success Message */}
        <View style={styles.messageSection}>
          <Text style={[styles.successMessage, { color: theme.textSecondary }]}>
            You've successfully sold {cryptoAmount} {coin.symbol} and received {formatNumber(Math.round(vndAmount))} VND to your bank account
          </Text>
        </View>

        {/* Feedback Section */}
        <View style={[styles.feedbackSection, { borderColor: theme.border }]}>
          <Text style={[styles.feedbackTitle, { color: theme.textPrimary }]}>
            How was the experience?
          </Text>
          
          <View style={styles.feedbackButtons}>
            <TouchableOpacity 
              style={styles.feedbackButton}
              onPress={() => setSelectedFeedback('good')}
            >
              <View style={[
                styles.emojiContainer, 
                { 
                  backgroundColor: selectedFeedback === 'good' ? '#4CAF50' : theme.backgroundSecondary,
                }
              ]}>
                <Text style={styles.emoji}>😊</Text>
              </View>
              <Text style={[
                styles.feedbackLabel, 
                { 
                  color: selectedFeedback === 'good' ? '#4CAF50' : theme.textPrimary,
                  fontWeight: selectedFeedback === 'good' ? '600' : '500'
                }
              ]}>Good</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.feedbackButton}
              onPress={() => setSelectedFeedback('bad')}
            >
              <View style={[
                styles.emojiContainer, 
                { 
                  backgroundColor: selectedFeedback === 'bad' ? '#FF5252' : theme.backgroundSecondary,
                }
              ]}>
                <Text style={styles.emoji}>😞</Text>
              </View>
              <Text style={[
                styles.feedbackLabel, 
                { 
                  color: selectedFeedback === 'bad' ? '#FF5252' : theme.textPrimary,
                  fontWeight: selectedFeedback === 'bad' ? '600' : '500'
                }
              ]}>Bad</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.viewBalanceButton, { backgroundColor: theme.backgroundSecondary }]}
          onPress={handleViewBalance}
        >
          <Text style={[styles.viewBalanceText, { color: theme.textPrimary }]}>View Balance</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sellMoreButton, { backgroundColor: '#FF6B35' }]}
          onPress={handleSellMore}
        >
          <Text style={styles.sellMoreText}>Sell more</Text>
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
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  successSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successIcon: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    position: 'absolute',
  },
  star1: {
    top: -10,
    right: -20,
  },
  star2: {
    bottom: -10,
    left: -20,
  },
  starText: {
    fontSize: 20,
    color: '#FF6B35',
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
  cryptoAmount: {
    fontSize: 36,
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
  messageSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  feedbackSection: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  feedbackButton: {
    alignItems: 'center',
  },
  emojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 24,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 15,
  },
  viewBalanceButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  viewBalanceText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sellMoreButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  sellMoreText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SellCompletedScreen;