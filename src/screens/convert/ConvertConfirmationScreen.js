import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import CoinIcon from '../../components/CoinIcon';

const ConvertConfirmationScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { sourceCoin, destinationCoin, sourceAmount, destinationAmount, exchangeRate } = route.params;

  const slideAnim = useRef(new Animated.Value(650)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Calculate fee (0.1% of source amount)
  const fee = sourceAmount * 0.001;
  const finalAmount = destinationAmount; // Final amount received

  const handleConfirm = () => {
    Animated.timing(slideAnim, {
      toValue: 650,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Navigate directly to success screen
      navigation.replace('ConvertSuccess', {
        ...route.params,
        fee,
        finalAmount,
        transactionId: '#R009213121',
        transactionTime: '2025/1/12 - 9:10',
      });
    });
  };

  const handleCancel = () => {
    Animated.timing(slideAnim, {
      toValue: 650,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      navigation.goBack();
    });
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={true}
      onRequestClose={handleCancel}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleCancel}
        />
        <Animated.View style={[
          styles.modalContainer,
          {
            backgroundColor: theme.backgroundForm,
            transform: [{ translateY: slideAnim }],
            paddingBottom: insets.bottom,
          },
        ]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              Confirmation
            </Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
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
            </View>

            {/* Details Card */}
            <View style={[styles.detailsCard, { backgroundColor: theme.backgroundInput }]}>
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


              {/* Final Amount */}
              <View style={[styles.detailRow, styles.finalAmountRow]}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  You get
                </Text>
                <Text style={[styles.finalAmount, { color: theme.textPrimary }]}>
                  {finalAmount} {destinationCoin.symbol}
                </Text>
              </View>

              {/* Completion Time */}
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  Completion time
                </Text>
                <Text style={[styles.completionTime, { color: '#4285F4' }]}>
                  Immediately
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={[styles.modalActions, { paddingBottom: insets.bottom > 0 ? 15 : 25 }]}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: theme.backgroundInput }]}
              onPress={handleCancel}
            >
              <Text style={[styles.cancelButtonText, { color: theme.textPrimary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: '#FF6B35' }]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    height: 500,
    paddingTop: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
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
  modalContent: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  currencyIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  sourceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionSection: {
    alignItems: 'center',
    marginBottom: 20,
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
  detailsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
  finalAmountRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 10,
    paddingTop: 20,
  },
  finalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completionTime: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConvertConfirmationScreen;
