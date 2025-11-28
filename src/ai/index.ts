// This file is the main entry point for all Genkit flows.
// It is imported by the API route to ensure that all flows are registered
// when the API is called.

import { config } from 'dotenv';
config();

import './flows/generate-buy-sell-signals';
import './flows/provide-automated-stock-conclusion';
import './flows/predict-future-stock-price';
