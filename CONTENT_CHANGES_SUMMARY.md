# ☕ Coffee Connect - Content Updates Summary

## ✅ Content Changes for Arabica Coffee (50kg Bag Pricing)

All content has been updated to reflect:
- **Only Arabica varieties**: Parchment and Cherry
- **50kg bag pricing** instead of per kg
- **No average price** (only min and max)

---

## 📝 English Localization Updates (locales/en.json)

### Coffee Varieties (Breeds)
```json
OLD:
"breed_all": "All"
"breed_CB": "CB" 
"breed_BV": "BV"

NEW:
"breed_all": "All Varieties"
"breed_CB": "Arabica Parchment"
"breed_BV": "Arabica Cherry"
```

### Pricing Units (kg → 50kg bag)
```json
OLD:
"liveMarketRates": "Live coffee prices per kg"
"priceDetails": "Price Details (₹/kg)"
"avgPriceKg": "Avg Price/kg"
"perKilogram": "Per kilogram"
"currentPricePerKg": "Current Price per Kg (₹) *"

NEW:
"liveMarketRates": "Live coffee prices per 50kg bag"
"priceDetails": "Price Details (₹/50kg bag)"
"avgPriceKg": "Price/50kg bag"
"perKilogram": "Per 50kg bag"
"currentPricePerKg": "Price per 50kg Bag (₹) *"
```

### Price Labels
```json
OLD:
"minimumPrice": "Minimum Price (₹) *"
"maximumPrice": "Maximum Price (₹) *"
"averagePrice": "Average Price (₹) *"
"enterAveragePrice": "Enter average price"

NEW:
"minimumPrice": "Minimum Price per Bag (₹) *"
"maximumPrice": "Maximum Price per Bag (₹) *"
"averagePrice": "Average Price per Bag (₹)"
"enterAveragePrice": "Average calculated automatically"
```

### Market Information
```json
OLD:
"peakMarketRate": "Peak market rate"
"minimumMarketRate": "Minimum market rate"

NEW:
"peakMarketRate": "Highest price per bag"
"minimumMarketRate": "Lowest price per bag"
```

### Text-to-Speech
```json
OLD:
"The maximum price is {{maxPrice}} rupees per kilogram. 
The average price is {{avgPrice}} rupees per kilogram. 
The minimum price is {{minPrice}} rupees per kilogram."

NEW:
"The maximum price is {{maxPrice}} rupees per 50 kilogram bag. 
The minimum price is {{minPrice}} rupees per 50 kilogram bag."
(Average removed)
```

---

## 🇮🇳 Kannada Localization Updates (locales/kn.json)

### Coffee Varieties
```json
NEEDED UPDATES:
"cocoonPrices" → "ಕಾಫಿ ಬೆಲೆ" (Coffee Prices)
"breed_CB" → "ಅರೇಬಿಕಾ ಪಾರ್ಚ್ಮೆಂಟ್" (Arabica Parchment)
"breed_BV" → "ಅರೇಬಿಕಾ ಚೆರ್ರಿ" (Arabica Cherry)
```

### Pricing Units
```json
NEEDED UPDATES:
"liveMarketRates" → "50 ಕೆಜಿ ಚೀಲಕ್ಕೆ ಲೈವ್ ಕಾಫಿ ಬೆಲೆಗಳು"
"priceDetails" → "ಬೆಲೆ ವಿವರಗಳು (₹/50ಕೆಜಿ ಚೀಲ)"
"perKilogram" → "50 ಕೆಜಿ ಚೀಲಕ್ಕೆ"
```

**Note**: Full Kannada translation update can be done by a Kannada speaker for accuracy.

---

## 🎯 Key Changes Summary

| Aspect | Old | New |
|--------|-----|-----|
| **Varieties** | CB, BV (Generic) | Arabica Parchment, Arabica Cherry |
| **Pricing Unit** | Per kg (₹/kg) | Per 50kg bag (₹/50kg bag) |
| **Average Price** | Shown & Required | Hidden/Auto-calculated |
| **Min/Max** | Per kg | Per 50kg bag |
| **TTS/Audio** | Mentions avg, per kg | Only min/max, per bag |
| **Display Labels** | Kg references | Bag references |

---

## 📱 Affected App Sections

### 1. Home Screen
- Price cards show "per 50kg bag"
- Variety filter: Arabica Parchment, Arabica Cherry
- No average price display

### 2. Market Screen
- All listings show bag pricing
- Filter by Arabica varieties only
- Min/Max prices per bag

### 3. Stats Screen
- Charts use bag pricing
- Variety breakdown: Parchment vs Cherry
- Price ranges per bag

### 4. Admin Panel
- Price entry form: bag pricing
- Variety dropdown: Only Arabica types
- Average auto-calculated (not entered)

### 5. Notifications
- Price alerts mention bag pricing
- Variety names updated

---

## 🔧 Technical Updates Needed

### Still To Update:

1. **Admin Price Form** (AdminPriceFormScreen.tsx)
   - Remove average price field or make it auto-calculated
   - Update variety dropdown to only show Arabica Parchment & Cherry
   - Change all label references to "bag" instead of "kg"

2. **Screen Components**
   - HomeScreen.tsx - Price display per bag
   - MarketScreen.tsx - Filter and display per bag
   - StatsScreen.tsx - Charts per bag pricing

3. **Filter Components**
   - Hardcode varieties to only Arabica Parchment & Cherry
   - Remove other variety options

4. **Backend** (backend/server.js)
   - Notification templates mention bag pricing
   - Update references from cocoon to coffee

5. **Kannada Localization** (locales/kn.json)
   - Full translation to coffee terms
   - 50kg bag terminology in Kannada

---

## 📊 Data Migration Notes

### Firestore Collections

If you have existing data from Reshme_Info:

**Option 1: Fresh Start (Recommended)**
- Start with new Firebase project (coffeeconnect-2d910) ✅
- No old data to migrate
- Enter coffee prices fresh via admin panel

**Option 2: If Migrating Data**
- Would need to convert kg prices to bag prices
- Multiply by 50 for bag pricing
- Change breed names: CB→Arabica Parchment, BV→Arabica Cherry
- Remove average price field

---

## ✅ Completed

- [x] English localization updated
- [x] Arabica Parchment & Cherry varieties set
- [x] 50kg bag pricing terminology
- [x] Average price field relabeled
- [x] TTS updated for bag pricing
- [x] Market descriptions updated

## ⚠️ To Do

- [ ] Update Kannada localization fully
- [ ] Update admin price form component
- [ ] Update screen components (Home, Market, Stats)
- [ ] Update filter dropdowns to only show Arabica
- [ ] Test price calculations with bag pricing
- [ ] Update backend notification templates

---

## 🎯 Next Steps

1. **Update Admin Price Form**
   - Make average price auto-calculated from min/max
   - Restrict varieties to Arabica Parchment & Cherry only

2. **Update Screen Components**
   - Ensure all price displays show "per bag"
   - Verify calculations work with bag pricing

3. **Test Thoroughly**
   - Add test price data via admin panel
   - Verify displays on all screens
   - Test filters work with Arabica varieties only

4. **Kannada Translation**
   - Get proper Kannada translations for coffee terms
   - Update locales/kn.json completely

---

**Status**: 🟡 English content updated, components need updates
**Last Updated**: 2025-10-30
**Priority**: Update admin form and screen components next
