import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import BankIcon from '../../components/BankIcon';

const ReceiveMethodScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { currentMethod } = route.params || {};

  const bankAccounts = [
    {
      id: 'bank-vietcombank',
      bankId: 'vietcombank',
      bankName: 'Vietcombank',
      accountName: 'NGUYEN THE DUY',
      accountNumber: '***3399',
      isSelected: currentMethod === 'bank-vietcombank',
    },
    {
      id: 'bank-acb',
      bankId: 'acb',
      bankName: 'ACB',
      accountName: 'NGUYEN THE DUY',
      accountNumber: '***3399',
      isSelected: currentMethod === 'bank-acb',
    },
    {
      id: 'bank-techcombank',
      bankId: 'techcombank',
      bankName: 'Techcombank',
      accountName: 'NGUYEN THE DUY',
      accountNumber: '***5678',
      isSelected: currentMethod === 'bank-techcombank',
    },
    {
      id: 'bank-vietinbank',
      bankId: 'vietinbank',
      bankName: 'VietinBank',
      accountName: 'NGUYEN THE DUY',
      accountNumber: '***9012',
      isSelected: currentMethod === 'bank-vietinbank',
    },
  ];

  const supportedBanks = [
    { id: 'vietcombank', name: 'Vietcombank' },
    { id: 'acb', name: 'ACB' },
    { id: 'techcombank', name: 'Techcombank' },
    { id: 'vietinbank', name: 'VietinBank' },
    { id: 'sacombank', name: 'Sacombank' },
    { id: 'mbbank', name: 'MBBank' },
    { id: 'vpbank', name: 'VPBank' },
    { id: 'vib', name: 'VIB' },
    { id: 'msb', name: 'MSB' },
    { id: 'shinhanbank', name: 'ShinhanBank' },
  ];

  const handleSelectAccount = (account) => {
    // Close modal first
    navigation.goBack();

    // Navigate back to SellFlow with the selected bank account
    setTimeout(() => {
      navigation.navigate('SellFlow', {
        screen: route.params?.returnScreen || 'SellAmount',
        params: {
          selectedReceiveMethod: account.id,
          selectedReceiveMethodDetails: {
            accountName: account.accountName,
            accountNumber: account.accountNumber,
            bankName: account.bankName,
          },
        },
      });
    }, 100);
  };

  const renderBankAccount = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.accountItem,
        {
          backgroundColor: theme.backgroundInput,
          borderColor: item.isSelected ? theme.primary : theme.border,
          borderWidth: item.isSelected ? 2 : 1,
        },
      ]}
      onPress={() => handleSelectAccount(item)}
      activeOpacity={0.7}
    >
      <BankIcon bankId={item.bankId} size={40} />
      <View style={styles.accountDetails}>
        <Text style={[styles.bankName, { color: theme.textPrimary }]}>
          {item.bankName} ({item.accountNumber})
        </Text>
        <Text style={[styles.accountName, { color: theme.textSecondary }]}>
          {item.accountName}
        </Text>
      </View>
      {item.isSelected && (
        <Ionicons name="checkmark" size={24} color={theme.primary} />
      )}
    </TouchableOpacity>
  );

  const handleAddBankAccount = () => {
    Alert.alert(
      'Coming Soon',
      'Add bank account feature will be available soon!',
      [
        { text: 'OK', style: 'default' },
      ],
      { cancelable: true }
    );
  };

  const renderAddBankAccount = () => (
    <TouchableOpacity
      style={[
        styles.addAccountItem,
        {
          backgroundColor: theme.backgroundInput,
          borderColor: theme.border,
          borderWidth: 1,
        },
      ]}
      onPress={handleAddBankAccount}
      activeOpacity={0.7}
    >
      <View style={[styles.addIcon, { backgroundColor: theme.primary }]}>
        <Ionicons name="business" size={24} color="#FFF" />
      </View>
      <View style={styles.addAccountDetails}>
        <Text style={[styles.addAccountTitle, { color: theme.textPrimary }]}>
          Add bank account
        </Text>
        <View style={styles.supportedBanks}>
          <Text style={[styles.supportedText, { color: theme.textSecondary }]}>
            We support{' '}
          </Text>
          <View style={styles.bankIcons}>
            {supportedBanks.slice(0, 8).map((bank, index) => (
              <BankIcon key={bank.id} bankId={bank.id} size={16} style={{ marginRight: 2 }} />
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Receive method
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <FlatList
            data={bankAccounts}
            renderItem={renderBankAccount}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={renderAddBankAccount}
          />
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  accountDetails: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  accountName: {
    fontSize: 14,
  },
  addAccountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  addIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAccountDetails: {
    flex: 1,
  },
  addAccountTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  supportedBanks: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  supportedText: {
    fontSize: 14,
    marginRight: 4,
  },
  bankIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

export default ReceiveMethodScreen;
