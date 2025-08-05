import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const OnboardingArrowHint = ({ 
  arrowTop, 
  arrowLeft, 
  captionTop, 
  captionLeft = 40,
  captionText,
  highlightText,
  highlightColor = '#6B82FF',
  afterText = '',
  customFormat = false
}) => {
  return (
    <>
      {/* Curved arrow using provided SVG */}
      <View style={[styles.arrowContainer, { 
        top: arrowTop,
        left: arrowLeft
      }]}>
        <Svg width={30} height={73} viewBox="0 0 30 73" fill="none">
          <Path
            d="M1.5998 0.199847C1.15788 -0.131411 0.531105 -0.041708 0.199847 0.400204C-0.131411 0.842117 -0.041708 1.4689 0.400204 1.80015L1.5998 0.199847ZM20.1597 72.5462C20.4614 73.0088 21.081 73.1393 21.5436 72.8377L29.0826 67.9221C29.5452 67.6204 29.6757 67.0009 29.3741 66.5382C29.0725 66.0756 28.4529 65.9451 27.9903 66.2467L21.2889 70.6162L16.9195 63.9148C16.6178 63.4522 15.9983 63.3217 15.5356 63.6233C15.073 63.925 14.9425 64.5445 15.2441 65.0072L20.1597 72.5462ZM1 1L0.400204 1.80015C19.4513 16.0809 25.6163 45.2205 20.0189 71.7939L20.9974 72L21.9759 72.2061C27.6591 45.2252 21.518 15.1306 1.5998 0.199847L1 1Z"
            fill="#9FA1A9"
          />
        </Svg>
      </View>

      {/* Caption text */}
      <View style={[styles.captionContainer, { 
        top: captionTop,
        left: captionLeft,
        width: 150  // Add width constraint to prevent overlap
      }]}>
        <Text style={styles.captionText}>
          {customFormat ? (
            <>
              {captionText}{'\n'}<Text style={[styles.highlightText, { color: highlightColor }]}>{highlightText}</Text>{afterText}
            </>
          ) : (
            <>
              {captionText}{'\n'}by clicking <Text style={[styles.highlightText, { color: highlightColor }]}>{highlightText}</Text>...
            </>
          )}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  arrowContainer: {
    position: 'absolute',
    zIndex: 1001,
  },
  captionContainer: {
    position: 'absolute',
    zIndex: 1001,
  },
  captionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  highlightText: {
    fontWeight: 'bold',
  },
});

export default OnboardingArrowHint;