import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../navigation/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import CoinSelectionScreen from '../screens/buy/CoinSelectionScreen';
import BuyAmountScreen from '../screens/buy/BuyAmountScreen';
import BuyConfirmationScreen from '../screens/buy/BuyConfirmationScreen';
import PaymentMethodScreen from '../screens/buy/PaymentMethodScreen';

// Placeholder screens
const AssetsScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: theme.background }]}>
      <Text style={[styles.placeholderText, { color: theme.textPrimary }]}>Assets</Text>
    </View>
  );
};

const HistoryScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: theme.background }]}>
      <Text style={[styles.placeholderText, { color: theme.textPrimary }]}>History</Text>
    </View>
  );
};

const MainApp = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Home');

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    navigation.navigate(tabName);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen navigation={navigation} />;
      case 'Assets':
        return <AssetsScreen />;
      case 'History':
        return <HistoryScreen />;
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  const renderModal = () => {
    if (navigation.modalStack.length === 0) return null;

    const currentModal = navigation.modalStack[navigation.modalStack.length - 1];
    
    switch (currentModal.name) {
      case 'CoinSelection':
        return (
          <View style={styles.modalContainer}>
            <CoinSelectionScreen 
              navigation={{
                navigate: (screen, params) => {
                  navigation.closeModal();
                  navigation.openModal(screen, params);
                },
                goBack: navigation.closeModal,
              }}
              route={{ params: currentModal.params }}
            />
          </View>
        );
      case 'BuyAmount':
        return (
          <View style={styles.modalContainer}>
            <BuyAmountScreen 
              navigation={{
                navigate: (screen, params) => {
                  navigation.openModal(screen, params);
                },
                goBack: navigation.closeModal,
              }}
              route={{ params: currentModal.params }}
            />
          </View>
        );
      case 'BuyConfirmation':
        return (
          <View style={styles.modalContainer}>
            <BuyConfirmationScreen 
              navigation={{
                navigate: (screen, params) => {
                  navigation.closeModal();
                  // Handle completion
                },
                goBack: navigation.closeModal,
              }}
              route={{ params: currentModal.params }}
            />
          </View>
        );
      case 'PaymentMethod':
        return (
          <View style={styles.modalContainer}>
            <PaymentMethodScreen 
              navigation={{
                navigate: (screen, params) => {
                  navigation.closeModal();
                  navigation.openModal(screen, params);
                },
                goBack: navigation.closeModal,
              }}
              route={{ params: currentModal.params }}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Main Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: theme.bottomNavBackground, borderTopColor: theme.border }]}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => handleTabPress('Home')}
        >
          <Ionicons 
            name={activeTab === 'Home' ? 'home' : 'home-outline'} 
            size={24} 
            color={activeTab === 'Home' ? theme.primary : theme.bottomNavInactive} 
          />
          <Text style={[
            styles.navText, 
            { color: activeTab === 'Home' ? theme.primary : theme.bottomNavInactive }
          ]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => handleTabPress('Assets')}
        >
          <Ionicons 
            name={activeTab === 'Assets' ? 'wallet' : 'wallet-outline'} 
            size={24} 
            color={activeTab === 'Assets' ? theme.primary : theme.bottomNavInactive} 
          />
          <Text style={[
            styles.navText, 
            { color: activeTab === 'Assets' ? theme.primary : theme.bottomNavInactive }
          ]}>
            Assets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => handleTabPress('History')}
        >
          <Ionicons 
            name={activeTab === 'History' ? 'time' : 'time-outline'} 
            size={24} 
            color={activeTab === 'History' ? theme.primary : theme.bottomNavInactive} 
          />
          <Text style={[
            styles.navText, 
            { color: activeTab === 'History' ? theme.primary : theme.bottomNavInactive }
          ]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default MainApp;