import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, TouchableOpacity, View, StyleSheet, Platform, Alert, ActivityIndicator } from 'react-native';
import './i18n';
import * as Notifications from 'expo-notifications';
import { db } from './firebase.config';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Google Mobile Ads for Coffee Connect
import { useInterstitialAd } from './hooks/useInterstitialAd';
import { useExitAd } from './hooks/useExitAd';
import MobileAds from 'react-native-google-mobile-ads';

// Create context for notifications navigation
const NotificationsContext = createContext<{
  openNotifications: () => void;
} | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
};

// Import screen components
import HomeScreen from './screens/HomeScreen';
import MarketScreen from './screens/MarketScreen';
import StatsScreen from './screens/StatsScreen';
import AboutScreen from './screens/AboutScreen';
import AdminNavigator from './screens/AdminNavigator';
import LanguageSelectionScreen from './screens/LanguageSelectionScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SwipeableScreen from './components/SwipeableScreen';

const Tab = createBottomTabNavigator();

// Tab screen order for swipe navigation
const TAB_SCREENS = ['Home', 'Market', 'Stats', 'About'];

// Configure notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token: string | undefined;

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Push notifications permission is required to receive price alerts and updates.',
        [{ text: 'OK' }]
      );
      return undefined;
    }

    // Get device-specific FCM token for production (works in standalone APK)
    // Falls back to Expo token for development in Expo Go
    try {
      const deviceToken = await Notifications.getDevicePushTokenAsync();
      token = deviceToken.data;
      console.log('FCM Push Token (Production):', token);
    } catch (deviceTokenError) {
      console.log('Could not get FCM token, falling back to Expo token (Development)');
      const expoPushToken = await Notifications.getExpoPushTokenAsync();
      token = expoPushToken.data;
      console.log('Expo Push Token (Development):', token);
    }

    if (token) {
      await setDoc(doc(db, "pushTokens", token), {
        token: token,
        createdAt: new Date(),
        platform: Platform.OS,
        tokenType: token.startsWith('ExponentPushToken') ? 'expo' : 'fcm',
        deviceInfo: {
          os: Platform.OS,
          version: Platform.Version,
        },
      });
      console.log('Push token saved to Firestore');
    }

    return token;
  } catch (error) {
    console.error('Error in registerForPushNotificationsAsync:', error);
    Alert.alert(
      'Notification Setup Error',
      'Failed to set up push notifications. Please try again later.',
      [{ text: 'OK' }]
    );
    return undefined;
  }
}

const FIRST_LAUNCH_KEY = '@coffee_first_launch_completed';

const AppContent = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showNotificationsScreen, setShowNotificationsScreen] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | false>(false);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const [previousRoute, setPreviousRoute] = useState<string>('Home');
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [isCheckingFirstLaunch, setIsCheckingFirstLaunch] = useState(true);

  // Check if this is the first launch
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasCompletedFirstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
        if (!hasCompletedFirstLaunch) {
          setShowLanguageSelection(true);
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
        // On error, skip language selection to avoid blocking the app
      } finally {
        setIsCheckingFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  // Initialize Google Mobile Ads for Coffee Connect
  useEffect(() => {
    console.log('🚀 Initializing Google Mobile Ads...');
    console.log('🔧 Environment:', __DEV__ ? 'DEVELOPMENT' : 'PRODUCTION');

    MobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('✅ AdMob initialized successfully!');
        console.log('📊 Adapter statuses:', JSON.stringify(adapterStatuses, null, 2));
      })
      .catch(error => {
        console.error('❌ AdMob initialization error:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
      });
  }, []);

  // Interstitial ad hook for tab navigation
  const { showAd, isLoaded } = useInterstitialAd();

  // Exit ad hook - shows rewarded interstitial when user presses back button
  useExitAd({ enabled: true });

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        console.log('Push notifications registered successfully');
      }
    });

    // Listen for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      setNotification(notification);
    });

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      const data = response.notification.request.content.data;

      // Handle notification tap - can add navigation logic here
      if (data?.screen) {
        console.log('Navigate to screen:', data.screen);
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  // Handle navigation state changes to show interstitial ads
  const handleNavigationStateChange = (state: any) => {
    if (!state) return;

    const currentRoute = state.routes[state.index]?.name;

    console.log(`📍 Navigation: ${previousRoute} → ${currentRoute}`);
    console.log(`📊 Ad Status: isLoaded=${isLoaded}`);

    // Show interstitial ad occasionally when switching tabs (not every time to avoid annoyance)
    // TEMPORARY: Show ad 100% of time for testing (change 1.0 back to 0.3 for production)
    const AD_SHOW_PROBABILITY = 1.0; // Set to 0.3 for production (30% chance)
    const randomChance = Math.random();
    console.log(`🎲 Random chance: ${randomChance} (need < ${AD_SHOW_PROBABILITY})`);

    if (currentRoute && currentRoute !== previousRoute && isLoaded && randomChance < AD_SHOW_PROBABILITY) {
      console.log(`🎬 Showing interstitial ad: ${previousRoute} → ${currentRoute}`);
      showAd();
    } else if (currentRoute !== previousRoute) {
      if (!isLoaded) {
        console.log('⏳ Ad not loaded yet, skipping');
      } else if (randomChance >= 0.3) {
        console.log('🎲 Random chance missed (30% probability), skipping ad');
      }
    }

    setPreviousRoute(currentRoute);
  };

  return (
    <NotificationsContext.Provider value={{ openNotifications: () => setShowNotificationsScreen(true) }}>
      {/* Show loading spinner while checking first launch */}
      {isCheckingFirstLaunch ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF8E7', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#6F4E37" />
          <StatusBar style="dark" />
        </SafeAreaView>
      ) : showLanguageSelection ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <LanguageSelectionScreen onComplete={() => setShowLanguageSelection(false)} />
          <StatusBar style="dark" />
        </SafeAreaView>
      ) : showNotificationsScreen ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <NotificationsScreen onBack={() => setShowNotificationsScreen(false)} />
          <StatusBar style="dark" />
        </SafeAreaView>
      ) : showAdminPanel ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
          <AdminNavigator onExit={() => setShowAdminPanel(false)} />
          <StatusBar style="dark" />
        </SafeAreaView>
      ) : (
        <NavigationContainer onStateChange={handleNavigationStateChange}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF8E7' }}>

          <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string = 'home';

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Market') {
                iconName = focused ? 'business' : 'business-outline';
              } else if (route.name === 'Stats') {
                iconName = focused ? 'analytics' : 'analytics-outline';
              } else if (route.name === 'About') {
                iconName = focused ? 'information-circle' : 'information-circle-outline';
              }

              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#6F4E37',
            tabBarInactiveTintColor: '#A0826D',
            tabBarStyle: {
              backgroundColor: '#FFF8E7',
              borderTopWidth: 1,
              borderTopColor: '#D4A574',
              paddingTop: 8,
              paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
              height: 70 + insets.bottom,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 8,
            },
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: '600',
              marginTop: 4,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen
            name="Home"
            options={{
              tabBarLabel: t('home'),
            }}
          >
            {() => (
              <SwipeableScreen currentIndex={0} screens={TAB_SCREENS}>
                <HomeScreen />
              </SwipeableScreen>
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Market"
            options={{
              tabBarLabel: t('market'),
            }}
          >
            {() => (
              <SwipeableScreen currentIndex={1} screens={TAB_SCREENS}>
                <MarketScreen />
              </SwipeableScreen>
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Stats"
            options={{
              tabBarLabel: t('stats'),
            }}
          >
            {() => (
              <SwipeableScreen currentIndex={2} screens={TAB_SCREENS}>
                <StatsScreen />
              </SwipeableScreen>
            )}
          </Tab.Screen>
          <Tab.Screen
            name="About"
            options={{
              tabBarLabel: t('about'),
            }}
          >
            {() => (
              <SwipeableScreen currentIndex={3} screens={TAB_SCREENS}>
                <AboutScreen setShowAdminPanel={setShowAdminPanel} />
              </SwipeableScreen>
            )}
          </Tab.Screen>
        </Tab.Navigator>
        <StatusBar style="dark" />
      </SafeAreaView>
    </NavigationContainer>
      )}
    </NotificationsContext.Provider>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});