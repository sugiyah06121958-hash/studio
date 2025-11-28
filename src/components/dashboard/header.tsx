"use client";

import { Logo } from '@/components/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { StockDataCollection } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Watchlist } from './watchlist';
import { StockSearch } from './stock-search';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { ListTodo } from 'lucide-react';

interface HeaderProps {
  stocks: StockDataCollection;
  selectedTicker: string;
  setSelectedTicker: (ticker: string) => void;
  isLoading: boolean;
  watchlistTickers: string[];
  onAddToWatchlist: (ticker: string) => void;
}

export function Header({ stocks, selectedTicker, setSelectedTicker, isLoading, watchlistTickers, onAddToWatchlist }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <Logo className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">StockSense AI</h1>
      </div>

      <nav className="ml-auto flex items-center gap-4">
        {isLoading ? (
            <Skeleton className="h-10 w-48" />
        ) : (
            <Select value={selectedTicker} onValueChange={setSelectedTicker}>
              <SelectTrigger className="w-40 md:w-48">
                  <SelectValue placeholder="Pilih saham" />
              </SelectTrigger>
              <SelectContent>
                  {Object.entries(stocks).map(([ticker, data]) => (
                    watchlistTickers.includes(ticker) && (
                      <SelectItem key={ticker} value={ticker}>
                          <span className="font-medium">{ticker}</span>
                          <span className="text-muted-foreground ml-2 truncate">{data.name}</span>
                      </SelectItem>
                    )
                  ))}
              </SelectContent>
            </Select>
        )}

        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <ListTodo className="mr-2 h-4 w-4" />
                    Daftar Pantau
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold px-2">Daftar Pantau Saham</h3>
                    <StockSearch onAddToWatchlist={onAddToWatchlist} />
                    <Watchlist 
                        stocks={stocks ?? {}}
                        selectedTicker={selectedTicker}
                        setSelectedTicker={setSelectedTicker}
                        isLoading={isLoading}
                        watchlistTickers={watchlistTickers}
                    />
                </div>
            </PopoverContent>
        </Popover>

      </nav>
    </header>
  );
}
