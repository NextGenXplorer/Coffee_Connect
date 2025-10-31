// Load environment variables from .env file (for local development)
// In EAS Build, environment variables are already in process.env (no .env file needed)
if (process.env.EAS_BUILD !== 'true') {
  require('dotenv').config();
}

module.exports = {
  expo: {
    name: "Coffee Connect",
    slug: "CoffeeConnect",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/coffee_logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/coffee_logo.png",
      resizeMode: "contain",
      backgroundColor: "#3E2723"
    },
    android: {
      package: "com.master.coffeeconnect", // Unique Android package name
      adaptiveIcon: {
        foregroundImage: "./assets/coffee_logo.png",
        backgroundColor: "#3E2723"
      },
      icon: "./assets/coffee_logo.png", // Notification icon
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      googleServicesFile: "./google-services.json",
      permissions: [
        "android.permission.POST_NOTIFICATIONS",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE",
        "WAKE_LOCK"
      ]
    },
    notification: {
      icon: "./assets/coffee_logo.png",
      color: "#6F4E37",
      androidMode: "default",
      androidCollapsedTitle: "Coffee Connect Updates"
    },
    plugins: [
      "expo-font",
      [
        "expo-notifications",
        {
          icon: "./assets/coffee_logo.png",
          color: "#6F4E37",
          sounds: []
        }
      ],
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-5029120740748641~1692182197", // Production AdMob App ID for Coffee Connect
        }
      ]
    ],
    web: {
      favicon: "./assets/coffee_logo.png"
    },
    extra: {
      // Firebase Environment Variables
      EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,

      // Admin Credentials
      EXPO_PUBLIC_ADMIN_USERNAME_1: process.env.EXPO_PUBLIC_ADMIN_USERNAME_1,
      EXPO_PUBLIC_ADMIN_PASSWORD_1: process.env.EXPO_PUBLIC_ADMIN_PASSWORD_1,
      EXPO_PUBLIC_ADMIN_ROLE_1: process.env.EXPO_PUBLIC_ADMIN_ROLE_1,
      EXPO_PUBLIC_ADMIN_MARKET_1: process.env.EXPO_PUBLIC_ADMIN_MARKET_1,

      EXPO_PUBLIC_ADMIN_USERNAME_2: process.env.EXPO_PUBLIC_ADMIN_USERNAME_2,
      EXPO_PUBLIC_ADMIN_PASSWORD_2: process.env.EXPO_PUBLIC_ADMIN_PASSWORD_2,
      EXPO_PUBLIC_ADMIN_ROLE_2: process.env.EXPO_PUBLIC_ADMIN_ROLE_2,
      EXPO_PUBLIC_ADMIN_MARKET_2: process.env.EXPO_PUBLIC_ADMIN_MARKET_2,

      EXPO_PUBLIC_ADMIN_USERNAME_3: process.env.EXPO_PUBLIC_ADMIN_USERNAME_3,
      EXPO_PUBLIC_ADMIN_PASSWORD_3: process.env.EXPO_PUBLIC_ADMIN_PASSWORD_3,
      EXPO_PUBLIC_ADMIN_ROLE_3: process.env.EXPO_PUBLIC_ADMIN_ROLE_3,
      EXPO_PUBLIC_ADMIN_MARKET_3: process.env.EXPO_PUBLIC_ADMIN_MARKET_3,

      // EAS Project ID for Coffee Connect
      eas: {
        projectId: "b5229c37-f73f-4407-a118-90083cb95221"
      }
    }
  }
};
