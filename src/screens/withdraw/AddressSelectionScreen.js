import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const AddressSelectionScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { currentAddress } = route.params || {};

  // Mock saved addresses data
  const savedAddresses = [
    {
      id: '1',
      label: 'Universal address',
      name: null,
      address: 'HI9KD...dzxte',
      fullAddress: 'HI9KDjhf8s9djfh8s9dhf8s9dhf8s9dhdzxte',
      network: 'TRX',
      networkName: 'Tron (TRC20)',
    },
    {
      id: '2',
      label: 'USDT',
      name: 'John Smith',
      address: 'THPdj...jks21',
      fullAddress: 'THPdjhf8s9djfh8s9dhf8s9dhf8s9dhjks21',
      network: 'BSC',
      networkName: 'BNB Smart Chain (BEP20)',
    },
    {
      id: '3',
      label: 'Solana Address',
      name: 'My Solana Wallet',
      address: '7xKXt...n3F9p',
      fullAddress: '7xKXtg2CW87d7TXQ3aYJvSD4jZvqmZD7mLNQ2B5n3F9p',
      network: 'SOL',
      networkName: 'Solana',
    },
  ];

  const [addresses, setAddresses] = useState(savedAddresses);
  const [isManageMode, setIsManageMode] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [networkDropdownVisible, setNetworkDropdownVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editNetwork, setEditNetwork] = useState(null);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNetwork, setNewNetwork] = useState(null);

  // Available networks
  const networks = [
    { id: 'trc20', symbol: 'TRX', name: 'Tron (TRC20)' },
    { id: 'bsc', symbol: 'BSC', name: 'BNB Smart Chain (BEP20)' },
    { id: 'polygon', symbol: 'POL', name: 'Polygon POS (POLYGON)' },
    { id: 'solana', symbol: 'SOL', name: 'Solana' },
    { id: 'ton', symbol: 'TON', name: 'The Open Network' },
  ];

  // Find the currently selected address based on the current address from withdraw screen
  const getCurrentAddressId = () => {
    if (!currentAddress) {return null;}
    const foundAddress = savedAddresses.find(addr => addr.fullAddress === currentAddress);
    return foundAddress ? foundAddress.id : null;
  };

  const [selectedAddressId, setSelectedAddressId] = useState(getCurrentAddressId());

  const handleAddressSelect = (address) => {
    // Close modal first
    navigation.goBack();

    // Navigate back to WithdrawFlow with the selected address
    setTimeout(() => {
      navigation.navigate('WithdrawFlow', {
        screen: 'Withdraw',
        params: { selectedAddress: address },
      });
    }, 200);
  };

  const handleManage = () => {
    setIsManageMode(!isManageMode);
  };

  const handleDelete = (address) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses(addresses.filter(a => a.id !== address.id));
          },
        },
      ]
    );
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setEditName(address.name || '');
    setEditAddress(address.fullAddress);
    setEditNetwork(networks.find(n => n.symbol === address.network));
    setEditModalVisible(true);
  };

  const handleUpdateAddress = () => {
    if (editingAddress && editAddress && editNetwork) {
      setAddresses(addresses.map(a =>
        a.id === editingAddress.id
          ? {
              ...a,
              name: editName || null,
              address: editAddress.length > 10 ? editAddress.substring(0, 5) + '...' + editAddress.substring(editAddress.length - 5) : editAddress,
              fullAddress: editAddress,
              network: editNetwork.symbol,
              networkName: editNetwork.name,
            }
          : a
      ));
      setEditModalVisible(false);
      setEditingAddress(null);
    }
  };

  const handleAddNewAddress = () => {
    setNewName('');
    setNewAddress('');
    setNewNetwork(null);
    setAddModalVisible(true);
  };

  const handleAddAddress = () => {
    if (newAddress && newNetwork) {
      const newAddressObj = {
        id: Date.now().toString(),
        label: newName || `${newNetwork.symbol} Address`,
        name: newName || null,
        address: newAddress.length > 10 ? newAddress.substring(0, 5) + '...' + newAddress.substring(newAddress.length - 5) : newAddress,
        fullAddress: newAddress,
        network: newNetwork.symbol,
        networkName: newNetwork.name,
      };
      setAddresses([...addresses, newAddressObj]);
      setAddModalVisible(false);
      setNewName('');
      setNewAddress('');
      setNewNetwork(null);
    }
  };

  const renderAddressCard = (address) => (
    <TouchableOpacity
      key={address.id}
      style={[
        styles.addressCard,
        {
          backgroundColor: theme.backgroundInput,
          borderColor: selectedAddressId === address.id && !isManageMode ? theme.primary : '#E0E0E0',
        },
      ]}
      onPress={() => !isManageMode && handleAddressSelect(address)}
      disabled={isManageMode}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
          {address.label}
        </Text>
        {selectedAddressId === address.id && !isManageMode && (
          <View style={[styles.checkmark, { backgroundColor: theme.primary }]}>
            <Ionicons name="checkmark" size={16} color="white" />
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        {address.name && (
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Name
            </Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
              {address.name}
            </Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            Address
          </Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
            {address.address}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            Network
          </Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
            <Text style={styles.networkSymbol}>{address.network}</Text> {address.networkName}
          </Text>
        </View>

        {isManageMode && (
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEdit(address)}
            >
              <Text style={[styles.actionButtonText, { color: theme.textPrimary }]}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDelete(address)}
            >
              <Text style={[styles.actionButtonText, { color: '#FF3B30' }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Removed handleCancel since we don't need it

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Select address
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Saved addresses
          </Text>
          <TouchableOpacity onPress={handleManage}>
            <Text style={[styles.manageButton, { color: theme.primary }]}>
              {isManageMode ? 'Done' : 'Manage'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Address Cards */}
        <View style={styles.addressList}>
          {addresses.map(renderAddressCard)}
        </View>

        {/* Add New Address Button */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.backgroundInput }]}
          onPress={handleAddNewAddress}
        >
          <Ionicons name="add" size={24} color={theme.textSecondary} />
          <Text style={[styles.addButtonText, { color: theme.textPrimary }]}>
            Add new address
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.editModalContainer, { backgroundColor: theme.backgroundForm }]}>
            <View style={styles.editModalHeader}>
              <Text style={[styles.editModalTitle, { color: theme.textPrimary }]}>
                Edit Address
              </Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.editModalContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Network
                </Text>
                <TouchableOpacity
                  style={[styles.networkSelector, {
                    backgroundColor: theme.backgroundInput,
                    borderColor: '#E0E0E0',
                  }]}
                  onPress={() => setNetworkDropdownVisible(!networkDropdownVisible)}
                >
                  <Text style={[styles.networkSelectorText, {
                    color: editNetwork ? theme.textPrimary : theme.textSecondary,
                  }]}>
                    {editNetwork ? `${editNetwork.symbol} ${editNetwork.name}` : 'Select network'}
                  </Text>
                  <Ionicons
                    name={networkDropdownVisible ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
                {networkDropdownVisible && (
                  <View style={[styles.networkDropdown, { backgroundColor: theme.backgroundInput }]}>
                    {networks.map((network) => (
                      <TouchableOpacity
                        key={network.id}
                        style={styles.networkOption}
                        onPress={() => {
                          setEditNetwork(network);
                          setNetworkDropdownVisible(false);
                        }}
                      >
                        <Text style={[styles.networkOptionText, { color: theme.textPrimary }]}>
                          {network.symbol} {network.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Address
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.backgroundInput,
                    color: theme.textPrimary,
                  }]}
                  value={editAddress}
                  onChangeText={setEditAddress}
                  placeholder="Enter address"
                  placeholderTextColor={theme.textSecondary}
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Name (Optional)
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.backgroundInput,
                    color: theme.textPrimary,
                  }]}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter name"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.editModalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, {
                    backgroundColor: theme.backgroundInput,
                  }]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.textPrimary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.updateButton]}
                  onPress={handleUpdateAddress}
                >
                  <Text style={styles.updateButtonText}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.editModalContainer, { backgroundColor: theme.backgroundForm }]}>
            <View style={styles.editModalHeader}>
              <Text style={[styles.editModalTitle, { color: theme.textPrimary }]}>
                Add new Address
              </Text>
              <TouchableOpacity
                onPress={() => setAddModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.editModalContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Network
                </Text>
                <TouchableOpacity
                  style={[styles.networkSelector, {
                    backgroundColor: theme.backgroundInput,
                    borderColor: '#E0E0E0',
                  }]}
                  onPress={() => setNetworkDropdownVisible(!networkDropdownVisible)}
                >
                  <Text style={[styles.networkSelectorText, {
                    color: newNetwork ? theme.textPrimary : theme.textSecondary,
                  }]}>
                    {newNetwork ? `${newNetwork.symbol} ${newNetwork.name}` : 'Select network'}
                  </Text>
                  <Ionicons
                    name={networkDropdownVisible ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
                {networkDropdownVisible && (
                  <View style={[styles.networkDropdown, { backgroundColor: theme.backgroundInput }]}>
                    {networks.map((network) => (
                      <TouchableOpacity
                        key={network.id}
                        style={styles.networkOption}
                        onPress={() => {
                          setNewNetwork(network);
                          setNetworkDropdownVisible(false);
                        }}
                      >
                        <Text style={[styles.networkOptionText, { color: theme.textPrimary }]}>
                          {network.symbol} {network.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Address
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.backgroundInput,
                    color: theme.textPrimary,
                  }]}
                  value={newAddress}
                  onChangeText={setNewAddress}
                  placeholder="Enter address"
                  placeholderTextColor={theme.textSecondary}
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Name (Optional)
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.backgroundInput,
                    color: theme.textPrimary,
                  }]}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Enter name"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.editModalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, {
                    backgroundColor: theme.backgroundInput,
                  }]}
                  onPress={() => setAddModalVisible(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.textPrimary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.updateButton]}
                  onPress={handleAddAddress}
                >
                  <Text style={styles.updateButtonText}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  manageButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  addressList: {
    gap: 16,
    marginBottom: 24,
  },
  addressCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  networkSymbol: {
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  editModalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 48,
  },
  networkSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
  },
  networkSelectorText: {
    fontSize: 16,
    flex: 1,
  },
  networkDropdown: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  networkOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  networkOptionText: {
    fontSize: 16,
  },
  editModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  updateButton: {
    backgroundColor: '#FF6B35',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
});

export default AddressSelectionScreen;
