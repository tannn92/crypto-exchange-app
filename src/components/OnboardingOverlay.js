import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  Modal,
} from 'react-native';
import ActionButtonHighlight from './ActionButtonHighlight';
import TabButtonHighlight from './TabButtonHighlight';
import OnboardingArrowHint from './OnboardingArrowHint';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const OnboardingOverlay = ({ visible, onClose, step = 1, onNext }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible) {
    return null;
  }

  const handleBackgroundPress = () => {
    onNext();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      animationType="none"
    >
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
        pointerEvents="box-none"
      >
        {/* Action Buttons Highlight - shown in all steps */}
        <ActionButtonHighlight
          visible={true}
          step={step}
          onBackgroundPress={handleBackgroundPress}
          showBuyArrow={step >= 2}
          showDepositArrow={step >= 3}
          includeTabButtonSpotlight={step === 4}
          tabButtonPosition={{ 
            x: screenWidth / 2 - 30, 
            y: screenHeight - 77 
          }}
        />

        {/* Assets Tab Button Arrow - shown only in step 4 (no overlay) */}
        {step === 4 && (
          <View style={{ position: 'absolute', zIndex: 1002 }}>
            <OnboardingArrowHint
              arrowTop={screenHeight - 150}
              arrowLeft={screenWidth / 2 - 15}
              captionTop={screenHeight - 190}
              captionLeft={screenWidth / 2 - 80}
              captionText="Manage all your"
              highlightText="crypto assets"
              afterText=" here"
              customFormat={true}
            />
          </View>
        )}

        {/* Next/Start button - positioned at the very top */}
        <View style={styles.skipContainer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={step === 4 ? onClose : onNext}
          >
            <Text style={styles.skipText}>{step === 4 ? 'Start' : 'Next'}</Text>
          </TouchableOpacity>
        </View>

        {/* Header Content - consistent across all steps */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>Welcome to CryptoVN</Text>
          <Text style={styles.instructionSubtitle}>
            Empowering your steps into the crypto world
          </Text>
        </View>

        {/* Action Description - consistent across all steps */}
        <View style={[styles.actionDescriptionContainer, { 
          top: Platform.OS === 'ios' ? 305 : 285 
        }]}>
          <Text style={styles.instructionDescription}>
            Make your crypto transactions effortless{'\n'}
            just click the action you want to take
          </Text>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  skipContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 47 : 20,
    right: 15,
    zIndex: 1002,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  skipText: {
    color: '#FF6B00',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    left: 40,
    right: 40,
    alignItems: 'center',
    zIndex: 1002,
  },
  instructionTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
  },
  actionDescriptionContainer: {
    position: 'absolute',
    left: 40,
    right: 40,
    alignItems: 'center',
    zIndex: 1002,
  },
  instructionDescription: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default OnboardingOverlay;