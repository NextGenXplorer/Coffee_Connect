import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase.config';

// Sample Coffee Prices Data - Arabica and Robusta varieties
const sampleCoffeePrices = [
  // Madikeri Market
  {
    breed: 'Arabica Parchment',
    market: 'Madikeri',
    pricePerKg: 8500,
    minPrice: 8200,
    maxPrice: 8800,
    avgPrice: 8500,
    quality: 'A',
    source: 'market_admin',
    verified: true,
    location: {
      state: 'Karnataka',
      district: 'Kodagu',
      pincode: '571201'
    },
    lastUpdated: Timestamp.now(),
  },
  {
    breed: 'Arabica Cherry',
    market: 'Madikeri',
    pricePerKg: 4500,
    minPrice: 4200,
    maxPrice: 4800,
    avgPrice: 4500,
    quality: 'A',
    source: 'market_admin',
    verified: true,
    location: {
      state: 'Karnataka',
      district: 'Kodagu',
      pincode: '571201'
    },
    lastUpdated: Timestamp.now(),
  },
  {
    breed: 'Robusta Parchment',
    market: 'Madikeri',
    pricePerKg: 5200,
    minPrice: 5000,
    maxPrice: 5400,
    avgPrice: 5200,
    quality: 'A',
    source: 'market_admin',
    verified: true,
    location: {
      state: 'Karnataka',
      district: 'Kodagu',
      pincode: '571201'
    },
    lastUpdated: Timestamp.now(),
  },
  {
    breed: 'Robusta Cherry',
    market: 'Madikeri',
    pricePerKg: 2800,
    minPrice: 2600,
    maxPrice: 3000,
    avgPrice: 2800,
    quality: 'A',
    source: 'market_admin',
    verified: true,
    location: {
      state: 'Karnataka',
      district: 'Kodagu',
      pincode: '571201'
    },
    lastUpdated: Timestamp.now(),
  },

  // Virajpete Market
  {
    breed: 'Arabica Parchment',
    market: 'Virajpete',
    pricePerKg: 8400,
    minPrice: 8100,
    maxPrice: 8700,
    avgPrice: 8400,
    quality: 'A',
    source: 'market_admin',
    verified: true,
    location: {
      state: 'Karnataka',
      district: 'Kodagu',
      pincode: '571218'
    },
    lastUpdated: Timestamp.now(),
  },
  {
    breed: 'Robusta Parchment',
    market: 'Virajpete',
    pricePerKg: 5100,
    minPrice: 4900,
    maxPrice: 5300,
    avgPrice: 5100,
    quality: 'A',
    source: 'daily_update',
    verified: true,
    location: {
      state: 'Karnataka',
      district: 'Kodagu',
      pincode: '571218'
    },
    lastUpdated: Timestamp.now(),
  },

  // Kushalnagar Market
  {
    breed: 'Arabica Cherry',
    market: 'Kushalnagar',
    pricePerKg: 4400,
    minPrice: 4100,
    maxPrice: 4700,
    avgPrice: 4400,
    quality: 'B',
    source: 'market_admin',
    verified: true,
    location: {
      state: 'Karnataka',
      district: 'Kodagu',
      pincode: '571234'
    },
    lastUpdated: Timestamp.now(),
  },
  {
    breed: 'Robusta Cherry',
    market: 'Kushalnagar',
    pricePerKg: 2700,
    minPrice: 2500,
    maxPrice: 2900,
    avgPrice: 2700,
    quality: 'B',
    source: 'daily_update',
    verified: true,
    location: {
      state: 'Karnataka',
      district: 'Kodagu',
      pincode: '571234'
    },
    lastUpdated: Timestamp.now(),
  },

  // Somvarpete Market
  {
    breed: 'Arabica Parchment',
    market: 'Somvarpete',
    pricePerKg: 8300,
    minPrice: 8000,
    maxPrice: 8600,
    avgPrice: 8300,
    quality: 'A',
    source: 'market_admin',
    verified: true,
    location: {
      state: 'Karnataka',
      district: 'Kodagu',
      pincode: '571236'
    },
    lastUpdated: Timestamp.now(),
  },
  {
    breed: 'Robusta Parchment',
    market: 'Somvarpete',
    pricePerKg: 5000,
    minPrice: 4800,
    maxPrice: 5200,
    avgPrice: 5000,
    quality: 'B',
    source: 'daily_update',
    verified: true,
    location: {
      state: 'Karnataka',
      district: 'Kodagu',
      pincode: '571236'
    },
    lastUpdated: Timestamp.now(),
  },

  // Shanivarasanthe Market
  {
    breed: 'Arabica Cherry',
    market: 'Shanivarasanthe',
    pricePerKg: 4300,
    minPrice: 4000,
    maxPrice: 4600,
    avgPrice: 4300,
    quality: 'B',
    source: 'daily_update',
    verified: true,
    location: {
      state: 'Karnataka',
      district: 'Kodagu',
      pincode: '571253'
    },
    lastUpdated: Timestamp.now(),
  },
  {
    breed: 'Robusta Cherry',
    market: 'Shanivarasanthe',
    pricePerKg: 2650,
    minPrice: 2450,
    maxPrice: 2850,
    avgPrice: 2650,
    quality: 'C',
    source: 'daily_update',
    verified: true,
    location: {
      state: 'Karnataka',
      district: 'Kodagu',
      pincode: '571253'
    },
    lastUpdated: Timestamp.now(),
  },

  // Sakleshpura Market
  {
    breed: 'Arabica Parchment',
    market: 'Sakleshpura',
    pricePerKg: 8600,
    minPrice: 8300,
    maxPrice: 8900,
    avgPrice: 8600,
    quality: 'A',
    source: 'market_admin',
    verified: true,
    location: {
      state: 'Karnataka',
      district: 'Hassan',
      pincode: '573134'
    },
    lastUpdated: Timestamp.now(),
  },
  {
    breed: 'Robusta Parchment',
    market: 'Sakleshpura',
    pricePerKg: 5300,
    minPrice: 5100,
    maxPrice: 5500,
    avgPrice: 5300,
    quality: 'A',
    source: 'market_admin',
    verified: true,
    location: {
      state: 'Karnataka',
      district: 'Hassan',
      pincode: '573134'
    },
    lastUpdated: Timestamp.now(),
  },
];

// Coffee Markets Data - Coorg and Hassan regions
const sampleMarkets = [
  {
    name: 'Madikeri Coffee Depot',
    location: {
      city: 'Madikeri',
      state: 'Karnataka',
      country: 'India',
      latitude: 12.4244,
      longitude: 75.7382,
      address: 'Coffee Board Depot, Madikeri, Kodagu, Karnataka'
    },
    isActive: true,
    marketType: 'wholesale',
    operatingHours: {
      openTime: '08:00',
      closeTime: '17:00',
      workingDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    },
    contactInfo: {
      phone: '+91-8272-228844',
      email: 'madikeri.depot@coffeeboard.com'
    },
    supportedBreeds: ['Arabica Parchment', 'Arabica Cherry', 'Robusta Parchment', 'Robusta Cherry'],
    lastUpdated: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    name: 'Virajpete Coffee Depot',
    location: {
      city: 'Virajpete',
      state: 'Karnataka',
      country: 'India',
      latitude: 12.1962,
      longitude: 75.8048,
      address: 'Coffee Board Depot, Virajpete, Kodagu, Karnataka'
    },
    isActive: true,
    marketType: 'wholesale',
    operatingHours: {
      openTime: '08:00',
      closeTime: '17:00',
      workingDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    },
    contactInfo: {
      phone: '+91-8274-256677',
      email: 'virajpete.depot@coffeeboard.com'
    },
    supportedBreeds: ['Arabica Parchment', 'Arabica Cherry', 'Robusta Parchment', 'Robusta Cherry'],
    lastUpdated: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    name: 'Kushalnagar Coffee Depot',
    location: {
      city: 'Kushalnagar',
      state: 'Karnataka',
      country: 'India',
      latitude: 12.4593,
      longitude: 75.9573,
      address: 'Coffee Collection Center, Kushalnagar, Kodagu, Karnataka'
    },
    isActive: true,
    marketType: 'auction',
    operatingHours: {
      openTime: '09:00',
      closeTime: '16:00',
      workingDays: ['mon', 'wed', 'fri']
    },
    contactInfo: {
      phone: '+91-8276-278899',
      email: 'kushalnagar.depot@coffeeboard.com'
    },
    supportedBreeds: ['Arabica Parchment', 'Arabica Cherry', 'Robusta Parchment', 'Robusta Cherry'],
    lastUpdated: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    name: 'Somvarpete Coffee Depot',
    location: {
      city: 'Somvarpete',
      state: 'Karnataka',
      country: 'India',
      latitude: 12.5977,
      longitude: 75.8465,
      address: 'Coffee Depot, Somvarpete, Kodagu, Karnataka'
    },
    isActive: true,
    marketType: 'wholesale',
    operatingHours: {
      openTime: '08:30',
      closeTime: '17:00',
      workingDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    },
    contactInfo: {
      phone: '+91-8276-245566',
      email: 'somvarpete.depot@coffeeboard.com'
    },
    supportedBreeds: ['Arabica Parchment', 'Arabica Cherry', 'Robusta Parchment', 'Robusta Cherry'],
    lastUpdated: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    name: 'Shanivarasanthe Coffee Center',
    location: {
      city: 'Shanivarasanthe',
      state: 'Karnataka',
      country: 'India',
      latitude: 12.7213,
      longitude: 75.7055,
      address: 'Coffee Collection Point, Shanivarasanthe, Kodagu, Karnataka'
    },
    isActive: true,
    marketType: 'retail',
    operatingHours: {
      openTime: '09:00',
      closeTime: '16:00',
      workingDays: ['tue', 'thu', 'sat']
    },
    contactInfo: {
      phone: '+91-8276-234455',
      email: 'shanivarasanthe@coffeeboard.com'
    },
    supportedBreeds: ['Arabica Parchment', 'Arabica Cherry', 'Robusta Parchment', 'Robusta Cherry'],
    lastUpdated: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    name: 'Sakleshpura Coffee Depot',
    location: {
      city: 'Sakleshpura',
      state: 'Karnataka',
      country: 'India',
      latitude: 12.9442,
      longitude: 75.7845,
      address: 'Coffee Board Depot, Sakleshpura, Hassan, Karnataka'
    },
    isActive: true,
    marketType: 'wholesale',
    operatingHours: {
      openTime: '08:00',
      closeTime: '17:00',
      workingDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    },
    contactInfo: {
      phone: '+91-8175-272233',
      email: 'sakleshpura.depot@coffeeboard.com'
    },
    supportedBreeds: ['Arabica Parchment', 'Arabica Cherry', 'Robusta Parchment', 'Robusta Cherry'],
    lastUpdated: Timestamp.now(),
    createdAt: Timestamp.now()
  }
];

// Coffee Varieties Data - Arabica and Robusta
const sampleVarieties = [
  {
    name: 'Arabica Parchment',
    scientificName: 'Coffea arabica (processed)',
    category: 'Arabica Parchment',
    description: 'Premium Arabica coffee in parchment form, known for its smooth flavor and aromatic qualities. Grown extensively in Coorg and Hassan regions.',
    characteristics: {
      color: 'greenish-yellow',
      size: 'medium',
      quality: 'premium',
      production: 'seasonal'
    },
    averagePrice: {
      min: 8000,
      max: 9000,
      avg: 8500
    },
    productionAreas: ['Madikeri', 'Virajpete', 'Kushalnagar', 'Somvarpete', 'Shanivarasanthe', 'Sakleshpura'],
    seasonality: {
      peak: ['December', 'January', 'February', 'March'],
      low: ['June', 'July', 'August', 'September']
    },
    isActive: true,
    lastUpdated: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    name: 'Arabica Cherry',
    scientificName: 'Coffea arabica (raw cherry)',
    category: 'Arabica Cherry',
    description: 'Raw Arabica coffee cherries, directly from the farm. These need processing to extract the beans. Premium quality from Karnataka highlands.',
    characteristics: {
      color: 'red to deep red',
      size: 'medium to large',
      quality: 'premium',
      production: 'seasonal'
    },
    averagePrice: {
      min: 4000,
      max: 5000,
      avg: 4500
    },
    productionAreas: ['Madikeri', 'Virajpete', 'Kushalnagar', 'Somvarpete', 'Shanivarasanthe', 'Sakleshpura'],
    seasonality: {
      peak: ['November', 'December', 'January', 'February'],
      low: ['June', 'July', 'August', 'September']
    },
    isActive: true,
    lastUpdated: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    name: 'Robusta Parchment',
    scientificName: 'Coffea canephora (processed)',
    category: 'Robusta Parchment',
    description: 'Strong and bold Robusta coffee in parchment form. Higher caffeine content and resilient variety suitable for various altitudes.',
    characteristics: {
      color: 'brown',
      size: 'medium',
      quality: 'high',
      production: 'year-round'
    },
    averagePrice: {
      min: 4800,
      max: 5500,
      avg: 5200
    },
    productionAreas: ['Madikeri', 'Virajpete', 'Kushalnagar', 'Somvarpete', 'Sakleshpura'],
    seasonality: {
      peak: ['January', 'February', 'March', 'April'],
      low: ['July', 'August', 'September']
    },
    isActive: true,
    lastUpdated: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    name: 'Robusta Cherry',
    scientificName: 'Coffea canephora (raw cherry)',
    category: 'Robusta Cherry',
    description: 'Raw Robusta coffee cherries with strong flavor profile. Popular for instant coffee and espresso blends. Hardy variety with consistent yield.',
    characteristics: {
      color: 'yellow to brown',
      size: 'small to medium',
      quality: 'good',
      production: 'year-round'
    },
    averagePrice: {
      min: 2500,
      max: 3000,
      avg: 2800
    },
    productionAreas: ['Madikeri', 'Virajpete', 'Kushalnagar', 'Somvarpete', 'Shanivarasanthe'],
    seasonality: {
      peak: ['December', 'January', 'February', 'March', 'April'],
      low: ['July', 'August', 'September']
    },
    isActive: true,
    lastUpdated: Timestamp.now(),
    createdAt: Timestamp.now()
  }
];

export const seedCoffeePrices = async () => {
  try {
    console.log('🌱 Seeding coffee prices for Coorg and Hassan depots...');

    for (const priceData of sampleCoffeePrices) {
      await addDoc(collection(db, COLLECTIONS.COFFEE_PRICES), priceData);
      console.log(`📈 Added price for ${priceData.breed} in ${priceData.market}`);
    }

    console.log('✅ Successfully seeded all coffee prices!');
  } catch (error) {
    console.error('❌ Error seeding coffee prices:', error);
  }
};

export const seedMarkets = async () => {
  try {
    console.log('🌱 Seeding coffee depots...');

    for (const marketData of sampleMarkets) {
      await addDoc(collection(db, COLLECTIONS.MARKETS), marketData);
      console.log(`🏪 Added depot: ${marketData.name}`);
    }

    console.log('✅ Successfully seeded all coffee depots!');
  } catch (error) {
    console.error('❌ Error seeding markets:', error);
  }
};

export const seedVarieties = async () => {
  try {
    console.log('🌱 Seeding coffee varieties...');

    for (const varietyData of sampleVarieties) {
      await addDoc(collection(db, COLLECTIONS.VARIETIES), varietyData);
      console.log(`☕ Added variety: ${varietyData.name}`);
    }

    console.log('✅ Successfully seeded all coffee varieties!');
  } catch (error) {
    console.error('❌ Error seeding varieties:', error);
  }
};

export const seedAllCoffeeData = async () => {
  try {
    console.log('🚀 Starting Coffee Connect data seeding...');
    console.log('📍 Regions: Coorg (Kodagu) and Hassan districts');

    await seedVarieties();
    await seedMarkets();
    await seedCoffeePrices();

    console.log('🎉 All coffee market data seeded successfully!');
    console.log('📱 Coffee Connect app is ready to use!');
    console.log('🏪 Depots: Madikeri, Virajpete, Kushalnagar, Somvarpete, Shanivarasanthe, Sakleshpura');
    console.log('☕ Varieties: Arabica Parchment, Arabica Cherry, Robusta Parchment, Robusta Cherry');
  } catch (error) {
    console.error('💥 Error during data seeding:', error);
  }
};

// Uncomment the line below to run complete seeding when you import this file
// seedAllCoffeeData();
