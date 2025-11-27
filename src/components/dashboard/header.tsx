"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { StockDataCollection } from '@/lib/types';

interface HeaderProps {
  stocks: StockDataCollection;
  selectedTicker: string;
  setSelectedTicker: (ticker: string) => void;
}

export function Header({ stocks, selectedTicker, setSelectedTicker }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex items-center gap-2">
        <Logo className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">StockSense AI</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Select value={selectedTicker} onValueChange={setSelectedTicker}>
          <SelectTrigger className="w-40 md:w-48">
            <SelectValue placeholder="Pilih saham" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(stocks).map(([ticker, data]) => (
              <SelectItem key={ticker} value={ticker}>
                <span className="font-medium">{ticker}</span>
                <span className="text-muted-foreground ml-2 truncate">{data.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
