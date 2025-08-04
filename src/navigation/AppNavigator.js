import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';

import BottomTabNavigator from './BottomTabNavigator';
import {
  SafeCoinSelectionScreen,
  SafeBuyAmountScreen,
  SafeBuyConfirmationScreen,
  SafePaymentMethodScreen,
  SafePaymentProcessingScreen,
  SafePaymentCompletedScreen,
  SafeSellAmountScreen,
  SafeSellConfirmationScreen,
  SafeSellProcessingScreen,
  SafeSellCompletedScreen,
  SafeSellTransactionDetailsScreen,
  SafeReceiveMethodScreen,
  SafeConvertScreen,
  SafeConvertConfirmationScreen,
  SafeConvertSuccessScreen,
  SafeDepositScreen,
  SafeDepositCompletedScreen,
  SafeNetworkSelectionScreen,
  SafeWithdrawScreen,
  SafeAddressSelectionScreen,
  SafeWithdrawConfirmationScreen,
  SafeWithdrawSuccessScreen,
  SafeWithdrawMethodSelectionScreen,
  SafeSendToUserScreen,
  SafeUsernameSelectionScreen,
  SafeSendToUserConfirmationScreen,
  SafeSendToUserSuccessScreen,
  SafeCoinDetailsScreen,
  SafeCoinMarketScreen,
  SafeProfileMenuScreen,
  SafeNotificationScreen,
  SafeAnnouncementDetailScreen,
} from './SafeScreens';

const Stack = createStackNavigator();
const BuyStack = createStackNavigator();
const SellStack = createStackNavigator();
const ConvertStack = createStackNavigator();
const DepositStack = createStackNavigator();
const WithdrawStack = createStackNavigator();
const SendToUserStack = createStackNavigator();

// Buy Flow Navigator
const BuyFlowNavigator = () => {
  return (
    <BuyStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <BuyStack.Screen name="CoinSelection" component={SafeCoinSelectionScreen} />
      <BuyStack.Screen name="BuyAmount" component={SafeBuyAmountScreen} />
      <BuyStack.Screen name="PaymentMethod" component={SafePaymentMethodScreen} />
      <BuyStack.Screen name="BuyConfirmation" component={SafeBuyConfirmationScreen} />
      <BuyStack.Screen name="PaymentProcessing" component={SafePaymentProcessingScreen} />
      <BuyStack.Screen name="PaymentCompleted" component={SafePaymentCompletedScreen} />
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
      <SellStack.Screen name="CoinSelection" component={SafeCoinSelectionScreen} />
      <SellStack.Screen name="SellAmount" component={SafeSellAmountScreen} />
      <SellStack.Screen name="SellConfirmation" component={SafeSellConfirmationScreen} />
      <SellStack.Screen name="SellProcessing" component={SafeSellProcessingScreen} />
      <SellStack.Screen name="SellCompleted" component={SafeSellCompletedScreen} />
      <SellStack.Screen name="SellTransactionDetails" component={SafeSellTransactionDetailsScreen} />
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
      <ConvertStack.Screen name="Convert" component={SafeConvertScreen} />
      <ConvertStack.Screen
        name="ConvertConfirmation"
        component={SafeConvertConfirmationScreen}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animation: 'none',
          cardOverlayEnabled: false,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      <ConvertStack.Screen name="ConvertSuccess" component={SafeConvertSuccessScreen} />
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
      <DepositStack.Screen name="Deposit" component={SafeDepositScreen} />
      <DepositStack.Screen name="DepositCompleted" component={SafeDepositCompletedScreen} />
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
      <WithdrawStack.Screen name="Withdraw" component={SafeWithdrawScreen} />
      <WithdrawStack.Screen
        name="WithdrawConfirmation"
        component={SafeWithdrawConfirmationScreen}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animation: 'none',
          cardOverlayEnabled: false,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      <WithdrawStack.Screen name="WithdrawSuccess" component={SafeWithdrawSuccessScreen} />
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
      <SendToUserStack.Screen name="SendToUser" component={SafeSendToUserScreen} />
      <SendToUserStack.Screen
        name="SendToUserConfirmation"
        component={SafeSendToUserConfirmationScreen}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animation: 'none',
          cardOverlayEnabled: false,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      <SendToUserStack.Screen name="SendToUserSuccess" component={SafeSendToUserSuccessScreen} />
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
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen
          name="BuyFlow"
          component={BuyFlowNavigator}
        />
        <Stack.Screen
          name="SellFlow"
          component={SellFlowNavigator}
        />
        <Stack.Screen
          name="ConvertFlow"
          component={ConvertFlowNavigator}
        />
        <Stack.Screen
          name="CoinSelectionModal"
          component={SafeCoinSelectionScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="CoinSelectionScreen"
          component={SafeCoinSelectionScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ReceiveMethodScreen"
          component={SafeReceiveMethodScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="DepositFlow"
          component={DepositFlowNavigator}
        />
        <Stack.Screen
          name="WithdrawFlow"
          component={WithdrawFlowNavigator}
        />
        <Stack.Screen
          name="SendToUserFlow"
          component={SendToUserFlowNavigator}
        />
        <Stack.Screen
          name="NetworkSelectionModal"
          component={SafeNetworkSelectionScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="AddressSelectionModal"
          component={SafeAddressSelectionScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="WithdrawMethodSelectionModal"
          component={SafeWithdrawMethodSelectionScreen}
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
          component={SafeUsernameSelectionScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="CoinDetails"
          component={SafeCoinDetailsScreen}
        />
        <Stack.Screen
          name="CoinMarket"
          component={SafeCoinMarketScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ProfileMenu"
          component={SafeProfileMenuScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="PaymentMethodModal"
          component={SafePaymentMethodScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="Notification"
          component={SafeNotificationScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AnnouncementDetail"
          component={SafeAnnouncementDetailScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
