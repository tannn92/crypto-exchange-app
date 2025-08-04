import { Platform, Dimensions } from 'react-native';

/**
 * Utility functions to help handle safe areas and detect gesture navigation
 */

/**
 * Determines if the device likely has gesture navigation
 * This is a heuristic based on safe area insets
 * @param {Object} insets - Safe area insets from useSafeAreaInsets()
 * @returns {boolean} - True if device likely has gesture navigation
 */
export const hasGestureNavigation = (insets) => {
  if (Platform.OS === 'ios') {
    // iOS devices with Face ID or newer home indicator
    return insets.bottom > 0;
  } else {
    // Android devices with gesture navigation typically have bottom insets
    // Modern Android with gesture navigation usually has some bottom inset
    return insets.bottom > 0;
  }
};

/**
 * Determines if the device has a notch or camera cutout
 * @param {Object} insets - Safe area insets from useSafeAreaInsets()
 * @returns {boolean} - True if device has notch/cutout
 */
export const hasNotch = (insets) => {
  // Devices with notch/cutout typically have top insets > 20 (status bar height)
  const statusBarHeight = Platform.OS === 'ios' ? 20 : 24;
  return insets.top > statusBarHeight;
};

/**
 * Get safe padding values for a screen
 * @param {Object} insets - Safe area insets from useSafeAreaInsets()
 * @param {Object} options - Configuration options
 * @returns {Object} - Padding values for top, bottom, left, right
 */
export const getSafePadding = (insets, options = {}) => {
  const {
    includeTop = true,
    includeBottom = true,
    includeHorizontal = false,
    minBottomPadding = 5,
    minTopPadding = 0,
  } = options;

  return {
    paddingTop: includeTop ? Math.max(insets.top, minTopPadding) : 0,
    paddingBottom: includeBottom ? Math.max(insets.bottom, minBottomPadding) : 0,
    paddingLeft: includeHorizontal ? insets.left : 0,
    paddingRight: includeHorizontal ? insets.right : 0,
  };
};

/**
 * Get device info for debugging safe areas
 * @param {Object} insets - Safe area insets from useSafeAreaInsets()
 * @returns {Object} - Device information
 */
export const getDeviceInfo = (insets) => {
  const { width, height } = Dimensions.get('window');
  
  return {
    platform: Platform.OS,
    version: Platform.Version,
    dimensions: { width, height },
    insets,
    hasGestureNav: hasGestureNavigation(insets),
    hasNotch: hasNotch(insets),
  };
};

/**
 * Get optimal tab bar height for different devices
 * @param {Object} insets - Safe area insets from useSafeAreaInsets()
 * @returns {number} - Optimal tab bar height
 */
export const getTabBarHeight = (insets) => {
  const baseHeight = 50;
  const minHeight = 60;
  
  if (hasGestureNavigation(insets)) {
    // Add extra height for gesture navigation
    return Math.max(baseHeight + insets.bottom, minHeight);
  }
  
  return baseHeight;
};