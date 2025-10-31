import { PriceFormData } from '../types';

// Gemini AI Configuration
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent';

export interface ExtractedMarketData {
  market: string;
  date: string;
  arabicaParchment?: {
    maxPrice: number;
    minPrice: number;
  };
  arabicaCherry?: {
    maxPrice: number;
    minPrice: number;
  };
}

export interface AIExtractionResult {
  success: boolean;
  data?: ExtractedMarketData;
  priceEntries?: PriceFormData[];
  error?: string;
  rawResponse?: string;
}

/**
 * Extract market data from Kannada or English text using Gemini AI
 */
export async function extractMarketDataWithAI(
  inputText: string
): Promise<AIExtractionResult> {
  try {
    if (!API_KEY || API_KEY === 'your-gemini-api-key-here') {
      return {
        success: false,
        error: 'Gemini API key not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file.',
      };
    }

    const prompt = `
You are a data extraction assistant for coffee depot price transactions. Extract structured data from the following text which may be in Kannada or English.

Text to analyze:
"""
${inputText}
"""

Extract the following information and return ONLY a valid JSON object (no markdown, no code blocks):

{
  "market": "depot name (e.g., Madikeri, Virajpete, Kushalnagar, Somvarpete, Shanivarasanthe, Sakleshpura)",
  "date": "date in format DD-MM-YYYY",
  "arabicaParchment": {
    "maxPrice": number (ಹೆಚ್ಚು ದರ/max price per 50kg bag),
    "minPrice": number (ಕಡಿಮೆ ದರ/min price per 50kg bag)
  },
  "arabicaCherry": {
    "maxPrice": number (ಹೆಚ್ಚು ದರ/max price per 50kg bag),
    "minPrice": number (ಕಡಿಮೆ ದರ/min price per 50kg bag)
  }
}

Notes:
- **IMPORTANT: Depot names must ALWAYS be in English - match EXACTLY these spellings**
- Translate Kannada depot names to English (exact spelling required):
  * ಮಡಿಕೇರಿ → Madikeri
  * ವಿರಾಜಪೇಟೆ → Virajpete
  * ಕುಶಾಲನಗರ → Kushalnagar
  * ಸೋಮವಾರಪೇಟೆ → Somvarpete
  * ಶನಿವಾರಸಂತೆ → Shanivarasanthe
  * ಸಕಲೇಶಪುರ → Sakleshpura
- Use EXACT capitalization as shown above
- CB = Arabica Parchment
- BV = Arabica Cherry
- Prices are per 50 kilogram bag, not per kilogram
- If a variety is not present in the text, omit that object
- Return ONLY the JSON object, no explanations or markdown
`;

    // Call Gemini API directly using REST
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text;

    // Clean up response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    const extractedData: ExtractedMarketData = JSON.parse(cleanedText);

    // Convert to PriceFormData entries
    const priceEntries: PriceFormData[] = [];

    // Add Arabica Parchment/CB entry if present
    if (extractedData.arabicaParchment) {
      priceEntries.push({
        breed: 'CB',
        market: extractedData.market,
        pricePerKg: extractedData.arabicaParchment.maxPrice,
        minPrice: extractedData.arabicaParchment.minPrice,
        maxPrice: extractedData.arabicaParchment.maxPrice,
        quality: 'A', // Default quality, admin can change
        lotNumber: 0, // Not used for coffee
      });
    }

    // Add Arabica Cherry/BV entry if present
    if (extractedData.arabicaCherry) {
      priceEntries.push({
        breed: 'BV',
        market: extractedData.market,
        pricePerKg: extractedData.arabicaCherry.maxPrice,
        minPrice: extractedData.arabicaCherry.minPrice,
        maxPrice: extractedData.arabicaCherry.maxPrice,
        quality: 'A', // Default quality, admin can change
        lotNumber: 0, // Not used for coffee
      });
    }

    return {
      success: true,
      data: extractedData,
      priceEntries,
      rawResponse: text,
    };
  } catch (error) {
    console.error('AI extraction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract data from text',
    };
  }
}

/**
 * Normalize depot names to English
 */
function normalizeMarketName(marketName: string): string {
  // Coffee depot names matching translation files
  const marketMap: { [key: string]: string } = {
    // Madikeri
    'ಮಡಿಕೇರಿ': 'Madikeri',
    'madikeri': 'Madikeri',
    'MADIKERI': 'Madikeri',
    'Madikeri': 'Madikeri',
    // Virajpete
    'ವಿರಾಜಪೇಟೆ': 'Virajpete',
    'virajpete': 'Virajpete',
    'VIRAJPETE': 'Virajpete',
    'Virajpete': 'Virajpete',
    'virajapet': 'Virajpete',
    'VIRAJAPET': 'Virajpete',
    // Kushalnagar
    'ಕುಶಾಲನಗರ': 'Kushalnagar',
    'kushalnagar': 'Kushalnagar',
    'KUSHALNAGAR': 'Kushalnagar',
    'Kushalnagar': 'Kushalnagar',
    // Somvarpete
    'ಸೋಮವಾರಪೇಟೆ': 'Somvarpete',
    'somvarpete': 'Somvarpete',
    'SOMVARPETE': 'Somvarpete',
    'Somvarpete': 'Somvarpete',
    'somwarpet': 'Somvarpete',
    'SOMWARPET': 'Somvarpete',
    // Shanivarasanthe
    'ಶನಿವಾರಸಂತೆ': 'Shanivarasanthe',
    'shanivarasanthe': 'Shanivarasanthe',
    'SHANIVARASANTHE': 'Shanivarasanthe',
    'Shanivarasanthe': 'Shanivarasanthe',
    'shanivarasante': 'Shanivarasanthe',
    'SHANIVARASANTE': 'Shanivarasanthe',
    // Sakleshpura
    'ಸಕಲೇಶಪುರ': 'Sakleshpura',
    'sakleshpura': 'Sakleshpura',
    'SAKLESHPURA': 'Sakleshpura',
    'Sakleshpura': 'Sakleshpura',
    'sakleshpur': 'Sakleshpura',
    'SAKLESHPUR': 'Sakleshpura',
  };

  const trimmed = marketName.trim();
  return marketMap[trimmed] || trimmed;
}

/**
 * Validate extracted data
 */
export function validateExtractedData(data: ExtractedMarketData): {
  valid: boolean;
  errors: string[]
} {
  const errors: string[] = [];

  // Normalize market name to English
  if (data.market) {
    data.market = normalizeMarketName(data.market);
  }

  if (!data.market || data.market.trim() === '') {
    errors.push('Market name is required');
  }

  if (!data.date || data.date.trim() === '') {
    errors.push('Date is required');
  }

  // Check if at least one variety data exists
  if (!data.arabicaParchment && !data.arabicaCherry) {
    errors.push('At least one coffee variety data (Arabica Parchment or Arabica Cherry) is required');
  }

  // Validate Arabica Parchment data if present
  if (data.arabicaParchment) {
    if (data.arabicaParchment.minPrice <= 0) errors.push('Arabica Parchment min price must be greater than 0');
    if (data.arabicaParchment.maxPrice <= 0) errors.push('Arabica Parchment max price must be greater than 0');
    if (data.arabicaParchment.minPrice >= data.arabicaParchment.maxPrice) {
      errors.push('Arabica Parchment max price must be greater than min price');
    }
  }

  // Validate Arabica Cherry data if present
  if (data.arabicaCherry) {
    if (data.arabicaCherry.minPrice <= 0) errors.push('Arabica Cherry min price must be greater than 0');
    if (data.arabicaCherry.maxPrice <= 0) errors.push('Arabica Cherry max price must be greater than 0');
    if (data.arabicaCherry.minPrice >= data.arabicaCherry.maxPrice) {
      errors.push('Arabica Cherry max price must be greater than min price');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
