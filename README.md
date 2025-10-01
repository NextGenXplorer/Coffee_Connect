# ReshmeInfo - Cocoon Price Tracker

A React Native mobile app for tracking cocoon prices per kg with breed-wise and market-wise filtering. Built with Expo and Firebase Firestore.

[![Download APK](https://img.shields.io/badge/Download-APK-green?logo=android)](https://download1590.mediafire.com/z35qht855d1guhGCiizYwWv9zZPR2apnbAcx3nJOnTZyNSUCoyMQdUCJPZDwr9ppBa6HB2OmONn7pJrd76VhrfuBqQF-ZfVQuALbAI3dkNixJ6UFN18IBg5ptuWeZ824mcJp7mT8t3hsRvDMYb15ixbM-2xUjwIDIRO_5R8lLgamC10/oa2o0iffgnidhgj/ReshmeInfo.apk)
## Features

- 📊 Real-time cocoon price display
- 🏷️ Breed-wise filtering (CB, BV)
- 🏪 Market-wise filtering (Ramanagara, Kollegala, Kanakapura, Siddalagatta, Kollara)
- 📈 Price statistics (Min, Max, Average)
- 🔄 Pull-to-refresh functionality
- 📱 Responsive mobile design
- ⚡ Real-time updates from Firebase Firestore

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

### 3. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Firestore Database
4. Go to Project Settings > General > Your apps
5. Add a web app and copy the config object
6. Replace the values in `.env` file with your actual Firebase credentials

### 4. Firestore Database Structure
Create a collection named `cocoonPrices` with documents containing:
```javascript
{
  breed: string,        // 'CB', 'BV'
  market: string,       // Market name
  pricePerKg: number,   // Current price per kg
  minPrice: number,     // Minimum price
  maxPrice: number,     // Maximum price
  avgPrice: number,     // Average price
  quality: string,      // 'A', 'B', 'C'
  lastUpdated: timestamp
}
```

### 5. Seed Sample Data (Optional)
```javascript
import { seedAllData } from './seedDataFinal';
// Uncomment the function call in seedDataFinal.ts and run once
seedAllData();
```

### 6. Run the App
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

## Project Structure
```
├── App.tsx              # Main app component
├── firebase.config.ts   # Firebase configuration
├── types/index.ts       # TypeScript interfaces
├── utils/priceUtils.ts  # Utility functions
├── seedData.ts          # Sample data seeding
└── assets/             # App assets
```

## Technologies Used
- React Native
- Expo
- TypeScript
- Firebase Firestore
- React Hooks

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
