
// Define the structure for recipe output
export interface DoughRecipe {
  ingredients: Array<{ name: string; quantity: string }>;
  preFermentationSteps?: string[];
  fermentationSteps: string[];
  doughType: string; // To display the name correctly
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
  };
  preFermentation?: {
    type: 'Biga' | 'Poolish';
    flourPercentage: number; // % of total flour used in pre-ferment
    hydration: number; // Hydration % of the pre-ferment itself
    yeastPercentage?: number; // % of total yeast in pre-ferment (optional, can be a pinch)
    steps: string[];
  };
  fermentationSteps: string[];
}

// Hardcoded Recipe Definitions
const recipes: Record<string, RecipeDefinition> = {
  neapolitan: {
    name: 'Classic Neapolitan',
    flourType: '"00" Flour',
    bakersPercentages: {
      water: 62, // 62% hydration
      salt: 2.8, // 2.8% salt
      yeast: 0.1, // 0.1% IDY (adjust based on fermentation time/temp)
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
      water: 65, // 65% hydration
      salt: 2.5, // 2.5% salt
      yeast: 0.4, // 0.4% IDY
      oil: 2, // 2% Oil (e.g., Olive Oil)
      // sugar: 1, // Optional: 1-2% Sugar/Diastatic Malt
    },
    fermentationSteps: [
      'Combine flour, salt, yeast (and sugar if using) in a mixer bowl.',
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
      water: 68, // Higher hydration often used with Biga
      salt: 3,
      yeast: 0.2, // Total IDY, some used in Biga
    },
    preFermentation: {
      type: 'Biga',
      flourPercentage: 40, // Use 40% of total flour for Biga
      hydration: 45, // Biga is stiff: 45% hydration
      yeastPercentage: 25, // Use 25% of total yeast (or a tiny pinch) in Biga
      steps: [
        'Calculate Biga Ingredients: Determine flour, water, and yeast amount for the Biga based on percentages.',
        'Mix Biga: Combine Biga flour, water, and yeast. Mix briefly until just combined (shaggy, stiff dough). Do not knead.',
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
  // Add Poolish and Brazilian definitions similarly...
  poolish: {
      name: 'Poolish (Pre-ferment)',
      flourType: '"00" Flour or All-Purpose Flour',
      bakersPercentages: {
          water: 70, // Typically higher hydration
          salt: 2.8,
          yeast: 0.15, // Total IDY
      },
      preFermentation: {
          type: 'Poolish',
          flourPercentage: 30, // Use 30% of total flour
          hydration: 100, // Poolish is 1:1 flour to water by weight
          yeastPercentage: 33, // Use ~1/3 of total yeast in Poolish
          steps: [
              'Calculate Poolish Ingredients: Determine flour, water, and yeast for Poolish.',
              'Mix Poolish: Whisk together Poolish flour, water, and yeast until smooth (liquid batter).',
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
          water: 55, // Often lower hydration
          salt: 1.8,
          yeast: 1.5, // Can be higher for faster rise
          oil: 5, // Often includes oil
          sugar: 3, // Often includes sugar
          // Optional: Egg yolk or milk powder sometimes added
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
  // Total Weight = Flour * (1 + %Water + %Salt + %Yeast + %Oil + %Sugar)
  const totalPercentage =
    1 +
    definition.bakersPercentages.water / 100 +
    definition.bakersPercentages.salt / 100 +
    definition.bakersPercentages.yeast / 100 +
    (definition.bakersPercentages.oil ?? 0) / 100 +
    (definition.bakersPercentages.sugar ?? 0) / 100; // Added sugar here

  const flourWeight = Math.round(totalDoughWeight / totalPercentage);

  // Calculate individual ingredient weights
  const waterWeight = Math.round(flourWeight * (definition.bakersPercentages.water / 100));
  const saltWeight = Math.round(flourWeight * (definition.bakersPercentages.salt / 100) * 10) / 10; // Round to 1 decimal
  const yeastWeight = Math.round(flourWeight * (definition.bakersPercentages.yeast / 100) * 100) / 100; // Round to 2 decimals
  const oilWeight = definition.bakersPercentages.oil ? Math.round(flourWeight * (definition.bakersPercentages.oil / 100)) : 0;
  const sugarWeight = definition.bakersPercentages.sugar ? Math.round(flourWeight * (definition.bakersPercentages.sugar / 100)) : 0; // Calculate sugar weight


  const ingredients: DoughRecipe['ingredients'] = [
    { name: definition.flourType, quantity: `${flourWeight}g` },
    { name: 'Water', quantity: `${waterWeight}g (or ml)` }, // Water density is ~1g/ml
    { name: 'Salt', quantity: `${saltWeight}g` },
    { name: 'Instant Dry Yeast', quantity: `${yeastWeight < 0.1 ? '< 0.1' : yeastWeight}g` }, // Show small amounts clearly
  ];

  if (oilWeight > 0) {
    ingredients.push({ name: 'Oil', quantity: `${oilWeight}g` });
  }
  if (sugarWeight > 0) { // Add sugar if calculated
      ingredients.push({ name: 'Sugar', quantity: `${sugarWeight}g` });
  }


  // Add pre-fermentation steps if defined
  let preFermentationSteps: string[] | undefined = undefined;
  if (definition.preFermentation) {
      // Simple placeholder text - real implementation would calculate amounts
      preFermentationSteps = [
          `Prepare ${definition.preFermentation.type} using calculated portion of total flour, water, and yeast.`,
          ...definition.preFermentation.steps
      ];
  }


  // Construct the final recipe object
  const finalRecipe: DoughRecipe = {
    doughType: definition.name,
    ingredients: ingredients,
    preFermentationSteps: preFermentationSteps,
    fermentationSteps: definition.fermentationSteps.map(step =>
        // Replace placeholders - simplistic example
        step.replace('portions', `${numberOfBalls} portions`)
           .replace('portions.', `${numberOfBalls} portions.`)
    ),
  };

  return finalRecipe;
}
