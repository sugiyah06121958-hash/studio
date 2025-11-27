"use client";

import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { mockStockData } from '@/lib/mock-data';
import type { StockDataCollection } from '@/lib/types';
import { Header } from './header';
import { Watchlist } from './watchlist';
import { StockPriceCard } from './stock-price-card';
import { FundamentalAnalysisCard, TechnicalAnalysisCard } from './analysis-cards';
import { AutomatedConclusionCard, BuySellSignalCard, SimplePredictionCard } from './ai-cards';

export function Dashboard() {
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const stocks = mockStockData as StockDataCollection;
  const stockData = stocks[selectedTicker];

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar className="border-r flex flex-col">
        <SidebarHeader className="p-4">
          <h2 className="text-lg font-semibold">Daftar Pantau</h2>
        </SidebarHeader>
        <SidebarContent>
          <Watchlist
            stocks={stocks}
            selectedTicker={selectedTicker}
            setSelectedTicker={setSelectedTicker}
          />
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-col w-full flex-1">
        <Header
          stocks={stocks}
          selectedTicker={selectedTicker}
          setSelectedTicker={setSelectedTicker}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="md:col-span-2 xl:col-span-3">
              <StockPriceCard stock={stockData} ticker={selectedTicker} />
            </div>

            <FundamentalAnalysisCard analysis={stockData.fundamentalAnalysis} />
            <TechnicalAnalysisCard analysis={stockData.technicalAnalysis} />
            
            <BuySellSignalCard stockData={stockData} ticker={selectedTicker} />
            <AutomatedConclusionCard stockData={stockData} ticker={selectedTicker} />
            <SimplePredictionCard stockData={stockData} ticker={selectedTicker} />
          </div>
        </main>
      </div>
    </div>
  );
}
