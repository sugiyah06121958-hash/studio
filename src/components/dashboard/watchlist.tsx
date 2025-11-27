"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import type { StockData, StockDataCollection } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface WatchlistProps {
  stocks: StockDataCollection;
  selectedTicker: string;
  setSelectedTicker: (ticker: string) => void;
}

const getPriceDisplay = (data: StockData) => {
    if (data.category === 'Saham' || data.category === 'Reksadana') {
        return `Rp${data.price.toLocaleString('id-ID')}`;
    }
    return `$${data.price.toFixed(2)}`;
}

export function Watchlist({ stocks, selectedTicker, setSelectedTicker }: WatchlistProps) {
  const groupedStocks = Object.entries(stocks).reduce((acc, [ticker, data]) => {
    const { category } = data;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push([ticker, data]);
    return acc;
  }, {} as Record<string, [string, StockData][]>);

  const categories: ('Saham' | 'Saham AS' | 'Bitcoin' | 'Reksadana')[] = ['Saham', 'Saham AS', 'Bitcoin', 'Reksadana'];

  return (
    <div className="px-2">
      <Accordion type="multiple" defaultValue={categories} className="w-full">
        {categories.map((category) => (
          groupedStocks[category] && (
            <AccordionItem value={category} key={category}>
              <AccordionTrigger className="px-2 text-sm font-semibold hover:no-underline">{category}</AccordionTrigger>
              <AccordionContent>
                <SidebarMenu>
                  {groupedStocks[category].map(([ticker, data]) => (
                    <SidebarMenuItem key={ticker}>
                      <SidebarMenuButton
                        onClick={() => setSelectedTicker(ticker)}
                        isActive={selectedTicker === ticker}
                        className="justify-between h-auto py-2"
                      >
                        <div className="flex flex-col text-left">
                          <span className="font-semibold">{ticker}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[120px]">{data.name}</span>
                        </div>
                        <div className={`flex flex-col text-right text-sm ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          <span>{getPriceDisplay(data)}</span>
                          <span className="text-xs">{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </AccordionContent>
            </AccordionItem>
          )
        ))}
      </Accordion>
    </div>
  );
}
