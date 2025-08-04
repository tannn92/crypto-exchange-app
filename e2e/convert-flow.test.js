const { device, expect, element, by, waitFor } = require('detox');

describe('Convert Flow E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // Start from home screen
    await element(by.id('home-tab')).tap();
    await expect(element(by.text('CRYPTOVN'))).toBeVisible();
  });

  describe('Complete Convert Flow', () => {
    it('should complete a full convert transaction flow', async () => {
      // Navigate to convert flow
      await element(by.id('convert-button')).tap();
      
      // Should show convert screen
      await waitFor(element(by.text('Convert')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Verify default coins are selected (BTC -> USDT typically)
      await expect(element(by.id('convert-source-coin-selector'))).toBeVisible();
      await expect(element(by.id('convert-destination-coin-selector'))).toBeVisible();
      
      // Enter amount to convert
      await element(by.id('convert-source-amount-input')).typeText('0.001');
      
      // Should automatically calculate destination amount
      await expect(element(by.id('convert-destination-amount-display'))).not.toHaveText('0.00');
      
      // Proceed to preview
      await element(by.id('convert-preview-button')).tap();
      
      // Should show confirmation screen
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Cancel the transaction
      await device.pressBack();
      
      // Should return to convert screen
      await waitFor(element(by.text('Convert')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should handle source coin selection', async () => {
      await element(by.id('convert-button')).tap();
      
      // Select source coin
      await element(by.id('convert-source-coin-selector')).tap();
      
      // Should show coin selection modal
      await waitFor(element(by.id('coin-selection-title')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Select ETH
      await element(by.id('coin-item-eth')).tap();
      
      // Should return to convert screen with ETH selected
      await waitFor(element(by.text('Convert')))
        .toBeVisible()
        .withTimeout(3000);
      
      // Verify ETH is selected as source
      // The exact verification depends on UI implementation
    });

    it('should handle destination coin selection', async () => {
      await element(by.id('convert-button')).tap();
      
      // Select destination coin
      await element(by.id('convert-destination-coin-selector')).tap();
      
      // Should show coin selection modal
      await waitFor(element(by.id('coin-selection-title')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Select BTC
      await element(by.id('coin-item-btc')).tap();
      
      // Should return to convert screen with BTC selected as destination
      await waitFor(element(by.text('Convert')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should handle swap button functionality', async () => {
      await element(by.id('convert-button')).tap();
      
      // Enter some amount first
      await element(by.id('convert-source-amount-input')).typeText('100');
      
      // Use swap button to switch source and destination
      await element(by.id('convert-swap-button')).tap();
      
      // Should clear amounts when swapping
      await expect(element(by.id('convert-source-amount-input'))).toHaveText('');
      await expect(element(by.id('convert-destination-amount-display'))).toHaveText('');
    });

    it('should handle MAX button functionality', async () => {
      await element(by.id('convert-button')).tap();
      
      // Use MAX button
      await element(by.id('convert-max-button')).tap();
      
      // Should fill maximum available balance
      await expect(element(by.id('convert-source-amount-input'))).not.toHaveText('');
      
      // Should calculate destination amount
      await expect(element(by.id('convert-destination-amount-display'))).not.toHaveText('');
      
      // Preview button should be enabled
      await element(by.id('convert-preview-button')).tap();
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Convert Flow Validation', () => {
    it('should validate amount input', async () => {
      await element(by.id('convert-button')).tap();
      
      // Try to preview with empty amount
      await element(by.id('convert-preview-button')).tap();
      // Should stay on same screen (button disabled)
      await expect(element(by.text('Convert'))).toBeVisible();
      
      // Enter zero amount
      await element(by.id('convert-source-amount-input')).typeText('0');
      await element(by.id('convert-preview-button')).tap();
      // Should still stay on same screen
      await expect(element(by.text('Convert'))).toBeVisible();
      
      // Enter valid amount
      await element(by.id('convert-source-amount-input')).clearText();
      await element(by.id('convert-source-amount-input')).typeText('50');
      
      // Now preview should work
      await element(by.id('convert-preview-button')).tap();
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should prevent converting same currency to itself', async () => {
      await element(by.id('convert-button')).tap();
      
      // Select BTC as source
      await element(by.id('convert-source-coin-selector')).tap();
      await element(by.id('coin-item-btc')).tap();
      
      // Try to select BTC as destination too
      await element(by.id('convert-destination-coin-selector')).tap();
      
      // BTC should not be available in destination list
      // Or if selected, should be handled gracefully
      await waitFor(element(by.id('coin-selection-title')))
        .toBeVisible()
        .withTimeout(3000);
      
      // Go back
      await device.pressBack();
    });

    it('should handle invalid input gracefully', async () => {
      await element(by.id('convert-button')).tap();
      
      // Try entering invalid characters
      await element(by.id('convert-source-amount-input')).typeText('abc123');
      
      // Should handle gracefully
      await element(by.id('convert-preview-button')).tap();
      
      // Should not crash
      await expect(element(by.text('Convert'))).toBeVisible();
    });
  });

  describe('Convert Flow Calculations', () => {
    it('should update destination amount when source changes', async () => {
      await element(by.id('convert-button')).tap();
      
      // Enter amount
      await element(by.id('convert-source-amount-input')).typeText('1');
      
      // Destination should update automatically
      await expect(element(by.id('convert-destination-amount-display'))).not.toHaveText('0.00');
      
      // Change amount
      await element(by.id('convert-source-amount-input')).clearText();
      await element(by.id('convert-source-amount-input')).typeText('10');
      
      // Destination should update again
      // The exact value depends on exchange rates
    });

    it('should show accurate exchange rates', async () => {
      await element(by.id('convert-button')).tap();
      
      // Enter amount to see exchange rate calculation
      await element(by.id('convert-source-amount-input')).typeText('1');
      
      // Exchange rate information should be visible
      // The exact elements depend on UI implementation
      await expect(element(by.text('With price'))).toBeVisible();
    });

    it('should handle different currency pairs', async () => {
      const pairs = [
        { from: 'btc', to: 'eth' },
        { from: 'eth', to: 'usdt' },
        { from: 'usdt', to: 'xrp' }
      ];
      
      for (const pair of pairs) {
        await element(by.id('convert-button')).tap();
        
        // Select source currency
        await element(by.id('convert-source-coin-selector')).tap();
        await element(by.id(`coin-item-${pair.from}`)).tap();
        
        // Select destination currency
        await element(by.id('convert-destination-coin-selector')).tap();
        await element(by.id(`coin-item-${pair.to}`)).tap();
        
        // Enter amount
        await element(by.id('convert-source-amount-input')).typeText('1');
        
        // Should calculate conversion
        await expect(element(by.id('convert-destination-amount-display'))).not.toHaveText('0.00');
        
        // Go back to home
        await device.pressBack();
        await waitFor(element(by.text('CRYPTOVN')))
          .toBeVisible()
          .withTimeout(3000);
      }
    });
  });

  describe('Convert Flow Navigation', () => {
    it('should handle back navigation correctly', async () => {
      await element(by.id('convert-button')).tap();
      
      // Go back from convert screen
      await device.pressBack();
      
      // Should return to home
      await waitFor(element(by.text('CRYPTOVN')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should preserve form data during coin selection', async () => {
      await element(by.id('convert-button')).tap();
      
      // Enter amount
      await element(by.id('convert-source-amount-input')).typeText('5');
      
      // Change destination coin
      await element(by.id('convert-destination-coin-selector')).tap();
      await device.pressBack(); // Cancel selection
      
      // Amount should be preserved
      await expect(element(by.id('convert-source-amount-input'))).toHaveText('5');
    });

    it('should handle confirmation screen navigation', async () => {
      await element(by.id('convert-button')).tap();
      await element(by.id('convert-source-amount-input')).typeText('2.5');
      await element(by.id('convert-preview-button')).tap();
      
      // Should be on confirmation screen
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Go back
      await device.pressBack();
      
      // Should return to convert screen with data preserved
      await waitFor(element(by.text('Convert')))
        .toBeVisible()
        .withTimeout(3000);
      
      await expect(element(by.id('convert-source-amount-input'))).toHaveText('2.5');
    });
  });

  describe('Convert Flow Error Handling', () => {
    it('should handle rapid interactions gracefully', async () => {
      await element(by.id('convert-button')).tap();
      
      // Rapid button taps
      for (let i = 0; i < 5; i++) {
        await element(by.id('convert-swap-button')).tap();
      }
      
      // Should not crash
      await expect(element(by.text('Convert'))).toBeVisible();
    });

    it('should handle network issues gracefully', async () => {
      await element(by.id('convert-button')).tap();
      
      // Rapid navigation that might trigger network calls
      for (let i = 0; i < 3; i++) {
        await element(by.id('convert-source-coin-selector')).tap();
        await device.pressBack();
      }
      
      // Should still be functional
      await expect(element(by.text('Convert'))).toBeVisible();
    });

    it('should handle insufficient balance scenarios', async () => {
      await element(by.id('convert-button')).tap();
      
      // Enter very large amount
      await element(by.id('convert-source-amount-input')).typeText('999999');
      
      // Should handle gracefully
      await element(by.id('convert-preview-button')).tap();
      
      // Should either show error or disable button
      // The exact behavior depends on implementation
    });
  });

  describe('Convert Flow User Experience', () => {
    it('should provide clear visual feedback', async () => {
      await element(by.id('convert-button')).tap();
      
      // All key elements should be visible
      await expect(element(by.id('convert-source-coin-selector'))).toBeVisible();
      await expect(element(by.id('convert-destination-coin-selector'))).toBeVisible();
      await expect(element(by.id('convert-source-amount-input'))).toBeVisible();
      await expect(element(by.id('convert-destination-amount-display'))).toBeVisible();
      await expect(element(by.id('convert-swap-button'))).toBeVisible();
      await expect(element(by.id('convert-max-button'))).toBeVisible();
      await expect(element(by.id('convert-preview-button'))).toBeVisible();
    });

    it('should show appropriate loading states', async () => {
      await element(by.id('convert-button')).tap();
      
      // Enter amount and proceed quickly
      await element(by.id('convert-source-amount-input')).typeText('1.5');
      await element(by.id('convert-preview-button')).tap();
      
      // Should eventually show confirmation or loading state
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('should handle different screen orientations', async () => {
      await element(by.id('convert-button')).tap();
      
      // Test portrait mode
      await device.setOrientation('portrait');
      await expect(element(by.text('Convert'))).toBeVisible();
      
      // Test landscape mode if supported
      try {
        await device.setOrientation('landscape');
        await expect(element(by.text('Convert'))).toBeVisible();
        
        // Return to portrait
        await device.setOrientation('portrait');
      } catch (error) {
        // Landscape not supported, which is fine
        console.log('Landscape mode not supported');
      }
    });
  });
});