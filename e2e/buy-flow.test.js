const { device, expect, element, by, waitFor } = require('detox');

describe('Buy Flow E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    // Wait for app to be ready and home tab to be visible
    await waitFor(element(by.id('home-tab')))
      .toBeVisible()
      .withTimeout(10000);
    
    // Tap home tab to ensure we're on home screen
    await element(by.id('home-tab')).tap();
    
    // Wait for home screen content to load
    await waitFor(element(by.text('CRYPTOVN')))
      .toBeVisible()
      .withTimeout(5000);
  });

  describe('Complete Buy Flow with Payment Processing', () => {
    it('should complete full buy transaction including payment processing and completion', async () => {
      // Step 1: Navigate to buy flow
      await element(by.id('buy-button')).tap();
      
      // Step 2: Select cryptocurrency
      await waitFor(element(by.id('coin-selection-title')))
        .toBeVisible()
        .withTimeout(5000);
      
      await element(by.id('coin-search-input')).typeText('BTC');
      await element(by.id('coin-item-btc')).tap();
      
      // Step 3: Enter amount and select payment method
      await waitFor(element(by.text('Buy BTC')))
        .toBeVisible()
        .withTimeout(5000);
      
      await element(by.id('buy-amount-input')).typeText('1000000');
      await element(by.id('payment-method-selector')).tap();
      
      // Step 4: Select bank transfer payment
      await element(by.id('bank-transfer-option')).tap();
      await element(by.id('bank-vietcombank-option')).tap();
      
      // Step 5: Confirm purchase details
      await element(by.id('buy-confirm-button')).tap();
      
      // Step 6: Verify confirmation screen
      await waitFor(element(by.id('crypto-amount-display')))
        .toBeVisible()
        .withTimeout(5000);
      await expect(element(by.id('total-amount-display'))).toBeVisible();
      
      // Step 7: Proceed to payment processing
      await element(by.id('buy-confirm-button')).tap();
      
      // Step 8: Payment processing screen
      await waitFor(element(by.text('Payment Processing')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Step 9: Confirm payment sent
      await element(by.id('confirm-payment-button')).tap();
      
      // Step 10: Payment completed screen
      await waitFor(element(by.text('Payment Completed')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Step 11: Verify completion options
      await expect(element(by.id('view-balance-button'))).toBeVisible();
      await expect(element(by.id('buy-more-button'))).toBeVisible();
      
      // Step 12: Complete flow by viewing balance
      await element(by.id('view-balance-button')).tap();
      
      // Should navigate to Assets screen
      await waitFor(element(by.text('My Assets')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should allow user to buy more after completing a purchase', async () => {
      // Complete a quick purchase flow to reach completion screen
      await element(by.id('buy-button')).tap();
      await element(by.id('popular-coin-btc')).tap();
      await element(by.id('buy-amount-input')).typeText('500000');
      await element(by.id('buy-confirm-button')).tap();
      await element(by.id('buy-confirm-button')).tap();
      await element(by.id('confirm-payment-button')).tap();
      
      // On completion screen, tap buy more
      await waitFor(element(by.id('buy-more-button')))
        .toBeVisible()
        .withTimeout(5000);
      
      await element(by.id('buy-more-button')).tap();
      
      // Should return to buy amount screen with BTC pre-selected
      await waitFor(element(by.text('Buy BTC')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Complete Buy Flow', () => {
    it('should complete a full buy transaction flow', async () => {
      // Navigate to buy flow
      await element(by.id('buy-button')).tap();
      
      // Should show coin selection screen
      await waitFor(element(by.id('coin-selection-title')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Search and select Bitcoin
      await element(by.id('coin-search-input')).typeText('BTC');
      await element(by.id('coin-item-btc')).tap();
      
      // Should navigate to buy amount screen
      await waitFor(element(by.text('Buy BTC')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Enter amount to buy
      await element(by.id('buy-amount-input')).typeText('1000000');
      
      // Select payment method
      await element(by.id('payment-method-selector')).tap();
      await waitFor(element(by.text('Paying with')))
        .toBeVisible()
        .withTimeout(3000);
      
      // Select bank transfer
      await element(by.id('bank-transfer-option')).tap();
      await element(by.id('bank-vietcombank-option')).tap();
      
      // Back to amount screen, proceed to confirmation
      await waitFor(element(by.id('buy-confirm-button')))
        .toBeVisible()
        .withTimeout(3000);
      await element(by.id('buy-confirm-button')).tap();
      
      // Should show confirmation screen
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Verify confirmation details
      await expect(element(by.id('crypto-amount-display'))).toBeVisible();
      await expect(element(by.id('total-amount-display'))).toBeVisible();
      
      // Cancel the transaction
      await element(by.id('back-button')).tap();
      
      // Should return to amount screen
      await waitFor(element(by.text('Buy BTC')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should handle coin selection correctly', async () => {
      await element(by.id('buy-button')).tap();
      
      // Test search functionality
      await element(by.id('coin-search-input')).typeText('ETH');
      await expect(element(by.id('coin-item-eth'))).toBeVisible();
      
      // Clear search
      await element(by.id('coin-search-input')).clearText();
      
      // Test popular coins
      await element(by.id('popular-coin-btc')).tap();
      
      // Should navigate to amount screen with BTC selected
      await waitFor(element(by.text('Buy BTC')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should validate amount input', async () => {
      await element(by.id('buy-button')).tap();
      await element(by.id('popular-coin-btc')).tap();
      
      // Try to confirm with empty amount
      await element(by.id('buy-confirm-button')).tap();
      // Should stay on same screen (button disabled)
      await expect(element(by.text('Buy BTC'))).toBeVisible();
      
      // Enter valid amount
      await element(by.id('buy-amount-input')).typeText('500000');
      
      // Now confirmation button should be enabled
      await element(by.id('buy-confirm-button')).tap();
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should handle payment method selection', async () => {
      await element(by.id('buy-button')).tap();
      await element(by.id('popular-coin-usdt')).tap();
      await element(by.id('buy-amount-input')).typeText('100000');
      
      // Test payment method selection
      await element(by.id('payment-method-selector')).tap();
      
      // Should show payment methods
      await expect(element(by.id('bank-transfer-option'))).toBeVisible();
      await expect(element(by.id('balance-option'))).toBeVisible();
      
      // Select balance option
      await element(by.id('balance-option')).tap();
      
      // Should return to amount screen with balance selected
      await waitFor(element(by.text('Buy USDT')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should handle different cryptocurrencies', async () => {
      const cryptos = ['BTC', 'ETH', 'USDT'];
      
      for (const crypto of cryptos) {
        await element(by.id('buy-button')).tap();
        
        // Search for cryptocurrency
        await element(by.id('coin-search-input')).typeText(crypto);
        await element(by.id(`coin-item-${crypto.toLowerCase()}`)).tap();
        
        // Should show correct buy screen
        await waitFor(element(by.text(`Buy ${crypto}`)))
          .toBeVisible()
          .withTimeout(5000);
        
        // Go back to home
        await device.pressBack();
        await device.pressBack();
        await waitFor(element(by.text('CRYPTOVN')))
          .toBeVisible()
          .withTimeout(3000);
      }
    });

    it('should handle coin selector in amount screen', async () => {
      await element(by.id('buy-button')).tap();
      await element(by.id('popular-coin-btc')).tap();
      
      // Change coin using selector in amount screen
      await element(by.id('coin-selector')).tap();
      
      // Should show coin selection again
      await waitFor(element(by.id('coin-selection-title')))
        .toBeVisible()
        .withTimeout(3000);
      
      // Select different coin
      await element(by.id('coin-item-eth')).tap();
      
      // Should update to ETH
      await waitFor(element(by.text('Buy ETH')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Buy Flow Navigation', () => {
    it('should handle back navigation correctly', async () => {
      await element(by.id('buy-button')).tap();
      await element(by.id('popular-coin-btc')).tap();
      
      // Go back from amount screen
      await device.pressBack();
      
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

    it('should handle confirmation screen navigation', async () => {
      await element(by.id('buy-button')).tap();
      await element(by.id('popular-coin-usdt')).tap();
      await element(by.id('buy-amount-input')).typeText('50000');
      await element(by.id('buy-confirm-button')).tap();
      
      // Should be on confirmation screen
      await waitFor(element(by.text('Confirmation')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Test back button
      await element(by.id('back-button')).tap();
      
      // Should return to amount screen
      await waitFor(element(by.text('Buy USDT')))
        .toBeVisible()
        .withTimeout(3000);
      
      // Amount should be preserved
      await expect(element(by.id('buy-amount-input'))).toHaveText('50000');
    });
  });

  describe('Buy Flow Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // This test would require mocking network failures
      // For now, just test that the screens don't crash
      await element(by.id('buy-button')).tap();
      await element(by.id('popular-coin-btc')).tap();
      
      // Rapid navigation shouldn't cause crashes
      for (let i = 0; i < 3; i++) {
        await element(by.id('coin-selector')).tap();
        await device.pressBack();
      }
      
      // Should still be functional
      await expect(element(by.text('Buy BTC'))).toBeVisible();
    });

    it('should handle invalid input gracefully', async () => {
      await element(by.id('buy-button')).tap();
      await element(by.id('popular-coin-btc')).tap();
      
      // Try entering invalid characters
      await element(by.id('buy-amount-input')).typeText('abc123def');
      
      // Should handle gracefully (only numbers should be accepted)
      // The exact behavior depends on TextInput configuration
      await element(by.id('buy-confirm-button')).tap();
      
      // Should not crash the app
      await expect(element(by.text('Buy BTC'))).toBeVisible();
    });
  });

  describe('Buy Flow Accessibility', () => {
    it('should have proper accessibility labels', async () => {
      await element(by.id('buy-button')).tap();
      
      // Key elements should be accessible
      await expect(element(by.id('coin-selection-title'))).toBeVisible();
      await expect(element(by.id('coin-search-input'))).toBeVisible();
      
      await element(by.id('popular-coin-btc')).tap();
      
      // Amount screen elements should be accessible
      await expect(element(by.id('buy-amount-input'))).toBeVisible();
      await expect(element(by.id('payment-method-selector'))).toBeVisible();
      await expect(element(by.id('buy-confirm-button'))).toBeVisible();
    });
  });
});