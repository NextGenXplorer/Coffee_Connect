# Expo Go Testing Mode

This document explains the changes made to enable testing in Expo Go.

## Changes Made

### 1. App.tsx
- **Lines 14-17**: Commented out ad-related imports
  - `useInterstitialAd` hook
  - `useExitAd` hook
  - `MobileAds` module

- **Lines 159-174**: Commented out Google Mobile Ads initialization

- **Lines 176-180**: Commented out ad hooks usage
  - Interstitial ad hook
  - Exit ad hook

- **Lines 217-244**: Commented out navigation state handler for showing ads

### 2. app.config.js
- **Lines 54-60**: Commented out `react-native-google-mobile-ads` plugin configuration

## Testing in Expo Go

1. Make sure you have Expo Go installed on your Android device
2. Run the following command:
   ```bash
   npx expo start
   ```
3. Scan the QR code with Expo Go app
4. The app will run without any ad functionality

## Re-enabling Ads for Production Builds

When you're ready to build for production, follow these steps:

### 1. Uncomment App.tsx
```typescript
// Change this:
// import { useInterstitialAd } from './hooks/useInterstitialAd';
// import { useExitAd } from './hooks/useExitAd';
// import MobileAds from 'react-native-google-mobile-ads';

// To this:
import { useInterstitialAd } from './hooks/useInterstitialAd';
import { useExitAd } from './hooks/useExitAd';
import MobileAds from 'react-native-google-mobile-ads';
```

Uncomment all other ad-related code blocks marked with:
`// COMMENTED OUT FOR EXPO GO TESTING`

### 2. Uncomment app.config.js
```javascript
// Change this:
// [
//   "react-native-google-mobile-ads",
//   {
//     androidAppId: "ca-app-pub-5029120740748641~1692182197",
//   }
// ]

// To this:
[
  "react-native-google-mobile-ads",
  {
    androidAppId: "ca-app-pub-5029120740748641~1692182197",
  }
]
```

### 3. Build with EAS
```bash
# Preview build
eas build --profile preview --platform android

# Production build
eas build --profile production --platform android
```

## Note
- Expo Go does NOT support native modules like `react-native-google-mobile-ads`
- You MUST use EAS Build or bare workflow for production builds with ads
- For testing ads, use EAS Build with preview profile

## Quick Reference

**Files Modified:**
- `App.tsx` - Main app file with ad initialization and hooks
- `app.config.js` - Expo configuration with ad plugin

**Search Pattern:**
Look for comments containing: `COMMENTED OUT FOR EXPO GO TESTING`
