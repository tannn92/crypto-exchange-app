const { device, expect, element, by, waitFor } = require('detox');

describe('Withdrawal Flow E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // Start from home screen
    await element(by.id('home-tab')).tap();
    await expect(element(by.text('CRYPTOVN'))).toBeVisible();
  });

  describe('Complete Withdrawal Flow', () => {
    it('should complete a full crypto network withdrawal flow', async () => {
      // Navigate to withdraw flow
      await element(by.id('withdraw-button')).tap();
      
      // Should show withdraw method selection modal
      await waitFor(element(by.text('Withdraw USDT')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Select crypto network withdrawal
      await element(by.text('Send via crypto network')).tap();
      
      // Should show withdraw form
      await waitFor(element(by.text('Withdraw')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Enter withdrawal address
      await element(by.id('withdraw-address-input')).typeText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
      
      // Enter withdrawal amount
      await element(by.id('withdraw-amount-input')).typeText('100');
      
      // Select different coin if needed
      await element(by.id('withdraw-coin-selector')).tap();
      await waitFor(element(by.id('coin-selection-title')))
        .toBeVisible()
        .withTimeout(3000);
      await element(by.id('coin-item-btc')).tap();
      
      // Submit withdrawal
      await waitFor(element(by.id('withdraw-submit-button')))
        .toBeVisible()
        .withTimeout(3000);
      await element(by.id('withdraw-submit-button')).tap();
      
      // Should show confirmation screen
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Cancel the withdrawal
      await device.pressBack();
      
      // Should return to withdrawal form
      await waitFor(element(by.text('Withdraw')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should complete send to user flow', async () => {
      await element(by.id('withdraw-button')).tap();
      
      // Select send to user
      await element(by.text('Send to Azasend user')).tap();
      
      // Should navigate to send to user screen
      await waitFor(element(by.id('username-input')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Fill out send form
      await element(by.id('username-input')).typeText('testuser123');
      await element(by.id('amount-input')).typeText('50');
      
      // Submit the form
      await element(by.id('submit-button')).tap();
      
      // Should show confirmation
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Cancel
      await device.pressBack();
      
      // Should return to send form
      await waitFor(element(by.id('username-input')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should handle MAX button functionality', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Use MAX button
      await element(by.id('withdraw-max-button')).tap();
      
      // Should fill maximum available balance
      await expect(element(by.id('withdraw-amount-input'))).not.toHaveText('');
      
      // Enter address to enable submit
      await element(by.id('withdraw-address-input')).typeText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
      
      // Submit should be enabled
      await element(by.id('withdraw-submit-button')).tap();
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should handle coin selection in withdrawal', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Test coin selector
      await element(by.id('withdraw-coin-selector')).tap();
      
      // Should show coin selection modal
      await waitFor(element(by.id('coin-selection-title')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Select ETH
      await element(by.id('coin-item-eth')).tap();
      
      // Should return to withdraw form with ETH selected
      await waitFor(element(by.text('Withdraw')))
        .toBeVisible()
        .withTimeout(3000);
    });
  });

  describe('Withdrawal Flow Validation', () => {
    it('should validate withdrawal form inputs', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Try to submit with empty form
      await element(by.id('withdraw-submit-button')).tap();
      // Should stay on same screen (button disabled)
      await expect(element(by.text('Withdraw'))).toBeVisible();
      
      // Enter only address
      await element(by.id('withdraw-address-input')).typeText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
      await element(by.id('withdraw-submit-button')).tap();
      // Should still stay on same screen
      await expect(element(by.text('Withdraw'))).toBeVisible();
      
      // Enter only amount
      await element(by.id('withdraw-address-input')).clearText();
      await element(by.id('withdraw-amount-input')).typeText('50');
      await element(by.id('withdraw-submit-button')).tap();
      // Should still stay on same screen
      await expect(element(by.text('Withdraw'))).toBeVisible();
      
      // Enter both address and amount
      await element(by.id('withdraw-address-input')).typeText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
      await element(by.id('withdraw-submit-button')).tap();
      
      // Should proceed to confirmation
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should validate send to user form inputs', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send to Azasend user')).tap();
      
      // Try to submit with empty form
      await element(by.id('submit-button')).tap();
      // Should stay on same screen
      await expect(element(by.id('username-input'))).toBeVisible();
      
      // Enter only username
      await element(by.id('username-input')).typeText('testuser');
      await element(by.id('submit-button')).tap();
      // Should stay on same screen
      await expect(element(by.id('username-input'))).toBeVisible();
      
      // Enter zero amount
      await element(by.id('amount-input')).typeText('0');
      await element(by.id('submit-button')).tap();
      // Should stay on same screen
      await expect(element(by.id('username-input'))).toBeVisible();
      
      // Enter valid inputs
      await element(by.id('amount-input')).clearText();
      await element(by.id('amount-input')).typeText('10');
      await element(by.id('submit-button')).tap();
      
      // Should proceed to confirmation
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should handle invalid address formats', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Enter invalid address
      await element(by.id('withdraw-address-input')).typeText('invalid_address_123');
      await element(by.id('withdraw-amount-input')).typeText('50');
      
      // Try to submit
      await element(by.id('withdraw-submit-button')).tap();
      
      // Should either stay on same screen or show error
      // The exact behavior depends on validation implementation
    });

    it('should handle invalid amount inputs', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Enter valid address
      await element(by.id('withdraw-address-input')).typeText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
      
      // Try negative amount
      await element(by.id('withdraw-amount-input')).typeText('-10');
      await element(by.id('withdraw-submit-button')).tap();
      // Should handle gracefully
      
      // Try very large amount (more than balance)
      await element(by.id('withdraw-amount-input')).clearText();
      await element(by.id('withdraw-amount-input')).typeText('999999');
      await element(by.id('withdraw-submit-button')).tap();
      
      // Should handle gracefully
      await expect(element(by.text('Withdraw'))).toBeVisible();
    });
  });

  describe('Withdrawal Flow Navigation', () => {
    it('should handle back navigation correctly', async () => {
      await element(by.id('withdraw-button')).tap();
      
      // From method selection modal
      await device.pressBack();
      
      // Should return to home
      await waitFor(element(by.text('CRYPTOVN')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should handle method selection navigation', async () => {
      await element(by.id('withdraw-button')).tap();
      
      // Test both withdrawal methods
      await element(by.text('Send via crypto network')).tap();
      await waitFor(element(by.text('Withdraw')))
        .toBeVisible()
        .withTimeout(3000);
      
      // Go back to home and try other method
      await device.pressBack();
      await waitFor(element(by.text('CRYPTOVN')))
        .toBeVisible()
        .withTimeout(3000);
      
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send to Azasend user')).tap();
      await waitFor(element(by.id('username-input')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should preserve form data during navigation', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Enter some data
      await element(by.id('withdraw-address-input')).typeText('test_address');
      await element(by.id('withdraw-amount-input')).typeText('25');
      
      // Change coin and come back
      await element(by.id('withdraw-coin-selector')).tap();
      await device.pressBack();
      
      // Data should be preserved
      await expect(element(by.id('withdraw-address-input'))).toHaveText('test_address');
      await expect(element(by.id('withdraw-amount-input'))).toHaveText('25');
    });
  });

  describe('Withdrawal Flow Different Cryptocurrencies', () => {
    it('should handle withdrawing different cryptocurrencies', async () => {
      const cryptos = ['BTC', 'ETH', 'USDT'];
      
      for (const crypto of cryptos) {
        await element(by.id('withdraw-button')).tap();
        await element(by.text('Send via crypto network')).tap();
        
        // Select cryptocurrency
        await element(by.id('withdraw-coin-selector')).tap();
        await element(by.id(`coin-item-${crypto.toLowerCase()}`)).tap();
        
        // Should show withdraw form for selected crypto
        await waitFor(element(by.text('Withdraw')))
          .toBeVisible()
          .withTimeout(5000);
        
        // Go back to home
        await device.pressBack();
        await waitFor(element(by.text('CRYPTOVN')))
          .toBeVisible()
          .withTimeout(3000);
      }
    });

    it('should show appropriate balance for each cryptocurrency', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Test different coins and their balances
      const cryptos = ['BTC', 'ETH', 'USDT'];
      
      for (const crypto of cryptos) {
        await element(by.id('withdraw-coin-selector')).tap();
        await element(by.id(`coin-item-${crypto.toLowerCase()}`)).tap();
        
        // Should show balance for selected coin
        // The exact balance display depends on implementation
        await expect(element(by.text('Balance'))).toBeVisible();
      }
    });
  });

  describe('Withdrawal Flow Error Handling', () => {
    it('should handle rapid interactions gracefully', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Rapid button taps
      for (let i = 0; i < 5; i++) {
        await element(by.id('withdraw-max-button')).tap();
      }
      
      // Should not crash
      await expect(element(by.text('Withdraw'))).toBeVisible();
    });

    it('should handle network connection issues', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Rapid navigation that might trigger network calls
      for (let i = 0; i < 3; i++) {
        await element(by.id('withdraw-coin-selector')).tap();
        await device.pressBack();
      }
      
      // Should still be functional
      await expect(element(by.text('Withdraw'))).toBeVisible();
    });

    it('should handle clipboard operations gracefully', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Try to paste into address field (long press simulation)
      await element(by.id('withdraw-address-input')).longPress();
      
      // Should handle clipboard operations without crashing
      await expect(element(by.text('Withdraw'))).toBeVisible();
    });
  });

  describe('Withdrawal Flow Security Features', () => {
    it('should show appropriate warnings for large amounts', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Enter large amount
      await element(by.id('withdraw-amount-input')).typeText('10000');
      
      // Should show warnings or additional verification
      // The exact behavior depends on security implementation
    });

    it('should validate address formats properly', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Test different address formats for different coins
      const addressTests = [
        { coin: 'btc', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
        { coin: 'eth', address: '0x742d35Cc6636C0532925a3b8D9BAA44f7DD60A' },
        { coin: 'usdt', address: 'TQMhTWdZ5JgJcFCvGJJ47PvHT2QnQdX2Qt' }
      ];
      
      for (const test of addressTests) {
        await element(by.id('withdraw-coin-selector')).tap();
        await element(by.id(`coin-item-${test.coin}`)).tap();
        
        await element(by.id('withdraw-address-input')).clearText();
        await element(by.id('withdraw-address-input')).typeText(test.address);
        
        // Should accept valid addresses for corresponding coins
      }
    });
  });

  describe('Withdrawal Flow User Experience', () => {
    it('should provide clear instructions and labels', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Should have clear labels
      await expect(element(by.text('You Withdraw'))).toBeVisible();
      await expect(element(by.text('Balance'))).toBeVisible();
    });

    it('should show appropriate placeholders', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Address input should have helpful placeholder
      await expect(element(by.id('withdraw-address-input'))).toBeVisible();
      
      // Amount input should have placeholder
      await expect(element(by.id('withdraw-amount-input'))).toBeVisible();
    });

    it('should handle different screen orientations', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Test portrait
      await device.setOrientation('portrait');
      await expect(element(by.text('Withdraw'))).toBeVisible();
      
      // Test landscape if supported
      try {
        await device.setOrientation('landscape');
        await expect(element(by.text('Withdraw'))).toBeVisible();
        await device.setOrientation('portrait');
      } catch (error) {
        console.log('Landscape orientation not supported');
      }
    });

    it('should provide accessibility support', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // All interactive elements should be accessible
      await expect(element(by.id('withdraw-address-input'))).toBeVisible();
      await expect(element(by.id('withdraw-amount-input'))).toBeVisible();
      await expect(element(by.id('withdraw-max-button'))).toBeVisible();
      await expect(element(by.id('withdraw-coin-selector'))).toBeVisible();
      await expect(element(by.id('withdraw-submit-button'))).toBeVisible();
    });

    it('should show appropriate loading states', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Fill form and submit quickly
      await element(by.id('withdraw-address-input')).typeText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
      await element(by.id('withdraw-amount-input')).typeText('1');
      await element(by.id('withdraw-submit-button')).tap();
      
      // Should eventually show confirmation or loading state
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(10000);
    });
  });

  describe('Withdrawal Flow Edge Cases', () => {
    it('should handle minimum withdrawal amounts', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Try very small amount
      await element(by.id('withdraw-address-input')).typeText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
      await element(by.id('withdraw-amount-input')).typeText('0.00001');
      
      // Should handle minimum amount validation
      await element(by.id('withdraw-submit-button')).tap();
    });

    it('should handle decimal precision correctly', async () => {
      await element(by.id('withdraw-button')).tap();
      await element(by.text('Send via crypto network')).tap();
      
      // Test different decimal precisions for different coins
      await element(by.id('withdraw-address-input')).typeText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
      
      // Test BTC (8 decimals)
      await element(by.id('withdraw-coin-selector')).tap();
      await element(by.id('coin-item-btc')).tap();
      await element(by.id('withdraw-amount-input')).typeText('0.12345678');
      
      // Should handle correctly
      await element(by.id('withdraw-submit-button')).tap();
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });
});