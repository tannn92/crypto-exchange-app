#!/bin/bash

# Install React Navigation dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs

# Install required peer dependencies for React Navigation
npm install react-native-screens react-native-gesture-handler

echo "React Navigation packages installed successfully!"
echo "Please restart your Expo development server."