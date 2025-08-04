import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';

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

// Buy Flow Navigator
const BuyFlowNavigator = () => {
  return (
    <BuyStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <BuyStack.Screen name="CoinSelection" component={CoinSelectionScreen} />
      <BuyStack.Screen name="BuyAmount" component={BuyAmountScreen} />
      <BuyStack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <BuyStack.Screen name="BuyConfirmation" component={BuyConfirmationScreen} />
      <BuyStack.Screen name="PaymentProcessing" component={PaymentProcessingScreen} />
      <BuyStack.Screen name="PaymentCompleted" component={PaymentCompletedScreen} />
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
      <SellStack.Screen name="CoinSelection" component={CoinSelectionScreen} />
      <SellStack.Screen name="SellAmount" component={SellAmountScreen} />
      <SellStack.Screen name="SellConfirmation" component={SellConfirmationScreen} />
      <SellStack.Screen name="SellProcessing" component={SellProcessingScreen} />
      <SellStack.Screen name="SellCompleted" component={SellCompletedScreen} />
      <SellStack.Screen name="SellTransactionDetails" component={SellTransactionDetailsScreen} />
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
      <ConvertStack.Screen name="Convert" component={ConvertScreen} />
      <ConvertStack.Screen
        name="ConvertConfirmation"
        component={ConvertConfirmationScreen}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animation: 'none',
          cardOverlayEnabled: false,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      <ConvertStack.Screen name="ConvertSuccess" component={ConvertSuccessScreen} />
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
      <DepositStack.Screen name="Deposit" component={DepositScreen} />
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
      <WithdrawStack.Screen name="Withdraw" component={WithdrawScreen} />
      <WithdrawStack.Screen
        name="WithdrawConfirmation"
        component={WithdrawConfirmationScreen}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animation: 'none',
          cardOverlayEnabled: false,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      <WithdrawStack.Screen name="WithdrawSuccess" component={WithdrawSuccessScreen} />
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
      <SendToUserStack.Screen name="SendToUser" component={SendToUserScreen} />
      <SendToUserStack.Screen
        name="SendToUserConfirmation"
        component={SendToUserConfirmationScreen}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animation: 'none',
          cardOverlayEnabled: false,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      <SendToUserStack.Screen name="SendToUserSuccess" component={SendToUserSuccessScreen} />
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
          component={CoinSelectionScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="CoinSelectionScreen"
          component={CoinSelectionScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ReceiveMethodScreen"
          component={ReceiveMethodScreen}
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
          component={NetworkSelectionScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="AddressSelectionModal"
          component={AddressSelectionScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="WithdrawMethodSelectionModal"
          component={WithdrawMethodSelectionScreen}
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
          component={UsernameSelectionScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="CoinDetails"
          component={CoinDetailsScreen}
        />
        <Stack.Screen
          name="CoinMarket"
          component={CoinMarketScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ProfileMenu"
          component={ProfileMenuScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="PaymentMethodModal"
          component={PaymentMethodScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="Notification"
          component={NotificationScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
