// Centralized cryptocurrency prices and data
// Updated August 1, 2025 - Current market rates

export const coinPrices = {
  btc: {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 117512.00,
    change: -2.60,
    icon: '₿',
    iconBg: '#F7931A',
  },
  eth: {
    id: 'eth', 
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3801.38,
    change: 0.69,
    icon: 'Ξ',
    iconBg: '#627EEA',
  },
  xrp: {
    id: 'xrp',
    symbol: 'XRP',
    name: 'XRP',
    price: 3.05,
    change: 11.00,
    icon: 'X',
    iconBg: '#23292F',
  },
  usdt: {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether USDT',
    price: 0.9999,
    change: 0.00,
    icon: '₮',
    iconBg: '#26A17B',
  },
  bnb: {
    id: 'bnb',
    symbol: 'BNB',
    name: 'BNB',
    price: 775.30,
    change: -1.20,
    icon: 'B',
    iconBg: '#F3BA2F',
  },
  sol: {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    price: 180.00,
    change: 5.80,
    icon: 'S',
    iconBg: '#9945FF',
  },
  bch: {
    id: 'bch',
    symbol: 'BCH',
    name: 'Bitcoin Cash',
    price: 619.60,
    change: -0.35,
    icon: '₿',
    iconBg: '#8DC351',
  },
  ltc: {
    id: 'ltc',
    symbol: 'LTC',
    name: 'Litecoin',
    price: 96.79,
    change: -0.05,
    icon: 'Ł',
    iconBg: '#BFBBBB',
  },
};

// Export array format for HomeScreen compatibility
export const cryptoData = [
  {
    ...coinPrices.btc,
    // BTC: Down 2.60% - smooth declining trend
    sparklineData: [52, 52.5, 51.8, 51.2, 50.5, 49.8, 50.2, 49.6, 48.9, 48.2, 48.8, 48.1, 47.4, 47.8, 46.9, 46.2, 45.5, 45.1, 44.3, 43.5],
  },
  {
    ...coinPrices.eth,
    // ETH: Up 0.69% - gentle upward trend with smooth fluctuation
    sparklineData: [45, 44.8, 45.2, 45.1, 44.9, 45.3, 45.4, 45.2, 44.7, 45.6, 45.3, 46.1, 45.8, 46.3, 45.9, 46.1, 46.4, 46.2, 46.5, 46.3],
  },
  {
    ...coinPrices.xrp,
    // XRP: Up 11% - smooth strong bullish movement
    sparklineData: [30, 31.2, 32.1, 33.4, 34.8, 36.2, 37.9, 39.5, 41.8, 44.2, 46.5, 49.1, 51.8, 54.6, 57.2, 60.1, 62.8, 65.4, 68.1, 70.5],
  },
  {
    ...coinPrices.usdt,
    // USDT: 0% change - perfectly stable line (stablecoin)
    sparklineData: [50, 50.01, 49.99, 50, 50.01, 49.99, 50, 50.01, 49.99, 50, 50.01, 49.99, 50, 50, 50.01, 49.99, 50, 50, 50, 50],
  },
  {
    ...coinPrices.bnb,
    // BNB: Down 1.20% - smooth mild declining trend
    sparklineData: [48, 48.2, 47.6, 47.8, 47.1, 46.9, 46.3, 46.5, 45.8, 45.6, 44.9, 45.1, 44.4, 44.6, 43.8, 44.0, 43.2, 43.4, 42.6, 42.1],
  },
  {
    ...coinPrices.sol,
    // SOL: Up 5.80% - smooth strong upward movement
    sparklineData: [35, 35.8, 36.9, 37.2, 38.1, 39.4, 40.8, 42.3, 43.9, 45.6, 47.2, 49.1, 50.8, 52.6, 54.3, 56.2, 58.1, 60.3, 62.4, 64.2],
  },
];

// Export array format for CoinSelectionScreen compatibility
export const cryptoList = [
  coinPrices.btc,
  coinPrices.eth,
  coinPrices.usdt,
  coinPrices.bch,
  coinPrices.ltc,
  coinPrices.xrp,
];

// Helper function to get coin by symbol
export const getCoinBySymbol = (symbol) => {
  return Object.values(coinPrices).find(coin => coin.symbol.toLowerCase() === symbol.toLowerCase());
};

// Helper function to get coin by id
export const getCoinById = (id) => {
  return coinPrices[id];
};