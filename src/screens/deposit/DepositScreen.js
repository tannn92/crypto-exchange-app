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

const DepositScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { coin } = route.params || { coin: { id: 'usdt', symbol: 'USDT', name: 'Tether' } };

  const [selectedCoin, setSelectedCoin] = useState(coin);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [depositAddress, setDepositAddress] = useState('');

  // Use focus effect to handle return values from modal screens
  useFocusEffect(
    React.useCallback(() => {
      const params = route.params;

      // Check if we have return params from CoinSelectionModal
      if (params?.selectedCoin && params.selectedCoin !== selectedCoin) {
        setSelectedCoin(params.selectedCoin);
        setSelectedNetwork(null);
        setDepositAddress('');
        // Clear the params to prevent re-triggering
        navigation.setParams({ selectedCoin: undefined });
      }

      // Check if we have return params from NetworkSelectionModal
      if (params?.selectedNetwork && params.selectedNetwork !== selectedNetwork) {
        setSelectedNetwork(params.selectedNetwork);
        // Auto-fill the deposit address when network is selected
        setDepositAddress(params.selectedNetwork.address);
        // Clear the params to prevent re-triggering
        navigation.setParams({ selectedNetwork: undefined });
      }
    }, [route.params, selectedCoin, selectedNetwork, navigation])
  );

  // This is handled by the NetworkSelectionScreen now

  const handleCoinSelect = () => {
    navigation.navigate('CoinSelectionModal', {
      flow: 'deposit',
      currentCoin: selectedCoin,
      returnScreen: 'DepositScreen',
    });
  };

  const handleNetworkSelect = () => {
    navigation.navigate('NetworkSelectionModal', {
      currentNetwork: selectedNetwork,
      flow: 'deposit',
      returnScreen: 'DepositScreen',
    });
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            console.log('Back button touched - DepositScreen');
            navigation.goBack();
          }}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel="Go back"
          testID="back-button"
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Deposit {selectedCoin?.symbol || 'USDT'}
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => {
              console.log('History button touched - DepositScreen');
              navigation.getParent()?.navigate('MainTabs', {
                screen: 'History',
                params: { selectedTab: 'Deposit' },
              });
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel="View transaction history"
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
          {/* Deposit Coin Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              Deposit
            </Text>
            <TouchableOpacity
              style={[styles.selectionField, { backgroundColor: theme.backgroundInput }]}
              onPress={handleCoinSelect}
              testID="deposit-coin-selector"
            >
              <View style={styles.selectionContent}>
                <CoinIcon coinId={selectedCoin?.id || 'usdt'} size={24} />
                <Text style={[styles.selectionText, { color: theme.textPrimary }]}>
                  {selectedCoin?.symbol || 'USDT'}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Network Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              From
            </Text>
            <TouchableOpacity
              style={[styles.selectionField, { backgroundColor: theme.backgroundInput }]}
              onPress={handleNetworkSelect}
              testID="deposit-network-selector"
            >
              <View style={styles.networkContent}>
                <Text style={[
                  styles.selectionText,
                  { color: selectedNetwork ? theme.textPrimary : theme.textSecondary },
                ]}>
                  {selectedNetwork ? `${selectedNetwork.symbol} ${selectedNetwork.name}` : 'Select'}
                </Text>
                {selectedNetwork && (
                  <Text style={[styles.minAmount, { color: theme.textSecondary }]}>
                    Min {selectedNetwork.min}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Deposit Address */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              Deposit address
            </Text>
            <View style={[styles.addressContainer, { backgroundColor: theme.backgroundInput }]}>
              <View style={styles.addressContent}>
                <TextInput
                  style={[styles.input, { color: theme.textPrimary }]}
                  value={depositAddress}
                  placeholder={selectedNetwork ? 'Address will be generated automatically' : 'Select a network first'}
                  placeholderTextColor={theme.textSecondary}
                  multiline={true}
                  numberOfLines={3}
                  editable={false}
                  selectTextOnFocus={true}
                />
                {depositAddress && (
                  <TouchableOpacity style={[styles.copyButton, { backgroundColor: theme.primary }]} testID="copy-address-button">
                    <Ionicons name="copy-outline" size={16} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* QR Code */}
            {depositAddress && (
              <View style={styles.qrContainer}>
                <View style={[styles.qrCode, { backgroundColor: theme.backgroundInput }]}>
                  <View style={styles.qrPattern}>
                    {/* Realistic QR code pattern */}
                    <View style={styles.qrGrid}>
                      {/* Top-left finder pattern */}
                      <View style={[styles.finderPattern, { top: 0, left: 0 }]}>
                        <View style={styles.finderInner} />
                      </View>
                      {/* Top-right finder pattern */}
                      <View style={[styles.finderPattern, { top: 0, right: 0 }]}>
                        <View style={styles.finderInner} />
                      </View>
                      {/* Bottom-left finder pattern */}
                      <View style={[styles.finderPattern, { bottom: 0, left: 0 }]}>
                        <View style={styles.finderInner} />
                      </View>

                      {/* Random data pattern */}
                      {Array.from({ length: 625 }, (_, i) => {
                        const row = Math.floor(i / 25);
                        const col = i % 25;
                        // Skip finder pattern areas
                        const isFinderArea = (row < 9 && col < 9) ||
                                            (row < 9 && col > 15) ||
                                            (row > 15 && col < 9);
                        if (isFinderArea) {return null;}

                        // Create realistic QR pattern
                        const shouldBeFilled = Math.sin(row * 0.8 + col * 1.2) +
                                              Math.cos(row * 1.1 - col * 0.9) > 0.3;

                        return (
                          <View
                            key={i}
                            style={[
                              styles.qrPixel,
                              {
                                left: col * 5,
                                top: row * 5,
                                backgroundColor: shouldBeFilled ? '#000' : 'transparent',
                              },
                            ]}
                          />
                        );
                      })}
                    </View>
                    {/* Center icon */}
                    <View style={[styles.qrCenterIcon, { backgroundColor: 'white' }]}>
                      <CoinIcon coinId={selectedCoin?.id || 'usdt'} size={20} />
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Warning Message */}
            {selectedNetwork && (
              <View style={[styles.warningMessage, { backgroundColor: '#FFF3CD' }]}>
                <Text style={[styles.warningText, { color: '#856404' }]}>
                  Any deposit that is less than {selectedNetwork.min} will not be refunded.
                </Text>
              </View>
            )}
          </View>

        </ScrollView>

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
  headerIcon: {
    marginLeft: 15,
    padding: 5,
    zIndex: 10,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 8,
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
  selectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkContent: {
    flex: 1,
  },
  selectionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  minAmount: {
    fontSize: 14,
    marginLeft: 12,
    marginTop: 2,
  },
  inputField: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 80,
  },
  addressContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
    position: 'relative',
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  input: {
    fontSize: 14,
    lineHeight: 18,
    flex: 1,
    minHeight: 40,
    paddingRight: 40,
  },
  copyButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  qrCode: {
    width: 140,
    height: 140,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPattern: {
    position: 'relative',
  },
  qrGrid: {
    width: 125,
    height: 125,
    position: 'relative',
  },
  qrPixel: {
    width: 5,
    height: 5,
    position: 'absolute',
  },
  finderPattern: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderWidth: 5,
    borderColor: '#000',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finderInner: {
    width: 15,
    height: 15,
    backgroundColor: '#000',
  },
  qrCenterIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -15,
    marginLeft: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  warningMessage: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default DepositScreen;
