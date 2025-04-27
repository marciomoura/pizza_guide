
'use server';
/**
 * @fileOverview Generates custom pizza dough recipes based on user specifications.
 *
 * - generateDoughRecipe - A function that generates a pizza dough recipe.
 * - GenerateDoughInput - The input type for the generateDoughRecipe function.
 * - GenerateDoughOutput - The return type for the generateDoughRecipe function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'zod';

// Define input schema
const GenerateDoughInputSchema = z.object({
  numberOfBalls: z.number().int().min(1).max(20).describe('The desired number of dough balls.'),
  ballSizeGrams: z.number().int().min(150).max(1000).describe('The desired weight of each dough ball in grams.'),
  doughType: z.string().describe('The type of pizza dough style requested (e.g., Biga, Poolish, Classic Neapolitan, New York Style, Brazilian Style).'),
});
export type GenerateDoughInput = z.infer<typeof GenerateDoughInputSchema>;

// Define output schema
const GenerateDoughOutputSchema = z.object({
  ingredients: z.array(z.object({
    name: z.string().describe('Name of the ingredient (e.g., "00" Flour, Water, Salt, Instant Dry Yeast).'),
    quantity: z.string().describe('Quantity of the ingredient with units (e.g., "500g", "300ml", "10g", "3g").'),
  })).describe('List of ingredients required for the dough.'),
  preFermentationSteps: z.array(z.string()).optional().describe('Steps for creating the pre-ferment (e.g., Biga or Poolish), if applicable to the dough type. Omit if not applicable.'),
  fermentationSteps: z.array(z.string()).describe('Step-by-step instructions for mixing the final dough, bulk fermentation, balling, and final proofing.'),
});
export type GenerateDoughOutput = z.infer<typeof GenerateDoughOutputSchema>;

// Define the exported wrapper function
export async function generateDoughRecipe(input: GenerateDoughInput): Promise<GenerateDoughOutput> {
  return generateDoughFlow(input);
}

// Define the prompt
const doughRecipePrompt = ai.definePrompt({
  name: 'doughRecipePrompt',
  input: {
    schema: GenerateDoughInputSchema,
  },
  output: {
    schema: GenerateDoughOutputSchema,
  },
  prompt: `You are an expert pizzaiolo specializing in crafting perfect pizza dough recipes. Generate a detailed pizza dough recipe based on the following user specifications:

Dough Style: {{{doughType}}}
Number of Dough Balls: {{{numberOfBalls}}}
Weight per Dough ball (grams): {{{ballSizeGrams}}}

Instructions:
1. Calculate the precise ingredient amounts (flour, water, salt, yeast) based on the requested dough style, number of balls, and weight per ball. Use baker's percentages appropriate for the style, typically aiming for a hydration level suitable for {{{doughType}}}. Assume standard ingredient densities if needed. Specify flour type (e.g., "00" Flour for Neapolitan, Bread Flour for New York). Clearly list each ingredient and its calculated quantity with units (grams or ml for water).
2. If the dough style is 'Biga' or 'Poolish', provide clear, step-by-step instructions for creating the pre-ferment in the 'preFermentationSteps' field. Include ingredient amounts for the pre-ferment itself (taken from the total calculated amounts) and fermentation time/temperature. If the style is not Biga or Poolish, omit the 'preFermentationSteps' field or leave it as an empty array.
3. Provide detailed, step-by-step instructions for the final dough mixing process in the 'fermentationSteps' field. This should include:
    - Combining the pre-ferment (if used) with the remaining ingredients.
    - Mixing/kneading technique and duration (e.g., hand mix, stand mixer with hook).
    - Bulk fermentation time and temperature.
    - Dividing and shaping the dough into {{{numberOfBalls}}} balls of approximately {{{ballSizeGrams}}}g each.
    - Final proofing instructions (time, temperature, e.g., room temperature or cold proof).
4. Ensure the instructions are clear, concise, and easy for a home baker to follow.
5. Output the result strictly adhering to the GenerateDoughOutputSchema format.
`,
});


// Define the flow
const generateDoughFlow = ai.defineFlow<
  typeof GenerateDoughInputSchema,
  typeof GenerateDoughOutputSchema
>(
  {
    name: 'generateDoughFlow',
    inputSchema: GenerateDoughInputSchema,
    outputSchema: GenerateDoughOutputSchema,
  },
  async (input) => {
    // Calculate total dough weight
    const totalDoughWeight = input.numberOfBalls * input.ballSizeGrams;

    console.log(`Generating dough recipe for ${input.numberOfBalls} balls of ${input.ballSizeGrams}g each (${totalDoughWeight}g total), style: ${input.doughType}`);

    const { output } = await doughRecipePrompt(input);

    if (!output) {
        throw new Error('Failed to get a response from the AI model.');
    }

    console.log('Recipe generated:', output);

    // Basic validation (optional, as Zod handles schema)
    if (!output.ingredients || output.ingredients.length === 0) {
        throw new Error('Generated recipe is missing ingredients.');
    }
     if (!output.fermentationSteps || output.fermentationSteps.length === 0) {
        throw new Error('Generated recipe is missing fermentation steps.');
    }

    return output;
  }
);

// Add flow to dev list
import { devList } from '@/ai/dev';
devList.generateDoughFlow = generateDoughFlow;
