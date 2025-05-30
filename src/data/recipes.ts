
// Define the structure for recipe output
export interface DoughRecipe {
  doughType: string; // Display name of the dough type
  ingredients: Array<{ name: string; quantity: string }>; // Ingredients for the FINAL dough mix
  preFermentIngredients?: Array<{ name: string; quantity: string }>; // Ingredients specifically for the pre-ferment
  preFermentPercentageUsed?: number; // Percentage of total flour used in pre-ferment
  hydrationUsed?: number; // Actual hydration percentage used for the final dough
  preFermentationSteps?: string[];
  fermentationSteps: string[];
}

// Define the structure for base recipe data (using Baker's Percentages)
interface RecipeDefinition {
  name: string;
  flourType: string;
  bakersPercentages: {
    water: number; // % relative to flour (this is the default target hydration for the whole dough)
    salt: number; // % relative to flour
    yeast: number; // % relative to flour (Instant Dry Yeast)
    oil?: number; // % relative to flour (optional)
    sugar?: number; // % relative to flour (optional)
  };
  preFermentation?: {
    type: 'Biga' | 'Poolish';
    flourPercentage: number; // Default % of total flour used in pre-ferment
    hydration: number; // Hydration % of the pre-ferment itself (e.g., Biga 45%, Poolish 100%)
    yeastPercentage: number; // % of *total* yeast used in pre-ferment
    steps: string[];
  };
  fermentationSteps: string[];
}

// Helper function for rounding
function round(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

// Helper function for formatting small yeast amounts
function formatYeast(weight: number): string {
    if (weight < 0.01) return '< 0.01g (a tiny pinch)';
    if (weight < 0.1) return `${round(weight, 2)}g`;
    return `${round(weight, 1)}g`;
}

export const recipes: Record<string, RecipeDefinition> = {
  neapolitan: {
    name: 'Classic Neapolitan',
    flourType: '"00" Flour',
    bakersPercentages: {
      water: 62, // Default overall hydration
      salt: 2.8,
      yeast: 0.1,
    },
    fermentationSteps: [
      'Combine flour and most of the water (reserve ~30ml). Mix until shaggy.',
      'Dissolve salt in remaining water and add to dough. Knead for 5-10 mins until smooth.',
      'Add yeast, incorporate fully. Knead for another 5 mins until elastic (windowpane test).',
      'Bulk Ferment: Cover dough and let rise at room temp (~20-24°C) for 2 hours.',
      'Divide and Ball: Divide dough into {numberOfBalls} portions. Shape into smooth balls.',
      'Final Proof: Place balls in lightly oiled containers or a proofing box. Proof at room temp for 4-6 hours OR cold proof (fridge ~4°C) for 24-72 hours.',
      'Before use (if cold proofed), let balls sit at room temp for 1-2 hours.',
    ],
  },
  new_york: {
    name: 'New York Style',
    flourType: 'Bread Flour (High Gluten)',
    bakersPercentages: {
      water: 65,
      salt: 2.5,
      yeast: 0.4,
      oil: 2,
      sugar: 1,
    },
    fermentationSteps: [
      'Combine flour, salt, yeast and sugar in a mixer bowl.',
      'Add water and oil. Mix on low speed with dough hook until combined.',
      'Increase speed to medium-low and knead for 8-12 minutes until smooth, elastic, and passes windowpane test.',
      'Bulk Ferment: Lightly oil a bowl, place dough in, turn to coat. Cover and let rise at room temp for 1-2 hours OR proceed directly to cold fermentation.',
      'Divide and Ball: Divide dough into {numberOfBalls} portions. Shape into tight balls.',
      'Cold Proof (Recommended): Place balls in oiled containers/bags. Refrigerate for 24-72 hours (48h often ideal).',
      'Temper: Before baking, remove dough from fridge and let it sit at room temp for 60-90 minutes.',
    ],
  },
  biga: {
    name: 'Biga (Pre-ferment)',
    flourType: '"00" Flour or Bread Flour',
    bakersPercentages: {
      water: 68, // Default overall hydration for the final dough
      salt: 3,
      yeast: 0.2,
    },
    preFermentation: {
      type: 'Biga',
      flourPercentage: 40,
      hydration: 45, // Biga's own hydration
      yeastPercentage: 25,
      steps: [
        'Mix Biga Ingredients: Combine Biga flour, Biga water, and Biga yeast. Mix briefly until just combined (shaggy, stiff dough). Do not knead.',
        'Ferment Biga: Cover loosely and let ferment at cool room temp (16-18°C) for 12-16 hours OR in the fridge (4°C) for 24-48 hours.',
      ],
    },
    fermentationSteps: [
      'Combine Final Dough Ingredients: In a mixer bowl, combine the mature Biga (tear into small pieces), remaining flour, remaining yeast, and most of the remaining water.',
      'Mix Low: Mix on low speed until ingredients start coming together.',
      'Add Salt & Remaining Water: Dissolve salt in the last bit of water and add slowly while mixing on low.',
      'Knead: Increase speed to medium-low and knead for 10-15 minutes until smooth and elastic.',
      'Bulk Ferment: Cover dough and let rise at room temp for 1-2 hours (watch the dough, not the clock).',
      'Divide and Ball: Divide dough into {numberOfBalls} portions and shape into balls.',
      'Final Proof: Place in containers. Proof at room temp for 3-5 hours OR cold proof for 12-48 hours.',
      'Temper: Before use (if cold proofed), let balls sit at room temp for 1-2 hours.',
    ],
  },
  poolish: {
      name: 'Poolish (Pre-ferment)',
      flourType: '"00" Flour or All-Purpose Flour',
      bakersPercentages: {
          water: 70, // Default overall hydration for the final dough
          salt: 2.8,
          yeast: 0.15,
      },
      preFermentation: {
          type: 'Poolish',
          flourPercentage: 30,
          hydration: 100, // Poolish's own hydration (1:1 flour to water)
          yeastPercentage: 33,
          steps: [
              'Mix Poolish Ingredients: Whisk together Poolish flour, Poolish water, and Poolish yeast until smooth (liquid batter).',
              'Ferment Poolish: Cover and let ferment at room temp (~20-22°C) for 8-12 hours, or until bubbly, domed, and just starting to recede in the center.',
          ],
      },
      fermentationSteps: [
          'Combine Final Dough: In a mixer bowl, combine mature Poolish, remaining flour, remaining yeast, and salt.',
          'Add Water Gradually: Slowly add remaining water while mixing on low speed.',
          'Knead: Knead on medium-low speed for 8-12 minutes until dough is strong and elastic.',
          'Bulk Ferment: Cover dough, let rise at room temp for 1.5-2.5 hours, with folds every 45-60 mins if desired.',
          'Divide and Ball: Gently divide into {numberOfBalls} portions and shape into balls.',
          'Final Proof: Proof at room temp for 3-4 hours or cold proof for 12-24 hours.',
          'Temper: If cold proofed, temper at room temp for 1-2 hours before use.',
      ],
  },
  brazilian: {
      name: 'Brazilian Style',
      flourType: 'All-Purpose Flour',
      bakersPercentages: {
          water: 55,
          salt: 1.8,
          yeast: 1.5,
          oil: 5,
          sugar: 3,
      },
      fermentationSteps: [
          'Combine Dry Ingredients: Whisk flour, salt, yeast, and sugar in a bowl.',
          'Add Wet Ingredients: Add water and oil. Mix until a shaggy dough forms.',
          'Knead: Knead on a lightly floured surface or in a mixer for 8-10 minutes until smooth and soft.',
          'Bulk Ferment: Place in a lightly oiled bowl, cover, and let rise in a warm place for 1-1.5 hours, or until doubled.',
          'Punch Down & Divide: Gently punch down the dough. Divide into {numberOfBalls} portions.',
          'Shape & Second Rise: Shape into balls or directly into pizza bases. Let rest/rise for another 20-30 minutes.',
          'Top and Bake: Add toppings and bake in a hot oven.',
      ],
  },
  focaccia: {
    name: 'Focaccia',
    flourType: 'Bread Flour or All-Purpose Flour',
    bakersPercentages: {
        water: 75,
        salt: 2.2,
        yeast: 0.8,
        oil: 5,
    },
    fermentationSteps: [
        'Combine Ingredients: In a large bowl, whisk together flour, salt, and yeast.',
        'Add Water & Oil: Add water and oil. Mix with a spatula or hands until a very wet, shaggy dough forms. No extensive kneading needed.',
        'First Rise (Bulk Ferment): Cover the bowl. Let rise at room temperature for 1.5-2 hours, performing 2-3 sets of stretch-and-folds in the bowl during the first hour (wet hands to prevent sticking).',
        'Pan Prep: Generously oil a baking sheet or pan (e.g., 9x13 inch).',
        'Transfer & Shape: Gently transfer the dough to the oiled pan. Oil your hands and gently stretch/press the dough towards the edges of the pan. Don\'t force it if it resists; let it rest for 10-15 minutes and try again.',
        'Second Rise (Proof in Pan): Cover the pan loosely. Let the dough proof at room temperature for 1-1.5 hours, until puffy and nearly doubled.',
        'Dimple & Top: Preheat oven to 220°C (425°F). Oil your fingertips and dimple the dough all over, pressing down firmly to the bottom of the pan. Drizzle with more olive oil and sprinkle with flaky sea salt and optional herbs (like rosemary).',
        'Bake: Bake for 20-25 minutes, or until golden brown and cooked through.',
        'Cool: Let cool in the pan for a few minutes before transferring to a wire rack.',
    ],
  },
};

export function getCalculatedRecipe(
  doughTypeKey: keyof typeof recipes,
  numberOfBalls: number,
  ballSizeGrams: number,
  preFermentFlourPercentageInput?: number,
  doughHydrationPercentageInput?: number
): DoughRecipe | null {
  const definition = recipes[doughTypeKey];
  if (!definition) return null;

  let currentBakersPercentages = { ...definition.bakersPercentages };
  let hydrationUsed = currentBakersPercentages.water; // Default to recipe's defined hydration

  // Override overall dough hydration if user provides valid input for specific types
  if (['neapolitan', 'biga', 'poolish'].includes(doughTypeKey) &&
      doughHydrationPercentageInput !== undefined &&
      doughHydrationPercentageInput >= 50 && doughHydrationPercentageInput <= 100) {
    currentBakersPercentages.water = doughHydrationPercentageInput;
    hydrationUsed = doughHydrationPercentageInput;
  }

  const totalDoughWeight = numberOfBalls * ballSizeGrams;

  const totalPercentageSum =
    100 + // Flour itself
    currentBakersPercentages.water +
    currentBakersPercentages.salt +
    currentBakersPercentages.yeast +
    (currentBakersPercentages.oil ?? 0) +
    (currentBakersPercentages.sugar ?? 0);

  const totalFlourWeight = round(totalDoughWeight / (totalPercentageSum / 100), 0);
  const totalWaterWeight = round(totalFlourWeight * (currentBakersPercentages.water / 100), 0); // This is TOTAL water for the dough
  const totalSaltWeight = round(totalFlourWeight * (currentBakersPercentages.salt / 100), 1);
  const totalYeastWeight = round(totalFlourWeight * (currentBakersPercentages.yeast / 100), 2);
  const totalOilWeight = currentBakersPercentages.oil ? round(totalFlourWeight * (currentBakersPercentages.oil / 100), 0) : 0;
  const totalSugarWeight = currentBakersPercentages.sugar ? round(totalFlourWeight * (currentBakersPercentages.sugar / 100), 0) : 0;

  let finalIngredients: DoughRecipe['ingredients'] = [];
  let preFermentIngredientsList: DoughRecipe['preFermentIngredients'] | undefined = undefined;
  let preFermentationSteps: string[] | undefined = undefined;
  let preFermentPercentageUsed : number | undefined = undefined;

  if (definition.preFermentation) {
    const pfDefinition = definition.preFermentation;
    preFermentationSteps = pfDefinition.steps;

    const flourPercentageToUse = preFermentFlourPercentageInput !== undefined && preFermentFlourPercentageInput >= 10 && preFermentFlourPercentageInput <= 80
      ? preFermentFlourPercentageInput
      : pfDefinition.flourPercentage;
    preFermentPercentageUsed = flourPercentageToUse;

    const pfFlour = round(totalFlourWeight * (flourPercentageToUse / 100), 0);
    // Water for pre-ferment is based on ITS OWN hydration, not overall dough hydration
    const pfWater = round(pfFlour * (pfDefinition.hydration / 100), 0);
    const pfYeast = round(totalYeastWeight * (pfDefinition.yeastPercentage / 100), 2);

    preFermentIngredientsList = [
        { name: `${pfDefinition.type} ${definition.flourType}`, quantity: `${pfFlour}g` },
        { name: 'Water', quantity: `${pfWater}g` },
        { name: 'Instant Dry Yeast', quantity: formatYeast(pfYeast) },
    ];

    const finalFlour = totalFlourWeight - pfFlour;
    const finalWater = totalWaterWeight - pfWater; // Remaining water for final dough
    const finalYeast = totalYeastWeight - pfYeast;
    const preFermentWeight = pfFlour + pfWater + pfYeast;

    if (finalFlour < 0 || finalWater < 0) {
      throw new Error(`Pre-ferment or hydration settings result in negative final dough ingredients. Review percentages.`);
    }

    finalIngredients.push({ name: `Mature ${pfDefinition.type}`, quantity: `~${round(preFermentWeight,0)}g (All from above)` });
    finalIngredients.push({ name: definition.flourType, quantity: `${finalFlour}g` });
    finalIngredients.push({ name: 'Water', quantity: `${finalWater}g` });
    if (finalYeast > 0.001) {
        finalIngredients.push({ name: 'Instant Dry Yeast', quantity: formatYeast(finalYeast) });
    }
    finalIngredients.push({ name: 'Salt', quantity: `${totalSaltWeight}g` });
    if (totalOilWeight > 0) {
        finalIngredients.push({ name: 'Oil', quantity: `${totalOilWeight}g` });
    }
    if (totalSugarWeight > 0) {
        finalIngredients.push({ name: 'Sugar', quantity: `${totalSugarWeight}g` });
    }

  } else {
    finalIngredients = [
      { name: definition.flourType, quantity: `${totalFlourWeight}g` },
      { name: 'Water', quantity: `${totalWaterWeight}g` },
      { name: 'Salt', quantity: `${totalSaltWeight}g` },
      { name: 'Instant Dry Yeast', quantity: formatYeast(totalYeastWeight) },
    ];
    if (totalOilWeight > 0) {
      finalIngredients.push({ name: doughTypeKey === 'focaccia' ? 'Olive Oil' : 'Oil', quantity: `${totalOilWeight}g` });
    }
    if (totalSugarWeight > 0) {
      finalIngredients.push({ name: 'Sugar', quantity: `${totalSugarWeight}g` });
    }
  }

  const finalRecipe: DoughRecipe = {
    doughType: definition.name,
    ingredients: finalIngredients,
    preFermentIngredients: preFermentIngredientsList,
    preFermentPercentageUsed: preFermentPercentageUsed,
    hydrationUsed: hydrationUsed, // Add the actual hydration used
    preFermentationSteps: preFermentationSteps,
    fermentationSteps: definition.fermentationSteps.map(step =>
        step.replace(/\{numberOfBalls\}/g, numberOfBalls.toString())
    ),
  };

  return finalRecipe;
}
