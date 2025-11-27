"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Bot, BrainCircuit } from 'lucide-react';
import { generateBuySellSignals } from '@/ai/flows/generate-buy-sell-signals';
import { provideAutomatedStockConclusion } from '@/ai/flows/provide-automated-stock-conclusion';
import { predictFutureStockPrice } from '@/ai/flows/predict-future-stock-price';
import type { StockData } from '@/lib/types';
import type { GenerateBuySellSignalsOutput } from '@/ai/flows/generate-buy-sell-signals';
import type { AutomatedStockConclusionOutput } from '@/ai/flows/provide-automated-stock-conclusion';
import type { PredictFutureStockPriceOutput } from '@/ai/flows/predict-future-stock-price';
import { Badge } from '../ui/badge';

interface AICardProps {
  stockData: StockData;
  ticker: string;
}

const getSignalBadgeVariant = (signal: 'Buy' | 'Hold' | 'Sell' | string) => {
    switch (signal) {
      case 'Buy':
        return 'default';
      case 'Sell':
        return 'destructive';
      case 'Hold':
        return 'secondary';
      default:
        return 'outline';
    }
  };

export function BuySellSignalCard({ stockData, ticker }: AICardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateBuySellSignalsOutput | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await generateBuySellSignals({
        ticker,
        technicalAnalysis: JSON.stringify(stockData.technicalAnalysis),
        fundamentalAnalysis: JSON.stringify(stockData.fundamentalAnalysis),
      });
      setResult(res);
    } catch (error) {
      console.error('Error generating signals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BrainCircuit className="h-5 w-5 text-primary" />
          AI Buy/Sell Signals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        {result && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="font-semibold">Signal:</span>
                <Badge variant={getSignalBadgeVariant(result.signal)}>{result.signal}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{result.reason}</p>
          </div>
        )}
        {!isLoading && (
          <Button onClick={handleGenerate}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Signal
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function AutomatedConclusionCard({ stockData, ticker }: AICardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AutomatedStockConclusionOutput | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await provideAutomatedStockConclusion({
        ticker,
        technicalAnalysis: JSON.stringify(stockData.technicalAnalysis),
        fundamentalAnalysis: JSON.stringify(stockData.fundamentalAnalysis),
        buySellSignals: 'Generated based on a combination of TA and FA.',
      });
      setResult(res);
    } catch (error) {
      console.error('Error generating conclusion:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5 text-primary" />
          Automated Conclusion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        {result && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Recommendation:</span>
            <Badge variant={getSignalBadgeVariant(result.conclusion)}>{result.conclusion}</Badge>
          </div>
        )}
        {!isLoading && (
          <Button onClick={handleGenerate}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Conclusion
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function SimplePredictionCard({ stockData, ticker }: AICardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<PredictFutureStockPriceOutput | null>(null);
  
    const handleGenerate = async () => {
      setIsLoading(true);
      setResult(null);
      try {
        const res = await predictFutureStockPrice({
          ticker,
          timeSeriesData: JSON.stringify(stockData.historicalData),
          financialNews: 'Market sentiment is currently mixed due to recent inflation reports.',
        });
        setResult(res);
      } catch (error) {
        console.error('Error generating prediction:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Simple Prediction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
          {result && (
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Prediction: </span>
                <span className="font-mono text-lg">{result.prediction}</span>
              </div>
              <div>
                <span className="font-semibold">Confidence: </span>
                <span className="font-mono">{((result.confidence || 0) * 100).toFixed(0)}%</span>
              </div>
              <p className="text-sm text-muted-foreground">{result.rationale}</p>
            </div>
          )}
          {!isLoading && (
            <Button onClick={handleGenerate}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Prediction
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
