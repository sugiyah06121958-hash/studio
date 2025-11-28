"use client";

import type { StockData, StockDataCollection } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';

interface WatchlistProps {
  stocks: StockDataCollection;
  selectedTicker: string;
  setSelectedTicker: (ticker: string) => void;
  isLoading: boolean;
  watchlistTickers: string[];
}

const getPriceDisplay = (data: StockData) => {
    if (data.category === 'Saham' || data.category === 'Reksadana') {
        return `Rp${data.price.toLocaleString('id-ID')}`;
    }
    return `$${data.price.toFixed(2)}`;
}

export function Watchlist({ stocks, selectedTicker, setSelectedTicker, isLoading, watchlistTickers }: WatchlistProps) {
  if (isLoading) {
    return (
        <div className="px-1 space-y-2">
            {Array.from({length: 5}).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
    )
  }
    
  const groupedStocks = Object.entries(stocks).reduce((acc, [ticker, data]) => {
    if (!watchlistTickers.includes(ticker)) return acc;
    const { category } = data;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push([ticker, data]);
    return acc;
  }, {} as Record<string, [string, StockData][]>);

  const categories: ('Saham' | 'Saham AS' | 'Bitcoin' | 'Reksadana')[] = ['Saham', 'Saham AS', 'Bitcoin', 'Reksadana'];

  return (
    <ScrollArea className="h-96">
      <Accordion type="multiple" defaultValue={categories} className="w-full">
        {categories.map((category) => (
          groupedStocks[category] && groupedStocks[category].length > 0 && (
            <AccordionItem value={category} key={category}>
              <AccordionTrigger className="px-2 text-sm font-semibold hover:no-underline">{category}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1">
                  {groupedStocks[category].map(([ticker, data]) => (
                    <Button
                        key={ticker}
                        variant="ghost"
                        onClick={() => setSelectedTicker(ticker)}
                        data-active={selectedTicker === ticker}
                        className="justify-between h-auto py-2 data-[active=true]:bg-accent"
                      >
                        <div className="flex flex-col text-left">
                          <span className="font-semibold">{ticker}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[120px]">{data.name}</span>
                        </div>
                        <div className={`flex flex-col text-right text-sm ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          <span>{getPriceDisplay(data)}</span>
                          <span className="text-xs">{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)</span>
                        </div>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        ))}
      </Accordion>
    </ScrollArea>
  );
}
