import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const NetworkSelectionScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { currentNetwork } = route.params || {};

  // Network configurations with example addresses
  const networks = [
    {
      id: 'ton',
      symbol: 'TON',
      name: 'The Open Network',
      fee: '0.9 USDT',
      min: '1 USDT',
      arrivalTime: '~ 1 mins',
      address: 'EQDtFpEwcFAEcRe5mLVh2N6C0x1hJEM7W61JLnSF74p4q2',
      status: 'active',
    },
    {
      id: 'trc20',
      symbol: 'TRX',
      name: 'Tron (TRC20)',
      fee: '2 USDT',
      min: '1 USDT',
      arrivalTime: '~ 1 mins',
      address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      status: 'active',
    },
    {
      id: 'bsc',
      symbol: 'BSC',
      name: 'BNB Smart Chain (BEP20)',
      fee: '1 USDT',
      min: '1 USDT',
      arrivalTime: '~ 1 mins',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f6BEd1',
      status: 'active',
    },
    {
      id: 'polygon',
      symbol: 'POL',
      name: 'Polygon POS (POLYGON)',
      fee: '0.9 USDT',
      min: '1 USDT',
      arrivalTime: '~ 1 mins',
      address: '0x3ccc55fb22b75a3be4437a56d32284f24d3f6372',
      status: 'suspended',
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      fee: '0.5 USDT',
      min: '1 USDT',
      arrivalTime: '~ 1 mins',
      address: '7xKXtg2CW87d7TXQ3aYJvSD4jZvqmZD7mLNQ2B5n3F9p',
      status: 'active',
    },
  ];

  const handleSelectNetwork = (network) => {
    if (network.status === 'suspended') {
      Alert.alert(
        'Network Suspended',
        'This network is temporarily suspended. Please choose another network.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    // Close modal first
    navigation.goBack();

    // Navigate back to the appropriate flow with the selected network
    setTimeout(() => {
      const targetFlow = route.params?.flow || 'withdraw';

      if (targetFlow === 'deposit') {
        navigation.navigate('DepositFlow', {
          screen: 'Deposit',
          params: { selectedNetwork: network },
        });
      } else {
        navigation.navigate('WithdrawFlow', {
          screen: 'Withdraw',
          params: { selectedNetwork: network },
        });
      }
    }, 200);
  };

  const renderNetwork = (network, index) => {
    const isSelected = currentNetwork?.id === network.id;
    const isSuspended = network.status === 'suspended';

    return (
      <TouchableOpacity
        key={network.id}
        style={[
          styles.networkItem,
          {
            backgroundColor: theme.backgroundInput,
            borderColor: isSelected ? theme.primary : theme.border,
            borderWidth: isSelected ? 2 : 1,
            opacity: isSuspended ? 0.6 : 1,
          },
        ]}
        onPress={() => handleSelectNetwork(network)}
        activeOpacity={0.7}
      >
        <View style={styles.networkHeader}>
          <View style={styles.networkTitleRow}>
            <Text style={[styles.networkSymbol, { color: theme.textPrimary }]}>
              {network.symbol}
            </Text>
            <Text style={[styles.networkName, { color: theme.textSecondary }]}>
              {network.name}
            </Text>
          </View>
          {isSuspended && (
            <View style={[styles.suspendedBadge, { backgroundColor: '#FF4757' }]}>
              <Text style={styles.suspendedText}>Suspended</Text>
            </View>
          )}
        </View>

        <View style={styles.networkDetails}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Fee {network.fee}
            </Text>
            <Text style={[styles.detailValue, { color: theme.textSecondary }]}>
              Arrival time {network.arrivalTime}
            </Text>
          </View>
          <Text style={[styles.minAmount, { color: theme.textSecondary }]}>
            Min {network.min}
          </Text>
        </View>

        {isSelected && (
          <View style={[styles.checkmark, { backgroundColor: theme.primary }]}>
            <Ionicons name="checkmark" size={16} color="white" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Select Network
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Warning Box */}
      <View style={[styles.warningBox, { backgroundColor: '#FFF3CD' }]}>
        <Text style={[styles.warningText, { color: '#856404' }]}>
          Ensure the network you choose to deposit matches the withdrawal network, otherwise your assets may be lost
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        {networks.map(renderNetwork)}
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: -24,
  },
  closeButton: {
    padding: 5,
    zIndex: 1,
  },
  warningBox: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  networkItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative',
  },
  networkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  networkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  networkSymbol: {
    fontSize: 18,
    fontWeight: '600',
  },
  networkName: {
    fontSize: 16,
  },
  suspendedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  suspendedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  networkDetails: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
  },
  minAmount: {
    fontSize: 14,
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NetworkSelectionScreen;
