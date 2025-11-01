# Filter Debugging Guide

## Issue
Filter by varieties is not working on the homepage.

## Debug Logs Added

### 1. Database Fetch Debug (in fetchPrices function)
When data is fetched from Firebase, the console will show:
```
🔍 DEBUG: Unique breeds in database: [array of breed values]
🔍 DEBUG: Total prices fetched: [number]
```

This will tell us:
- What breed values are actually stored in the database
- How many price records exist

### 2. Filter Logic Debug (in useEffect for filtering)
When filters are applied, the console will show:
```
🔍 FILTER DEBUG: selectedBreed = [current filter value]
🔍 FILTER DEBUG: selectedMarket = [current filter value]
🔍 FILTER DEBUG: Total prices = [number before filtering]
🔍 FILTER DEBUG: Filtering by breed: [breed name]
🔍 FILTER DEBUG: After breed filter: [number after breed filtering]
🔍 FILTER DEBUG: Filtering by market: [market name]
🔍 FILTER DEBUG: After market filter: [number after market filtering]
🔍 FILTER DEBUG: Final filtered count: [final number]
```

## How to Debug

1. Run the app in Expo Go:
   ```bash
   npx expo start
   ```

2. Open the app and watch the console output

3. Check the database breeds log to see if breeds match:
   - Expected: ['Arabica Parchment', 'Arabica Cherry', 'Robusta Parchment', 'Robusta Cherry']
   - If you see: ['CB', 'BV'] or similar short codes, the database needs updating

4. Try selecting a filter and watch the filter debug logs

5. Check if the breed filter value matches the database breed values exactly

## Possible Issues

### Issue 1: Database has old breed codes
- **Symptom**: Unique breeds shows ['CB', 'BV'] instead of full names
- **Solution**: Update database records to use full breed names

### Issue 2: Filter values don't match database
- **Symptom**: After breed filter shows 0 results
- **Solution**: Update breeds array or database to match

### Issue 3: Database only has 2 varieties
- **Symptom**: Unique breeds only shows 2 items like ['Arabica Parchment', 'Arabica Cherry']
- **Solution**: Admin needs to add price records for all 4 varieties

## Current Filter Configuration

Breeds array in HomeScreen.tsx:
```javascript
const breeds = ['all', 'Arabica Parchment', 'Arabica Cherry', 'Robusta Parchment', 'Robusta Cherry'];
```

Types definition:
```typescript
breed: 'Arabica Parchment' | 'Arabica Cherry' | 'Robusta Parchment' | 'Robusta Cherry';
```

Filter logic:
```javascript
if (selectedBreed !== 'all') {
  filtered = filtered.filter((price) => price.breed === selectedBreed);
}
```

## Next Steps

Run the app and check the console logs to identify which issue is occurring, then apply the appropriate solution.
