import React, { useRef, useEffect } from 'react';
import {
  View,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, { Defs, Mask, Rect } from 'react-native-svg';
import OnboardingArrowHint from './OnboardingArrowHint';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const ActionButtonHighlight = ({ 
  visible, 
  step, 
  onBackgroundPress,
  showBuyArrow = false,
  showDepositArrow = false,
  includeTabButtonSpotlight = false,
  tabButtonPosition = { x: 0, y: 0 }
}) => {
  if (!visible) return null;

  const statusBarHeight = Platform.OS === 'ios' ? 47 : 24;
  
  // Calculate spotlight area for the 5 action buttons
  const spotlightY = 365 + statusBarHeight;
  const spotlightHeight = 100;
  const cardMargin = 20;
  const cardPadding = 20;
  const spotlightX = cardMargin + cardPadding;
  const spotlightWidth = screenWidth - (2 * cardMargin) - (2 * cardPadding);
  const borderRadius = 16;

  // Calculate individual button positions more accurately
  // The buttons have margins between them, so we need to account for that
  const buttonSize = 50; // Button diameter
  const totalButtonsWidth = buttonSize * 5; // 5 buttons
  const totalSpacing = spotlightWidth - totalButtonsWidth;
  const spaceBetweenButtons = totalSpacing / 6; // 6 spaces (before first, between buttons, after last)
  
  // Button center positions (more accurate calculation)
  const getButtonPosition = (buttonIndex) => {
    const buttonCenterX = spotlightX + spaceBetweenButtons + (buttonIndex * (buttonSize + spaceBetweenButtons)) + (buttonSize / 2);
    return {
      x: buttonCenterX,
      y: spotlightY + (spotlightHeight / 2)
    };
  };

  // Button positions: 0=Buy, 1=Sell, 2=Convert, 3=Deposit, 4=Withdraw
  const buyButton = getButtonPosition(0);
  const depositButton = getButtonPosition(3);

  return (
    <>
      {/* Touchable overlay for any press - must be before SVG */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: screenWidth,
          height: screenHeight,
          backgroundColor: 'transparent',
          zIndex: 1000,
        }}
        onTouchEnd={onBackgroundPress}
      />

      {/* SVG Mask for Action Buttons Spotlight */}
      <Svg
        width={screenWidth}
        height={screenHeight}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 999 }}
        pointerEvents="none"
      >
        <Defs>
          <Mask id="actionButtonsMask">
            <Rect width={screenWidth} height={screenHeight} fill="white" />
            <Rect
              x={spotlightX}
              y={spotlightY}
              width={spotlightWidth}
              height={spotlightHeight}
              rx={borderRadius}
              ry={borderRadius}
              fill="black"
            />
            {/* Add tab button spotlight if needed */}
            {includeTabButtonSpotlight && (
              <Rect
                x={tabButtonPosition.x}
                y={tabButtonPosition.y}
                width={60}
                height={60}
                rx={30}
                ry={30}
                fill="black"
              />
            )}
          </Mask>
        </Defs>
        <Rect
          width={screenWidth}
          height={screenHeight}
          fill="rgba(0, 0, 0, 0.85)"
          mask="url(#actionButtonsMask)"
        />
      </Svg>



      {/* Buy Arrow - positioned relative to Buy button */}
      {showBuyArrow && (
        <OnboardingArrowHint
          arrowTop={spotlightY + 65}
          arrowLeft={buyButton.x + 10} // Shift more to the right
          captionTop={spotlightY + spotlightHeight + 35}
          captionLeft={buyButton.x - 60} // Center caption under button
          captionText="Own your first crypto"
          highlightText="Buy"
        />
      )}

      {/* Deposit Arrow - positioned relative to Deposit button */}
      {showDepositArrow && (
        <OnboardingArrowHint
          arrowTop={spotlightY + 65}
          arrowLeft={depositButton.x + 10} // Shift more to the right
          captionTop={spotlightY + spotlightHeight + 35}
          captionLeft={depositButton.x - 78} // Shift caption 2px to the right
          captionText="...or"
          highlightText="Deposit"
          afterText=" your crypto and ready to trade"
          customFormat={true}
        />
      )}
    </>
  );
};

export default ActionButtonHighlight;