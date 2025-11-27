import { config } from 'dotenv';
config();

import '@/ai/flows/generate-buy-sell-signals.ts';
import '@/ai/flows/provide-automated-stock-conclusion.ts';
import '@/ai/flows/predict-future-stock-price.ts';