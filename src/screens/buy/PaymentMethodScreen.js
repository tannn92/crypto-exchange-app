import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import BankIcon from '../../components/BankIcon';

const { width: screenWidth } = Dimensions.get('window');

const PaymentMethodScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const currentPaymentMethod = route.params?.currentPaymentMethod || 'balance';
  const coin = route.params?.coin;
  
  // Initialize state based on current payment method
  const [selectedMethod, setSelectedMethod] = useState(currentPaymentMethod);
  const [isBankExpanded, setIsBankExpanded] = useState(
    currentPaymentMethod.startsWith('bank-') || currentPaymentMethod === 'bank'
  );

  const bankLogos = ['shinhanbank', 'vietcombank', 'techcombank', 'msb', 'vietinbank', 'vpbank', 'vib', 'mbbank', 'sacombank'];
  const bankNames = {
    shinhanbank: 'ShinhanBank',
    vietcombank: 'Vietcombank',
    techcombank: 'Techcombank',
    msb: 'MSB',
    vietinbank: 'VietinBank',
    vpbank: 'VPBank',
    vib: 'VIB',
    mbbank: 'MBBank',
    sacombank: 'Sacombank',
    acb: 'ACB',
  };
  const expandedBanks = ['vietcombank', 'sacombank', 'msb', 'vib', 'mbbank', 'acb', 'techcombank'];

  const handleSelectMethod = (method) => {
    if (method === 'bank') {
      setIsBankExpanded(!isBankExpanded);
      setSelectedMethod(method);
    } else {
      setSelectedMethod(method);
      // Close modal first
      navigation.goBack();
      
      // Navigate back to BuyFlow with the selected payment method
      setTimeout(() => {
        navigation.navigate('BuyFlow', {
          screen: 'BuyAmount',
          params: { 
            selectedPaymentMethod: method,
            coin: coin // Pass the coin back
          }
        });
      }, 100);
    }
  };

  const handleSelectBank = (bankId) => {
    setSelectedMethod(`bank-${bankId}`);
    // Close modal first
    navigation.goBack();
    
    // Navigate back to BuyFlow with the selected bank
    setTimeout(() => {
      navigation.navigate('BuyFlow', {
        screen: 'BuyAmount',
        params: { 
          selectedPaymentMethod: `bank-${bankId}`,
          coin: coin // Pass the coin back
        }
      });
    }, 100);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Paying with</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bank Transfer Option */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            {
              backgroundColor: theme.backgroundInput,
              borderColor: (selectedMethod.startsWith('bank') || selectedMethod === 'bank') ? theme.primary : theme.border,
              borderWidth: (selectedMethod.startsWith('bank') || selectedMethod === 'bank') ? 2 : 1,
            }
          ]}
          onPress={() => handleSelectMethod('bank')}
        >
          <View style={styles.paymentLeft}>
            <View style={[styles.paymentIcon, { backgroundColor: theme.primary }]}>
              <Ionicons name="card" size={20} color="#FFF" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentTitle, { color: theme.textPrimary }]}>
                Bank transfer
              </Text>
              <View style={styles.bankInfoRow}>
                <Text style={[styles.paymentSubtitle, { color: theme.textSecondary }]}>
                  Buy crypto 24/7 via:
                </Text>
                <View style={styles.bankLogos}>
                  {bankLogos.slice(0, screenWidth < 400 ? 5 : 8).map((bank, index) => (
                    <BankIcon key={bank} bankId={bank} size={16} style={{ marginLeft: 4 }} />
                  ))}
                </View>
              </View>
            </View>
          </View>
          <Ionicons 
            name={isBankExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={theme.textSecondary} 
          />
        </TouchableOpacity>

        {/* Expanded Bank Options */}
        {isBankExpanded && (
          <View style={[styles.expandedBanks, { backgroundColor: theme.backgroundInput }]}>
            {expandedBanks.map((bankId) => (
              <TouchableOpacity
                key={bankId}
                style={[
                  styles.bankOption,
                  {
                    borderBottomColor: theme.border,
                    backgroundColor: selectedMethod === `bank-${bankId}` ? theme.primary + '15' : theme.backgroundInput,
                  }
                ]}
                onPress={() => handleSelectBank(bankId)}
              >
                <View style={styles.bankLeft}>
                  <BankIcon bankId={bankId} size={24} />
                  <Text style={[styles.bankName, { color: theme.textPrimary }]}>
                    {bankNames[bankId]}
                  </Text>
                </View>
                {selectedMethod === `bank-${bankId}` && (
                  <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Your Balance Option */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            {
              backgroundColor: theme.backgroundInput,
              borderColor: selectedMethod === 'balance' ? theme.primary : theme.border,
              borderWidth: selectedMethod === 'balance' ? 2 : 1,
            }
          ]}
          onPress={() => handleSelectMethod('balance')}
        >
          <View style={styles.paymentLeft}>
            <View style={[styles.paymentIcon, { backgroundColor: theme.primary }]}>
              <Ionicons name="wallet" size={20} color="#FFF" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentTitle, { color: theme.textPrimary }]}>
                Your Balance
              </Text>
              <Text style={[styles.paymentBalance, { color: theme.textSecondary }]}>
                30,000,000 VND
              </Text>
            </View>
          </View>
          {selectedMethod === 'balance' && (
            <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
          )}
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
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
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
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentSubtitle: {
    fontSize: 14,
  },
  paymentBalance: {
    fontSize: 14,
  },
  bankInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  bankLogos: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedBanks: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    marginLeft: 20,
    marginRight: 20,
  },
  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  bankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankName: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default PaymentMethodScreen;