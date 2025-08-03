import React from 'react';
import CoinSelectionScreen from '../buy/CoinSelectionScreen';

// Reuse the buy flow's coin selection screen but navigate to sell flow
const SellCoinSelectionScreen = ({ navigation, route }) => {
  const handleSelectCoin = (coin) => {
    navigation.navigate('SellFlow', {
      screen: 'SellAmount',
      params: { coin }
    });
  };

  return (
    <CoinSelectionScreen 
      navigation={{
        ...navigation,
        navigate: (screen, params) => {
          if (screen === 'BuyAmount' && params?.coin) {
            // Redirect to sell flow instead
            handleSelectCoin(params.coin);
          } else {
            navigation.navigate(screen, params);
          }
        },
        goBack: navigation.goBack
      }}
      route={route}
    />
  );
};

export default SellCoinSelectionScreen;