import React, { useState, useEffect, useRef } from 'react';
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
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import CoinIcon from '../../components/CoinIcon';

const WithdrawScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const coin = route.params?.coin || { id: 'usdt', symbol: 'USDT', name: 'Tether' };

  const [selectedCoin, setSelectedCoin] = useState(coin);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showMethodSelection, setShowMethodSelection] = useState(false); // Don't show method selection by default

  const slideAnim = useRef(new Animated.Value(300)).current;

  // Mock balance
  const balance = 2855.00;

  useEffect(() => {
    if (showMethodSelection) {
      // Slide up animation when modal appears
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [showMethodSelection, slideAnim]);

  const handleMethodSelect = (method) => {
    // Start slide down animation
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Immediately hide the modal (don't wait for animation)
    setShowMethodSelection(false);

    if (method === 'crypto') {
      // Stay on this screen - the form will now be visible
    } else if (method === 'user') {
      // Navigate to P2P send screen
      navigation.navigate('SendToUserFlow', {
        screen: 'SendToUser',
        params: { coin: selectedCoin },
      });
    }
  };

  const handleCloseMethodSelection = () => {
    // Start slide down animation
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Immediately hide the modal and go back
    setShowMethodSelection(false);
    navigation.goBack(); // Go back to home screen
  };

  const handleNetworkSelect = () => {
    navigation.navigate('NetworkSelectionModal', {
      currentNetwork: selectedNetwork,
    });
  };

  const handleMaxPress = () => {
    setWithdrawAmount(balance.toString());
  };

  const handleCoinSelect = () => {
    navigation.navigate('CoinSelectionModal', {
      flow: 'withdraw',
      currentCoin: selectedCoin,
    });
  };


  const handleAddressSelect = () => {
    navigation.navigate('AddressSelectionModal', {
      currentAddress: withdrawAddress,
    });
  };

  // Use focus effect to handle return values from modal screens
  useFocusEffect(
    React.useCallback(() => {
      const params = route.params;

      // Handle coin selection
      if (params?.selectedCoin && params.selectedCoin !== selectedCoin) {
        setSelectedCoin(params.selectedCoin);
        setSelectedNetwork(null);
        setWithdrawAddress('');
        setWithdrawAmount('');
        navigation.setParams({ selectedCoin: undefined });
      }

      // Handle network selection
      if (params?.selectedNetwork && params.selectedNetwork !== selectedNetwork) {
        setSelectedNetwork(params.selectedNetwork);
        navigation.setParams({ selectedNetwork: undefined });
      }

      // Handle address selection
      if (params?.selectedAddress) {
        setWithdrawAddress(params.selectedAddress.fullAddress);
        // Also set the network based on the selected address
        const networkData = {
          id: params.selectedAddress.network.toLowerCase(),
          symbol: params.selectedAddress.network,
          name: params.selectedAddress.networkName,
          min: '1 USDT',
          fee: '0 USDT',
        };
        setSelectedNetwork(networkData);
        navigation.setParams({ selectedAddress: undefined });
      }
    }, [route.params, selectedCoin, selectedNetwork, navigation])
  );

  const handleSubmit = () => {
    // Navigate to withdraw confirmation
    navigation.navigate('WithdrawConfirmation', {
      coin: selectedCoin,
      network: selectedNetwork,
      address: withdrawAddress,
      amount: parseFloat(withdrawAmount),
    });
  };

  const isSubmitEnabled = selectedNetwork && withdrawAddress && withdrawAmount && parseFloat(withdrawAmount) > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      {/* Only show the withdraw form if method has been selected */}
      {!showMethodSelection && (
        <>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              Withdraw {selectedCoin?.symbol || 'USDT'}
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
          {/* Address Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              Address
            </Text>
            <View style={[styles.addressContainer, { backgroundColor: theme.backgroundInput }]}>
              <View style={styles.addressContent}>
                <TextInput
                  style={[styles.addressInput, { color: theme.textPrimary }]}
                  value={withdrawAddress}
                  onChangeText={setWithdrawAddress}
                  placeholder="Long press to paste"
                  placeholderTextColor={theme.textSecondary}
                  multiline={true}
                  numberOfLines={withdrawAddress ? 2 : 1}
                  textAlignVertical="top"
                />
                <View style={styles.addressActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.backgroundForm }]}
                    onPress={handleAddressSelect}
                  >
                    <Ionicons name="person-outline" size={18} color={theme.textSecondary} />
                  </TouchableOpacity>
                  <View style={[styles.divider, { backgroundColor: theme.textSecondary }]} />
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.backgroundForm }]}>
                    <Ionicons name="qr-code-outline" size={18} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Network Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              Network
            </Text>
            <TouchableOpacity
              style={[styles.selectionField, { backgroundColor: theme.backgroundInput }]}
              onPress={handleNetworkSelect}
            >
              <Text style={[
                styles.selectionText,
                { color: selectedNetwork ? theme.textPrimary : theme.textSecondary },
              ]}>
                {selectedNetwork ? selectedNetwork.name : 'Select network'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* You Withdraw Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>You Withdraw</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.backgroundInput }]}>
              <TextInput
                style={[styles.amountInput, { color: theme.textPrimary }]}
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
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
            <View style={styles.withdrawInfo}>
              <Text style={[styles.minText, { color: theme.textSecondary }]}>
                {selectedNetwork ? `Min. ${selectedNetwork.min}` : 'Min. 1 USDT'}
              </Text>
              <Text style={[styles.balanceText, { color: theme.textSecondary }]}>
                Balance: {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {selectedCoin?.symbol || 'USDT'}
              </Text>
            </View>
          </View>

        </ScrollView>

        {/* Bottom Card with Withdraw Info and Submit Button */}
        <View style={styles.bottomContainer}>
          <View style={[styles.bottomCard, { backgroundColor: theme.backgroundInput }]}>
            {/* Withdraw Info */}
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
        </>
      )}

      {/* Method Selection Modal - Full Screen Overlay */}
      {showMethodSelection && (
        <Modal
          animationType="none"
          transparent={true}
          visible={showMethodSelection}
          onRequestClose={handleCloseMethodSelection}
          statusBarTranslucent={true}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.overlayTouchable}
              activeOpacity={1}
              onPress={handleCloseMethodSelection}
            />
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: theme.backgroundForm,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Header with back button */}
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={handleCloseMethodSelection}
                  style={styles.modalBackButton}
                >
                  <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  Withdraw {selectedCoin?.symbol || 'USDT'}
                </Text>
                <TouchableOpacity onPress={handleCloseMethodSelection} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Method Options */}
              <View style={styles.methodsContainer}>
                <TouchableOpacity
                  style={[styles.methodOption, { backgroundColor: theme.backgroundInput }]}
                  onPress={() => handleMethodSelect('user')}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: '#FF6B3515' }]}>
                    <Ionicons name="person-circle-outline" size={24} color="#FF6B35" />
                  </View>
                  <View style={styles.methodContent}>
                    <Text style={[styles.methodTitle, { color: theme.textPrimary }]}>
                      Send to Azasend user
                    </Text>
                    <Text style={[styles.methodSubtitle, { color: theme.textSecondary }]}>
                      Send crypto to Azasend users instantly with no fees
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.methodOption, { backgroundColor: theme.backgroundInput }]}
                  onPress={() => handleMethodSelect('crypto')}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: '#FF6B3515' }]}>
                    <Ionicons name="globe-outline" size={24} color="#FF6B35" />
                  </View>
                  <View style={styles.methodContent}>
                    <Text style={[styles.methodTitle, { color: theme.textPrimary }]}>
                      Send via crypto network
                    </Text>
                    <Text style={[styles.methodSubtitle, { color: theme.textSecondary }]}>
                      Send to any address known through crypto network
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Bottom Safe Area */}
              <View style={styles.bottomSafeArea} />
            </Animated.View>
          </View>
        </Modal>
      )}
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
  addressContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressInput: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
    paddingRight: 8,
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 20,
    alignSelf: 'center',
    opacity: 0.3,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectionText: {
    fontSize: 16,
  },
  maxButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 15,
    minHeight: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalBackButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 0,
    padding: 5,
  },
  methodsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSafeArea: {
    height: 34,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 5,
    minHeight: 70,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    textAlignVertical: 'center',
  },
  maxText: {
    fontSize: 16,
    fontWeight: '600',
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
  withdrawInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 15,
    marginTop: 8,
  },
  minText: {
    fontSize: 14,
  },
  balanceText: {
    fontSize: 14,
  },
});

export default WithdrawScreen;
