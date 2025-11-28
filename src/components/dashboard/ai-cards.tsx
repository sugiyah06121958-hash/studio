"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Bot, BrainCircuit } from 'lucide-react';
import type { StockData } from '@/lib/types';
import type { GenerateBuySellSignalsInput, GenerateBuySellSignalsOutput } from '@/ai/flows/generate-buy-sell-signals';
import type { AutomatedStockConclusionInput, AutomatedStockConclusionOutput } from '@/ai/flows/provide-automated-stock-conclusion';
import type { PredictFutureStockPriceInput, PredictFutureStockPriceOutput } from '@/ai/flows/predict-future-stock-price';
import { Badge } from '../ui/badge';
import { runFlow } from '@/ai/client';

interface AICardProps {
  stockData: StockData;
  ticker: string;
}

const getSignalBadgeVariant = (signal: 'Beli' | 'Tahan' | 'Jual' | string) => {
    switch (signal) {
      case 'Beli':
        return 'default';
      case 'Jual':
        return 'destructive';
      case 'Tahan':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
const getSignalBadgeVariantEN = (signal: 'Buy' | 'Hold' | 'Sell' | string) => {
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

const translateSignal = (signal: 'Buy' | 'Hold' | 'Sell' | string) => {
    switch (signal) {
        case 'Buy':
            return 'Beli';
        case 'Sell':
            return 'Jual';
        case 'Hold':
            return 'Tahan';
        default:
            return signal;
    }
}


export function BuySellSignalCard({ stockData, ticker }: AICardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateBuySellSignalsOutput | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const input: GenerateBuySellSignalsInput = {
        ticker,
        technicalAnalysis: JSON.stringify(stockData.technicalAnalysis),
        fundamentalAnalysis: JSON.stringify(stockData.fundamentalAnalysis),
      };
      const res = await runFlow<GenerateBuySellSignalsOutput>('generateBuySellSignalsFlow', input);
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
          Sinyal Beli/Jual AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        {result && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="font-semibold">Sinyal:</span>
                <Badge variant={getSignalBadgeVariantEN(result.signal)}>{translateSignal(result.signal)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{result.reason}</p>
          </div>
        )}
        {!isLoading && !result && (
          <Button onClick={handleGenerate} disabled={isLoading}>
            <Sparkles className="mr-2 h-4 w-4" />
            Hasilkan Sinyal
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
      const input: AutomatedStockConclusionInput = {
        ticker,
        technicalAnalysis: JSON.stringify(stockData.technicalAnalysis),
        fundamentalAnalysis: JSON.stringify(stockData.fundamentalAnalysis),
        buySellSignals: 'Dihasilkan berdasarkan kombinasi TA dan FA.',
      };
      const res = await runFlow<AutomatedStockConclusionOutput>('provideAutomatedStockConclusionFlow', input);
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
          Kesimpulan Otomatis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        {result && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Rekomendasi:</span>
            <Badge variant={getSignalBadgeVariant(result.conclusion)}>{result.conclusion}</Badge>
          </div>
        )}
        {!isLoading && !result && (
          <Button onClick={handleGenerate} disabled={isLoading}>
            <Sparkles className="mr-2 h-4 w-4" />
            Hasilkan Kesimpulan
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
        const input: PredictFutureStockPriceInput = {
          ticker,
          timeSeriesData: JSON.stringify(stockData.historicalData),
          financialNews: 'Sentimen pasar saat ini beragam karena laporan inflasi terbaru.',
        };
        const res = await runFlow<PredictFutureStockPriceOutput>('predictFutureStockPriceFlow', input);
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
            Prediksi Sederhana
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
          {result && (
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Prediksi: </span>
                <span className="font-mono text-lg">{result.prediction}</span>
              </div>
              <div>
                <span className="font-semibold">Keyakinan: </span>
                <span className="font-mono">{((result.confidence || 0) * 100).toFixed(0)}%</span>
              </div>
              <p className="text-sm text-muted-foreground">{result.rationale}</p>
            </div>
          )}
          {!isLoading && !result &&(
            <Button onClick={handleGenerate} disabled={isLoading}>
              <Sparkles className="mr-2 h-4 w-4" />
              Hasilkan Prediksi
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
