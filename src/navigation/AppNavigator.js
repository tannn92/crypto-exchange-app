import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import ScreenWrapper from '../components/ScreenWrapper';

import BottomTabNavigator from './BottomTabNavigator';
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

const Stack = createStackNavigator();
const BuyStack = createStackNavigator();
const SellStack = createStackNavigator();
const ConvertStack = createStackNavigator();
const DepositStack = createStackNavigator();
const WithdrawStack = createStackNavigator();
const SendToUserStack = createStackNavigator();

// Helper function to wrap screens with safe area handling
const wrapWithSafeArea = (Component, options = {}) => {
  return (props) => {
    // Skip wrapper for specific screens if needed
    if (options.skipSafeArea) {
      return <Component {...props} />;
    }
    
    // Determine if it's a modal based on screen options
    const isModal = options.isModal || false;
    
    return (
      <ScreenWrapper route={props.route} isModal={isModal}>
        <Component {...props} />
      </ScreenWrapper>
    );
  };
};

// Buy Flow Navigator
const BuyFlowNavigator = () => {
  return (
    <BuyStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <BuyStack.Screen name="CoinSelection" component={wrapWithSafeArea(CoinSelectionScreen)} />
      <BuyStack.Screen name="BuyAmount" component={wrapWithSafeArea(BuyAmountScreen)} />
      <BuyStack.Screen name="PaymentMethod" component={wrapWithSafeArea(PaymentMethodScreen)} />
      <BuyStack.Screen name="BuyConfirmation" component={wrapWithSafeArea(BuyConfirmationScreen)} />
      <BuyStack.Screen name="PaymentProcessing" component={wrapWithSafeArea(PaymentProcessingScreen)} />
      <BuyStack.Screen name="PaymentCompleted" component={wrapWithSafeArea(PaymentCompletedScreen)} />
    </BuyStack.Navigator>
  );
};

// Sell Flow Navigator
const SellFlowNavigator = () => {
  return (
    <SellStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SellStack.Screen name="CoinSelection" component={wrapWithSafeArea(CoinSelectionScreen)} />
      <SellStack.Screen name="SellAmount" component={wrapWithSafeArea(SellAmountScreen)} />
      <SellStack.Screen name="SellConfirmation" component={wrapWithSafeArea(SellConfirmationScreen)} />
      <SellStack.Screen name="SellProcessing" component={wrapWithSafeArea(SellProcessingScreen)} />
      <SellStack.Screen name="SellCompleted" component={wrapWithSafeArea(SellCompletedScreen)} />
      <SellStack.Screen name="SellTransactionDetails" component={wrapWithSafeArea(SellTransactionDetailsScreen)} />
    </SellStack.Navigator>
  );
};

// Convert Flow Navigator
const ConvertFlowNavigator = () => {
  return (
    <ConvertStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ConvertStack.Screen name="Convert" component={wrapWithSafeArea(ConvertScreen)} />
      <ConvertStack.Screen
        name="ConvertConfirmation"
        component={wrapWithSafeArea(ConvertConfirmationScreen, { isModal: true })}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animation: 'none',
          cardOverlayEnabled: false,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      <ConvertStack.Screen name="ConvertSuccess" component={wrapWithSafeArea(ConvertSuccessScreen)} />
    </ConvertStack.Navigator>
  );
};

// Deposit Flow Navigator
const DepositFlowNavigator = () => {
  return (
    <DepositStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <DepositStack.Screen name="Deposit" component={wrapWithSafeArea(DepositScreen)} />
    </DepositStack.Navigator>
  );
};

// Withdraw Flow Navigator
const WithdrawFlowNavigator = () => {
  return (
    <WithdrawStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <WithdrawStack.Screen name="Withdraw" component={wrapWithSafeArea(WithdrawScreen)} />
      <WithdrawStack.Screen
        name="WithdrawConfirmation"
        component={wrapWithSafeArea(WithdrawConfirmationScreen, { isModal: true })}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animation: 'none',
          cardOverlayEnabled: false,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      <WithdrawStack.Screen name="WithdrawSuccess" component={wrapWithSafeArea(WithdrawSuccessScreen)} />
    </WithdrawStack.Navigator>
  );
};

// Send To User Flow Navigator
const SendToUserFlowNavigator = () => {
  return (
    <SendToUserStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SendToUserStack.Screen name="SendToUser" component={wrapWithSafeArea(SendToUserScreen)} />
      <SendToUserStack.Screen
        name="SendToUserConfirmation"
        component={wrapWithSafeArea(SendToUserConfirmationScreen, { isModal: true })}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animation: 'none',
          cardOverlayEnabled: false,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      <SendToUserStack.Screen name="SendToUserSuccess" component={wrapWithSafeArea(SendToUserSuccessScreen)} />
    </SendToUserStack.Navigator>
  );
};

const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="MainTabs" component={wrapWithSafeArea(BottomTabNavigator)} />
        <Stack.Screen
          name="BuyFlow"
          component={wrapWithSafeArea(BuyFlowNavigator)}
        />
        <Stack.Screen
          name="SellFlow"
          component={wrapWithSafeArea(SellFlowNavigator)}
        />
        <Stack.Screen
          name="ConvertFlow"
          component={wrapWithSafeArea(ConvertFlowNavigator)}
        />
        <Stack.Screen
          name="CoinSelectionModal"
          component={wrapWithSafeArea(CoinSelectionScreen, { isModal: true })}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="CoinSelectionScreen"
          component={wrapWithSafeArea(CoinSelectionScreen)}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ReceiveMethodScreen"
          component={wrapWithSafeArea(ReceiveMethodScreen, { isModal: true })}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="DepositFlow"
          component={wrapWithSafeArea(DepositFlowNavigator)}
        />
        <Stack.Screen
          name="WithdrawFlow"
          component={wrapWithSafeArea(WithdrawFlowNavigator)}
        />
        <Stack.Screen
          name="SendToUserFlow"
          component={wrapWithSafeArea(SendToUserFlowNavigator)}
        />
        <Stack.Screen
          name="NetworkSelectionModal"
          component={wrapWithSafeArea(NetworkSelectionScreen, { isModal: true })}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="AddressSelectionModal"
          component={wrapWithSafeArea(AddressSelectionScreen, { isModal: true })}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="WithdrawMethodSelectionModal"
          component={wrapWithSafeArea(WithdrawMethodSelectionScreen, { isModal: true })}
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'none',
            cardOverlayEnabled: false,
            cardStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
          name="UsernameSelectionModal"
          component={wrapWithSafeArea(UsernameSelectionScreen, { isModal: true })}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="CoinDetails"
          component={wrapWithSafeArea(CoinDetailsScreen)}
        />
        <Stack.Screen
          name="CoinMarket"
          component={wrapWithSafeArea(CoinMarketScreen)}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ProfileMenu"
          component={wrapWithSafeArea(ProfileMenuScreen, { isModal: true })}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="PaymentMethodModal"
          component={wrapWithSafeArea(PaymentMethodScreen, { isModal: true })}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="Notification"
          component={wrapWithSafeArea(NotificationScreen)}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
