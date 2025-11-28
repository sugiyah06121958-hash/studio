/**
 * @fileOverview Predicts future stock prices using time series analysis and incorporates relevant financial news.
 *
 * - predictFutureStockPrice - A function that handles the stock price prediction process.
 * - PredictFutureStockPriceInput - The input type for the predictFutureStockPrice function.
 * - PredictFutureStockPriceOutput - The return type for the predictFutureStockPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictFutureStockPriceInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock to predict.'),
  timeSeriesData: z.string().describe('Time series data for the stock, such as historical prices.'),
  financialNews: z.string().describe('Relevant financial news articles related to the stock.'),
});
export type PredictFutureStockPriceInput = z.infer<
  typeof PredictFutureStockPriceInputSchema
>;

const PredictFutureStockPriceOutputSchema = z.object({
  prediction: z
    .string()
    .describe('A prediction of the stock price in the near future.'),
  confidence: z
    .number()
    .describe('A confidence level (0-1) for the prediction, with 1 being most confident.'),
  rationale: z
    .string()
    .describe('The rationale behind the prediction, including key factors.'),
});
export type PredictFutureStockPriceOutput = z.infer<
  typeof PredictFutureStockPriceOutputSchema
>;

export async function predictFutureStockPrice(
  input: PredictFutureStockPriceInput
): Promise<PredictFutureStockPriceOutput> {
  return predictFutureStockPriceFlow(input);
}

const assessNewsRelevance = ai.defineTool({
  name: 'assessNewsRelevance',
  description: 'Determines the relevance of financial news to stock price prediction.',
  inputSchema: z.object({
    news: z.string().describe('Financial news article.'),
    ticker: z.string().describe('Stock ticker symbol.'),
  }),
  outputSchema: z.number().describe('Relevance score (0-1).'),
}, async (input) => {
  // Dummy implementation - replace with actual relevance assessment logic
  // For now, return a random number between 0 and 1
  return Math.random();
});

const predictFutureStockPricePrompt = ai.definePrompt({
  name: 'predictFutureStockPricePrompt',
  input: {schema: PredictFutureStockPriceInputSchema},
  output: {schema: PredictFutureStockPriceOutputSchema},
  tools: [assessNewsRelevance],
  prompt: `Anda adalah seorang ahli prediksi harga saham.

  Berdasarkan data deret waktu dan berita keuangan yang diberikan, prediksikan harga saham di masa depan untuk simbol ticker: {{{ticker}}}.

  Data Deret Waktu: {{{timeSeriesData}}}
  Berita Keuangan: {{{financialNews}}}

  Pertimbangkan relevansi berita keuangan menggunakan alat assessNewsRelevance.

  Berikan prediksi, tingkat kepercayaan (0-1), dan alasan untuk prediksi Anda.`,
});

export const predictFutureStockPriceFlow = ai.defineFlow(
  {
    name: 'predictFutureStockPriceFlow',
    inputSchema: PredictFutureStockPriceInputSchema,
    outputSchema: PredictFutureStockPriceOutputSchema,
  },
  async input => {
    const {output} = await predictFutureStockPricePrompt(input);
    return output!;
  }
);
