// This is a mock implementation of the Alpha Vantage API client.
// In a real application, you would use fetch to make API calls to Alpha Vantage.
// You would also need to handle API key management and error handling.

import type { StockData, StockDataCollection, HistoricalData, SearchResult } from './types';

const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';


// --- Mock Data Generation ---
// This section is for demonstration purposes since we can't make live API calls in this environment.
// In a real implementation, you would remove this and use actual fetch calls.

const generateHistoricalData = (basePrice: number, days: number, volatility: number): HistoricalData[] => {
    const data: HistoricalData[] = [];
    let price = basePrice;
    const today = new Date();
  
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      price += (Math.random() - 0.5) * volatility * price;
      price = Math.max(price, 1);
  
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: parseFloat(price.toFixed(2)),
      });
    }
    return data;
};

const mockApiData: StockDataCollection = {
    "BBCA": {
      name: "Bank Central Asia",
      price: 9250,
      change: 50,
      changePercent: 0.54,
      historicalData: generateHistoricalData(9000, 30, 0.03),
      technicalAnalysis: { movingAverage: { "50day": 9100, "200day": 8800 }, rsi: 65, macd: 25 },
      fundamentalAnalysis: { marketCap: "1,141T", peRatio: 24.5, eps: 377, dividendYield: "2.5%", debtToEquity: 0 },
      category: "Saham"
    },
    "GOTO": {
      name: "GoTo Gojek Tokopedia",
      price: 52,
      change: -1,
      changePercent: -1.89,
      historicalData: generateHistoricalData(55, 30, 0.15),
      technicalAnalysis: { movingAverage: { "50day": 58, "200day": 65 }, rsi: 35, macd: -0.5 },
      fundamentalAnalysis: { marketCap: "62.4T", peRatio: -4.2, eps: -12.4, dividendYield: "N/A", debtToEquity: 0.05 },
      category: "Saham"
    },
    "AAPL": {
      name: "Apple Inc.",
      price: 172.25,
      change: 2.50,
      changePercent: 1.47,
      historicalData: generateHistoricalData(150, 30, 0.05),
      technicalAnalysis: { movingAverage: { "50day": 168.50, "200day": 160.20 }, rsi: 62.5, macd: 1.25 },
      fundamentalAnalysis: { marketCap: "2.8T", peRatio: 28.5, eps: 6.05, dividendYield: "0.55%", debtToEquity: 1.47 },
      category: 'Saham AS'
    },
    "GOOGL": {
      name: "Alphabet Inc.",
      price: 138.50,
      change: -1.10,
      changePercent: -0.79,
      historicalData: generateHistoricalData(130, 30, 0.04),
      technicalAnalysis: { movingAverage: { "50day": 135.20, "200day": 128.90 }, rsi: 48.2, macd: -0.50 },
      fundamentalAnalysis: { marketCap: "1.7T", peRatio: 25.8, eps: 5.37, dividendYield: "N/A", debtToEquity: 0.12 },
      category: 'Saham AS'
    },
    "MSFT": {
      name: "Microsoft Corp.",
      price: 335.90,
      change: 3.15,
      changePercent: 0.95,
      historicalData: generateHistoricalData(320, 30, 0.03),
      technicalAnalysis: { movingAverage: { "50day": 330.10, "200day": 310.45 }, rsi: 68.1, macd: 2.80 },
      fundamentalAnalysis: { marketCap: "2.5T", peRatio: 35.2, eps: 9.54, dividendYield: "0.85%", debtToEquity: 0.45 },
      category: 'Saham AS'
    },
    "TSLA": {
      name: "Tesla, Inc.",
      price: 250.75,
      change: -5.25,
      changePercent: -2.05,
      historicalData: generateHistoricalData(260, 30, 0.1),
      technicalAnalysis: { movingAverage: { "50day": 260.50, "200day": 240.80 }, rsi: 45.5, macd: -3.10 },
      fundamentalAnalysis: { marketCap: "790B", peRatio: 75.9, eps: 3.30, dividendYield: "N/A", debtToEquity: 0.25 },
      category: 'Saham AS'
    },
    "BTC": {
      name: "Bitcoin",
      price: 68000,
      change: 1200,
      changePercent: 1.8,
      historicalData: generateHistoricalData(65000, 30, 0.08),
      technicalAnalysis: { movingAverage: { "50day": 66000, "200day": 60000 }, rsi: 70, macd: 500 },
      fundamentalAnalysis: { marketCap: "1.3T", peRatio: "N/A", eps: 0, dividendYield: "N/A", debtToEquity: 0 },
      category: "Bitcoin"
    },
    "RD-PASARUANG": {
      name: "Reksadana Pasar Uang",
      price: 1500,
      change: 0.5,
      changePercent: 0.03,
      historicalData: generateHistoricalData(1490, 30, 0.001),
      technicalAnalysis: { movingAverage: { "50day": 1495, "200day": 1480 }, rsi: 80, macd: 0.1 },
      fundamentalAnalysis: { marketCap: "N/A", peRatio: "N/A", eps: 0, dividendYield: "N/A", debtToEquity: 0 },
      category: "Reksadana"
    }
  };

// --- API Fetching Logic ---

/**
 * Searches for stock symbols based on keywords.
 * This function now makes a live API call to Alpha Vantage.
 */
export async function searchSymbols(keywords: string): Promise<SearchResult[]> {
    console.log(`Searching for symbols with keywords: ${keywords}`);
    if (!keywords) return [];
  
    const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Note) {
            // This happens when the API limit is reached.
            console.warn("Alpha Vantage API limit reached:", data.Note);
            // We can return an empty array or handle it as an error.
            return []; 
        }

        if (!data.bestMatches || !Array.isArray(data.bestMatches)) {
            console.error("Invalid search results format:", data);
            return [];
        }

        return data.bestMatches.map((item: any) => ({
            symbol: item['1. symbol'],
            name: item['2. name'],
            region: item['4. region'],
            currency: item['8. currency'],
        }));

    } catch (error) {
        console.error("Error fetching from Alpha Vantage API:", error);
        throw new Error("Gagal melakukan pencarian saham. Silakan coba lagi.");
    }
}


/**
 * Fetches data for multiple tickers.
 * NOTE: The free version of Alpha Vantage has a low rate limit (e.g., 25 calls per day).
 * Calling this for a long list of tickers might get you blocked.
 * For this example, we are using a mock implementation to avoid this.
 */
export async function getStockDataForWatchlist(tickers: string[]): Promise<StockDataCollection> {
  console.log("Fetching data for watchlist tickers:", tickers);

  // In a real implementation, you would fetch data for each ticker.
  // This is a mock implementation.
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  const results: StockDataCollection = {};
  for (const ticker of tickers) {
    if (mockApiData[ticker]) {
      results[ticker] = mockApiData[ticker];
    } else {
      // If the ticker is new, create some mock data for it.
      const isUS = ticker.length <= 4 && ticker.toUpperCase() === ticker && !ticker.includes('.');
      const basePrice = isUS ? Math.random() * 500 + 50 : Math.random() * 10000 + 500;
      results[ticker] = {
        name: `${ticker} Company Name`,
        price: basePrice,
        change: (Math.random() - 0.5) * basePrice * 0.05,
        changePercent: (Math.random() - 0.5) * 5,
        historicalData: generateHistoricalData(basePrice, 30, 0.05),
        technicalAnalysis: { movingAverage: { "50day": basePrice * 0.98, "200day": basePrice * 0.95 }, rsi: 50, macd: 0 },
        fundamentalAnalysis: { marketCap: "N/A", peRatio: "N/A", eps: 0, dividendYield: "N/A", debtToEquity: 0 },
        category: isUS ? 'Saham AS' : 'Saham',
      }
    }
  }
  return results;
}

/**
 * Fetches detailed data for a single ticker.
 * This is a mock function. In a real app, you'd call multiple Alpha Vantage endpoints.
 */
export async function getStockDetails(ticker: string): Promise<StockData> {
    console.log(`Fetching details for ticker: ${ticker}`);
    
    // In a real app, you'd make multiple fetch calls here, e.g.,
    // 1. GLOBAL_QUOTE for price, change
    // 2. OVERVIEW for fundamental data
    // 3. TIME_SERIES_DAILY for historical data
    // 4. Technical indicators like RSI, MACD, SMA
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    // First, check if the data exists in our initial mock data
    if (mockApiData[ticker]) {
        return mockApiData[ticker];
    }

    // If not, we will generate new mock data for the requested ticker
    console.log(`No mock data for ${ticker}, generating new mock data.`);
    const isUS = ticker.length <= 4 && ticker.toUpperCase() === ticker && !ticker.includes('.');
    const basePrice = isUS ? Math.random() * 500 + 50 : Math.random() * 10000 + 500;
    const newStockData: StockData = {
      name: `${ticker} Company Name`,
      price: basePrice,
      change: (Math.random() - 0.5) * basePrice * 0.05,
      changePercent: (Math.random() - 0.5) * 5,
      historicalData: generateHistoricalData(basePrice, 30, 0.05),
      technicalAnalysis: { movingAverage: { "50day": basePrice * 0.98, "200day": basePrice * 0.95 }, rsi: 50, macd: 0 },
      fundamentalAnalysis: { marketCap: "N/A", peRatio: "N/A", eps: 0, dividendYield: "N/A", debtToEquity: 0 },
      category: isUS ? 'Saham AS' : 'Saham',
    };
    
    // Add to the main mock data object so it can be retrieved next time
    mockApiData[ticker] = newStockData;

    return newStockData;
}

    