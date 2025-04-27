import type { Recipe } from '@/types/recipe';

export const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Classic Margherita',
    description: 'A simple yet delicious pizza with fresh tomatoes, mozzarella, and basil.',
    imageUrl: 'https://picsum.photos/seed/margherita/600/400',
    ingredients: [
      '1 Pizza Dough Ball',
      '1/2 cup Tomato Sauce (San Marzano recommended)',
      '4 oz Fresh Mozzarella, sliced',
      'Fresh Basil Leaves',
      '2 tbsp Olive Oil',
      'Salt and Pepper to taste',
    ],
    instructions: [
      'Preheat your oven to 500°F (260°C) with a pizza stone or steel inside.',
      'Stretch the pizza dough on a lightly floured surface to about 12 inches.',
      'Transfer the dough to a piece of parchment paper or a lightly floured pizza peel.',
      'Spread the tomato sauce evenly over the dough, leaving a small border.',
      'Arrange the mozzarella slices over the sauce.',
      'Drizzle with 1 tbsp of olive oil and season with salt and pepper.',
      'Carefully slide the pizza (with parchment, if using) onto the hot stone/steel.',
      'Bake for 8-12 minutes, or until the crust is golden and the cheese is bubbly and slightly browned.',
      'Remove from oven, top with fresh basil leaves, drizzle with remaining olive oil, slice, and serve.',
    ],
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'The all-time favorite classic pepperoni pizza.',
    imageUrl: 'https://picsum.photos/seed/pepperoni/600/400',
    ingredients: [
      '1 Pizza Dough Ball',
      '1/2 cup Pizza Sauce',
      '6 oz Shredded Mozzarella Cheese',
      '4 oz Sliced Pepperoni',
      '1 tbsp Olive Oil (optional)',
      'Dried Oregano (optional)',
    ],
    instructions: [
      'Preheat oven to 475°F (245°C). Place a pizza stone or baking sheet in the oven.',
      'Stretch dough to desired size.',
      'Place dough on parchment paper or floured peel.',
      'Spread pizza sauce evenly, leaving a border.',
      'Sprinkle mozzarella cheese over the sauce.',
      'Arrange pepperoni slices on top.',
      'Drizzle with olive oil and sprinkle oregano if desired.',
      'Transfer pizza to the hot stone/sheet.',
      'Bake for 10-15 minutes until crust is golden and cheese is melted and bubbly.',
      'Let cool slightly before slicing and serving.',
    ],
  },
  {
    id: '3',
    name: 'Veggie Supreme',
    description: 'Loaded with fresh vegetables for a healthy and flavorful pizza.',
    imageUrl: 'https://picsum.photos/seed/veggie/600/400',
    ingredients: [
      '1 Pizza Dough Ball',
      '1/2 cup Tomato Sauce',
      '6 oz Shredded Mozzarella Cheese',
      '1/4 cup Sliced Bell Peppers (mixed colors)',
      '1/4 cup Sliced Red Onion',
      '1/4 cup Sliced Mushrooms',
      '1/4 cup Black Olives, sliced',
      '1 tbsp Olive Oil',
      'Salt and Pepper to taste',
    ],
    instructions: [
      'Preheat oven to 475°F (245°C) with a pizza stone or baking sheet.',
      'Stretch the pizza dough.',
      'Transfer dough to parchment or peel.',
      'Spread sauce, then sprinkle cheese.',
      'Top evenly with bell peppers, onion, mushrooms, and olives.',
      'Drizzle with olive oil, season with salt and pepper.',
      'Slide pizza onto the hot stone/sheet.',
      'Bake for 12-16 minutes, until crust is cooked and veggies are tender-crisp.',
      'Cool slightly, slice, and serve.',
    ],
  },
   {
    id: '4',
    name: 'BBQ Chicken Pizza',
    description: 'Sweet and tangy BBQ sauce, chicken, red onions, and cilantro.',
    imageUrl: 'https://picsum.photos/seed/bbqchicken/600/400',
    ingredients: [
      '1 Pizza Dough Ball',
      '1/2 cup BBQ Sauce',
      '6 oz Shredded Mozzarella or Monterey Jack Cheese',
      '1 cup Cooked Chicken Breast, shredded or diced',
      '1/4 cup Red Onion, thinly sliced',
      '2 tbsp Fresh Cilantro, chopped',
      'Olive oil (optional)',
    ],
    instructions: [
      'Preheat oven to 475°F (245°C).',
      'Stretch pizza dough.',
      'Place dough on parchment or peel.',
      'Spread BBQ sauce evenly over the dough.',
      'Sprinkle with cheese.',
      'Distribute cooked chicken and red onion slices over the cheese.',
      'Bake for 10-15 minutes until crust is golden and cheese is bubbly.',
      'Remove from oven, sprinkle with fresh cilantro.',
      'Slice and serve immediately.',
    ],
  },
];

// Function to simulate fetching recipes (can be replaced with actual API call)
export async function getRecipes(): Promise<Recipe[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return sampleRecipes;
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
   // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return sampleRecipes.find(recipe => recipe.id === id);
}
