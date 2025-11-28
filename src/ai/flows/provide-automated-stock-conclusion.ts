/**
 * @fileOverview This file defines a Genkit flow for providing an automated stock conclusion (Buy/Hold/Sell)
 * based on technical and fundamental analysis.
 *
 * - provideAutomatedStockConclusion - A function that provides an automated stock conclusion.
 * - AutomatedStockConclusionInput - The input type for the provideAutomatedStockConclusion function.
 * - AutomatedStockConclusionOutput - The return type for the provideAutomatedStockConclusion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedStockConclusionInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock.'),
  technicalAnalysis: z.string().describe('The technical analysis of the stock.'),
  fundamentalAnalysis: z.string().describe('The fundamental analysis of the stock.'),
  buySellSignals: z.string().describe('Buy/sell signals based on analysis.'),
});
export type AutomatedStockConclusionInput = z.infer<
  typeof AutomatedStockConclusionInputSchema
>;

const AutomatedStockConclusionOutputSchema = z.object({
  conclusion: z
    .enum(['Beli', 'Tahan', 'Jual'])
    .describe('The automated conclusion (Buy/Hold/Sell) for the stock.'),
});
export type AutomatedStockConclusionOutput = z.infer<
  typeof AutomatedStockConclusionOutputSchema
>;

export async function provideAutomatedStockConclusion(
  input: AutomatedStockConclusionInput
): Promise<AutomatedStockConclusionOutput> {
  return provideAutomatedStockConclusionFlow(input);
}

const provideAutomatedStockConclusionPrompt = ai.definePrompt({
  name: 'provideAutomatedStockConclusionPrompt',
  input: {schema: AutomatedStockConclusionInputSchema},
  output: {schema: AutomatedStockConclusionOutputSchema},
  prompt: `Mengingat analisis teknis, analisis fundamental, dan sinyal beli/jual berikut untuk ticker saham {{{ticker}}}, berikan kesimpulan otomatis (Beli/Tahan/Jual).

Analisis Teknis: {{{technicalAnalysis}}}
Analisis Fundamental: {{{fundamentalAnalysis}}}
Sinyal Beli/Jual: {{{buySellSignals}}}

Kesimpulan:`,
});

export const provideAutomatedStockConclusionFlow = ai.defineFlow(
  {
    name: 'provideAutomatedStockConclusionFlow',
    inputSchema: AutomatedStockConclusionInputSchema,
    outputSchema: AutomatedStockConclusionOutputSchema,
  },
  async input => {
    const {output} = await provideAutomatedStockConclusionPrompt(input);
    return output!;
  }
);
