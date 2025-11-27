"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GanttChartSquare } from 'lucide-react';
import type { FundamentalAnalysis, TechnicalAnalysis } from '@/lib/types';

interface AnalysisCardProps<T> {
  analysis: T;
}

const AnalysisItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between text-sm">
    <p className="text-muted-foreground">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export function FundamentalAnalysisCard({ analysis }: AnalysisCardProps<FundamentalAnalysis>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Fundamental Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnalysisItem label="Market Cap" value={analysis.marketCap} />
        <AnalysisItem label="P/E Ratio" value={analysis.peRatio} />
        <AnalysisItem label="EPS" value={analysis.eps} />
        <AnalysisItem label="Dividend Yield" value={analysis.dividendYield} />
        <AnalysisItem label="Debt to Equity" value={analysis.debtToEquity} />
      </CardContent>
    </Card>
  );
}

export function TechnicalAnalysisCard({ analysis }: AnalysisCardProps<TechnicalAnalysis>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <GanttChartSquare className="h-5 w-5 text-primary" />
          Technical Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnalysisItem label="50-Day MA" value={`$${analysis.movingAverage['50day'].toFixed(2)}`} />
        <AnalysisItem label="200-Day MA" value={`$${analysis.movingAverage['200day'].toFixed(2)}`} />
        <AnalysisItem label="RSI" value={analysis.rsi.toFixed(1)} />
        <AnalysisItem label="MACD" value={analysis.macd.toFixed(2)} />
      </CardContent>
    </Card>
  );
}
