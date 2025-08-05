import React from 'react';
import {
  View,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, { Defs, Mask, Rect } from 'react-native-svg';
import OnboardingArrowHint from './OnboardingArrowHint';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const TabButtonHighlight = ({ 
  visible, 
  buttonPosition = 'center', // 'left', 'center', 'right', etc.
  showArrow = false,
  arrowText = '',
  highlightText = '',
  afterText = '',
  onBackgroundPress
}) => {
  if (!visible) return null;

  // Calculate position based on tab bar layout
  // Assets button is typically in the center (2nd position in a 5-tab layout)
  const getButtonPosition = () => {
    switch (buttonPosition) {
      case 'center':
      case 'assets':
        return {
          x: screenWidth / 2 - 30,
          y: screenHeight - 77, // Fine-tuned position for Assets button
        };
      case 'home':
        return {
          x: screenWidth * 0.2 - 30,
          y: screenHeight - 77,
        };
      case 'history':
        return {
          x: screenWidth * 0.8 - 30,
          y: screenHeight - 77,
        };
      default:
        return {
          x: screenWidth / 2 - 30,
          y: screenHeight - 77,
        };
    }
  };

  const buttonPos = getButtonPosition();
  const circleSize = 60;
  const circleRadius = circleSize / 2;

  return (
    <>
      {/* SVG Mask for Tab Button Spotlight */}
      <Svg
        width={screenWidth}
        height={screenHeight}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1000 }}
        pointerEvents="none"
      >
        <Defs>
          <Mask id="tabButtonMask">
            <Rect width={screenWidth} height={screenHeight} fill="white" />
            <Rect
              x={buttonPos.x}
              y={buttonPos.y}
              width={circleSize}
              height={circleSize}
              rx={circleRadius}
              ry={circleRadius}
              fill="black"
            />
          </Mask>
        </Defs>
        <Rect
          width={screenWidth}
          height={screenHeight}
          fill="rgba(0, 0, 0, 0.85)"
          mask="url(#tabButtonMask)"
        />
      </Svg>

      {/* Touchable overlay for background press */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: screenWidth,
          height: screenHeight,
          zIndex: 999,
        }}
        onTouchEnd={onBackgroundPress}
      />

      {/* Invisible area over spotlight to allow button interaction */}
      <View
        style={{
          position: 'absolute',
          top: buttonPos.y,
          left: buttonPos.x,
          width: circleSize,
          height: circleSize,
          backgroundColor: 'transparent',
          zIndex: 1001,
        }}
        pointerEvents="box-none"
      />

      {/* Arrow pointing to tab button */}
      {showArrow && (
        <OnboardingArrowHint
          arrowTop={screenHeight - 150}
          arrowLeft={screenWidth / 2 - 15}
          captionTop={screenHeight - 190}
          captionLeft={screenWidth / 2 - 80}
          captionText={arrowText}
          highlightText={highlightText}
          afterText={afterText}
          customFormat={true}
        />
      )}
    </>
  );
};

export default TabButtonHighlight;