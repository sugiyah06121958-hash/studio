"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { searchSymbols } from '@/lib/alpha-vantage';
import type { SearchResult } from '@/lib/types';
import { Loader2, Search } from 'lucide-react';
import { Button } from '../ui/button';

interface StockSearchProps {
  onAddToWatchlist: (ticker: string) => void;
}

export function StockSearch({ onAddToWatchlist }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSearch = async () => {
    if (!query) {
        setResults([]);
        return;
    }
    setIsLoading(true);
    if (!isPopoverOpen) setIsPopoverOpen(true);
    try {
      const searchData = await searchSymbols(query);
      setResults(searchData);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (ticker: string) => {
    onAddToWatchlist(ticker);
    setQuery('');
    setResults([]);
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
            <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="Cari saham..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearch();
                        }
                    }}
                    className="pl-9 pr-10"
                />
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 h-8 w-8"
                    onClick={handleSearch}
                    disabled={isLoading}
                    aria-label="Cari"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
            </div>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        {isLoading && (
            <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        )}
        {!isLoading && results.length > 0 && (
          <div className="flex flex-col space-y-1 p-2">
            {results.map((item) => (
              <Button
                key={item.symbol}
                variant="ghost"
                className="flex h-auto flex-col items-start p-2"
                onClick={() => handleSelect(item.symbol)}
              >
                <div className="font-semibold">{item.symbol}</div>
                <div className="text-xs text-muted-foreground">{item.name}</div>
              </Button>
            ))}
          </div>
        )}
        {!isLoading && query && results.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Tidak ada hasil untuk &quot;{query}&quot;
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
