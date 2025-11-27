
"use client";

import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce'; 
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
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      const fetchResults = async () => {
        setIsLoading(true);
        try {
          const searchData = await searchSymbols(debouncedQuery);
          setResults(searchData);
          if (!isPopoverOpen) setIsPopoverOpen(true);
        } catch (error) {
          console.error("Search failed:", error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchResults();
    } else {
      setResults([]);
      // Do not close popover here to allow selection
    }
  }, [debouncedQuery, isPopoverOpen]);

  const handleSelect = (ticker: string) => {
    onAddToWatchlist(ticker);
    setQuery('');
    setResults([]);
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Cari saham..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!isPopoverOpen) setIsPopoverOpen(true);
                    }}
                    className="pl-9"
                    onFocus={() => { if (results.length > 0) setIsPopoverOpen(true); }}
                />
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
        {!isLoading && debouncedQuery && results.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Tidak ada hasil untuk &quot;{debouncedQuery}&quot;
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
