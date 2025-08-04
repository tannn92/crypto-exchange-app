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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import CoinIcon from '../../components/CoinIcon';

const SendToUserScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const coin = route.params?.coin || { id: 'usdt', symbol: 'USDT', name: 'Tether' };

  const [selectedCoin, setSelectedCoin] = useState(coin);
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  // Mock balance
  const balance = 2855.00;

  const handleCoinSelect = () => {
    navigation.navigate('CoinSelectionModal', {
      flow: 'send',
      currentCoin: selectedCoin,
    });
  };

  const handleUsernameSelect = () => {
    navigation.navigate('UsernameSelectionModal', {
      currentUsername: username,
      coin: selectedCoin,
    });
  };

  // Use focus effect to handle return values from modal screens
  useFocusEffect(
    React.useCallback(() => {
      // Check if we have return params from CoinSelectionModal
      const params = route.params;
      if (params?.selectedCoin && params.selectedCoin !== selectedCoin) {
        setSelectedCoin(params.selectedCoin);
        setAmount('');
        // Clear the params to prevent re-triggering
        navigation.setParams({ selectedCoin: undefined });
      }

      // Check if we have return params from UsernameSelectionModal
      if (params?.selectedUsername && params.selectedUsername !== username) {
        setUsername(params.selectedUsername);
        // Clear the params to prevent re-triggering
        navigation.setParams({ selectedUsername: undefined });
      }
    }, [route.params, selectedCoin, username, navigation])
  );

  const handleMaxPress = () => {
    setAmount(balance.toString());
  };

  const handleSubmit = () => {
    // Navigate to send confirmation
    navigation.navigate('SendToUserConfirmation', {
      coin: selectedCoin,
      username: username,
      amount: parseFloat(amount),
      message: message,
    });
  };

  const isSubmitEnabled = username && amount && parseFloat(amount) > 0;

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
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Send {selectedCoin?.symbol || 'USDT'}
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.getParent()?.push('MainTabs', {
              screen: 'History',
              params: { selectedTab: 'Withdrawal' },
            })}
          >
            <Ionicons name="time-outline" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Username Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              Username
            </Text>
            <View style={[styles.usernameContainer, { backgroundColor: theme.backgroundInput }]}>
              <View style={styles.usernameContent}>
                <TextInput
                  style={[styles.usernameInput, { color: theme.textPrimary }]}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Long press to paste"
                  placeholderTextColor={theme.textSecondary}
                />
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.backgroundForm }]}
                  onPress={handleUsernameSelect}
                >
                  <Ionicons name="person-outline" size={18} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Quantity Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Quantity</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.backgroundInput }]}>
              <TextInput
                style={[styles.amountInput, { color: theme.textPrimary }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
              />
              <TouchableOpacity onPress={handleMaxPress} style={styles.maxButton}>
                <Text style={[styles.maxText, { color: theme.primary }]}>Max</Text>
              </TouchableOpacity>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <TouchableOpacity style={styles.coinSelector} onPress={handleCoinSelect}>
                <CoinIcon coinId={selectedCoin?.id || 'usdt'} size={24} />
                <Text style={[styles.coinSymbol, { color: theme.textPrimary }]}>
                  {selectedCoin?.symbol || 'USDT'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.quantityInfo}>
              <Text style={[styles.minText, { color: theme.textSecondary }]}>
                Min. 1 {selectedCoin?.symbol || 'USDT'}
              </Text>
              <Text style={[styles.balanceText, { color: theme.textSecondary }]}>
                Balance: {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {selectedCoin?.symbol || 'USDT'}
              </Text>
            </View>
          </View>

          {/* Message Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              Message
            </Text>
            <View style={[styles.messageContainer, { backgroundColor: theme.backgroundInput }]}>
              <TextInput
                style={[styles.messageInput, { color: theme.textPrimary }]}
                value={message}
                onChangeText={setMessage}
                placeholder="Your message"
                placeholderTextColor={theme.textSecondary}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

        </ScrollView>

        {/* Bottom Card with Send Info and Submit Button */}
        <View style={styles.bottomContainer}>
          <View style={[styles.bottomCard, { backgroundColor: theme.backgroundInput }]}>
            {/* Send Info */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                    Withdraw fee
                  </Text>
                  <TouchableOpacity>
                    <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.feeTag, { backgroundColor: '#E8F5E8' }]}>
                  <Text style={[styles.feeText, { color: '#4CAF50' }]}>
                    0 Free
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                    Time to complete
                  </Text>
                  <TouchableOpacity>
                    <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                  Immediately
                </Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                    Daily withdraw quota
                  </Text>
                  <TouchableOpacity>
                    <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                  Unlimited
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: isSubmitEnabled ? theme.primary : '#FFB885',
                },
              ]}
              onPress={handleSubmit}
              disabled={!isSubmitEnabled}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  usernameContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
    minHeight: 60,
  },
  usernameContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameInput: {
    fontSize: 16,
    flex: 1,
    paddingRight: 8,
    lineHeight: 22,
    textAlignVertical: 'center',
    paddingVertical: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maxButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  messageContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
    minHeight: 100,
  },
  messageInput: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  infoSection: {
    gap: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  feeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  feeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  bottomCard: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 8,
    minHeight: 70,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    textAlignVertical: 'center',
  },
  quantityInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
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
  minText: {
    fontSize: 14,
  },
  balanceText: {
    fontSize: 14,
  },
});

export default SendToUserScreen;
