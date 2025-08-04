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
import HomeScreen from '../screens/HomeScreen';
import AssetsScreen from '../screens/AssetsScreen';
import HistoryScreen from '../screens/HistoryScreen';

// Helper to create wrapped components
const createSafeScreen = (Component, isModal = false) => {
  const SafeComponent = (props) => (
    <ScreenWrapper route={props.route} isModal={isModal}>
      <Component {...props} />
    </ScreenWrapper>
  );
  
  SafeComponent.displayName = `Safe(${Component.displayName || Component.name})`;
  return SafeComponent;
};

// Create all safe screen components
export const SafeCoinSelectionScreen = createSafeScreen(CoinSelectionScreen);
export const SafeBuyAmountScreen = createSafeScreen(BuyAmountScreen);
export const SafeBuyConfirmationScreen = createSafeScreen(BuyConfirmationScreen);
export const SafePaymentMethodScreen = createSafeScreen(PaymentMethodScreen);
export const SafePaymentProcessingScreen = createSafeScreen(PaymentProcessingScreen);
export const SafePaymentCompletedScreen = createSafeScreen(PaymentCompletedScreen);

export const SafeSellAmountScreen = createSafeScreen(SellAmountScreen);
export const SafeSellConfirmationScreen = createSafeScreen(SellConfirmationScreen);
export const SafeSellProcessingScreen = createSafeScreen(SellProcessingScreen);
export const SafeSellCompletedScreen = createSafeScreen(SellCompletedScreen);
export const SafeSellTransactionDetailsScreen = createSafeScreen(SellTransactionDetailsScreen);
export const SafeReceiveMethodScreen = createSafeScreen(ReceiveMethodScreen, true);

export const SafeConvertScreen = createSafeScreen(ConvertScreen);
export const SafeConvertConfirmationScreen = createSafeScreen(ConvertConfirmationScreen, true);
export const SafeConvertSuccessScreen = createSafeScreen(ConvertSuccessScreen);

export const SafeDepositScreen = createSafeScreen(DepositScreen);
export const SafeNetworkSelectionScreen = createSafeScreen(NetworkSelectionScreen, true);

export const SafeWithdrawScreen = createSafeScreen(WithdrawScreen);
export const SafeAddressSelectionScreen = createSafeScreen(AddressSelectionScreen, true);
export const SafeWithdrawConfirmationScreen = createSafeScreen(WithdrawConfirmationScreen, true);
export const SafeWithdrawSuccessScreen = createSafeScreen(WithdrawSuccessScreen);
export const SafeWithdrawMethodSelectionScreen = createSafeScreen(WithdrawMethodSelectionScreen, true);

export const SafeSendToUserScreen = createSafeScreen(SendToUserScreen);
export const SafeUsernameSelectionScreen = createSafeScreen(UsernameSelectionScreen, true);
export const SafeSendToUserConfirmationScreen = createSafeScreen(SendToUserConfirmationScreen, true);
export const SafeSendToUserSuccessScreen = createSafeScreen(SendToUserSuccessScreen);

export const SafeCoinDetailsScreen = createSafeScreen(CoinDetailsScreen);
export const SafeCoinMarketScreen = createSafeScreen(CoinMarketScreen);
export const SafeProfileMenuScreen = createSafeScreen(ProfileMenuScreen, true);
export const SafeNotificationScreen = createSafeScreen(NotificationScreen);

// Tab screens
export const SafeHomeScreen = createSafeScreen(HomeScreen);
export const SafeAssetsScreen = createSafeScreen(AssetsScreen);
export const SafeHistoryScreen = createSafeScreen(HistoryScreen);