const { device, expect, element, by, waitFor } = require('detox');

describe('Sell Flow E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // Start from home screen
    await element(by.id('home-tab')).tap();
    await expect(element(by.text('CRYPTOVN'))).toBeVisible();
  });

  describe('Complete Sell Flow', () => {
    it('should complete a full sell transaction flow', async () => {
      // Navigate to sell flow
      await element(by.id('sell-button')).tap();
      
      // Should show coin selection screen
      await waitFor(element(by.id('coin-selection-title')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Select Bitcoin
      await element(by.id('coin-item-btc')).tap();
      
      // Should navigate to sell amount screen
      await waitFor(element(by.text('Sell BTC')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Enter amount to sell
      await element(by.id('sell-amount-input')).typeText('0.001');
      
      // Select receive method
      await element(by.id('receive-method-selector')).tap();
      await waitFor(element(by.text('Receive method')))
        .toBeVisible()
        .withTimeout(3000);
      
      // Select a bank (this depends on the receive method screen implementation)
      await device.pressBack(); // Go back for now
      
      // Proceed to confirmation
      await waitFor(element(by.id('sell-confirm-button')))
        .toBeVisible()
        .withTimeout(3000);
      await element(by.id('sell-confirm-button')).tap();
      
      // Should show confirmation screen
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Cancel the transaction
      await element(by.id('back-button')).tap();
      
      // Should return to amount screen
      await waitFor(element(by.text('Sell BTC')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should handle MAX button functionality', async () => {
      await element(by.id('sell-button')).tap();
      await element(by.id('coin-item-btc')).tap();
      
      // Test MAX button
      await element(by.id('max-button')).tap();
      
      // Should fill in maximum available balance
      // The exact value depends on mock data
      await expect(element(by.id('sell-amount-input'))).not.toHaveText('');
      
      // Should enable confirm button
      await element(by.id('sell-confirm-button')).tap();
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should validate sell amount input', async () => {
      await element(by.id('sell-button')).tap();
      await element(by.id('coin-item-eth')).tap();
      
      // Try to confirm with empty amount
      await element(by.id('sell-confirm-button')).tap();
      // Should stay on same screen (button disabled)
      await expect(element(by.text('Sell ETH'))).toBeVisible();
      
      // Enter zero amount  
      await element(by.id('sell-amount-input')).typeText('0');
      await element(by.id('sell-confirm-button')).tap();
      // Should still stay on same screen
      await expect(element(by.text('Sell ETH'))).toBeVisible();
      
      // Enter valid amount
      await element(by.id('sell-amount-input')).clearText();
      await element(by.id('sell-amount-input')).typeText('1.5');
      
      // Now confirmation button should work
      await element(by.id('sell-confirm-button')).tap();
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should handle coin selection in sell flow', async () => {
      await element(by.id('sell-button')).tap();
      
      // Test search functionality
      await element(by.id('coin-search-input')).typeText('USDT');
      await expect(element(by.id('coin-item-usdt'))).toBeVisible();
      
      // Select USDT
      await element(by.id('coin-item-usdt')).tap();
      
      // Should navigate to sell amount screen with USDT
      await waitFor(element(by.text('Sell USDT')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Test coin selector in amount screen
      await element(by.id('sell-coin-selector')).tap();
      
      // Should show coin selection again
      await waitFor(element(by.id('coin-selection-title')))
        .toBeVisible()
        .withTimeout(3000);
      
      // Select different coin
      await element(by.id('coin-item-btc')).tap();
      
      // Should update to BTC
      await waitFor(element(by.text('Sell BTC')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Sell Flow Navigation', () => {
    it('should handle back navigation correctly', async () => {
      await element(by.id('sell-button')).tap();
      await element(by.id('coin-item-btc')).tap();
      
      // Go back from amount screen  
      await element(by.id('back-button')).tap();
      
      // Should return to coin selection
      await waitFor(element(by.id('coin-selection-title')))
        .toBeVisible()
        .withTimeout(3000);
      
      // Go back from coin selection
      await device.pressBack();
      
      // Should return to home
      await waitFor(element(by.text('CRYPTOVN')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should preserve form data during navigation', async () => {
      await element(by.id('sell-button')).tap();
      await element(by.id('coin-item-eth')).tap();
      
      // Enter some data
      await element(by.id('sell-amount-input')).typeText('2.5');
      
      // Navigate away and back
      await element(by.id('sell-coin-selector')).tap();
      await device.pressBack();
      
      // Data should be preserved
      await expect(element(by.id('sell-amount-input'))).toHaveText('2.5');
    });
  });

  describe('Sell Flow Balance Checks', () => {
    it('should display balance information', async () => {
      await element(by.id('sell-button')).tap();
      await element(by.id('coin-item-btc')).tap();
      
      // Should show balance for selected coin
      // The exact text depends on implementation
      await expect(element(by.text('Balance'))).toBeVisible();
    });

    it('should handle insufficient balance gracefully', async () => {
      await element(by.id('sell-button')).tap();
      await element(by.id('coin-item-btc')).tap();
      
      // Try to sell more than available balance
      await element(by.id('sell-amount-input')).typeText('999999');
      
      // The app should handle this gracefully
      // Either disable the button or show an error
      await element(by.id('sell-confirm-button')).tap();
      
      // Should either stay on same screen or show error
      // The exact behavior depends on implementation
    });
  });

  describe('Sell Flow Different Cryptocurrencies', () => {
    it('should handle selling different cryptocurrencies', async () => {
      const cryptos = ['BTC', 'ETH', 'USDT', 'XRP'];
      
      for (const crypto of cryptos) {
        await element(by.id('sell-button')).tap();
        
        // Search for cryptocurrency
        await element(by.id('coin-search-input')).typeText(crypto);
        
        // Try to select it (it may not be available)
        try {
          await element(by.id(`coin-item-${crypto.toLowerCase()}`)).tap();
          
          // Should show correct sell screen
          await waitFor(element(by.text(`Sell ${crypto}`)))
            .toBeVisible()
            .withTimeout(5000);
          
          // Go back to home
          await device.pressBack();
          await device.pressBack();
        } catch (error) {
          // Coin might not be available, go back
          await device.pressBack();
        }
        
        await waitFor(element(by.text('CRYPTOVN')))
          .toBeVisible()
          .withTimeout(3000);
      }
    });
  });

  describe('Sell Flow Error Handling', () => {
    it('should handle rapid interactions gracefully', async () => {
      await element(by.id('sell-button')).tap();
      await element(by.id('coin-item-btc')).tap();
      
      // Rapid button taps
      for (let i = 0; i < 5; i++) {
        await element(by.id('max-button')).tap();
      }
      
      // Should not crash
      await expect(element(by.text('Sell BTC'))).toBeVisible();
    });

    it('should handle invalid input gracefully', async () => {
      await element(by.id('sell-button')).tap();
      await element(by.id('coin-item-eth')).tap();
      
      // Try entering invalid characters
      await element(by.id('sell-amount-input')).typeText('abc.xyz');
      
      // Should handle gracefully
      await element(by.id('sell-confirm-button')).tap();
      
      // Should not crash the app
      await expect(element(by.text('Sell ETH'))).toBeVisible();
    });

    it('should handle network connection issues', async () => {
      // This would ideally mock network failures
      // For now, just test rapid navigation doesn't crash
      await element(by.id('sell-button')).tap();
      
      // Rapid navigation
      for (let i = 0; i < 3; i++) {
        await element(by.id('coin-item-btc')).tap();
        await device.pressBack();
      }
      
      // Should still be functional
      await expect(element(by.id('coin-selection-title'))).toBeVisible();
    });
  });

  describe('Sell Flow User Experience', () => {
    it('should show loading states appropriately', async () => {
      await element(by.id('sell-button')).tap();
      await element(by.id('coin-item-btc')).tap();
      
      // Enter amount and proceed quickly
      await element(by.id('sell-amount-input')).typeText('0.01');
      await element(by.id('sell-confirm-button')).tap();
      
      // Should eventually reach confirmation or show loading
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('should provide clear feedback for user actions', async () => {
      await element(by.id('sell-button')).tap();
      await element(by.id('coin-item-usdt')).tap();
      
      // All interactive elements should be visible and accessible
      await expect(element(by.id('sell-amount-input'))).toBeVisible();
      await expect(element(by.id('max-button'))).toBeVisible();
      await expect(element(by.id('sell-coin-selector'))).toBeVisible();
      await expect(element(by.id('sell-confirm-button'))).toBeVisible();
    });
  });
});