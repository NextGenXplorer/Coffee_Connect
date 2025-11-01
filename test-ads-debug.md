# Ad Display Issues - Debugging Checklist

## Common Reasons Ads Don't Display:

### 1. New Ad Units (Most Common)
- **New ad units take 24-48 hours to activate** after creation
- Even with valid IDs, AdMob needs time to approve and activate
- Test ads should still work during this period

### 2. Test Ads vs Production Ads
- In development mode (__DEV__ = true), should use test IDs
- Check if you're testing on a device or emulator
- Test ads appear as "Test Ad" label

### 3. AdMob Account Status
- Account needs to be fully verified
- Payment information must be added
- App must be approved by AdMob

### 4. Package Name Mismatch
- google-services.json package: com.master.coffeeconnect ✅
- app.config.js package: com.master.coffeeconnect ✅
- AdMob console: Must match exactly

### 5. Build Configuration
- Must be built with EAS or expo prebuild
- Cannot test ads properly in Expo Go
- Need actual APK/AAB build to test real ads

## Quick Fixes to Try:

### Fix 1: Use Test Ads First
Update ad unit IDs to use test IDs to verify ads work:
