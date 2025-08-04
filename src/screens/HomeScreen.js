import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import CoinIcon from '../components/CoinIcon';
import BalanceHeader from '../components/BalanceHeader';
import SafeAreaDebugger from '../components/SafeAreaDebugger';
import { cryptoData, coinPrices } from '../data/coinPrices';

const { width: screenWidth } = Dimensions.get('window');

// Custom SVG Icons
const BuyIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Path d="M12.9995 26.25C12.8095 26.25 12.6195 26.18 12.4695 26.03C12.1795 25.74 12.1795 25.26 12.4695 24.97L26.4695 10.97C26.7595 10.68 27.2395 10.68 27.5295 10.97C27.8195 11.26 27.8195 11.74 27.5295 12.03L13.5295 26.03C13.3795 26.18 13.1895 26.25 12.9995 26.25Z" fill="white"/>
    <Path d="M23.27 26.25H13C12.59 26.25 12.25 25.91 12.25 25.5V15.23C12.25 14.82 12.59 14.48 13 14.48C13.41 14.48 13.75 14.82 13.75 15.23V24.75H23.27C23.68 24.75 24.02 25.09 24.02 25.5C24.02 25.91 23.68 26.25 23.27 26.25Z" fill="white"/>
    <Path d="M28.5 30.75H11.5C11.09 30.75 10.75 30.41 10.75 30C10.75 29.59 11.09 29.25 11.5 29.25H28.5C28.91 29.25 29.25 29.59 29.25 30C29.25 30.41 28.91 30.75 28.5 30.75Z" fill="white"/>
  </Svg>
);

const SellIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 41 40" fill="none">
    <Path d="M29.25 30.75H12.25C11.84 30.75 11.5 30.41 11.5 30C11.5 29.59 11.84 29.25 12.25 29.25H29.25C29.66 29.25 30 29.59 30 30C30 30.41 29.66 30.75 29.25 30.75Z" fill="white"/>
    <Path d="M13.7475 26.25C13.9375 26.25 14.1275 26.18 14.2775 26.03L28.2775 12.03C28.5675 11.74 28.5675 11.26 28.2775 10.97C27.9875 10.68 27.5075 10.68 27.2175 10.97L13.2175 24.97C12.9275 25.26 12.9275 25.74 13.2175 26.03C13.3675 26.18 13.5575 26.25 13.7475 26.25Z" fill="white"/>
    <Path d="M27.7475 22.52C28.1575 22.52 28.4975 22.18 28.4975 21.77V11.5C28.4975 11.09 28.1575 10.75 27.7475 10.75H17.4775C17.0675 10.75 16.7275 11.09 16.7275 11.5C16.7275 11.91 17.0675 12.25 17.4775 12.25H26.9975V21.77C26.9975 22.18 27.3375 22.52 27.7475 22.52Z" fill="white"/>
  </Svg>
);

const ConvertIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 41 40" fill="none">
    <Path d="M25.9201 12.4099H13.8901L15.7701 10.53C16.0601 10.24 16.0601 9.75994 15.7701 9.46994C15.4801 9.17994 15.0001 9.17994 14.7101 9.46994L11.5501 12.63C11.4801 12.7 11.4301 12.78 11.3901 12.87C11.3501 12.96 11.3301 13.0599 11.3301 13.1599C11.3301 13.2599 11.3501 13.36 11.3901 13.45C11.4301 13.54 11.4801 13.62 11.5501 13.69L14.7101 16.8499C14.8601 16.9999 15.0501 17.07 15.2401 17.07C15.4301 17.07 15.6201 16.9999 15.7701 16.8499C16.0601 16.5599 16.0601 16.0799 15.7701 15.7899L13.8901 13.9099H25.9201C27.1601 13.9099 28.1701 14.9199 28.1701 16.1599V19.48C28.1701 19.89 28.5101 20.23 28.9201 20.23C29.3301 20.23 29.6701 19.89 29.6701 19.48V16.1599C29.6701 14.0899 27.9901 12.4099 25.9201 12.4099Z" fill="white"/>
    <Path d="M29.6701 26.84C29.6701 26.74 29.6501 26.64 29.6101 26.55C29.5701 26.46 29.5201 26.38 29.4501 26.31L26.2901 23.15C26.0001 22.86 25.5201 22.86 25.2301 23.15C24.9401 23.44 24.9401 23.92 25.2301 24.21L27.1101 26.09H15.0801C13.8401 26.09 12.8301 25.08 12.8301 23.84V20.52C12.8301 20.11 12.4901 19.77 12.0801 19.77C11.6701 19.77 11.3301 20.11 11.3301 20.52V23.84C11.3301 25.91 13.0101 27.59 15.0801 27.59H27.1101L25.2301 29.47C24.9401 29.76 24.9401 30.24 25.2301 30.53C25.3801 30.68 25.5701 30.75 25.7601 30.75C25.9501 30.75 26.1401 30.68 26.2901 30.53L29.4501 27.37C29.5201 27.3 29.5701 27.22 29.6101 27.13C29.6501 27.04 29.6701 26.94 29.6701 26.84Z" fill="white"/>
  </Svg>
);

const DepositIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 41 40" fill="none">
    <Path d="M28.25 19H21.25V12C21.25 11.4533 20.7967 11 20.25 11C19.7033 11 19.25 11.4533 19.25 12V19H12.25C11.7033 19 11.25 19.4533 11.25 20C11.25 20.5467 11.7033 21 12.25 21H19.25V28C19.25 28.5467 19.7033 29 20.25 29C20.7967 29 21.25 28.5467 21.25 28V21H28.25C28.7967 21 29.25 20.5467 29.25 20C29.25 19.4533 28.7967 19 28.25 19Z" fill="white"/>
  </Svg>
);


const WithdrawIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Path d="M21 19H28C28.5467 19 29 19.4533 29 20C29 20.5467 28.5467 21 28 21H21H19H12C11.4533 21 11 20.5467 11 20C11 19.4533 11.4533 19 12 19H19H21Z" fill="white"/>
  </Svg>
);

// Mini chart component for sparklines
const MiniChart = ({ data, color }) => {
  const chartWidth = 100;
  const chartHeight = 40;
  const padding = 5;

  if (!data || data.length === 0) {
    return <Svg width={chartWidth} height={chartHeight} />;
  }

  const validData = data.filter(v => typeof v === 'number' && !isNaN(v));
  if (validData.length === 0) {
    return <Svg width={chartWidth} height={chartHeight} />;
  }

  const max = Math.max(...validData);
  const min = Math.min(...validData);
  const range = max - min || 1;

  const points = validData.map((value, index) => {
    const x = (index / Math.max(validData.length - 1, 1)) * (chartWidth - padding * 2) + padding;
    const y = chartHeight - padding - ((value - min) / range) * (chartHeight - padding * 2);
    return { x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) };
  });

  // Create smooth curve using cubic bezier curves for maximum smoothness
  const createSmoothPath = (points) => {
    if (points.length < 2) {return '';}
    if (points.length === 2) {return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;}

    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = i < points.length - 1 ? points[i + 1] : curr;
      const prevPrev = i > 1 ? points[i - 2] : prev;

      // Control points for smooth cubic bezier
      const cp1x = prev.x + (curr.x - prevPrev.x) * 0.15;
      const cp1y = prev.y + (curr.y - prevPrev.y) * 0.15;
      const cp2x = curr.x - (next.x - prev.x) * 0.15;
      const cp2y = curr.y - (next.y - prev.y) * 0.15;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
    }

    return path;
  };

  const smoothPath = createSmoothPath(points);

  return (
    <Svg width={chartWidth} height={chartHeight}>
      <Path
        d={smoothPath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

// Balance chart component
const BalanceChart = ({ theme, currency, exchangeRate }) => {
  const [activeDot, setActiveDot] = useState(null);
  const [showDot, setShowDot] = useState(false);

  // Smooth balance chart data - scaled to represent growth from ~$1500 to $3243
  const chartData = [
    45, 46.2, 47.1, 46.8, 47.5, 48.2, 47.9, 48.8, 50.1, 51.3, 50.8, 52.4, 53.6, 54.2, 55.8,
    58.2, 60.1, 62.3, 64.8, 67.2, 69.8, 71.4, 73.9, 75.6, 77.8, 79.2, 81.5, 83.1, 84.8, 86.4,
    88.1, 89.6, 91.2, 92.8, 94.1, 95.7,
  ];
  const chartWidth = screenWidth - 40; // Adjust for card margins
  const chartHeight = 100;

  const validData = chartData.filter(v => typeof v === 'number' && !isNaN(v));
  if (validData.length === 0) {
    return <View style={styles.chartContainer} />;
  }

  const max = Math.max(...validData);
  const min = Math.min(...validData);
  const range = max - min || 1;

  const balancePoints = validData.map((value, index) => {
    const x = (index / Math.max(validData.length - 1, 1)) * chartWidth;
    const y = chartHeight - ((value - min) / range) * chartHeight;
    return { x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)), value };
  });

  // Create smooth curve for main balance chart
  const createSmoothBalancePath = (points) => {
    if (points.length < 2) {return '';}

    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      if (i === 1) {
        // First curve
        const cpx1 = prev.x + (curr.x - prev.x) * 0.3;
        const cpy1 = prev.y;
        const cpx2 = curr.x - (curr.x - prev.x) * 0.3;
        const cpy2 = curr.y;
        path += ` C ${cpx1},${cpy1} ${cpx2},${cpy2} ${curr.x},${curr.y}`;
      } else {
        // Subsequent curves
        const next = i < points.length - 1 ? points[i + 1] : curr;
        const cpx1 = prev.x + (curr.x - prev.x) * 0.6;
        const cpy1 = prev.y + (curr.y - prev.y) * 0.2;
        const cpx2 = curr.x - (next.x - prev.x) * 0.1;
        const cpy2 = curr.y - (next.y - prev.y) * 0.1;
        path += ` C ${cpx1},${cpy1} ${cpx2},${cpy2} ${curr.x},${curr.y}`;
      }
    }

    return path;
  };

  const pathData = createSmoothBalancePath(balancePoints);

  const areaPath = `${pathData} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;


  const formatValue = (value) => {
    const baseValue = 3243.00; // Base USDT value - updated to match real balance
    const scaledValue = baseValue * (value / 95.7); // Scale based on chart data max value

    if (currency === 'VND') {
      return `${(scaledValue * exchangeRate).toLocaleString('en-US', { maximumFractionDigits: 0 })} VND`;
    }
    return `${scaledValue.toFixed(2)} USDT`;
  };


  return (
    <View style={styles.chartContainer}>

      <View style={styles.chartTouchArea}>
        <View style={styles.chartSvgContainer}>
          <Svg width={chartWidth} height={chartHeight} style={styles.chartSvg}>
            <Defs>
              <SvgLinearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={theme.isDarkMode ? '#8BA0FF' : '#6B82FF'} stopOpacity="0.3" />
                <Stop offset="100%" stopColor={theme.isDarkMode ? '#8BA0FF' : '#6B82FF'} stopOpacity="0.02" />
              </SvgLinearGradient>
            </Defs>
            <Path
              d={areaPath}
              fill="url(#chartGradient)"
            />
            <Path
              d={pathData}
              fill="none"
              stroke={theme.isDarkMode ? '#8BA0FF' : '#6B82FF'}
              strokeWidth="2"
            />
            {/* Invisible touch areas for each data point */}
            {balancePoints.map((point, index) => (
              <Rect
                key={index}
                x={point.x - 15}
                y={0}
                width={30}
                height={chartHeight}
                fill="transparent"
                onPress={() => {
                  console.log('Point touched:', point, index);
                  setActiveDot({ ...point, index });
                  setShowDot(true);
                  setTimeout(() => {
                    setShowDot(false);
                    setActiveDot(null);
                  }, 4000);
                }}
              />
            ))}
            {showDot && activeDot && (
              <Circle
                cx={activeDot.x}
                cy={activeDot.y}
                r="4"
                fill="#FF6B00"
                stroke="#FFF"
                strokeWidth="2"
              />
            )}
          </Svg>
        </View>
        {showDot && activeDot && (
          <View style={[
            styles.chartLabel,
            {
              left: Math.min(Math.max(activeDot.x - 50, 10), chartWidth - 110),
              top: Math.max(activeDot.y - 45, 5),
              backgroundColor: theme.isDarkMode ? 'rgba(255, 107, 0, 0.95)' : 'rgba(255, 107, 0, 0.9)',
            },
          ]}>
            <Text style={[styles.chartLabelText, { color: '#FFF' }]}>
              {formatValue(activeDot.value)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Crypto item component
const CryptoItem = ({ item, theme, navigation }) => {
  const change = typeof item.change === 'number' ? item.change : 0;
  const price = typeof item.price === 'number' ? item.price : 0;
  const isPositive = change >= 0;

  const handleCoinPress = () => {
    navigation.navigate('CoinMarket', { coin: item });
  };

  return (
    <TouchableOpacity style={styles.cryptoItem} onPress={handleCoinPress}>
      <View style={styles.cryptoLeft}>
        <CoinIcon coinId={item.id} size={40} />
        <View style={styles.cryptoInfo}>
          <Text style={[styles.cryptoSymbol, { color: theme.textPrimary }]}>{item.symbol}</Text>
          <Text style={[styles.cryptoName, { color: theme.textSecondary }]}>{item.name}</Text>
        </View>
      </View>
      <View style={styles.cryptoCenter}>
        <MiniChart data={item.sparklineData} color={isPositive ? '#16C784' : '#EA3943'} />
      </View>
      <View style={styles.cryptoRight}>
        <Text style={[styles.cryptoPrice, { color: theme.textPrimary }]}>
          {price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        <Text style={[styles.cryptoChange, { color: isPositive ? '#16C784' : '#EA3943' }]}>
          {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation, route }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('popular');
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [currency, setCurrency] = useState('USDT');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const exchangeRate = 26300; // 1 USDT = 26,300 VND
  const baseBalance = 3243.00;
  const baseChange = 43.96;
  const baseChangePercent = 1.47;


  const quickActions = [
    { id: 'buy', label: 'Buy', iconComponent: BuyIcon },
    { id: 'sell', label: 'Sell', iconComponent: SellIcon },
    { id: 'convert', label: 'Convert', iconComponent: ConvertIcon },
    { id: 'deposit', label: 'Deposit', iconComponent: DepositIcon },
    { id: 'withdraw', label: 'Withdraw', iconComponent: WithdrawIcon },
  ];

  const handleQuickAction = (action) => {
    // Default BTC coin for Buy and Sell
    const defaultBTCCoin = coinPrices.btc;

    if (action === 'buy') {
      navigation.navigate('BuyFlow', {
        screen: 'BuyAmount',
        params: { coin: defaultBTCCoin },
      });
    } else if (action === 'sell') {
      navigation.navigate('SellFlow', {
        screen: 'SellAmount',
        params: { coin: defaultBTCCoin },
      });
    } else if (action === 'convert') {
      navigation.navigate('ConvertFlow', {
        screen: 'Convert',
      });
    } else if (action === 'deposit') {
      navigation.navigate('DepositFlow', {
        screen: 'Deposit',
      });
    } else if (action === 'withdraw') {
      navigation.navigate('WithdrawMethodSelectionModal', {
        coin: { id: 'usdt', symbol: 'USDT', name: 'Tether' },
      });
    } else {
      console.log(`${action} pressed`);
    }
  };

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  const formatBalance = (amount) => {
    if (!balanceVisible) {
      return '*********';
    }

    if (currency === 'VND') {
      return (amount * exchangeRate).toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatChange = (amount, percent) => {
    if (!balanceVisible) {
      return '****** (****)';
    }

    const formattedAmount = currency === 'VND'
      ? (amount * exchangeRate).toLocaleString('en-US', { maximumFractionDigits: 0 })
      : amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const currencySymbol = currency === 'VND' ? '' : '$';
    const currencyLabel = currency === 'VND' ? ' VND' : '';

    return `${currencySymbol}${formattedAmount}${currencyLabel} (${percent.toFixed(2)}%)`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileMenu')}>
            <Ionicons name="person-circle-outline" size={28} color="#FF6B00" />
          </TouchableOpacity>
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={[styles.logoText, { color: theme.textPrimary }]}>CRYPTOVN</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons
              name={isDarkMode ? 'sunny' : 'moon'}
              size={24}
              color={theme.textPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notification')}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.textPrimary} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: theme.backgroundCard }]}>
          <BalanceHeader
            currency={currency}
            setCurrency={setCurrency}
            showCurrencyDropdown={showCurrencyDropdown}
            setShowCurrencyDropdown={setShowCurrencyDropdown}
            totalBalance={baseBalance}
            balanceVisible={balanceVisible}
            toggleBalanceVisibility={toggleBalanceVisibility}
            balanceChange={baseChange}
            balanceChangePercent={baseChangePercent}
            formatBalance={formatBalance}
            formatChange={formatChange}
          />

          <BalanceChart theme={{ ...theme, isDarkMode }} currency={currency} exchangeRate={exchangeRate} />

          {/* Quick Actions inside balance card - no separator line */}
          <View style={styles.quickActionsInCard}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionButton}
                onPress={() => handleQuickAction(action.id)}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: theme.primary }]}>
                  <action.iconComponent size={32} />
                </View>
                <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Crypto List */}
        <View style={[styles.cryptoSection, { backgroundColor: theme.backgroundCard }]}>
          <View style={styles.cryptoTabs}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'popular' && styles.activeTab,
                activeTab === 'popular' && { borderBottomColor: theme.primary },
              ]}
              onPress={() => setActiveTab('popular')}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === 'popular' ? theme.tabActive : theme.tabInactive },
              ]}>
                Popular
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'all' && styles.activeTab,
                activeTab === 'all' && { borderBottomColor: theme.primary },
              ]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === 'all' ? theme.tabActive : theme.tabInactive },
              ]}>
                All coins
              </Text>
            </TouchableOpacity>
          </View>

          {cryptoData.map((item) => (
            <CryptoItem key={item.id} item={item} theme={theme} navigation={navigation} />
          ))}
        </View>

        {/* Contest Section */}
        <View style={[styles.contestSection, { backgroundColor: '#FFF4E6' }]}>
          <View style={styles.contestContent}>
            <Text style={styles.contestTitle}>Bank-grade security,</Text>
            <Text style={styles.contestSubtitle}>100% Protected</Text>
          </View>
          <View style={styles.contestIcon}>
            <Ionicons name="shield-checkmark" size={40} color="#FF6B00" />
          </View>
        </View>

      </ScrollView>
      
      {/* Debug component - remove in production */}
      <SafeAreaDebugger visible={__DEV__} />
    </View>
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
  headerLeft: {
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 15,
    flex: 1,
  },
  themeToggle: {
    padding: 5,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  balanceCard: {
    margin: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 5,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'visible',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  balanceChange: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  chartContainer: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 0,
    height: 120,
    width: '100%',
  },
  chartTouchArea: {
    flex: 1,
    position: 'relative',
  },
  chartSvgContainer: {
    flex: 1,
  },
  chartSvg: {
    alignSelf: 'center',
  },
  chartLabel: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chartLabelText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActionsInCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 10,
    marginTop: 5,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 12,
  },
  cryptoSection: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cryptoTabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    marginRight: 20,
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
  },
  cryptoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  cryptoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cryptoInfo: {
    marginLeft: 12,
  },
  cryptoSymbol: {
    fontSize: 16,
    fontWeight: '600',
  },
  cryptoName: {
    fontSize: 12,
  },
  cryptoCenter: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cryptoRight: {
    alignItems: 'flex-end',
  },
  cryptoPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  cryptoChange: {
    fontSize: 12,
    marginTop: 2,
  },
  contestSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contestContent: {
    flex: 1,
  },
  contestTitle: {
    fontSize: 16,
    color: '#333',
  },
  contestSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  contestIcon: {
    marginLeft: 20,
  },
  currencyDropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    minWidth: 120,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  activeCurrencyOption: {
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
  },
  currencyOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen;
