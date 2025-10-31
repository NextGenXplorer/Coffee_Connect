# Coffee Connect ☕

A React Native mobile app for tracking coffee prices from various depots in Karnataka, India. Built with Expo, Firebase Firestore, and TypeScript.

[![EAS Project](https://img.shields.io/badge/EAS-Project-blue?logo=expo)](https://expo.dev/accounts/mithun7411/projects/CoffeeConnect)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/NextGenXplorer/Coffee_Connect)

## 📋 Project Information

- **Package Name**: `com.master.coffeeconnect`
- **EAS Project ID**: `b5229c37-f73f-4407-a118-90083cb95221`
- **Backend URL**: https://coffee-connect-mu.vercel.app
- **Firebase Project**: `coffeeconnect-2d910`
- **Platform**: Android (React Native/Expo)

## ✨ Features

- ☕ Real-time coffee price display per 50kg bag
- 🌱 Variety-wise filtering (Arabica Parchment, Arabica Cherry)
- 🏪 Depot-wise filtering (Madikeri, Virajpete, Kushalnagar, Somvarpete, Shanivarasanthe, Sakleshpura)
- 📊 Price statistics and trends
- 📈 Interactive charts and analytics
- 🌐 Multi-language support (English, Kannada)
- 🔔 Push notifications for price updates
- 🔊 Text-to-speech price announcements
- 🤖 AI-powered data extraction (Gemini AI)
- 👨‍💼 Admin panel for price management
- 🔄 Real-time updates from Firebase Firestore

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Android Studio (for Android builds) or Xcode (for iOS builds)

### 1. Clone Repository
```bash
git clone git@github.com:NextGenXplorer/Coffee_Connect.git
cd Coffee_Connect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following structure:

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
EXPO_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
EXPO_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Admin Credentials (Configure 3 admins)
EXPO_PUBLIC_ADMIN_USERNAME_1="admin1"
EXPO_PUBLIC_ADMIN_PASSWORD_1="password1"
EXPO_PUBLIC_ADMIN_ROLE_1="super_admin"
EXPO_PUBLIC_ADMIN_MARKET_1="all"

EXPO_PUBLIC_ADMIN_USERNAME_2="admin2"
EXPO_PUBLIC_ADMIN_PASSWORD_2="password2"
EXPO_PUBLIC_ADMIN_ROLE_2="super_admin"
EXPO_PUBLIC_ADMIN_MARKET_2="all"

EXPO_PUBLIC_ADMIN_USERNAME_3="admin3"
EXPO_PUBLIC_ADMIN_PASSWORD_3="password3"
EXPO_PUBLIC_ADMIN_ROLE_3="super_admin"
EXPO_PUBLIC_ADMIN_MARKET_3="all"

# Backend URL (Vercel deployment)
EXPO_PUBLIC_BACKEND_URL="https://coffee-connect-mu.vercel.app"

# Google Gemini AI (for AI data extraction)
EXPO_PUBLIC_GEMINI_API_KEY="your-gemini-api-key"
```

### 4. EAS Environment Variables

Use the provided `eascred.sh` script to upload environment variables to EAS:

```bash
# Dry run first to verify
bash eascred.sh --env .env --dry-run

# Upload to EAS production environment
bash eascred.sh --env .env
```

**Important Note about EXPO_PUBLIC_ variables:**
- Variables prefixed with `EXPO_PUBLIC_` are embedded in the compiled app
- They use **"sensitive"** visibility in EAS (NOT "secret")
- They will be visible in plain text in your compiled app
- Never store truly secret keys in `EXPO_PUBLIC_` variables
- The script automatically handles this correctly

### 5. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: `coffeeconnect-2d910` (or your own)
3. Enable **Firestore Database**
4. Enable **Cloud Messaging** for push notifications
5. Add an Android app with package name: `com.master.coffeeconnect`
6. Download `google-services.json` and place it in the root directory
7. Set up Firestore security rules (see below)

### 6. Firestore Database Structure

Create collections with the following structure:

#### Collection: `coffeePrices`
```javascript
{
  breed: string,           // 'CB' (Arabica Parchment) or 'BV' (Arabica Cherry)
  market: string,          // Depot name (Madikeri, Virajpete, etc.)
  maxPrice: number,        // Maximum price per 50kg bag
  minPrice: number,        // Minimum price per 50kg bag
  pricePerKg: number,      // Price used for calculations
  quality: string,         // 'A', 'B', 'C'
  source: string,          // Admin username who added this price
  verified: boolean,       // Admin verification status
  lastUpdated: timestamp,  // Firestore timestamp
  expiresAt: timestamp     // Auto-delete after 7 days
}
```

#### Collection: `pushTokens`
```javascript
{
  token: string,           // FCM or Expo push token
  platform: string,        // 'fcm' or 'expo'
  createdAt: timestamp
}
```

#### Collection: `notifications`
```javascript
{
  title: string,
  message: string,
  imageUrl: string | null,
  priceData: object,
  sentAt: timestamp,
  totalSent: number,
  totalFailed: number
}
```

### 7. Backend Setup

The backend is deployed on Vercel at: https://coffee-connect-mu.vercel.app

To deploy your own backend:

1. Navigate to backend directory:
```bash
cd backend
```

2. Create `.env` file with Firebase service account:
```bash
PORT=3000
FIREBASE_PROJECT_ID=coffeeconnect-2d910
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

3. Deploy to Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 8. Run the App

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## 🏗️ Building for Production

### Android APK/AAB Build

```bash
# Build APK for testing
eas build --platform android --profile preview

# Build AAB for Google Play Store
eas build --platform android --profile production
```

### iOS Build

```bash
# Build for TestFlight/App Store
eas build --platform ios --profile production
```

## 📱 App Structure

```
Coffee_Connect/
├── App.tsx                          # Main app entry point
├── app.config.js                    # Expo/EAS configuration
├── firebase.config.ts               # Firebase initialization
├── i18n.ts                          # Internationalization setup
├── eascred.sh                       # EAS environment variables script
│
├── screens/                         # App screens
│   ├── HomeScreen.tsx               # Main price listing screen
│   ├── StatsScreen.tsx              # Analytics and statistics
│   ├── MarketScreen.tsx             # Market-wise comparison
│   ├── AboutScreen.tsx              # About and contact info
│   ├── NotificationsScreen.tsx      # Notification history
│   ├── LanguageSelectionScreen.tsx  # Language picker (first launch)
│   ├── AdminLoginScreen.tsx         # Admin authentication
│   ├── AdminDashboardScreen.tsx     # Admin price management
│   ├── AdminPriceFormScreen.tsx     # Manual price entry form
│   └── AdminAIExtractScreen.tsx     # AI-powered data extraction
│
├── components/                      # Reusable components
│   └── Header.tsx                   # Common header component
│
├── utils/                           # Utility functions
│   ├── adminAuth.ts                 # Admin authentication logic
│   └── aiExtraction.ts              # Gemini AI integration
│
├── types/                           # TypeScript type definitions
│   └── index.ts                     # Common interfaces
│
├── locales/                         # Translation files
│   ├── en.json                      # English translations
│   └── kn.json                      # Kannada translations
│
├── assets/                          # App assets
│   ├── coffee_logo.png              # App icon/logo
│   └── ...
│
└── backend/                         # Node.js backend (Vercel)
    ├── server.js                    # Express server with push notifications
    ├── .env                         # Backend environment variables
    └── package.json                 # Backend dependencies
```

## 🎨 Coffee Depots & Varieties

### Supported Depots (Markets)
- **Madikeri** (ಮಡಿಕೇರಿ)
- **Virajpete** (ವಿರಾಜಪೇಟೆ)
- **Kushalnagar** (ಕುಶಾಲನಗರ)
- **Somvarpete** (ಸೋಮವಾರಪೇಟೆ)
- **Shanivarasanthe** (ಶನಿವಾರಸಂತೆ)
- **Sakleshpura** (ಸಕಲೇಶಪುರ)

### Coffee Varieties
- **CB** - Arabica Parchment (ಅರೇಬಿಕಾ ಪಾರ್ಚ್‌ಮೆಂಟ್)
- **BV** - Arabica Cherry (ಅರೇಬಿಕಾ ಚೆರ್ರಿ)

### Quality Grades
- **Grade A** - Premium quality
- **Grade B** - Standard quality
- **Grade C** - Basic quality

## 🔐 Admin Features

### Admin Roles
- **super_admin**: Full access to all depots
- **market_admin**: Access to specific depot only

### Admin Capabilities
1. **Manual Price Entry**: Add prices with breed, depot, grade selection
2. **AI Data Extraction**: Paste price data (Kannada/English), AI extracts structured data
3. **Price Management**: Edit, delete existing prices
4. **Push Notifications**: Automatic notifications on price updates
5. **Dashboard Analytics**: View statistics and recent updates

### Accessing Admin Panel
1. Open app and navigate to "About" screen
2. Tap "Admin Panel" at the bottom
3. Login with admin credentials
4. Choose between Manual Entry or AI Extraction

## 🤖 AI Data Extraction

The app uses **Google Gemini AI** to extract structured price data from raw text (Kannada or English).

**How it works:**
1. Admin pastes depot price data (e.g., from WhatsApp, SMS)
2. AI automatically identifies:
   - Depot name
   - Date
   - Coffee varieties (Parchment/Cherry)
   - Prices (Max and Min per 50kg bag)
3. Admin reviews and confirms extracted data
4. Prices are saved to Firebase

**Supported Input Formats:**
- Kannada text with coffee prices
- English text with coffee prices
- Mixed Kannada-English text
- Price tables and lists

## 🔔 Push Notifications

The app supports two notification systems:

1. **FCM (Firebase Cloud Messaging)**: For Android native push
2. **Expo Push Notifications**: Fallback for Expo Go

**Notification Triggers:**
- New price added by admin
- Price update for specific depot/variety

**Backend Integration:**
- Node.js server on Vercel
- Sends notifications to all registered tokens
- Includes price details and depot information
- Supports rich notifications with images

## 🌐 Internationalization (i18n)

The app supports:
- **English** (en)
- **Kannada** (kn) - ಕನ್ನಡ

Translation files: `locales/en.json` and `locales/kn.json`

**Language Selection:**
- First launch: Language picker screen
- Settings: Change language anytime from About screen
- Persistent: Language preference saved in AsyncStorage

## 🛠️ Technologies Used

- **React Native** - Cross-platform mobile framework
- **Expo** (SDK 54) - Development platform
- **TypeScript** - Type-safe JavaScript
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Cloud Messaging** - Push notifications
- **Google Gemini AI** - AI data extraction
- **React Navigation** - Navigation library
- **i18next** - Internationalization framework
- **Expo Speech** - Text-to-speech
- **AsyncStorage** - Local data persistence
- **Express.js** - Backend server (Node.js)
- **Vercel** - Serverless deployment

## 📝 Migration from Reshme Info

This app was migrated from **Reshme Info** (silk/cocoon price tracking) to **Coffee Connect**:

### Key Changes:
- ✅ Package name: `com.reshmeinfo` → `com.master.coffeeconnect`
- ✅ App name: Reshme Info → Coffee Connect
- ✅ Collection: `cocoonPrices` → `coffeePrices`
- ✅ Markets: Silk markets → Coffee depots
- ✅ Breeds: CB/BV (silk) → CB/BV (coffee varieties)
- ✅ Price unit: Per kg → Per 50kg bag
- ✅ Icons: Leaf → Coffee bean
- ✅ Backend: reshme-info.vercel.app → coffee-connect-mu.vercel.app
- ✅ EAS Project: New project initialized
- ✅ Firebase: New project setup
- ✅ All translations updated
- ✅ AI extraction retrained for coffee data

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the 0BSD License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **NextGenXplorer** - [GitHub](https://github.com/NextGenXplorer)

## 📞 Support

- **Email**: nxgextra@gmail.com
- **GitHub Issues**: [Report a bug](https://github.com/NextGenXplorer/Coffee_Connect/issues)
- **WhatsApp Channel**: [Join](https://whatsapp.com/channel/0029VaU05uG9RZAeiXKyEu06)
- **Instagram**: [@nexgenxplorerr](https://www.instagram.com/nexgenxplorerr)

## 🙏 Acknowledgments

- Coffee farmers and depot managers for price information
- Firebase for backend infrastructure
- Google Gemini AI for data extraction capabilities
- Expo team for the amazing development platform

---

**Made with ❤️ for coffee farmers and traders in Karnataka**

🤖 *Documentation generated with [Claude Code](https://claude.com/claude-code)*
