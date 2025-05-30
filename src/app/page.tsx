
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getCalculatedRecipe, type DoughRecipe, recipes as recipeDefinitions } from '@/data/recipes';
import { Pizza, ListChecks, ChefHat, Calculator, Wheat, Percent, MinusSquare, Droplets, Search, Utensils, Flame, CookingPot } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

// Define Zod schema for form validation
const doughFormSchema = z.object({
  numberOfBalls: z.coerce.number().int().min(1, 'Must be at least 1 portion/ball').max(20, 'Cannot exceed 20 portions/balls'),
  ballSizeGrams: z.coerce.number().int().min(150, 'Minimum size is 150g').max(2000, 'Maximum size is 2000g'),
  doughType: z.enum(['biga', 'poolish', 'neapolitan', 'new_york', 'brazilian', 'focaccia'], {
    required_error: 'Please select a dough type.',
  }),
  preFermentFlourPercentage: z.coerce.number().int().min(10, 'Must be at least 10%').max(80, 'Cannot exceed 80%').optional(),
  doughHydrationPercentage: z.coerce.number().int().min(50, 'Min hydration 50%').max(100, 'Max hydration 100%').optional(),
}).refine(data => {
  const requiresPreFerment = data.doughType === 'biga' || data.doughType === 'poolish';
  return !requiresPreFerment || (requiresPreFerment && typeof data.preFermentFlourPercentage === 'number');
}, {
  message: "Pre-ferment percentage is required for this dough type.",
  path: ["preFermentFlourPercentage"],
}).refine(data => {
  const requiresHydrationInput = data.doughType === 'biga' || data.doughType === 'poolish' || data.doughType === 'neapolitan' || data.doughType === 'focaccia';
  return !requiresHydrationInput || (requiresHydrationInput && typeof data.doughHydrationPercentage === 'number');
}, {
  message: "Dough hydration is required for this dough type.",
  path: ["doughHydrationPercentage"],
});


type DoughFormValues = z.infer<typeof doughFormSchema>;

const recipeKeys: Record<DoughFormValues['doughType'], keyof typeof recipeDefinitions> = {
  biga: 'biga',
  poolish: 'poolish',
  neapolitan: 'neapolitan',
  new_york: 'new_york',
  brazilian: 'brazilian',
  focaccia: 'focaccia',
};

const doughTypeNames: Record<DoughFormValues['doughType'], string> = {
  biga: 'Biga (Pre-ferment Pizza)',
  poolish: 'Poolish (Pre-ferment Pizza)',
  neapolitan: 'Classic Neapolitan Pizza',
  new_york: 'New York Style Pizza',
  brazilian: 'Brazilian Style Pizza',
  focaccia: 'Focaccia',
};


export default function Home() {
  const [doughRecipe, setDoughRecipe] = React.useState<DoughRecipe | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<DoughFormValues>({
    resolver: zodResolver(doughFormSchema),
    defaultValues: {
      numberOfBalls: 3,
      ballSizeGrams: 250,
      doughType: undefined,
      preFermentFlourPercentage: undefined,
      doughHydrationPercentage: undefined,
    },
  });

  const watchedDoughType = form.watch('doughType');
  const requiresPreFerment = watchedDoughType === 'biga' || watchedDoughType === 'poolish';
  const isFocaccia = watchedDoughType === 'focaccia';
  const requiresHydrationInput = watchedDoughType === 'neapolitan' || watchedDoughType === 'biga' || watchedDoughType === 'poolish' || watchedDoughType === 'focaccia';


  React.useEffect(() => {
    const currentDoughType = watchedDoughType;
    const recipeKey = currentDoughType ? recipeKeys[currentDoughType] : undefined;
    const recipeDef = recipeKey ? recipeDefinitions[recipeKey] : undefined;

    if (isFocaccia) {
        if (form.getValues('numberOfBalls') === 3 && form.getValues('ballSizeGrams') === 250) {
             form.setValue('numberOfBalls', 1);
             form.setValue('ballSizeGrams', 800);
        }
    } else {
        if (form.getValues('numberOfBalls') === 1 && form.getValues('ballSizeGrams') === 800) {
            form.setValue('numberOfBalls', 3);
            form.setValue('ballSizeGrams', 250);
        }
    }

    if (requiresPreFerment && recipeDef?.preFermentation) {
        if (form.getValues('preFermentFlourPercentage') === undefined) {
            form.setValue('preFermentFlourPercentage', recipeDef.preFermentation.flourPercentage, { shouldValidate: true });
        }
    } else {
        form.setValue('preFermentFlourPercentage', undefined);
        form.clearErrors('preFermentFlourPercentage');
    }

    if (requiresHydrationInput && recipeDef) {
        if (form.getValues('doughHydrationPercentage') === undefined) {
            form.setValue('doughHydrationPercentage', recipeDef.bakersPercentages.water, { shouldValidate: true });
        }
    } else {
        form.setValue('doughHydrationPercentage', undefined);
        form.clearErrors('doughHydrationPercentage');
    }

  }, [watchedDoughType, form, isFocaccia, requiresPreFerment, requiresHydrationInput]);


  const onSubmit: SubmitHandler<DoughFormValues> = (data) => {
    setIsLoading(true);
    setDoughRecipe(null);
    console.log('Form submitted:', data);

    try {
      const recipeKey = recipeKeys[data.doughType];
      const result = getCalculatedRecipe(
        recipeKey,
        data.numberOfBalls,
        data.ballSizeGrams,
        data.preFermentFlourPercentage,
        data.doughHydrationPercentage
      );

      if (result) {
        setDoughRecipe(result);
      } else {
        throw new Error('Invalid dough type selected.');
      }

    } catch (error) {
      console.error('Failed to calculate dough recipe:', error);
      let description = 'Could not calculate the dough recipe. Please check inputs or try again.';
      if (error instanceof Error) {
        description = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Error Calculating Recipe',
        description: description,
      });
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  return (
    <>
      <header className="mb-8 text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="w-6 h-9 bg-[hsl(var(--primary))]"></div>
          <div className="w-6 h-9 bg-white"></div>
          <div className="w-6 h-9 bg-[hsl(var(--accent))]"></div>
        </div>
        <h1 className="text-4xl font-bold text-primary">Pizza Guide</h1>
        <p className="text-lg text-muted-foreground">Your guide to perfect pizza & focaccia dough, rooted in Italian tradition!</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="shadow-lg border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                <Calculator className="h-6 w-6 text-accent" /> Dough Calculator
              </CardTitle>
              <CardDescription>Enter your dough preferences below.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="numberOfBalls"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isFocaccia ? 'Number of Pans/Portions' : 'Number of Dough Balls'}</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder={isFocaccia ? "e.g., 1" : "e.g., 3"} {...field} />
                        </FormControl>
                        <FormDescription>{isFocaccia ? 'How many focaccias you want to make.' : 'How many pizzas you want to make.'}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ballSizeGrams"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isFocaccia ? 'Weight per Portion (grams)' : 'Size per Dough Ball (grams)'}</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder={isFocaccia ? "e.g., 800" : "e.g., 250"} {...field} />
                        </FormControl>
                        <FormDescription>{isFocaccia ? 'Weight for your pan size (e.g., 800g for 9x13").' : 'Typical pizza size is 200-300g.'}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="doughType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dough Type</FormLabel>
                        <Select onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue('preFermentFlourPercentage', undefined, {shouldValidate: true});
                            form.setValue('doughHydrationPercentage', undefined, {shouldValidate: true});
                          }}
                          defaultValue={field.value}
                         >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a dough style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(doughTypeNames).map(([value, name]) => (
                              <SelectItem key={value} value={value}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose the style of dough.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                   {requiresPreFerment && (
                     <FormField
                       control={form.control}
                       name="preFermentFlourPercentage"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Pre-ferment Flour (%)</FormLabel>
                            <div className="relative">
                             <FormControl>
                               <Input type="number" placeholder={watchedDoughType === 'biga' ? 'e.g., 40' : 'e.g., 30'} {...field} value={field.value ?? ''} />
                             </FormControl>
                             <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            </div>
                           <FormDescription>
                             Percentage of total flour used in the {doughTypeNames[watchedDoughType!]?.split(' ')[0]}.
                           </FormDescription>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                   )}

                  {requiresHydrationInput && (
                     <FormField
                       control={form.control}
                       name="doughHydrationPercentage"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Dough Hydration (%)</FormLabel>
                            <div className="relative">
                             <FormControl>
                               <Input type="number" placeholder={
                                 watchedDoughType === 'neapolitan' ? 'e.g., 62' :
                                 watchedDoughType === 'biga' ? 'e.g., 68' :
                                 watchedDoughType === 'poolish' ? 'e.g., 70' :
                                 watchedDoughType === 'focaccia' ? 'e.g., 75' : 'e.g., 65'
                               } {...field} value={field.value ?? ''} />
                             </FormControl>
                             <Droplets className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            </div>
                           <FormDescription>
                             Target water percentage for the final dough.
                           </FormDescription>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                   )}


                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Calculator className="mr-2 h-4 w-4 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                       <>
                         <Calculator className="mr-2 h-4 w-4" />
                         Calculate Recipe
                       </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {isLoading && (
            <Card className="shadow-lg border-secondary/50">
              <CardHeader>
                <Skeleton className="h-8 w-3/4 bg-muted/50" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Skeleton className="h-6 w-1/4 mb-4 bg-muted/50" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-muted/40" />
                    <Skeleton className="h-4 w-5/6 bg-muted/40" />
                    <Skeleton className="h-4 w-full bg-muted/40" />
                  </div>
                </div>
                <Separator />
                 <div>
                  <Skeleton className="h-6 w-1/4 mb-4 bg-muted/50" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full bg-muted/40" />
                    <Skeleton className="h-4 w-full bg-muted/40" />
                    <Skeleton className="h-4 w-5/6 bg-muted/40" />
                    <Skeleton className="h-4 w-full bg-muted/40" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && doughRecipe && (
            <Card className="shadow-lg border-primary/30">
              <CardHeader>
                 <CardTitle className="text-2xl text-primary flex items-center gap-2">
                    {isFocaccia ? <MinusSquare className="h-6 w-6" /> : <Pizza className="h-6 w-6" />}
                    Your {doughRecipe.doughType} Recipe
                 </CardTitle>
                 <CardDescription>
                    Total Portions: {form.getValues('numberOfBalls')} @ {form.getValues('ballSizeGrams')}g each.
                    {doughRecipe.hydrationUsed !== undefined && ` Target Hydration: ${doughRecipe.hydrationUsed}%.`}
                 </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {doughRecipe.preFermentIngredients && doughRecipe.preFermentIngredients.length > 0 && watchedDoughType && recipeKeys[watchedDoughType] && recipeDefinitions[recipeKeys[watchedDoughType]]?.preFermentation && (
                   <>
                     <div>
                       <h2 className="text-xl font-semibold mb-3 flex items-center text-primary">
                         <Wheat className="mr-2 h-5 w-5 text-accent" /> {recipeDefinitions[recipeKeys[watchedDoughType]].preFermentation?.type} Ingredients ({doughRecipe.preFermentPercentageUsed}%)
                       </h2>
                       <ul className="list-disc list-inside space-y-1 text-foreground/90 bg-secondary/50 p-4 rounded-md border border-secondary">
                         {doughRecipe.preFermentIngredients.map((item, index) => (
                           <li key={`pf-ing-${index}`}>
                             <strong>{item.name}:</strong> {item.quantity}
                           </li>
                         ))}
                       </ul>
                     </div>
                     <Separator className="bg-primary/20" />
                   </>
                 )}

                <div>
                  <h2 className="text-xl font-semibold mb-3 flex items-center text-primary">
                    <ListChecks className="mr-2 h-5 w-5 text-accent" />
                    {doughRecipe.preFermentIngredients ? 'Final Dough Ingredients' : 'Ingredients'}
                  </h2>
                  <ul className="list-disc list-inside space-y-1 text-foreground/90 bg-secondary/50 p-4 rounded-md border border-secondary">
                    {doughRecipe.ingredients.map((item, index) => (
                      <li key={`final-ing-${index}`}>
                        <strong>{item.name}:</strong> {item.quantity}
                      </li>
                    ))}
                  </ul>
                  {isFocaccia && <p className="text-sm text-muted-foreground mt-2">Note: Extra olive oil for pan and topping not included in list.</p>}
                </div>

                <Separator className="bg-primary/20" />

                {doughRecipe.preFermentationSteps && doughRecipe.preFermentationSteps.length > 0 && watchedDoughType && recipeKeys[watchedDoughType] && recipeDefinitions[recipeKeys[watchedDoughType]]?.preFermentation && (
                  <>
                    <div>
                       <h2 className="text-xl font-semibold mb-3 flex items-center text-primary">
                         <ChefHat className="mr-2 h-5 w-5 text-accent" /> {recipeDefinitions[recipeKeys[watchedDoughType]].preFermentation?.type} Steps
                       </h2>
                       <ol className="list-decimal list-inside space-y-2 text-foreground/90 pl-4">
                         {doughRecipe.preFermentationSteps.map((step, index) => (
                           <li key={`pf-step-${index}`}>{step}</li>
                         ))}
                       </ol>
                    </div>
                    <Separator className="bg-primary/20" />
                  </>
                )}

                 <div>
                   <h2 className="text-xl font-semibold mb-3 flex items-center text-primary">
                     <ChefHat className="mr-2 h-5 w-5 text-accent" />
                     {doughRecipe.preFermentationSteps ? 'Final Dough Making & Processing' : 'Dough Making & Processing'}
                   </h2>
                   <ol className="list-decimal list-inside space-y-2 text-foreground/90 pl-4">
                     {doughRecipe.fermentationSteps.map((step, index) => (
                       <li key={`f-step-${index}`}>{step}</li>
                     ))}
                   </ol>
                 </div>

              </CardContent>
            </Card>
          )}

          {!isLoading && !doughRecipe && (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-10 border border-dashed border-primary/50 rounded-lg bg-muted/20">
                 <Pizza size={48} className="mb-4 text-primary/70" />
                <p className="text-lg">Enter your preferences above and click "Calculate Recipe" to get your custom dough guide!</p>
                <p className="text-sm mt-2"> Buon appetito!</p>
              </div>
          )}
        </div>
      </div>

      {/* Flour Guide Section */}
      <div className="mt-12">
        <Card className="shadow-lg border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-primary">
              <Wheat className="h-6 w-6 text-accent" />
              Understanding Your Flour
            </CardTitle>
            <CardDescription>A guide to choosing the right flour and dusting techniques.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">"00" Flour (Grano Tenero Tipo "00")</h3>
              <p>
                Often considered the gold standard for Neapolitan pizza, "00" flour is very finely milled.
                It typically has a moderate protein content (around 10-12.5%). The fine milling allows for a very smooth,
                extensible dough that can be stretched thin without tearing. It's excellent for high-temperature ovens
                (like wood-fired ovens) and creates a soft, tender crust with a slight chew and beautiful blistering (leopard spotting).
                While great for Neapolitan, it can also be used for other styles if a softer crust is desired.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">Bread Flour</h3>
              <p>
                Bread flour has a higher protein content (typically 12-14%) compared to "00" or all-purpose flour.
                This higher protein content means more gluten development, resulting in a stronger, chewier crust with more structure.
                It's ideal for styles like New York pizza, which benefit from a sturdy yet foldable slice. Bread flour can absorb more water,
                allowing for higher hydration doughs if desired. It provides good rise and a satisfying chew.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">All-Purpose Flour (AP Flour)</h3>
              <p>
                All-purpose flour has a moderate protein content (around 10-12%), falling between "00" and bread flour.
                It's a versatile option and can be used for many pizza styles, especially home oven pizzas. The crust will generally be
                softer than one made with bread flour but might not have the same extensibility as "00" flour. It's a good choice for
                Brazilian style pizzas or when you want a reliable, accessible flour. Results can vary slightly by brand.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">Semolina Flour (Semola Rimacinata) for Dusting</h3>
              <p>
                Semolina flour, particularly finely ground semolina ("Semola Rimacinata"), is excellent for dusting your work surface and pizza peel.
                It has a coarser texture than regular flour, which helps prevent the dough from sticking and acts like tiny ball bearings.
                A key advantage is that semolina tends to burn less easily at high temperatures compared to regular flour, reducing bitterness and smoke in the oven.
                Using a 50/50 mix of regular flour and semolina for dusting is also a popular choice.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">Key Takeaways:</h3>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li><strong>Higher Protein = More Gluten = Chewier Crust:</strong> Good for structure (e.g., New York style).</li>
                <li><strong>Finer Mill ("00") = Smoother, More Extensible Dough:</strong> Ideal for Neapolitan style and high-heat baking.</li>
                <li><strong>Semolina for Dusting:</strong> Helps prevent sticking and reduces burning in the oven.</li>
                <li><strong>Airiness:</strong> Achieved through proper fermentation, hydration, and handling, not just flour type, though flour plays a role in gluten structure which traps gases.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sauce Guide Section */}
      <div className="mt-8">
        <Card className="shadow-lg border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-primary">
              <Utensils className="h-6 w-6 text-accent" /> {/* Changed icon */}
              Crafting the Perfect Sauce
            </CardTitle>
            <CardDescription>Simple tips for a delicious pizza sauce.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">Quality Tomatoes are Key</h3>
              <p>
                The foundation of any great pizza sauce is high-quality tomatoes. Look for whole peeled San Marzano tomatoes (D.O.P. certified if possible)
                or other good quality canned tomatoes. Crushing them by hand or with a quick pulse in a food processor gives a better texture
                than pre-crushed tomatoes, which can sometimes be watery or have a metallic taste. Avoid tomato paste unless you're aiming for a very specific, concentrated flavor.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">Keep it Simple: Seasoning</h3>
              <p>
                Less is often more with pizza sauce. The goal is to complement the dough and toppings, not overpower them.
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
                <li><strong>Salt:</strong> Essential for flavor. Add a pinch at a time and taste.</li>
                <li><strong>Oregano:</strong> Dried oregano is classic. Add a pinch or two. Fresh oregano can be added after baking.</li>
                <li><strong>Basil:</strong> Fresh basil leaves, added before or after baking, lend a wonderful aroma.</li>
                <li><strong>Olive Oil (Optional):</strong> A small drizzle of good quality extra virgin olive oil can add richness.</li>
                <li><strong>Garlic (Optional):</strong> A small amount of finely minced fresh garlic or a tiny pinch of garlic powder can be used, but be cautious not to overdo it.</li>
                <li><strong>Sugar (Use Sparingly, if at all):</strong> Some tomatoes can be acidic. A tiny pinch of sugar can balance this, but often high-quality tomatoes don't need it. Taste first!</li>
              </ul>
            </div>
             <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">To Cook or Not To Cook?</h3>
              <p>
                For many classic pizza styles like Neapolitan, the sauce is uncooked. Simply crushed tomatoes seasoned and spread directly onto the dough.
                This allows the fresh tomato flavor to shine through after baking. If you prefer a thicker, more concentrated sauce, you can simmer it briefly (15-20 minutes)
                to reduce it slightly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Home Oven Guide Section */}
      <div className="mt-8 mb-8">
        <Card className="shadow-lg border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-primary">
              <CookingPot className="h-6 w-6 text-accent" />
              Home Oven Pizza Perfection
            </CardTitle>
            <CardDescription>Tips for baking amazing pizza without a dedicated pizza oven.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">Use a Pizza Stone or Baking Steel</h3>
              <p>
                A pizza stone or (even better) a baking steel is crucial. These surfaces retain a lot of heat and transfer it directly to the bottom of your pizza,
                resulting in a crispier crust. Steel conducts heat more effectively than stone, leading to faster bake times and often better "oven spring" (the initial puffiness of the crust).
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">Preheat, Preheat, Preheat!</h3>
              <p>
                Place your stone or steel on an oven rack (position discussed below) and preheat your oven to its absolute highest temperature (usually 250-290°C / 475-550°F)
                for at least 45-60 minutes. This ensures the stone/steel is thoroughly heated and ready to cook your pizza quickly.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">Rack Position Matters</h3>
              <p>
                For most home ovens, placing the rack in the upper third (but not the very top slot) or middle of the oven works well.
                If your oven has a very strong bottom element and a weaker top, a higher position can help cook the top more evenly.
                Experiment to see what works best for your specific oven.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">Leverage Your Broiler (Grill Element) <Flame className="inline h-5 w-5 text-destructive" /></h3>
              <p>
                Home ovens lack the intense top heat of a true pizza oven. To compensate, you can use your broiler (top heating element or grill).
                After the pizza has baked for a few minutes and the crust is set, you can switch the oven to broil for the last 1-3 minutes.
                <strong>CAUTION:</strong> Watch your pizza like a hawk during this stage! It can go from perfectly charred to burnt in seconds. Keep the oven door slightly ajar if needed to monitor.
                This technique helps to cook toppings, melt cheese beautifully, and achieve some leoparding or charring on the crust.
              </p>
            </div>
             <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">Quick Launch & Retrieval</h3>
              <p>
                Have your pizza assembled on a lightly floured (or semolina-dusted) peel. Launch it onto the hot stone/steel with a quick, confident motion.
                Bake times will vary (typically 5-10 minutes) depending on your oven and dough. Rotate the pizza halfway through if your oven has hot spots.
                Retrieve with the peel once golden and bubbly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    

    