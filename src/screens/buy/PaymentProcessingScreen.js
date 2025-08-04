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
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import CoinIcon from '../../components/CoinIcon';
import BankIcon from '../../components/BankIcon';
import ProcessingGuarantee from '../../components/ProcessingGuarantee';

const PaymentProcessingScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { coin, vndAmount, cryptoAmount, exchangeRate, paymentMethod } = route.params;
  const [timeRemaining, setTimeRemaining] = useState({ minutes: 2, seconds: 30 });
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const qrRef = useRef();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          // Don't clear timer here, let it stay at 0:00
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check for timer completion and navigate
  useEffect(() => {
    if (timeRemaining.minutes === 0 && timeRemaining.seconds === 0 && isVerifying && !hasNavigated) {
      setHasNavigated(true);
      navigation.navigate('PaymentCompleted', {
        ...route.params,
      });
    }
  }, [timeRemaining, isVerifying, navigation, route.params, hasNavigated]);

  // Rotation animation for verification state
  useEffect(() => {
    if (isVerifying) {
      const rotation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear, // Linear easing for constant speed
          useNativeDriver: true,
        }),
        { iterations: -1 }
      );
      rotation.start();
      return () => rotation.stop();
    }
  }, [isVerifying, rotateAnim]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleCancel = () => {
    // Simply go back without setting hasNavigated flag
    navigation.goBack();
  };

  const handlePaymentSent = () => {
    setIsVerifying(true);
    // Reset timer to 10 seconds when entering verification mode
    setTimeRemaining({ minutes: 0, seconds: 10 });
  };



  const handleBackToHome = () => {
    setHasNavigated(true);
    navigation.navigate('MainTabs');
  };

  const bankDetails = {
    name: 'Vietcombank',
    accountNumber: '079079084084',
    accountName: 'CONG TY TNHH CRYPTOVN',
    amount: formatNumber(Math.round(vndAmount)),
    narration: '56C78E90EE',
  };

  const copyToClipboard = (text) => {
    console.log('Copied to clipboard:', text);
  };

  const handleDownloadQR = async () => {
    try {
      if (qrRef.current) {
        qrRef.current.toDataURL((data) => {
          const base64Image = `data:image/png;base64,${data}`;

          // Create a file path
          const filename = `QR_Payment_${Date.now()}.png`;
          const fileUri = FileSystem.documentDirectory + filename;

          // Save the image
          FileSystem.writeAsStringAsync(fileUri, data, {
            encoding: FileSystem.EncodingType.Base64,
          }).then(async () => {
            // Share the image
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(fileUri, {
                mimeType: 'image/png',
                dialogTitle: 'Save QR Code',
              });
            } else {
              Alert.alert('Success', 'QR Code saved successfully!');
            }
          }).catch((error) => {
            console.error('Error saving QR code:', error);
            Alert.alert('Error', 'Failed to save QR code');
          });
        });
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
      Alert.alert('Error', 'Failed to download QR code');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Payment Processing</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Transaction Details */}
        <View style={styles.transactionSection}>
          <Text style={[styles.transactionType, { color: theme.textSecondary }]}>
            Buy {coin.symbol} via Bank Transfer
          </Text>
          <Text style={[styles.cryptoAmount, { color: theme.textPrimary }]}>
            {cryptoAmount.toFixed(6)} {coin.symbol}
          </Text>
        </View>

        {/* Steps Timeline */}
        <View style={styles.timeline}>
          {!isVerifying ? (
            // Payment Processing State
            <>
              {/* Step 1 - Active */}
              <View style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.stepDot, styles.stepActive]}>
                    <Text style={styles.stepNumber}>1</Text>
                  </View>
                  <View style={[
                    styles.connector,
                    isDetailsExpanded ? styles.firstConnectorExpanded : styles.firstConnector,
                    { backgroundColor: '#E0E0E0' },
                  ]} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>
                    Transfer using the details below
                  </Text>

                  <View style={styles.stepDetails}>
                    {/* Timer */}
                    <View style={styles.timerRow}>
                      <Text style={[styles.timerLabel, { color: theme.textSecondary }]}>Time remaining</Text>
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

                    {/* QR Code */}
                    <View style={styles.qrContainer}>
                      <View style={styles.qrCodeWrapper}>
                        <QRCode
                          value={JSON.stringify({
                            amount: bankDetails.amount,
                            bankName: bankDetails.bankName,
                            accountNumber: bankDetails.accountNumber,
                            accountName: bankDetails.accountName,
                            narration: bankDetails.narration,
                          })}
                          size={120}
                          backgroundColor="white"
                          color="black"
                          getRef={(c) => (qrRef.current = c)}
                        />
                        <TouchableOpacity
                          style={[styles.downloadButton, { backgroundColor: theme.primary }]}
                          onPress={handleDownloadQR}
                        >
                          <Ionicons name="download-outline" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                      <Text style={[styles.qrNote, { color: theme.textSecondary }]}>
                        Scan the QR code to complete payment.
                      </Text>
                    </View>

                    {/* Collapsible Bank Details */}
                    <TouchableOpacity
                      style={styles.detailsToggle}
                      onPress={() => setIsDetailsExpanded(!isDetailsExpanded)}
                    >
                      <Text style={[styles.toggleText, { color: theme.primary }]}>
                        Can't scan QR code? Tap here for transfer details.
                      </Text>
                      <Ionicons
                        name={isDetailsExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={theme.primary}
                      />
                    </TouchableOpacity>

                    {isDetailsExpanded && (
                      <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Amount</Text>
                          <View style={styles.detailValueContainer}>
                            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                              {bankDetails.amount} VND
                            </Text>
                            <TouchableOpacity onPress={() => copyToClipboard(bankDetails.amount)}>
                              <View style={[styles.copyIcon, { backgroundColor: theme.primary }]}>
                                <Ionicons name="copy-outline" size={12} color="white" />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Bank name</Text>
                          <View style={styles.detailValueContainer}>
                            <BankIcon bankId="vietcombank" size={20} />
                            <Text style={[styles.detailValue, { color: theme.textPrimary, marginLeft: 8 }]}>
                              {bankDetails.name}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Account number</Text>
                          <View style={styles.detailValueContainer}>
                            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                              {bankDetails.accountNumber}
                            </Text>
                            <TouchableOpacity onPress={() => copyToClipboard(bankDetails.accountNumber)}>
                              <View style={[styles.copyIcon, { backgroundColor: theme.primary }]}>
                                <Ionicons name="copy-outline" size={12} color="white" />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Account name</Text>
                          <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                            {bankDetails.accountName}
                          </Text>
                        </View>

                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Narration</Text>
                          <View style={styles.detailValueContainer}>
                            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                              {bankDetails.narration}
                            </Text>
                            <TouchableOpacity onPress={() => copyToClipboard(bankDetails.narration)}>
                              <View style={[styles.copyIcon, { backgroundColor: theme.primary }]}>
                                <Ionicons name="copy-outline" size={12} color="white" />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )}

                    {/* Warning */}
                    <View style={[styles.warningBox, { backgroundColor: '#FFF3CD' }]}>
                      <Ionicons name="warning" size={20} color="#856404" />
                      <Text style={[styles.warningText, { color: '#856404' }]}>
                        Funds may be lost if the transfer details are incorrect.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Step 2 - Inactive */}
              <View style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.stepDot, styles.stepInactive]}>
                    <Text style={[styles.stepNumber, { color: '#666' }]}>2</Text>
                  </View>
                  <View style={[styles.connector, { backgroundColor: '#E0E0E0' }]} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.stepText, { color: theme.textSecondary }]}>Verify Transfer</Text>
                </View>
              </View>

              {/* Step 3 - Inactive */}
              <View style={[styles.timelineItem, styles.lastTimelineItem]}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.stepDot, styles.stepInactive]}>
                    <Text style={[styles.stepNumber, { color: '#666' }]}>3</Text>
                  </View>
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.stepText, { color: theme.textSecondary }]}>Completed</Text>
                </View>
              </View>
            </>
          ) : (
            // Payment Verification State
            <>
              {/* Step 1 - Completed */}
              <View style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.stepDot, styles.stepCompleted]}>
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                  <View style={[styles.connector, styles.firstConnectorVerifying, { backgroundColor: '#4CAF50' }]} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.stepTitle, { color: '#4CAF50' }]}>
                    Payment sent
                  </Text>
                </View>
              </View>

              {/* Step 2 - Active */}
              <View style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.stepDot, styles.stepActive]}>
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
                  </View>
                  <View style={[styles.connector, styles.secondConnectorVerifying, { backgroundColor: '#E0E0E0' }]} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>
                    Verify Payment...
                  </Text>
                  <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
                    We'll process your order once payment is confirmed
                  </Text>

                  <View style={styles.processingSection}>
                    <View style={styles.timerRow}>
                      <Text style={[styles.timerLabel, { color: theme.textSecondary }]}>Processing time</Text>
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

                    {/* Processing Guarantee */}
                    <ProcessingGuarantee />

                  </View>
                </View>
              </View>

              {/* Step 3 - Inactive */}
              <View style={[styles.timelineItem, styles.lastTimelineItem]}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.stepDot, styles.stepInactive]}>
                    <Text style={[styles.stepNumber, { color: '#666' }]}>3</Text>
                  </View>
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.stepText, { color: theme.textSecondary }]}>Completed</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        {!isVerifying ? (
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: '#FF6B35' }]}
            onPress={handlePaymentSent}
          >
            <Text style={styles.confirmButtonText}>I have sent the payment</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.homeButton, { backgroundColor: '#FF6B35' }]}
            onPress={handleBackToHome}
          >
            <Text style={styles.homeButtonText}>Back to Homepage</Text>
          </TouchableOpacity>
        )}
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
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 1,
  },
  headerRight: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transactionSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  transactionType: {
    fontSize: 16,
    marginBottom: 8,
  },
  cryptoAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timeline: {
    marginBottom: 20,
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
    height: 450, // Base height for processing state
  },
  firstConnectorExpanded: {
    height: 650, // Expanded height when bank details are shown
  },
  firstConnectorVerifying: {
    height: 20, // For verification state - minimal gap
  },
  secondConnectorVerifying: {
    height: 180, // Connect step 2 to step 3 in verification state - increased to fully eliminate gap
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  stepText: {
    fontSize: 16,
  },
  stepDetails: {
    marginLeft: 0,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  timerLabel: {
    fontSize: 16,
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
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCodeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  qrNote: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 8,
    marginVertical: 10,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  detailsContainer: {
    marginBottom: 15,
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  copyIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  warningText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  confirmButton: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingIcon: {
    // Animation styles applied inline
  },
  stepDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  processingSection: {
    marginLeft: 0,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  guaranteeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  homeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentProcessingScreen;
