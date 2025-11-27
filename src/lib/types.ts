export type HistoricalData = {
  date: string;
  price: number;
};

export type TechnicalAnalysis = {
  movingAverage: { '50day': number; '200day': number };
  rsi: number;
  macd: number;
};

export type FundamentalAnalysis = {
  marketCap: string;
  peRatio: number | string;
  eps: number;
  dividendYield: string;
  debtToEquity: number;
};

export type StockData = {
  name: string;
  price: number;
  change: number;
  changePercent: number;
  historicalData: HistoricalData[];
  technicalAnalysis: TechnicalAnalysis;
  fundamentalAnalysis: FundamentalAnalysis;
};

export type StockDataCollection = {
  [ticker: string]: StockData;
};
