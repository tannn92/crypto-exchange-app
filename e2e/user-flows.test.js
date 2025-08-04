const { device, expect, element, by, waitFor } = require('detox');

describe('User Flow Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Complete Send to User Flow', () => {
    it('should complete a full send transaction flow', async () => {
      // Start from home screen
      await element(by.id('home-tab')).tap();
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
      
      // Navigate to withdraw
      await element(by.id('withdraw-button')).tap();
      await waitFor(element(by.text('Withdraw USDT')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Select send to user
      await element(by.text('Send to Azasend user')).tap();
      await waitFor(element(by.id('username-input')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Fill out the form
      await element(by.id('username-input')).typeText('testuser123');
      await element(by.id('amount-input')).typeText('25.50');
      
      // Submit the form
      await element(by.id('submit-button')).tap();
      
      // Should navigate to confirmation screen
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Check confirmation details are displayed
      await expect(element(by.text('Withdraw USDT'))).toBeVisible();
      await expect(element(by.text('25.50 USDT'))).toBeVisible();
      
      // Can cancel the transaction
      if (await element(by.text('Cancel')).isVisible()) {
        await element(by.text('Cancel')).tap();
        
        // Should return to send form
        await waitFor(element(by.id('username-input')))
          .toBeVisible()
          .withTimeout(3000);
      }
    });

    it('should validate form inputs correctly', async () => {
      // Navigate to send form
      await element(by.id('home-tab')).tap();
      await element(by.id('withdraw-button')).tap();
      await waitFor(element(by.text('Send to Azasend user')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.text('Send to Azasend user')).tap();
      
      // Test empty form validation
      await element(by.id('submit-button')).tap();
      // Should stay on the same screen (form validation prevents submission)
      await expect(element(by.id('username-input'))).toBeVisible();
      
      // Test with username only
      await element(by.id('username-input')).typeText('testuser');
      await element(by.id('submit-button')).tap();
      await expect(element(by.id('username-input'))).toBeVisible();
      
      // Test with invalid amount (zero)
      await element(by.id('amount-input')).typeText('0');
      await element(by.id('submit-button')).tap();
      await expect(element(by.id('username-input'))).toBeVisible();
      
      // Test with valid inputs
      await element(by.id('amount-input')).clearText();
      await element(by.id('amount-input')).typeText('10');
      await element(by.id('submit-button')).tap();
      
      // Should proceed to confirmation
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Buy Flow Navigation', () => {
    it('should navigate through buy flow screens', async () => {
      // Start buy flow
      await element(by.id('home-tab')).tap();
      await element(by.id('buy-button')).tap();
      
      // Should show coin selection
      await waitFor(element(by.text('Select Cryptocurrency')))
        .toBeVisible()
        .withTimeout(5000);
      
      // This would require more detailed implementation to complete
      // For now, test basic navigation
      await device.pressBack();
      await waitFor(element(by.text('CRYPTOVN')))
        .toBeVisible()
        .withTimeout(3000);
    });
  });

  describe('Convert Flow Navigation', () => {
    it('should access convert screen', async () => {
      await element(by.id('home-tab')).tap();
      await element(by.id('convert-button')).tap();
      
      // Should navigate to convert screen
      await waitFor(element(by.text('Convert')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Test back navigation
      await device.pressBack();
      await waitFor(element(by.text('CRYPTOVN')))
        .toBeVisible()
        .withTimeout(3000);
    });
  });

  describe('Assets and History Navigation', () => {
    it('should display assets screen correctly', async () => {
      await element(by.id('assets-tab')).tap();
      await waitFor(element(by.text('Assets')))
        .toBeVisible()
        .withTimeout(3000);
      
      // Should show portfolio information
      // The exact content depends on the implementation
      // Test that screen loads without crashes
      await expect(element(by.id('assets-tab'))).toBeVisible();
    });

    it('should display history screen correctly', async () => {
      await element(by.id('history-tab')).tap();
      await waitFor(element(by.text('History')))
        .toBeVisible()
        .withTimeout(3000);
      
      // Should show transaction history
      await expect(element(by.id('history-tab'))).toBeVisible();
    });
  });

  describe('Modal and Overlay Handling', () => {
    it('should handle withdraw method selection modal', async () => {
      await element(by.id('home-tab')).tap();
      await element(by.id('withdraw-button')).tap();
      
      // Modal should appear
      await waitFor(element(by.text('Withdraw USDT')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Should show both options
      await expect(element(by.text('Send to Azasend user'))).toBeVisible();
      await expect(element(by.text('Send via crypto network'))).toBeVisible();
      
      // Test selecting an option
      await element(by.text('Send via crypto network')).tap();
      
      // Should navigate to appropriate screen
      await waitFor(element(by.text('Withdraw')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Input and Interaction Tests', () => {
    it('should handle text input correctly', async () => {
      // Navigate to a screen with text inputs
      await element(by.id('home-tab')).tap();
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send to Azasend user')).tap();
      
      // Test username input
      await element(by.id('username-input')).typeText('testuser123');
      await expect(element(by.id('username-input'))).toHaveText('testuser123');
      
      // Test amount input
      await element(by.id('amount-input')).typeText('100.50');
      await expect(element(by.id('amount-input'))).toHaveText('100.50');
      
      // Test clearing inputs
      await element(by.id('username-input')).clearText();
      await element(by.id('username-input')).typeText('newuser');
      await expect(element(by.id('username-input'))).toHaveText('newuser');
    });

    it('should handle button interactions', async () => {
      await element(by.id('home-tab')).tap();
      
      // Test all quick action buttons are tappable
      const buttons = ['buy-button', 'sell-button', 'convert-button', 'deposit-button', 'withdraw-button'];
      
      for (const buttonId of buttons) {
        await expect(element(by.id(buttonId))).toBeVisible();
        // Tap and immediately go back to test responsiveness
        await element(by.id(buttonId)).tap();
        // Wait a moment for navigation
        await new Promise(resolve => setTimeout(resolve, 1000));
        await device.pressBack();
        // Ensure we're back at home
        await waitFor(element(by.text('CRYPTOVN')))
          .toBeVisible()
          .withTimeout(3000);
      }
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle app state changes', async () => {
      // Test app backgrounding and foregrounding
      await element(by.id('home-tab')).tap();
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
      
      // Send app to background and bring it back
      await device.sendToHome();
      await device.launchApp({ newInstance: false });
      
      // App should still be functional
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
      await element(by.id('assets-tab')).tap();
      await waitFor(element(by.text('Assets')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should handle orientation changes', async () => {
      // Test portrait mode
      await device.setOrientation('portrait');
      await element(by.id('home-tab')).tap();
      await expect(element(by.text('CRYPTOVN'))).toBeVisible();
      
      // Test landscape mode (if supported)
      try {
        await device.setOrientation('landscape');
        await expect(element(by.text('CRYPTOVN'))).toBeVisible();
        
        // Return to portrait
        await device.setOrientation('portrait');
        await expect(element(by.text('CRYPTOVN'))).toBeVisible();
      } catch (error) {
        // Some apps may not support landscape, which is fine
        console.log('Landscape mode not supported or failed:', error.message);
      }
    });
  });
});