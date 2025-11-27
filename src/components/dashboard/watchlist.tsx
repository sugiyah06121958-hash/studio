"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import type { StockDataCollection } from '@/lib/types';

interface WatchlistProps {
  stocks: StockDataCollection;
  selectedTicker: string;
  setSelectedTicker: (ticker: string) => void;
}

export function Watchlist({ stocks, selectedTicker, setSelectedTicker }: WatchlistProps) {
  return (
    <div className="px-2">
      <SidebarMenu>
        {Object.entries(stocks).map(([ticker, data]) => (
          <SidebarMenuItem key={ticker}>
            <SidebarMenuButton
              onClick={() => setSelectedTicker(ticker)}
              isActive={selectedTicker === ticker}
              className="justify-between"
            >
              <div className="flex flex-col text-left">
                <span className="font-semibold">{ticker}</span>
                <span className="text-xs text-muted-foreground">{data.name}</span>
              </div>
              <div className={`flex flex-col text-right text-sm ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <span>${data.price.toFixed(2)}</span>
                <span className="text-xs">{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
