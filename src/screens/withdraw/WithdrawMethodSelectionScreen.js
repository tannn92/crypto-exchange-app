import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const WithdrawMethodSelectionScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { coin } = route.params || { coin: { id: 'usdt', symbol: 'USDT', name: 'Tether' } };

  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    // Slide up animation when modal appears
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const handleClose = () => {
    // Slide down animation before closing
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      navigation.goBack();
    });
  };

  const handleSendToUser = () => {
    // Start slide down animation immediately
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Navigate immediately without waiting for animation
    navigation.replace('SendToUserFlow', {
      screen: 'SendToUser',
      params: { coin },
    });
  };

  const handleSendToCrypto = () => {
    // Start slide down animation immediately
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Navigate immediately without waiting for animation
    navigation.replace('WithdrawFlow', {
      screen: 'Withdraw',
      params: { coin },
    });
  };

  const withdrawMethods = [
    {
      id: 'user',
      title: 'Send to Azasend user',
      subtitle: 'Send crypto to Azasend users instantly with no fees',
      icon: 'person-circle-outline',
      iconColor: '#FF6B35',
      onPress: handleSendToUser,
    },
    {
      id: 'crypto',
      title: 'Send via crypto network',
      subtitle: 'Send to any address known through crypto network',
      icon: 'globe-outline',
      iconColor: '#FF6B35',
      onPress: handleSendToCrypto,
    },
  ];


  const renderMethodOption = (method) => (
    <TouchableOpacity
      key={method.id}
      style={[styles.methodOption, { backgroundColor: theme.backgroundInput }]}
      onPress={method.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${method.iconColor}15` }]}>
        <Ionicons name={method.icon} size={24} color={method.iconColor} />
      </View>
      <View style={styles.methodContent}>
        <Text style={[styles.methodTitle, { color: theme.textPrimary }]}>
          {method.title}
        </Text>
        <Text style={[styles.methodSubtitle, { color: theme.textSecondary }]}>
          {method.subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={true}
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
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
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.modalBackButton}
            >
              <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              Withdraw {coin.symbol}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Method Options */}
          <View style={styles.methodsContainer}>
            {withdrawMethods.map(renderMethodOption)}
          </View>

          {/* Bottom Safe Area */}
          <View style={styles.bottomSafeArea} />
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
});

export default WithdrawMethodSelectionScreen;
