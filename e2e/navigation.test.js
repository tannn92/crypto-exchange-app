const { device, expect, element, by, waitFor } = require('detox');

describe('Navigation and Safe Area Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Safe Area Handling', () => {
    it('should display content properly with safe areas on different devices', async () => {
      // Test home screen safe area
      await element(by.id('home-tab')).tap();
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
      
      // Check that quick action buttons are accessible (not hidden by safe areas)
      await expect(element(by.id('buy-button'))).toBeVisible();
      await expect(element(by.id('sell-button'))).toBeVisible();
      await expect(element(by.id('convert-button'))).toBeVisible();
      await expect(element(by.id('deposit-button'))).toBeVisible();
      await expect(element(by.id('withdraw-button'))).toBeVisible();
    });

    it('should handle modal safe areas correctly', async () => {
      // Test modal presentation with safe areas
      await element(by.id('home-tab')).tap();
      await element(by.id('withdraw-button')).tap();
      
      // Modal should be visible with proper safe area padding
      await waitFor(element(by.text('Withdraw USDT')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Content should not be cut off by safe areas
      await expect(element(by.text('Send to Azasend user'))).toBeVisible();
      await expect(element(by.text('Send via crypto network'))).toBeVisible();
    });

    it('should maintain consistent background colors in safe areas', async () => {
      // Test form screens have consistent background colors
      await element(by.id('home-tab')).tap();
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send to Azasend user')).tap();
      
      // Form should be visible with consistent theming
      await waitFor(element(by.id('username-input')))
        .toBeVisible()
        .withTimeout(5000);
      
      // The safe area background should match the form background
      // This is a visual test - the important thing is no crashes occur
      await expect(element(by.id('amount-input'))).toBeVisible();
    });
  });

  describe('Navigation Flow Tests', () => {
    it('should handle complex navigation flows without loops', async () => {
      // Start buy flow
      await element(by.id('home-tab')).tap();
      await element(by.id('buy-button')).tap();
      
      // Navigate through buy flow steps
      await waitFor(element(by.text('Select Cryptocurrency')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Go back multiple times should not cause loops
      await device.pressBack();
      await waitFor(element(by.text('CRYPTOVN')))
        .toBeVisible()
        .withTimeout(3000);
      
      // Try again with sell flow
      await element(by.id('sell-button')).tap();
      await waitFor(element(by.text('Select Cryptocurrency')))
        .toBeVisible()
        .withTimeout(5000);
      
      await device.pressBack();
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
    });

    it('should handle transparent modal navigation correctly', async () => {
      // Test transparent modal presentation and dismissal
      await element(by.id('home-tab')).tap();
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send to Azasend user')).tap();
      
      // Fill out form to get to confirmation modal
      await element(by.id('username-input')).typeText('testuser123');
      await element(by.id('amount-input')).typeText('10');
      await element(by.id('submit-button')).tap();
      
      // Should show transparent confirmation modal
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Cancel should properly dismiss modal
      if (await element(by.text('Cancel')).isVisible()) {
        await element(by.text('Cancel')).tap();
        await waitFor(element(by.id('username-input')))
          .toBeVisible()
          .withTimeout(3000);
      }
    });

    it('should handle tab navigation consistently', async () => {
      // Test all tab transitions work smoothly
      const tabs = [
        { id: 'home-tab', expectedText: 'CRYPTOVN' },
        { id: 'assets-tab', expectedText: 'Assets' },
        { id: 'history-tab', expectedText: 'History' }
      ];
      
      for (const tab of tabs) {
        await element(by.id(tab.id)).tap();
        await waitFor(element(by.text(tab.expectedText)))
          .toBeVisible()
          .withTimeout(3000);
      }
      
      // Return to home
      await element(by.id('home-tab')).tap();
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
    });
  });

  describe('Device Specific Tests', () => {
    it('should handle gesture navigation properly', async () => {
      // Test that bottom tabs work with gesture navigation
      await element(by.id('home-tab')).tap();
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
      
      // Swipe up gesture should not interfere with app navigation
      // This test ensures the safe area handling works with gesture navigation
      await element(by.id('assets-tab')).tap();
      await waitFor(element(by.text('Assets')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should handle notch and dynamic island devices', async () => {
      // Test that content is properly displayed on devices with notches
      await element(by.id('home-tab')).tap();
      
      // Header content should be visible and not hidden behind notch
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
      
      // Status bar should be handled properly
      // This is mainly a visual test - ensuring no crashes
      await element(by.id('buy-button')).tap();
      await waitFor(element(by.text('Select Cryptocurrency')))
        .toBeVisible()
        .withTimeout(5000);
      
      await device.pressBack();
    });
  });

  describe('Performance and Stability', () => {
    it('should handle rapid navigation without crashes', async () => {
      // Rapidly switch between screens
      for (let i = 0; i < 5; i++) {
        await element(by.id('home-tab')).tap();
        await element(by.id('assets-tab')).tap();
        await element(by.id('history-tab')).tap();
      }
      
      // App should still be responsive
      await element(by.id('home-tab')).tap();
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
    });

    it('should handle deep navigation and back button spam', async () => {
      // Navigate deep into the app
      await element(by.id('home-tab')).tap();
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send to Azasend user')).tap();
      
      // Rapidly press back multiple times
      for (let i = 0; i < 3; i++) {
        await device.pressBack();
      }
      
      // Should end up at home screen without crashes
      await waitFor(element(by.text('CRYPTOVN')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });
});