
// Define the structure for recipe output
export interface DoughRecipe {
  doughType: string; // Display name of the dough type
  ingredients: Array<{ name: string; quantity: string }>; // Ingredients for the FINAL dough mix
  preFermentIngredients?: Array<{ name: string; quantity: string }>; // Ingredients specifically for the pre-ferment
  preFermentationSteps?: string[];
  fermentationSteps: string[];
}

// Define the structure for base recipe data (using Baker's Percentages)
interface RecipeDefinition {
  name: string;
  flourType: string;
  bakersPercentages: {
    water: number; // % relative to flour
    salt: number; // % relative to flour
    yeast: number; // % relative to flour (Instant Dry Yeast)
    oil?: number; // % relative to flour (optional)
    sugar?: number; // % relative to flour (optional)
  };
  preFermentation?: {
    type: 'Biga' | 'Poolish';
    flourPercentage: number; // % of total flour used in pre-ferment
    hydration: number; // Hydration % of the pre-ferment itself
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

// Hardcoded Recipe Definitions
const recipes: Record<string, RecipeDefinition> = {
  neapolitan: {
    name: 'Classic Neapolitan',
    flourType: '"00" Flour',
    bakersPercentages: {
      water: 62,
      salt: 2.8,
      yeast: 0.1,
    },
    fermentationSteps: [
      'Combine flour and most of the water (reserve ~30ml). Mix until shaggy.',
      'Dissolve salt in remaining water and add to dough. Knead for 5-10 mins until smooth.',
      'Add yeast, incorporate fully. Knead for another 5 mins until elastic (windowpane test).',
      'Bulk Ferment: Cover dough and let rise at room temp (~20-24°C) for 2 hours.',
      'Divide and Ball: Divide dough into portions. Shape into smooth balls.',
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
      sugar: 1, // Added sugar
    },
    fermentationSteps: [
      'Combine flour, salt, yeast and sugar in a mixer bowl.',
      'Add water and oil. Mix on low speed with dough hook until combined.',
      'Increase speed to medium-low and knead for 8-12 minutes until smooth, elastic, and passes windowpane test.',
      'Bulk Ferment: Lightly oil a bowl, place dough in, turn to coat. Cover and let rise at room temp for 1-2 hours OR proceed directly to cold fermentation.',
      'Divide and Ball: Divide dough into portions. Shape into tight balls.',
      'Cold Proof (Recommended): Place balls in oiled containers/bags. Refrigerate for 24-72 hours (48h often ideal).',
      'Temper: Before baking, remove dough from fridge and let it sit at room temp for 60-90 minutes.',
    ],
  },
  biga: {
    name: 'Biga (Pre-ferment)',
    flourType: '"00" Flour or Bread Flour',
    bakersPercentages: {
      water: 68,
      salt: 3,
      yeast: 0.2,
    },
    preFermentation: {
      type: 'Biga',
      flourPercentage: 40, // Use 40% of total flour
      hydration: 45, // Biga is stiff: 45% hydration
      yeastPercentage: 25, // Use 25% of *total* yeast in Biga
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
      'Divide and Ball: Divide dough into portions and shape into balls.',
      'Final Proof: Place in containers. Proof at room temp for 3-5 hours OR cold proof for 12-48 hours.',
      'Temper: Before use (if cold proofed), let balls sit at room temp for 1-2 hours.',
    ],
  },
  poolish: {
      name: 'Poolish (Pre-ferment)',
      flourType: '"00" Flour or All-Purpose Flour',
      bakersPercentages: {
          water: 70,
          salt: 2.8,
          yeast: 0.15,
      },
      preFermentation: {
          type: 'Poolish',
          flourPercentage: 30, // Use 30% of total flour
          hydration: 100, // Poolish is 1:1 flour to water
          yeastPercentage: 33, // Use ~1/3 of *total* yeast
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
          'Divide and Ball: Gently divide and shape into balls.',
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
          'Punch Down & Divide: Gently punch down the dough. Divide into portions.',
          'Shape & Second Rise: Shape into balls or directly into pizza bases. Let rest/rise for another 20-30 minutes.',
          'Top and Bake: Add toppings and bake in a hot oven.',
      ],
  },
};

// Function to calculate ingredients and generate the final recipe object
export function getCalculatedRecipe(
  doughTypeKey: keyof typeof recipes,
  numberOfBalls: number,
  ballSizeGrams: number
): DoughRecipe | null {
  const definition = recipes[doughTypeKey];
  if (!definition) return null;

  const totalDoughWeight = numberOfBalls * ballSizeGrams;

  // Calculate total flour weight based on percentages
  const totalPercentage =
    1 +
    definition.bakersPercentages.water / 100 +
    definition.bakersPercentages.salt / 100 +
    definition.bakersPercentages.yeast / 100 +
    (definition.bakersPercentages.oil ?? 0) / 100 +
    (definition.bakersPercentages.sugar ?? 0) / 100;

  const totalFlourWeight = round(totalDoughWeight / totalPercentage, 0);

  // Calculate total amounts for other ingredients based on total flour
  const totalWaterWeight = round(totalFlourWeight * (definition.bakersPercentages.water / 100), 0);
  const totalSaltWeight = round(totalFlourWeight * (definition.bakersPercentages.salt / 100), 1);
  const totalYeastWeight = round(totalFlourWeight * (definition.bakersPercentages.yeast / 100), 2);
  const totalOilWeight = definition.bakersPercentages.oil ? round(totalFlourWeight * (definition.bakersPercentages.oil / 100), 0) : 0;
  const totalSugarWeight = definition.bakersPercentages.sugar ? round(totalFlourWeight * (definition.bakersPercentages.sugar / 100), 0) : 0;

  let finalIngredients: DoughRecipe['ingredients'] = [];
  let preFermentIngredients: DoughRecipe['preFermentIngredients'] | undefined = undefined;
  let preFermentationSteps: string[] | undefined = definition.preFermentation?.steps;

  if (definition.preFermentation) {
    // Calculate Pre-ferment Ingredients
    const pf = definition.preFermentation;
    const pfFlour = round(totalFlourWeight * (pf.flourPercentage / 100), 0);
    const pfWater = round(pfFlour * (pf.hydration / 100), 0); // Water based on pre-ferment flour
    const pfYeast = round(totalYeastWeight * (pf.yeastPercentage / 100), 2);

    preFermentIngredients = [
        { name: definition.flourType, quantity: `${pfFlour}g` },
        { name: 'Water', quantity: `${pfWater}g` },
        { name: 'Instant Dry Yeast', quantity: formatYeast(pfYeast) },
    ];

    // Calculate Final Dough Ingredients (remaining amounts + salt/oil/sugar + pre-ferment)
    const finalFlour = totalFlourWeight - pfFlour;
    const finalWater = totalWaterWeight - pfWater;
    const finalYeast = totalYeastWeight - pfYeast;
    const preFermentWeight = pfFlour + pfWater + pfYeast; // Approximate weight

    finalIngredients.push({ name: `Mature ${pf.type}`, quantity: `~${round(preFermentWeight,0)}g (All from above)` });
    finalIngredients.push({ name: definition.flourType, quantity: `${finalFlour}g` });
    finalIngredients.push({ name: 'Water', quantity: `${finalWater}g` });
    if (finalYeast > 0.001) { // Only add if significant yeast remains
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
    // Direct dough - all ingredients go into the main mix
    finalIngredients = [
      { name: definition.flourType, quantity: `${totalFlourWeight}g` },
      { name: 'Water', quantity: `${totalWaterWeight}g` },
      { name: 'Salt', quantity: `${totalSaltWeight}g` },
      { name: 'Instant Dry Yeast', quantity: formatYeast(totalYeastWeight) },
    ];
    if (totalOilWeight > 0) {
      finalIngredients.push({ name: 'Oil', quantity: `${totalOilWeight}g` });
    }
    if (totalSugarWeight > 0) {
      finalIngredients.push({ name: 'Sugar', quantity: `${totalSugarWeight}g` });
    }
  }


  // Construct the final recipe object
  const finalRecipe: DoughRecipe = {
    doughType: definition.name,
    ingredients: finalIngredients,
    preFermentIngredients: preFermentIngredients,
    preFermentationSteps: preFermentationSteps,
    fermentationSteps: definition.fermentationSteps.map(step =>
      step.replace('portions', `${numberOfBalls} portions`)
         .replace('portions.', `${numberOfBalls} portions.`)
    ),
  };

  return finalRecipe;
}
