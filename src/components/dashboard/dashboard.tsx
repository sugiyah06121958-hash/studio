
"use client";

import { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { mockStockData } from '@/lib/mock-data';
import type { StockData, StockDataCollection } from '@/lib/types';
import { Header } from './header';
import { Watchlist } from './watchlist';
import { StockPriceCard } from './stock-price-card';
import { FundamentalAnalysisCard, TechnicalAnalysisCard } from './analysis-cards';
import { AutomatedConclusionCard, BuySellSignalCard, SimplePredictionCard } from './ai-cards';
import { getStockDataForWatchlist } from '@/lib/alpha-vantage';
import { Skeleton } from '@/components/ui/skeleton';

const watchlistTickers = ['BBCA', 'GOTO', 'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'BTC', 'RD-PASARUANG'];

function DashboardSkeleton() {
    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="md:col-span-2 xl:col-span-3">
                    <Skeleton className="h-[480px] w-full" />
                </div>
                <Skeleton className="h-[240px] w-full" />
                <Skeleton className="h-[240px] w-full" />
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[280px] w-full" />
            </div>
      </main>
    )
}


export function Dashboard() {
  const [selectedTicker, setSelectedTicker] = useState('BBCA');
  const [stocks, setStocks] = useState<StockDataCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        // In a real app, you might fetch details for the selected ticker separately
        // for more up-to-date information.
        const data = await getStockDataForWatchlist(watchlistTickers);
        setStocks(data);
      } catch (err) {
        setError('Gagal mengambil data saham. Silakan coba lagi nanti.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const stockData = stocks ? stocks[selectedTicker] : null;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar className="border-r flex flex-col">
        <SidebarHeader className="p-4">
          <h2 className="text-lg font-semibold">Daftar Pantau</h2>
        </SidebarHeader>
        <SidebarContent>
            <Watchlist
              stocks={stocks ?? {}}
              selectedTicker={selectedTicker}
              setSelectedTicker={setSelectedTicker}
              isLoading={isLoading}
            />
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-col w-full flex-1">
        <Header
          stocks={stocks ?? {}}
          selectedTicker={selectedTicker}
          setSelectedTicker={setSelectedTicker}
          isLoading={isLoading}
        />
        {isLoading && <DashboardSkeleton />}
        {error && <div className="p-8 text-center text-red-500">{error}</div>}
        {!isLoading && !error && stockData && (
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
        )}
      </div>
    </div>
  );
}
