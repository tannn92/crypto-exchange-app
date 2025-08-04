import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import CoinIcon from '../../components/CoinIcon';

const SellProcessingScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { coin, cryptoAmount, vndAmount, exchangeRate, receiveMethod, accountName, accountNumber } = route.params;
  const [timeRemaining, setTimeRemaining] = useState({ minutes: 0, seconds: 5 });
  const [currentStep, setCurrentStep] = useState(2); // Start at step 2 (sending money) immediately
  const [hasNavigated, setHasNavigated] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          // Timer reached 0
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle step progression
  useEffect(() => {
    if (timeRemaining.minutes === 0 && timeRemaining.seconds === 0 && !hasNavigated) {
      // Move to completed and stop here
      setCurrentStep(3);
      setHasNavigated(true);
    }
  }, [timeRemaining, hasNavigated]);

  // Rotation animation for step 2
  useEffect(() => {
    if (currentStep === 2) {
      const rotation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        { iterations: -1 }
      );
      rotation.start();
      return () => rotation.stop();
    }
  }, [currentStep, rotateAnim]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleCancel = () => {
    setHasNavigated(true);
    navigation.goBack();
  };

  const getStatusText = () => {
    switch (currentStep) {
      case 1:
        return 'Delivering';
      case 2:
        return 'Delivering';
      case 3:
        return 'Success';
      default:
        return 'Delivering';
    }
  };

  const getStatusColor = () => {
    switch (currentStep) {
      case 1:
      case 2:
        return '#4285F4';
      case 3:
        return '#4CAF50';
      default:
        return '#4285F4';
    }
  };

  const getBankName = (method) => {
    const bankNames = {
      'bank-vietcombank': 'Vietcombank',
      'bank-acb': 'ACB',
      'bank-techcombank': 'Techcombank',
      'bank-vietinbank': 'VietinBank',
      'bank-sacombank': 'Sacombank',
      'bank-mbbank': 'MBBank',
      'bank-vpbank': 'VPBank',
      'bank-vib': 'VIB',
      'bank-msb': 'MSB',
      'bank-shinhanbank': 'ShinhanBank',
    };
    return bankNames[method] || 'Bank';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleCancel}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Transaction Icon */}
        <View style={styles.iconSection}>
          <View style={styles.transactionIcon}>
            <View style={styles.newIconBackground}>
              <View style={styles.centerDollar}>
                <Text style={styles.dollarText}>$</Text>
              </View>
              <View style={styles.blueArrow}>
                <Ionicons name="arrow-forward" size={16} color="#4285F4" />
              </View>
              <View style={styles.orangeArrow}>
                <Ionicons name="arrow-back" size={16} color="#FF6B35" />
              </View>
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
          <View style={[styles.statusLabel, { backgroundColor: currentStep === 3 ? '#E8F5E8' : '#E8F0FF' }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        {/* Steps Timeline */}
        <View style={styles.timeline}>
          {/* Step 1 - Withdrawal confirmed (Already completed) */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.stepDot, styles.stepCompleted]}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
              <View style={[styles.connector, styles.firstConnector, { backgroundColor: '#4CAF50' }]} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.stepTitle, { color: '#4CAF50' }]}>
                Withdrawal has been confirmed
              </Text>
              <Text style={[styles.stepTime, { color: theme.textSecondary }]}>
                04/10/2024 - 13:49
              </Text>
            </View>
          </View>

          {/* Step 2 - Sending money (Active with countdown) */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.stepDot, currentStep === 2 ? styles.stepActive : styles.stepCompleted]}>
                {currentStep === 2 ? (
                  <Animated.View
                    style={[
                      styles.loadingIcon,
                      {
                        transform: [{
                          rotate: rotateAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg'],
                          }),
                        }],
                      },
                    ]}
                  >
                    <Ionicons name="refresh" size={14} color="white" />
                  </Animated.View>
                ) : (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <View style={[
                styles.connector,
                styles.secondConnector,
                {
                  backgroundColor: currentStep >= 3 ? '#4CAF50' : '#E0E0E0',
                  height: currentStep === 2 ? 80 : 40, // Adjusted height after removing ProcessingGuarantee
                },
              ]} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.stepTitle, { color: currentStep === 2 ? theme.textPrimary : '#4CAF50' }]}>
                Sending money...
              </Text>
              {currentStep === 2 && (
                <>
                  <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
                    Processing time
                  </Text>
                  <View style={styles.timerRow}>
                    <View style={styles.timerContainer}>
                      <View style={[styles.timerBox, { backgroundColor: '#4285F4' }]}>
                        <Text style={styles.timerText}>
                          {timeRemaining.minutes.toString().padStart(2, '0')}
                        </Text>
                      </View>
                      <Text style={[styles.timerColon, { color: theme.textPrimary }]}>:</Text>
                      <View style={[styles.timerBox, { backgroundColor: '#4285F4' }]}>
                        <Text style={styles.timerText}>
                          {timeRemaining.seconds.toString().padStart(2, '0')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
              {currentStep > 2 && (
                <Text style={[styles.stepTime, { color: theme.textSecondary }]}>
                  04/10/2024 - 13:49
                </Text>
              )}
            </View>
          </View>

          {/* Step 3 - Completed */}
          <View style={[styles.timelineItem, styles.lastTimelineItem]}>
            <View style={styles.timelineLeft}>
              <View style={[styles.stepDot, currentStep >= 3 ? styles.stepCompleted : styles.stepInactive]}>
                {currentStep >= 3 ? (
                  <Ionicons name="checkmark" size={16} color="white" />
                ) : (
                  <Text style={[styles.stepNumber, { color: '#666' }]}>3</Text>
                )}
              </View>
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.stepTitle, { color: currentStep >= 3 ? '#4CAF50' : theme.textSecondary }]}>
                Completed
              </Text>
              {currentStep >= 3 && (
                <Text style={[styles.stepTime, { color: theme.textSecondary }]}>
                  04/10/2024 - 13:50
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Transaction Details Button */}
        <TouchableOpacity
          style={[styles.detailsButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('SellTransactionDetails', route.params)}
        >
          <Text style={styles.detailsButtonText}>Transaction details</Text>
        </TouchableOpacity>
      </ScrollView>
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
    position: 'relative',
  },
  backButton: {
    width: 60,
    alignItems: 'flex-start',
    zIndex: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  headerRight: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iconSection: {
    alignItems: 'center',
    marginVertical: 15,
  },
  transactionIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  centerDollar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  dollarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  blueArrow: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
  },
  orangeArrow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    zIndex: 2,
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
  stepActive: {
    backgroundColor: '#4285F4',
  },
  stepCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepInactive: {
    backgroundColor: '#E0E0E0',
  },
  stepNumber: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  connector: {
    width: 2,
    height: 40,
    marginTop: 0,
  },
  firstConnector: {
    height: 30, // Connect step 1 to step 2
  },
  secondConnector: {
    height: 40, // Connect step 2 to step 3
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
  stepDescription: {
    fontSize: 14,
    marginBottom: 15,
  },
  processingSection: {
    marginLeft: 0,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 5,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  timerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerColon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    alignSelf: 'stretch',
  },
  guaranteeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  detailsButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  detailsButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingIcon: {
    // Animation styles applied inline
  },
});

export default SellProcessingScreen;
