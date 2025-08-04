# E2E Testing Documentation

This project uses Detox for End-to-End (E2E) testing of the Crypto Exchange React Native app.

## Prerequisites

Before running E2E tests, ensure you have:

### For iOS Testing:
- Xcode installed with iOS Simulator
- iOS Simulator running (iPhone 15 recommended)
- Expo CLI installed globally: `npm install -g @expo/cli`

### For Android Testing:
- Android Studio installed
- Android SDK and Build Tools
- Android Emulator running (Pixel_3a_API_30_x86 or similar)
- Java Development Kit (JDK)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Detox CLI globally:**
   ```bash
   npm install -g detox-cli
   ```

## Running Tests

### iOS Tests
```bash
# Build the app for testing (first time only or after changes)
npm run build:e2e:ios

# Run E2E tests on iOS simulator
npm run test:e2e:ios
```

### Android Tests
```bash
# Build the app for testing (first time only or after changes)
npm run build:e2e:android

# Run E2E tests on Android emulator
npm run test:e2e:android
```

### Run Default Tests (iOS)
```bash
npm run test:e2e
```

## Test Structure

### Test Files:
- **`app.test.js`** - Main application functionality tests
- **`navigation.test.js`** - Navigation and safe area handling tests
- **`user-flows.test.js`** - Complete user journey tests

### Test Categories:

#### 1. App Launch and Navigation
- Basic app launch
- Tab navigation
- Screen transitions

#### 2. Home Screen Features
- Quick action buttons (Buy, Sell, Convert, Deposit, Withdraw)
- Theme toggling
- Balance display

#### 3. Send to User Flow
- Form validation
- Input handling
- Confirmation modal
- Complete transaction flow

#### 4. Safe Area Handling
- Content visibility on different device types
- Modal presentations
- Background color consistency
- Support for notch/dynamic island devices

#### 5. Navigation and Back Button Handling
- Preventing navigation loops
- Proper back button behavior
- Modal dismissal
- Deep navigation scenarios

#### 6. Error Handling and Edge Cases
- Rapid navigation
- App state changes (background/foreground)
- Orientation changes
- Network error scenarios

## Test Configuration

The tests are configured in `.detoxrc.js` with the following configurations:
- **iOS Simulator**: iPhone 15, Debug configuration
- **Android Emulator**: Pixel_3a_API_30_x86, Debug configuration

## Key Features Tested

### 1. Safe Area Implementation
Tests verify that the safe area handling works correctly across:
- Different device types (iPhone with notch, Android with gesture navigation)
- Modal presentations
- Background color consistency
- Content accessibility

### 2. Navigation Fixes
Tests ensure the navigation improvements work:
- No infinite loops in payment processing
- Proper back button handling
- Transparent modal behavior
- Tab navigation consistency

### 3. User Experience
Tests validate:
- Form validation and user input
- Button interactions and responsiveness
- Error handling and edge cases
- App stability under various conditions

## Debugging Tests

### View Test Output:
Tests will output detailed logs showing:
- Test execution steps
- Element interactions
- Navigation events
- Any failures with screenshots (if configured)

### Common Issues:

1. **Element not found**: Ensure test IDs are properly added to components
2. **Timeout errors**: Increase timeout values for slow operations
3. **Simulator issues**: Restart simulator and rebuild app
4. **App not launching**: Check Expo/React Native setup and dependencies

### Adding New Tests:

1. **Add test IDs** to new components:
   ```jsx
   <TouchableOpacity testID="my-button" onPress={handlePress}>
   ```

2. **Create test cases** following the existing pattern:
   ```javascript
   it('should perform specific action', async () => {
     await element(by.id('my-button')).tap();
     await expect(element(by.text('Expected Text'))).toBeVisible();
   });
   ```

3. **Test both happy path and edge cases**

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run E2E Tests
  run: |
    npm install
    npm run build:e2e:ios
    npm run test:e2e:ios
```

## Performance Considerations

- Tests are designed to be independent and can run in parallel
- Each test reloads the app to ensure clean state
- Timeouts are configured to handle slower operations
- Tests include cleanup and error recovery

## Maintenance

- Update test IDs when component structure changes
- Add new tests for new features
- Regularly run tests to catch regressions
- Update device configurations as needed

## Troubleshooting

### iOS Issues:
```bash
# Reset iOS simulator
xcrun simctl erase all

# Rebuild if needed
npx expo run:ios --clear
```

### Android Issues:
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Restart ADB
adb kill-server && adb start-server
```

### General Issues:
```bash
# Clear Expo cache
npx expo start --clear

# Reinstall dependencies
rm -rf node_modules && npm install
```