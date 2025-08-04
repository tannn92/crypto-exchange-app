# Safe Area Handling Guide

This guide explains how to properly handle safe areas for modern mobile devices, including Android devices with gesture navigation and cameras/notches.

## Overview

Modern mobile devices have various screen configurations:
- **iPhone X and newer**: Face ID, home indicator (gesture navigation)
- **Android with gesture navigation**: Home gesture area at bottom (like Oppo Find X8)
- **Devices with notches/cutouts**: Camera cutouts, punch holes, etc.

## Components and Utilities

### 1. SafeAreaHelper (`src/utils/SafeAreaHelper.js`)

Utility functions to detect and handle different device configurations:

```javascript
import { hasGestureNavigation, hasNotch, getSafePadding, getTabBarHeight } from '../utils/SafeAreaHelper';

// Check if device has gesture navigation
const hasGestures = hasGestureNavigation(insets);

// Check if device has notch/cutout
const hasDeviceNotch = hasNotch(insets);

// Get safe padding values
const padding = getSafePadding(insets, {
  includeTop: true,
  includeBottom: true,
  minBottomPadding: 8
});
```

### 2. SafeScreen Component (`src/components/SafeScreen.js`)

A wrapper component that replaces `SafeAreaView` with more control:

```javascript
import SafeScreen from '../components/SafeScreen';

const MyScreen = () => (
  <SafeScreen includeTop={true} includeBottom={false}>
    {/* Your screen content */}
  </SafeScreen>
);
```

### 3. SafeAreaDebugger (`src/components/SafeAreaDebugger.js`)

Debug component to visualize safe area information during development:

```javascript
import SafeAreaDebugger from '../components/SafeAreaDebugger';

// Shows debug info only in development
<SafeAreaDebugger visible={__DEV__} />
```

## Implementation Examples

### Tab Bar with Gesture Navigation Support

```javascript
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hasGestureNavigation, getTabBarHeight } from '../utils/SafeAreaHelper';

const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const hasGestures = hasGestureNavigation(insets);
  const tabBarHeight = getTabBarHeight(insets);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: tabBarHeight,
          paddingBottom: hasGestures ? Math.max(insets.bottom - 5, 8) : 8,
          // Add elevation for Android gesture nav
          ...(hasGestures && Platform.OS === 'android' && {
            elevation: 8,
          }),
        },
      }}
    >
      {/* Tab screens */}
    </Tab.Navigator>
  );
};
```

### Screen with Safe Areas

```javascript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MyScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,        // Handle notch/status bar
      paddingBottom: insets.bottom,  // Handle home indicator/gesture area
    }}>
      {/* Screen content */}
    </View>
  );
};
```

## Device-Specific Considerations

### Android Gesture Navigation
- **Bottom inset > 0**: Device likely has gesture navigation
- **Minimum padding**: Always provide at least 8-10px bottom padding
- **Visual feedback**: Consider adding subtle elevation/shadow

### iOS Face ID Devices
- **Bottom inset = 34px**: Home indicator area
- **Top inset > 44px**: Status bar + Face ID area
- **Handle both portrait and landscape**

### Notch/Cutout Detection
- **Top inset > status bar height**: Device likely has notch/cutout
- **Status bar height**: ~20px iOS, ~24px Android
- **Content positioning**: Avoid placing critical UI in cutout areas

## Testing

### Using SafeAreaDebugger

Add the debug component to any screen to see real-time safe area information:

```javascript
<SafeAreaDebugger visible={true} />
```

This shows:
- Platform and version
- Screen dimensions
- Safe area insets (top, bottom, left, right)
- Gesture navigation detection
- Notch/cutout detection

### Testing on Different Devices

1. **iPhone with Face ID**: Check home indicator handling
2. **Android with gestures**: Test gesture area padding
3. **Devices with notches**: Verify content doesn't overlap
4. **Regular devices**: Ensure normal padding still works

## Migration from SafeAreaView

Replace existing `SafeAreaView` usage:

```javascript
// Before (limited control)
<SafeAreaView style={styles.container}>
  <View>Content</View>
</SafeAreaView>

// After (full control)
<View style={[styles.container, {
  paddingTop: insets.top,
  paddingBottom: insets.bottom,
}]}>
  <View>Content</View>
</View>

// Or use SafeScreen component
<SafeScreen>
  <View>Content</View>
</SafeScreen>
```

## Best Practices

1. **Always test on real devices** with different configurations
2. **Use useSafeAreaInsets** instead of SafeAreaView for better control
3. **Provide minimum padding** even when insets are 0
4. **Consider landscape orientation** for devices with notches
5. **Add visual feedback** (elevation, shadows) for gesture navigation areas
6. **Debug with SafeAreaDebugger** during development

## Common Patterns

### Modal/Overlay Positioning
```javascript
const modalStyle = {
  position: 'absolute',
  top: insets.top + 20,        // Below status bar/notch
  bottom: insets.bottom + 20,  // Above gesture area
  left: insets.left + 20,      // Account for curved edges
  right: insets.right + 20,
};
```

### Header with Back Button
```javascript
const headerStyle = {
  paddingTop: insets.top,
  height: 44 + insets.top,     // Standard header + safe area
  paddingHorizontal: Math.max(insets.left, 16),
};
```

This approach ensures your app looks great on all modern Android and iOS devices with proper safe area handling.