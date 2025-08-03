# Crypto Exchange Mobile App

A React Native Expo application for a cryptocurrency exchange platform with a modern UI design.

## Features

- 📊 Balance overview with interactive chart
- 💰 Crypto portfolio with real-time price tracking
- 🔄 Quick actions: Buy, Sell, Convert, Deposit, Withdraw
- 📈 Popular coins list with sparkline charts
- 💡 Tips carousel
- 📱 Bottom navigation

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

## Installation

1. Navigate to the project directory:
   ```bash
   cd crypto-exchange-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the App

1. Start the development server:
   ```bash
   npm start
   ```
   or
   ```bash
   expo start
   ```

2. Run on your device:
   - Scan the QR code with Expo Go (Android)
   - Scan the QR code with Camera app (iOS)

3. Run on simulators:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser

## Project Structure

```
crypto-exchange-app/
├── App.js                 # Main app entry point
├── src/
│   └── screens/
│       └── HomeScreen.js  # Home screen component
├── package.json
├── app.json              # Expo configuration
└── README.md
```

## Customization

- **Colors**: Primary orange (#FF6B00) can be changed in styles
- **Mock Data**: Update the `cryptoData` and `tipsData` arrays in HomeScreen.js
- **API Integration**: Replace mock data with real API calls
- **Navigation**: Add React Navigation for multi-screen support

## Dependencies

- `expo`: Core Expo SDK
- `react-native-svg`: For chart visualizations
- `expo-linear-gradient`: For gradient backgrounds
- `@expo/vector-icons`: Icon library

## Notes

- All data is currently mocked for demonstration
- Interactive elements log to console
- The design matches the provided UI mockup
- Ready for backend API integration