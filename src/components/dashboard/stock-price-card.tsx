"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { StockData } from '@/lib/types';
import { TrendingDown, TrendingUp, BellPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '../ui/input';

interface StockPriceCardProps {
  stock: StockData;
  ticker: string;
}

export function StockPriceCard({ stock, ticker }: StockPriceCardProps) {
  const isPositiveChange = stock.change >= 0;
  const { toast } = useToast();

  const handleSetAlert = () => {
    toast({
      title: "Alert Set",
      description: `You will be notified for significant price movements for ${ticker}.`,
      variant: 'default',
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-2xl font-bold">{ticker}</CardTitle>
          <CardDescription>{stock.name}</CardDescription>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">${stock.price.toFixed(2)}</p>
          <div
            className={`flex items-center justify-end gap-1 text-sm ${
              isPositiveChange ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isPositiveChange ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>
              {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ChartContainer
            config={{
              price: {
                label: 'Price',
                color: isPositiveChange ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-5))',
              },
            }}
          >
            <AreaChart
              data={stock.historicalData}
              margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositiveChange ? "hsl(var(--chart-2))" : "hsl(var(--chart-5))"} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={isPositiveChange ? "hsl(var(--chart-2))" : "hsl(var(--chart-5))"} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="price"
                type="natural"
                fill="url(#fillPrice)"
                stroke="var(--color-price)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <BellPlus className="mr-2 h-4 w-4" />
              Set Alert
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Set Price Alert for {ticker}</AlertDialogTitle>
              <AlertDialogDescription>
                Get notified when the price of {ticker} hits your target.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
               <Input id="price-target" defaultValue={stock.price.toFixed(2)} className="col-span-3" />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSetAlert}>Set Alert</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
