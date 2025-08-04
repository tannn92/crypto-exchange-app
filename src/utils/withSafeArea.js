import React from 'react';
import ScreenWrapper from '../components/ScreenWrapper';

/**
 * Higher-order component that automatically wraps screens with safe area handling
 * Usage: const SafeHomeScreen = withSafeArea(HomeScreen);
 */
const withSafeArea = (WrappedComponent, options = {}) => {
  const WithSafeAreaComponent = (props) => {
    // Skip wrapper for screens that should handle their own safe areas
    if (options.skipWrapper) {
      return <WrappedComponent {...props} />;
    }

    return (
      <ScreenWrapper route={props.route}>
        <WrappedComponent {...props} />
      </ScreenWrapper>
    );
  };

  WithSafeAreaComponent.displayName = `withSafeArea(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithSafeAreaComponent;
};

export default withSafeArea;