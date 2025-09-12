const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts.push(
  // Add any additional asset extensions you need
  'bin', 'txt', 'jpg', 'png', 'json', 'svg'
);

// Add support for additional source extensions
config.resolver.sourceExts.push('ts', 'tsx', 'js', 'jsx', 'json');

// Fix for web platform - exclude expo-router from web builds
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Web-specific configuration
config.resolver.alias = {
  ...config.resolver.alias,
  // Exclude expo-router for web
  'expo-router': false,
};

module.exports = config;
