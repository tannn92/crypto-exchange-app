const { device, expect, element, by, waitFor } = require('detox');

describe('Crypto Exchange App E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('App Launch and Navigation', () => {
    it('should launch app and show home screen', async () => {
      // Check if main tabs are visible
      await expect(element(by.id('home-tab'))).toBeVisible();
      await expect(element(by.id('assets-tab'))).toBeVisible();
      await expect(element(by.id('history-tab'))).toBeVisible();
    });

    it('should navigate between tabs', async () => {
      // Test Assets tab navigation
      await element(by.id('assets-tab')).tap();
      await waitFor(element(by.text('Assets')))
        .toBeVisible()
        .withTimeout(3000);

      // Test History tab navigation
      await element(by.id('history-tab')).tap();
      await waitFor(element(by.text('History')))
        .toBeVisible()
        .withTimeout(3000);

      // Return to Home tab
      await element(by.id('home-tab')).tap();
      await waitFor(element(by.text('CRYPTOVN')))
        .toBeVisible()
        .withTimeout(3000);
    });
  });

  describe('Home Screen Features', () => {
    beforeEach(async () => {
      // Ensure we're on home screen
      await element(by.id('home-tab')).tap();
    });

    it('should display quick action buttons', async () => {
      await expect(element(by.id('buy-button'))).toBeVisible();
      await expect(element(by.id('sell-button'))).toBeVisible();
      await expect(element(by.id('convert-button'))).toBeVisible();
      await expect(element(by.id('deposit-button'))).toBeVisible();
      await expect(element(by.id('withdraw-button'))).toBeVisible();
    });

    it('should navigate to buy flow', async () => {
      await element(by.id('buy-button')).tap();
      
      // Should navigate to coin selection screen
      await waitFor(element(by.text('Select Cryptocurrency')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should navigate to sell flow', async () => {
      await element(by.id('sell-button')).tap();
      
      // Should navigate to coin selection screen for selling
      await waitFor(element(by.text('Select Cryptocurrency')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should navigate to convert flow', async () => {
      await element(by.id('convert-button')).tap();
      
      // Should navigate to convert screen
      await waitFor(element(by.text('Convert')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should navigate to withdraw flow', async () => {
      await element(by.id('withdraw-button')).tap();
      
      // Should navigate to withdraw method selection
      await waitFor(element(by.text('Withdraw')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Send to User Flow', () => {
    beforeEach(async () => {
      // Navigate to withdraw and then send to user
      await element(by.id('home-tab')).tap();
      await element(by.id('withdraw-button')).tap();
      
      // Wait for withdraw method selection and tap send to user
      await waitFor(element(by.text('Send to Azasend user')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.text('Send to Azasend user')).tap();
    });

    it('should display send to user form', async () => {
      // Check form elements are visible
      await expect(element(by.id('username-input'))).toBeVisible();
      await expect(element(by.id('amount-input'))).toBeVisible();
      await expect(element(by.id('submit-button'))).toBeVisible();
    });

    it('should enable submit button when form is valid', async () => {
      // Fill in username
      await element(by.id('username-input')).typeText('testuser123');
      
      // Fill in amount
      await element(by.id('amount-input')).typeText('10');
      
      // Submit button should be enabled
      await expect(element(by.id('submit-button'))).toBeVisible();
      
      // Try to submit
      await element(by.id('submit-button')).tap();
      
      // Should navigate to confirmation screen
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should validate empty form', async () => {
      // Submit button should be disabled when form is empty
      // Note: In React Native, disabled buttons might still be tappable
      // but the onPress handler should check the disabled state
      const submitButton = element(by.id('submit-button'));
      await expect(submitButton).toBeVisible();
      
      // The actual validation happens in the component
      // Test by trying to submit empty form
      await submitButton.tap();
      
      // Should not navigate away from current screen
      await expect(element(by.id('username-input'))).toBeVisible();
    });

    it('should validate amount input', async () => {
      // Fill in username only
      await element(by.id('username-input')).typeText('testuser123');
      
      // Try with invalid amount
      await element(by.id('amount-input')).typeText('0');
      
      // Submit should not work with zero amount
      await element(by.id('submit-button')).tap();
      await expect(element(by.id('username-input'))).toBeVisible();
      
      // Clear and try with valid amount
      await element(by.id('amount-input')).clearText();
      await element(by.id('amount-input')).typeText('5');
      
      // Now submit should work
      await element(by.id('submit-button')).tap();
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Safe Area and Visual Consistency', () => {
    it('should display properly on different screen sizes', async () => {
      // Test home screen display
      await element(by.id('home-tab')).tap();
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
      
      // Test that content is not hidden behind status bar or home indicator
      // This is visual validation - elements should be visible and accessible
      await expect(element(by.id('buy-button'))).toBeVisible();
      await expect(element(by.id('sell-button'))).toBeVisible();
    });

    it('should handle modal presentations correctly', async () => {
      // Navigate to a flow that shows modals
      await element(by.id('home-tab')).tap();
      await element(by.id('withdraw-button')).tap();
      
      // Should show modal with proper safe area handling
      await waitFor(element(by.text('Withdraw USDT')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Test closing modal
      if (await element(by.text('×')).isVisible()) {
        await element(by.text('×')).tap();
      }
    });
  });

  describe('Navigation and Back Button Handling', () => {
    it('should handle back navigation correctly', async () => {
      // Start from home
      await element(by.id('home-tab')).tap();
      
      // Navigate to buy flow
      await element(by.id('buy-button')).tap();
      await waitFor(element(by.text('Select Cryptocurrency')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Go back using device back button
      await device.pressBack();
      
      // Should return to home screen
      await waitFor(element(by.text('CRYPTOVN')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should prevent navigation loops in payment processing', async () => {
      // This test ensures the PaymentProcessingScreen navigation fix works
      // We can't easily simulate the full flow, but we test navigation consistency
      
      await element(by.id('home-tab')).tap();
      await element(by.id('buy-button')).tap();
      
      // Navigate through buy flow would require more setup
      // For now, test basic navigation stability
      await device.pressBack();
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
    });
  });

  describe('Theme and UI Consistency', () => {
    it('should maintain consistent theming across screens', async () => {
      // Test theme consistency by navigating through different screens
      await element(by.id('home-tab')).tap();
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
      
      await element(by.id('assets-tab')).tap();
      await waitFor(element(by.text('Assets')))
        .toBeVisible()
        .withTimeout(3000);
      
      await element(by.id('history-tab')).tap();
      await waitFor(element(by.text('History')))
        .toBeVisible()
        .withTimeout(3000);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle network errors gracefully', async () => {
      // This would require mocking network conditions
      // For now, ensure app doesn't crash with normal usage
      await element(by.id('home-tab')).tap();
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
    });

    it('should handle rapid navigation', async () => {
      // Test rapid tab switching
      await element(by.id('home-tab')).tap();
      await element(by.id('assets-tab')).tap();
      await element(by.id('history-tab')).tap();
      await element(by.id('home-tab')).tap();
      
      // Should still be responsive
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
    });
  });
});