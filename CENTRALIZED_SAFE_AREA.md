# Centralized Safe Area Handling

This app now uses a **centralized approach** to handle safe areas across all screens, eliminating code duplication and making maintenance much easier.

## How It Works

### 1. ScreenWrapper Component (`src/components/ScreenWrapper.js`)
- **Universal wrapper** that handles safe areas for all screens
- **Automatic detection** of modals vs regular screens
- **StatusBar management** with proper theming
- **Consistent background colors** across all screens

### 2. Navigation-Level Integration (`src/navigation/AppNavigator.js`)
- **`wrapWithSafeArea()` helper** function applies ScreenWrapper to all screens
- **Automatic wrapping** at the navigator level - no individual screen changes needed
- **Modal detection** - different safe area handling for modal vs regular screens
- **Zero code duplication** across 50+ screens in the app

### 3. Tab Navigation (`src/navigation/BottomTabNavigator.js`)
- **Tab screens** get special treatment with ScreenWrapper
- **Bottom safe area** handled by tab bar itself
- **Top safe area** handled by ScreenWrapper

## Benefits

### ✅ No Code Duplication
- **Before**: Every screen needed individual safe area imports and setup
- **After**: Handled once at navigation level, applied everywhere

### ✅ Consistent Behavior
- **All screens** get identical safe area handling
- **StatusBar** automatically themed across the app
- **Modal screens** get appropriate bottom padding

### ✅ Easy Maintenance
- **Single point of control** for safe area logic
- **Easy to update** safe area behavior across entire app
- **No missed screens** - impossible to forget safe area handling

### ✅ Modern Device Support
- **Android gesture navigation** (Oppo Find X8, etc.)
- **iOS Face ID** devices with home indicator
- **Notches and camera cutouts** on all platforms
- **Curved edges** and other display variations

## Implementation

### All Screens Automatically Wrapped
Every screen in the app is now automatically wrapped:

```javascript
// In AppNavigator.js - automatically applied to ALL screens
<Stack.Screen name="BuyAmount" component={wrapWithSafeArea(BuyAmountScreen)} />
<Stack.Screen name="SellAmount" component={wrapWithSafeArea(SellAmountScreen)} />
// ... all 50+ screens
```

### Modal Screens Get Special Treatment
```javascript
// Modal screens get bottom padding too
<Stack.Screen 
  name="ConvertConfirmation" 
  component={wrapWithSafeArea(ConvertConfirmationScreen, { isModal: true })}
  options={{ presentation: 'transparentModal' }}
/>
```

### Individual Screens Stay Clean
```javascript
// HomeScreen.js - NO safe area code needed!
const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      {/* Just focus on your screen content */}
    </View>
  );
};
```

## Screen Types

### Regular Screens
- **Navigation screens** (Buy, Sell, Convert flows)
- **Tab screens** (Home, Assets, History)
- **Detail screens** (Coin details, Transaction details)

**Safe Area Handling**: Top padding only (tab bar handles bottom)

### Modal Screens
- **Confirmation modals** (transparentModal presentation)
- **Selection modals** (modal presentation)
- **Overlay screens**

**Safe Area Handling**: Top AND bottom padding

### Full Screen Screens
- **Video players**
- **Camera interfaces**
- **Games**

**Safe Area Handling**: None (pass `_isFullScreen: true` in route params)

## Debug Tools

The `SafeAreaDebugger` component shows real-time safe area information:

```javascript
// Only visible in development
<SafeAreaDebugger visible={__DEV__} />
```

Shows:
- Platform and version
- Screen dimensions  
- Safe area insets
- Gesture navigation detection
- Notch/cutout detection

## Migration Complete

✅ **All 50+ screens** in the app now have consistent safe area handling  
✅ **Zero individual screen changes** required for safe areas  
✅ **Modern device support** for Android gesture navigation and iOS Face ID  
✅ **Clean, maintainable code** with single point of control  

The app now handles safe areas properly on:
- **iPhone X, 11, 12, 13, 14, 15** series (Face ID + home indicator)
- **Android gesture navigation** devices (Oppo Find X8, Samsung S-series, etc.)
- **Devices with notches** and camera cutouts
- **Regular devices** with traditional navigation

All without any per-screen safe area code!