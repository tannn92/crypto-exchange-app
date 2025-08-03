import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Line, Path, Circle, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import CoinIcon from '../components/CoinIcon';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 40;
const chartHeight = 200;
const volumeChartHeight = 60;

// Mock candlestick data generator
const generateCandlestickData = (basePrice, timeframe, count = 50) => {
  const data = [];
  let currentPrice = basePrice;
  const volatility = basePrice * 0.02; // 2% volatility
  
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * volatility;
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.random() * 1000000 + 500000;
    
    data.push({
      timestamp: Date.now() - (count - i) * getTimeframeMs(timeframe),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: parseFloat(volume.toFixed(0)),
    });
    
    currentPrice = close;
  }
  
  return data;
};

const getTimeframeMs = (timeframe) => {
  const map = {
    '1m': 1 * 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000,
  };
  return map[timeframe] || 60 * 60 * 1000;
};

// Calculate technical indicators
const calculateSMA = (data, period) => {
  const sma = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, curr) => acc + curr.close, 0);
    sma.push(sum / period);
  }
  return sma;
};

const calculateEMA = (data, period) => {
  const ema = [];
  const multiplier = 2 / (period + 1);
  
  // Start with SMA for first value
  ema[0] = data.slice(0, period).reduce((acc, curr) => acc + curr.close, 0) / period;
  
  for (let i = 1; i < data.length - period + 1; i++) {
    ema[i] = (data[i + period - 1].close * multiplier) + (ema[i - 1] * (1 - multiplier));
  }
  
  return ema;
};

const calculateBollingerBands = (data, period = 20, stdDev = 2) => {
  const sma = calculateSMA(data, period);
  const bands = { upper: [], middle: sma, lower: [] };
  
  for (let i = 0; i < sma.length; i++) {
    const slice = data.slice(i, i + period);
    const variance = slice.reduce((acc, curr) => acc + Math.pow(curr.close - sma[i], 2), 0) / period;
    const stdDeviation = Math.sqrt(variance);
    
    bands.upper.push(sma[i] + (stdDev * stdDeviation));
    bands.lower.push(sma[i] - (stdDev * stdDeviation));
  }
  
  return bands;
};

// Candlestick Chart Component
const CandlestickChart = ({ data, theme, indicators }) => {
  if (!data || data.length === 0) return null;
  
  const maxPrice = Math.max(...data.map(d => d.high));
  const minPrice = Math.min(...data.map(d => d.low));
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1;
  const adjustedMax = maxPrice + padding;
  const adjustedMin = minPrice - padding;
  const adjustedRange = adjustedMax - adjustedMin;
  
  const candleWidth = (chartWidth - 60) / data.length;
  
  const getY = (price) => 30 + ((adjustedMax - price) / adjustedRange) * (chartHeight - 60);
  const getX = (index) => 30 + (index * candleWidth) + (candleWidth / 2);
  
  // Calculate technical indicators
  const sma5 = calculateSMA(data, 5);
  const sma20 = calculateSMA(data, 20);
  const ema10 = calculateEMA(data, 10);
  const bollinger = calculateBollingerBands(data, 20, 2);
  
  return (
    <View style={styles.chartContainer}>
      <Svg width={chartWidth} height={chartHeight}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = 30 + ratio * (chartHeight - 60);
          const price = adjustedMax - (ratio * adjustedRange);
          return (
            <React.Fragment key={i}>
              <Line
                x1="30"
                y1={y}
                x2={chartWidth - 30}
                y2={y}
                stroke={theme.isDarkMode ? '#2A2A2A' : '#F0F0F0'}
                strokeWidth="1"
              />
              <SvgText
                x="25"
                y={y + 3}
                fontSize="9"
                fill={theme.textSecondary}
                textAnchor="end"
              >
                {price.toFixed(0)}
              </SvgText>
            </React.Fragment>
          );
        })}
        
        {/* Bollinger Bands */}
        {indicators.bollinger && bollinger.upper.length > 0 && (
          <React.Fragment>
            <Path
              d={`M ${getX(data.length - bollinger.upper.length)} ${getY(bollinger.upper[0])} ${bollinger.upper.map((price, i) => 
                `L ${getX(data.length - bollinger.upper.length + i)} ${getY(price)}`
              ).join(' ')}`}
              fill="none"
              stroke={theme.isDarkMode ? '#8B5CF6' : '#A855F7'}
              strokeWidth="1"
              opacity="0.6"
            />
            <Path
              d={`M ${getX(data.length - bollinger.lower.length)} ${getY(bollinger.lower[0])} ${bollinger.lower.map((price, i) => 
                `L ${getX(data.length - bollinger.lower.length + i)} ${getY(price)}`
              ).join(' ')}`}
              fill="none"
              stroke={theme.isDarkMode ? '#8B5CF6' : '#A855F7'}
              strokeWidth="1"
              opacity="0.6"
            />
          </React.Fragment>
        )}
        
        {/* Moving Averages */}
        {indicators.sma && sma20.length > 0 && (
          <Path
            d={`M ${getX(data.length - sma20.length)} ${getY(sma20[0])} ${sma20.map((price, i) => 
              `L ${getX(data.length - sma20.length + i)} ${getY(price)}`
            ).join(' ')}`}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.5"
            opacity="0.8"
          />
        )}
        
        {indicators.ema && ema10.length > 0 && (
          <Path
            d={`M ${getX(data.length - ema10.length)} ${getY(ema10[0])} ${ema10.map((price, i) => 
              `L ${getX(data.length - ema10.length + i)} ${getY(price)}`
            ).join(' ')}`}
            fill="none"
            stroke="#10B981"
            strokeWidth="1.5"
            opacity="0.8"
          />
        )}
        
        {/* Candlesticks */}
        {data.map((candle, index) => {
          const x = getX(index);
          const openY = getY(candle.open);
          const closeY = getY(candle.close);
          const highY = getY(candle.high);
          const lowY = getY(candle.low);
          
          const isGreen = candle.close > candle.open;
          const bodyHeight = Math.abs(closeY - openY);
          const bodyY = Math.min(openY, closeY);
          
          return (
            <React.Fragment key={index}>
              {/* Wick */}
              <Line
                x1={x}
                y1={highY}
                x2={x}
                y2={lowY}
                stroke={isGreen ? '#16C784' : '#EA3943'}
                strokeWidth="1"
              />
              {/* Body */}
              <Rect
                x={x - candleWidth * 0.3}
                y={bodyY}
                width={candleWidth * 0.6}
                height={Math.max(bodyHeight, 1)}
                fill={isGreen ? '#16C784' : '#EA3943'}
                opacity={isGreen ? 0.8 : 1}
              />
            </React.Fragment>
          );
        })}
        
        {/* Current price line */}
        {data.length > 0 && (
          <React.Fragment>
            <Line
              x1="30"
              y1={getY(data[data.length - 1].close)}
              x2={chartWidth - 30}
              y2={getY(data[data.length - 1].close)}
              stroke="#FF6B00"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
            <Circle
              cx={chartWidth - 40}
              cy={getY(data[data.length - 1].close)}
              r="3"
              fill="#FF6B00"
            />
          </React.Fragment>
        )}
      </Svg>
    </View>
  );
};

// Volume Chart Component
const VolumeChart = ({ data, theme }) => {
  if (!data || data.length === 0) return null;
  
  const maxVolume = Math.max(...data.map(d => d.volume));
  const currentVolume = data[data.length - 1]?.volume || 0;
  const barWidth = (chartWidth - 60) / data.length;
  
  // Calculate volume moving averages
  const volumeMA5 = data.length >= 5 ? 
    data.slice(-5).reduce((sum, candle) => sum + candle.volume, 0) / 5 : 0;
  const volumeMA10 = data.length >= 10 ? 
    data.slice(-10).reduce((sum, candle) => sum + candle.volume, 0) / 10 : 0;
  
  const formatVolume = (volume) => {
    if (volume >= 1e9) {
      return (volume / 1e9).toFixed(5);
    } else if (volume >= 1e6) {
      return (volume / 1e6).toFixed(5);
    } else if (volume >= 1e3) {
      return (volume / 1e3).toFixed(2);
    }
    return volume.toFixed(0);
  };
  
  const formatVolumeDisplay = (volume) => {
    if (volume >= 1e6) {
      return (volume / 1e6).toFixed(2) + 'M';
    } else if (volume >= 1e3) {
      return (volume / 1e3).toFixed(2) + 'K';
    }
    return volume.toFixed(0);
  };
  
  return (
    <View style={styles.volumeContainer}>
      {/* Volume Indicators - Binance Style */}
      <View style={styles.volumeIndicators}>
        <View style={styles.volumeLeft}>
          <Text style={[styles.volumeText, { color: theme.textSecondary }]}>
            Vol: {formatVolume(currentVolume)}
          </Text>
          <Text style={[styles.volumeMA, { color: '#F59E0B' }]}>
            MA(5): {formatVolume(volumeMA5)}
          </Text>
          <Text style={[styles.volumeMA, { color: '#8B5CF6' }]}>
            MA(10): {formatVolume(volumeMA10)}
          </Text>
        </View>
        <Text style={[styles.volumeValue, { color: theme.textSecondary }]}>
          {formatVolumeDisplay(currentVolume)}
        </Text>
      </View>
      
      <Svg width={chartWidth} height={volumeChartHeight}>
        {data.map((candle, index) => {
          const x = 30 + (index * barWidth);
          const height = (candle.volume / maxVolume) * (volumeChartHeight - 20);
          const y = volumeChartHeight - height - 10;
          const isGreen = candle.close > candle.open;
          
          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={barWidth * 0.8}
              height={height}
              fill={isGreen ? '#16C784' : '#EA3943'}
              opacity="0.7"
            />
          );
        })}
      </Svg>
    </View>
  );
};

const CoinMarketScreen = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();
  const { coin } = route.params || {};
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('4h');
  const [candlestickData, setCandlestickData] = useState([]);
  const [indicators, setIndicators] = useState({
    sma: true,
    ema: true,
    bollinger: true,
  });
  
  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M'];
  
  // Mock market data
  const marketData = {
    high24h: coin?.price ? coin.price * 1.08 : 114063.49,
    low24h: coin?.price ? coin.price * 0.95 : 111920.00,
    volume24hBTC: 12182.56,
    volume24hUSDT: 1.38e9,
    priceChange24h: coin?.change || -0.59,
    marketCap: 2969426426.08,
  };
  
  useEffect(() => {
    if (coin?.price) {
      const data = generateCandlestickData(coin.price, selectedTimeframe);
      setCandlestickData(data);
    }
  }, [coin, selectedTimeframe]);
  
  const showComingSoon = (featureName) => {
    Alert.alert(
      'Coming Soon',
      `${featureName} feature will be available soon!`,
      [{ text: 'OK', style: 'default' }],
      { cancelable: true }
    );
  };
  
  if (!coin) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.textPrimary }]}>
          No coin data available
        </Text>
      </SafeAreaView>
    );
  }
  
  const handleBuy = () => {
    navigation.navigate('BuyFlow', {
      screen: 'BuyAmount',
      params: { coin }
    });
  };
  
  const handleSell = () => {
    navigation.navigate('SellFlow', {
      screen: 'SellAmount', 
      params: { coin }
    });
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        
        <Text style={[styles.coinPair, { color: theme.textPrimary }]}>
          {coin.symbol}/USDT
        </Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={() => showComingSoon('Filter')} 
            style={styles.filterButton}
          >
            <Ionicons name="options-outline" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Price & Stats Card */}
        <View style={[styles.priceCard, { backgroundColor: theme.backgroundCard }]}>
          <Text style={[styles.currentPrice, { color: theme.textPrimary }]}>
            ${coin.price < 10 
              ? coin.price.toLocaleString('en-US', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4 
                })
              : coin.price.toLocaleString('en-US', { 
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0 
                })
            }
          </Text>
          
          <View style={styles.marketStats}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>24h High</Text>
                <Text style={[styles.statValue, { color: theme.textPrimary }]}>
                  ${coin.price < 10 
                    ? marketData.high24h.toFixed(4)
                    : marketData.high24h.toLocaleString('en-US', { maximumFractionDigits: 0 })
                  }
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>24h Vol({coin.symbol})</Text>
                <Text style={[styles.statValue, { color: theme.textPrimary }]}>
                  {marketData.volume24hBTC.toLocaleString('en-US')}
                </Text>
              </View>
            </View>
            
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>24h Low</Text>
                <Text style={[styles.statValue, { color: theme.textPrimary }]}>
                  ${coin.price < 10 
                    ? marketData.low24h.toFixed(4)
                    : marketData.low24h.toLocaleString('en-US', { maximumFractionDigits: 0 })
                  }
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>24h Vol(USDT)</Text>
                <Text style={[styles.statValue, { color: theme.textPrimary }]}>
                  {(marketData.volume24hUSDT / 1e9).toFixed(2)}B
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Chart Card */}
        <View style={[styles.chartCard, { backgroundColor: theme.backgroundCard }]}>
          {/* Timeframe Controls */}
          <View style={styles.timeframeContainer}>
            <View style={styles.timeframeLeft}>
              <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Time</Text>
              {timeframes.map((tf) => (
                <TouchableOpacity
                  key={tf}
                  style={[
                    styles.timeframeButton,
                    selectedTimeframe === tf && styles.activeTimeframe,
                    selectedTimeframe === tf && { backgroundColor: theme.primary }
                  ]}
                  onPress={() => setSelectedTimeframe(tf)}
                >
                  <Text style={[
                    styles.timeframeText,
                    { color: selectedTimeframe === tf ? '#FFF' : theme.textSecondary }
                  ]}>
                    {tf}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Technical Indicators */}
          <View style={styles.indicatorContainer}>
            <Text style={[styles.indicatorText, { color: '#F59E0B' }]}>
              BOLL:(20, 2)  UP: 119,143.44  MB: 115,032.42  DN: 110,921.49
            </Text>
            <Text style={[styles.priceIndicator, { color: theme.textSecondary }]}>
              120,133.35
            </Text>
          </View>
          
          {/* Main Chart */}
          <CandlestickChart 
            data={candlestickData} 
            theme={theme} 
            indicators={indicators}
          />
          
          {/* Volume Chart */}
          <VolumeChart data={candlestickData} theme={theme} />
          
        </View>
        
        {/* Performance Card */}
        <View style={[styles.performanceCard, { backgroundColor: theme.backgroundCard }]}>
          <View style={styles.performanceGrid}>
            <View style={styles.performanceItem}>
              <Text style={[styles.performanceLabel, { color: theme.textSecondary }]}>Today</Text>
              <Text style={[styles.performanceValue, { color: '#16C784' }]}>0.14%</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={[styles.performanceLabel, { color: theme.textSecondary }]}>7 Days</Text>
              <Text style={[styles.performanceValue, { color: '#EA3943' }]}>-3.99%</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={[styles.performanceLabel, { color: theme.textSecondary }]}>30 Days</Text>
              <Text style={[styles.performanceValue, { color: '#16C784' }]}>3.73%</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={[styles.performanceLabel, { color: theme.textSecondary }]}>90 Days</Text>
              <Text style={[styles.performanceValue, { color: '#16C784' }]}>18.89%</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={[styles.performanceLabel, { color: theme.textSecondary }]}>180 Days</Text>
              <Text style={[styles.performanceValue, { color: '#16C784' }]}>15.05%</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={[styles.performanceLabel, { color: theme.textSecondary }]}>1 Year</Text>
              <Text style={[styles.performanceValue, { color: '#16C784' }]}>86.61%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={handleBuy}
          >
            <Text style={styles.primaryButtonText}>Buy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryButton, { backgroundColor: theme.backgroundForm, borderColor: theme.border }]}
            onPress={handleSell}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.textPrimary }]}>Sell</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  coinPair: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  filterButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  priceCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  marketStats: {
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeframeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeLabel: {
    fontSize: 12,
  },
  timeframeButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeTimeframe: {
    borderRadius: 4,
  },
  timeframeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  indicatorText: {
    fontSize: 10,
    flex: 1,
  },
  priceIndicator: {
    fontSize: 10,
  },
  chartContainer: {
    marginBottom: 8,
  },
  volumeContainer: {
    marginBottom: 12,
  },
  volumeIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 30,
  },
  volumeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volumeText: {
    fontSize: 10,
  },
  volumeMA: {
    fontSize: 10,
  },
  volumeValue: {
    fontSize: 10,
    minWidth: 40,
    textAlign: 'right',
  },
  performanceCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  performanceItem: {
    width: '32%',
    alignItems: 'center',
    marginBottom: 8,
  },
  performanceLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  performanceValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
});

export default CoinMarketScreen;