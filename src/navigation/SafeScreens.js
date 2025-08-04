import React from 'react';
import ScreenWrapper from '../components/ScreenWrapper';

// Import all screens
import CoinSelectionScreen from '../screens/buy/CoinSelectionScreen';
import BuyAmountScreen from '../screens/buy/BuyAmountScreen';
import BuyConfirmationScreen from '../screens/buy/BuyConfirmationScreen';
import PaymentMethodScreen from '../screens/buy/PaymentMethodScreen';
import PaymentProcessingScreen from '../screens/buy/PaymentProcessingScreen';
import PaymentCompletedScreen from '../screens/buy/PaymentCompletedScreen';
import SellAmountScreen from '../screens/sell/SellAmountScreen';
import SellConfirmationScreen from '../screens/sell/SellConfirmationScreen';
import SellProcessingScreen from '../screens/sell/SellProcessingScreen';
import SellCompletedScreen from '../screens/sell/SellCompletedScreen';
import SellTransactionDetailsScreen from '../screens/sell/SellTransactionDetailsScreen';
import ReceiveMethodScreen from '../screens/sell/ReceiveMethodScreen';
import ConvertScreen from '../screens/convert/ConvertScreen';
import ConvertConfirmationScreen from '../screens/convert/ConvertConfirmationScreen';
import ConvertSuccessScreen from '../screens/convert/ConvertSuccessScreen';
import DepositScreen from '../screens/deposit/DepositScreen';
import DepositCompletedScreen from '../screens/deposit/DepositCompletedScreen';
import NetworkSelectionScreen from '../screens/deposit/NetworkSelectionScreen';
import WithdrawScreen from '../screens/withdraw/WithdrawScreen';
import AddressSelectionScreen from '../screens/withdraw/AddressSelectionScreen';
import WithdrawConfirmationScreen from '../screens/withdraw/WithdrawConfirmationScreen';
import WithdrawSuccessScreen from '../screens/withdraw/WithdrawSuccessScreen';
import WithdrawMethodSelectionScreen from '../screens/withdraw/WithdrawMethodSelectionScreen';
import SendToUserScreen from '../screens/withdraw/SendToUserScreen';
import UsernameSelectionScreen from '../screens/withdraw/UsernameSelectionScreen';
import SendToUserConfirmationScreen from '../screens/withdraw/SendToUserConfirmationScreen';
import SendToUserSuccessScreen from '../screens/withdraw/SendToUserSuccessScreen';
import CoinDetailsScreen from '../screens/CoinDetailsScreen';
import CoinMarketScreen from '../screens/CoinMarketScreen';
import ProfileMenuScreen from '../screens/ProfileMenuScreen';
import NotificationScreen from '../screens/NotificationScreen';
import AnnouncementDetailScreen from '../screens/AnnouncementDetailScreen';
import HomeScreen from '../screens/HomeScreen';
import AssetsScreen from '../screens/AssetsScreen';
import HistoryScreen from '../screens/HistoryScreen';

// Helper to create wrapped components
const createSafeScreen = (Component, isModal = false, backgroundType = 'default', isTransparent = false) => {
  const SafeComponent = (props) => {
    // For transparent modals, don't wrap with ScreenWrapper at all
    if (isTransparent) {
      return <Component {...props} />;
    }
    
    // Use theme context to get the right background color
    const { theme } = require('../context/ThemeContext').useTheme();
    
    let backgroundColor;
    switch (backgroundType) {
      case 'form':
        backgroundColor = theme.backgroundForm;
        break;
      case 'card':
        backgroundColor = theme.backgroundCard;
        break;
      case 'secondary':
        backgroundColor = theme.backgroundSecondary;
        break;
      default:
        backgroundColor = theme.background;
        break;
    }
    
    return (
      <ScreenWrapper route={props.route} isModal={isModal} backgroundColor={backgroundColor}>
        <Component {...props} />
      </ScreenWrapper>
    );
  };
  
  SafeComponent.displayName = `Safe(${Component.displayName || Component.name})`;
  return SafeComponent;
};

// Create all safe screen components
export const SafeCoinSelectionScreen = createSafeScreen(CoinSelectionScreen);
export const SafeBuyAmountScreen = createSafeScreen(BuyAmountScreen, false, 'form');
export const SafeBuyConfirmationScreen = createSafeScreen(BuyConfirmationScreen, false, 'form');
export const SafePaymentMethodScreen = createSafeScreen(PaymentMethodScreen, false, 'form');
export const SafePaymentProcessingScreen = createSafeScreen(PaymentProcessingScreen, false, 'form');
export const SafePaymentCompletedScreen = createSafeScreen(PaymentCompletedScreen);

export const SafeSellAmountScreen = createSafeScreen(SellAmountScreen, false, 'form');
export const SafeSellConfirmationScreen = createSafeScreen(SellConfirmationScreen, false, 'form');
export const SafeSellProcessingScreen = createSafeScreen(SellProcessingScreen, false, 'form');
export const SafeSellCompletedScreen = createSafeScreen(SellCompletedScreen);
export const SafeSellTransactionDetailsScreen = createSafeScreen(SellTransactionDetailsScreen, false, 'form');
export const SafeReceiveMethodScreen = createSafeScreen(ReceiveMethodScreen, true, 'form');

export const SafeConvertScreen = createSafeScreen(ConvertScreen, false, 'form');
export const SafeConvertConfirmationScreen = createSafeScreen(ConvertConfirmationScreen, true, 'default', true);
export const SafeConvertSuccessScreen = createSafeScreen(ConvertSuccessScreen, false, 'form');

export const SafeDepositScreen = createSafeScreen(DepositScreen, false, 'form');
export const SafeDepositCompletedScreen = createSafeScreen(DepositCompletedScreen, false, 'form');
export const SafeNetworkSelectionScreen = createSafeScreen(NetworkSelectionScreen, true, 'form');

export const SafeWithdrawScreen = createSafeScreen(WithdrawScreen, false, 'form');
export const SafeAddressSelectionScreen = createSafeScreen(AddressSelectionScreen, true, 'form');
export const SafeWithdrawConfirmationScreen = createSafeScreen(WithdrawConfirmationScreen, true, 'default', true);
export const SafeWithdrawSuccessScreen = createSafeScreen(WithdrawSuccessScreen, false, 'form');
export const SafeWithdrawMethodSelectionScreen = createSafeScreen(WithdrawMethodSelectionScreen, true, 'default', true);

export const SafeSendToUserScreen = createSafeScreen(SendToUserScreen, false, 'form');
export const SafeUsernameSelectionScreen = createSafeScreen(UsernameSelectionScreen, true, 'form');
export const SafeSendToUserConfirmationScreen = createSafeScreen(SendToUserConfirmationScreen, true, 'default', true);
export const SafeSendToUserSuccessScreen = createSafeScreen(SendToUserSuccessScreen, false, 'form');

export const SafeCoinDetailsScreen = createSafeScreen(CoinDetailsScreen, false, 'form');
export const SafeCoinMarketScreen = createSafeScreen(CoinMarketScreen, false, 'form');
export const SafeProfileMenuScreen = createSafeScreen(ProfileMenuScreen, true);
export const SafeNotificationScreen = createSafeScreen(NotificationScreen, false, 'form');
export const SafeAnnouncementDetailScreen = createSafeScreen(AnnouncementDetailScreen, false, 'form');

// Tab screens
export const SafeHomeScreen = createSafeScreen(HomeScreen);
export const SafeAssetsScreen = createSafeScreen(AssetsScreen, false, 'form');
export const SafeHistoryScreen = createSafeScreen(HistoryScreen, false, 'form');