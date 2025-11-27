import type { StockDataCollection } from './types';

const generateHistoricalData = (basePrice: number, days: number, volatility: number) => {
  const data = [];
  let price = basePrice;
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    price += (Math.random() - 0.5) * volatility * price;
    price = Math.max(price, 1); // ensure price doesn't go below 1

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(price.toFixed(2)),
    });
  }
  return data;
};


export const mockStockData: StockDataCollection = {
  "AAPL": {
    name: "Apple Inc.",
    price: 172.25,
    change: 2.50,
    changePercent: 1.47,
    historicalData: generateHistoricalData(150, 30, 0.05),
    technicalAnalysis: {
      movingAverage: { "50day": 168.50, "200day": 160.20 },
      rsi: 62.5,
      macd: 1.25
    },
    fundamentalAnalysis: {
      marketCap: "2.8T",
      peRatio: 28.5,
      eps: 6.05,
      dividendYield: "0.55%",
      debtToEquity: 1.47
    }
  },
  "GOOGL": {
    name: "Alphabet Inc.",
    price: 138.50,
    change: -1.10,
    changePercent: -0.79,
    historicalData: generateHistoricalData(130, 30, 0.04),
    technicalAnalysis: {
      movingAverage: { "50day": 135.20, "200day": 128.90 },
      rsi: 48.2,
      macd: -0.50
    },
    fundamentalAnalysis: {
      marketCap: "1.7T",
      peRatio: 25.8,
      eps: 5.37,
      dividendYield: "N/A",
      debtToEquity: 0.12
    }
  },
  "MSFT": {
    name: "Microsoft Corp.",
    price: 335.90,
    change: 3.15,
    changePercent: 0.95,
    historicalData: generateHistoricalData(320, 30, 0.03),
    technicalAnalysis: {
      movingAverage: { "50day": 330.10, "200day": 310.45 },
      rsi: 68.1,
      macd: 2.80
    },
    fundamentalAnalysis: {
      marketCap: "2.5T",
      peRatio: 35.2,
      eps: 9.54,
      dividendYield: "0.85%",
      debtToEquity: 0.45
    }
  },
  "TSLA": {
    name: "Tesla, Inc.",
    price: 250.75,
    change: -5.25,
    changePercent: -2.05,
    historicalData: generateHistoricalData(260, 30, 0.1),
    technicalAnalysis: {
      movingAverage: { "50day": 260.50, "200day": 240.80 },
      rsi: 45.5,
      macd: -3.10
    },
    fundamentalAnalysis: {
      marketCap: "790B",
      peRatio: 75.9,
      eps: 3.30,
      dividendYield: "N/A",
      debtToEquity: 0.25
    }
  }
};
