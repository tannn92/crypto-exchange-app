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
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import CoinIcon from '../../components/CoinIcon';

const SendToUserConfirmationScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { coin, username, amount, message } = route.params;

  const slideAnim = useRef(new Animated.Value(550)).current;

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

  // P2P transfers are typically free
  const fee = 0;
  const totalAmount = amount;

  const handleConfirm = () => {
    Animated.timing(slideAnim, {
      toValue: 550,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Navigate directly to success screen
      navigation.replace('SendToUserSuccess', {
        ...route.params,
        fee,
        totalAmount,
        transactionId: '#P009213121',
        transactionTime: new Date().toLocaleString(),
      });
    });
  };

  const handleCancel = () => {
    Animated.timing(slideAnim, {
      toValue: 550,
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
            {/* Currency Icon */}
            <View style={styles.iconSection}>
              <View style={styles.iconContainer}>
                <CoinIcon coinId={coin.id} size={32} />
              </View>
            </View>

            {/* Transaction Info */}
            <View style={styles.transactionSection}>
              <Text style={[styles.transactionType, { color: theme.textSecondary }]}>
                Withdraw {coin.symbol}
              </Text>
              <Text style={[styles.amount, { color: theme.textPrimary }]}>
                {formatNumber(amount)} {coin.symbol}
              </Text>
            </View>

            {/* Details Card */}
            <View style={[styles.detailsCard, { backgroundColor: theme.backgroundInput }]}>
              {/* Received username */}
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  Received username
                </Text>
                <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                  {username}
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

              {/* Fee */}
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  Fee
                </Text>
                <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                  {fee === 0 ? '0.00' : fee.toFixed(2)} {coin.symbol}
                </Text>
              </View>

              {/* Total Amount */}
              <View style={[styles.detailRow, styles.totalAmountRow]}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  Total amount
                </Text>
                <Text style={[styles.totalAmount, { color: theme.textPrimary }]}>
                  {formatNumber(totalAmount.toFixed(2))} {coin.symbol}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
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
              <Text style={styles.confirmButtonText}>Withdraw</Text>
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
    height: 550,
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
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 15,
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
    flex: 1.5,
  },
  totalAmountRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 10,
    paddingTop: 20,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
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

export default SendToUserConfirmationScreen;
