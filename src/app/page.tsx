
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
import { Pizza, ListChecks, ChefHat, Calculator, Wheat, Percent, MinusSquare, Droplets } from 'lucide-react'; // Added Droplets for hydration
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
  const requiresHydrationInput = data.doughType === 'biga' || data.doughType === 'poolish' || data.doughType === 'neapolitan';
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
      doughHydrationPercentage: undefined, // Initialize as undefined
    },
  });

  const watchedDoughType = form.watch('doughType');
  const requiresPreFerment = watchedDoughType === 'biga' || watchedDoughType === 'poolish';
  const isFocaccia = watchedDoughType === 'focaccia';
  const requiresHydrationInput = watchedDoughType === 'neapolitan' || watchedDoughType === 'biga' || watchedDoughType === 'poolish';


  React.useEffect(() => {
    const currentDoughType = watchedDoughType;
    const recipeKey = currentDoughType ? recipeKeys[currentDoughType] : undefined;
    const recipeDef = recipeKey ? recipeDefinitions[recipeKey] : undefined;

    // Handle Focaccia specific sizing
    if (isFocaccia) {
        if (form.getValues('numberOfBalls') === 3 && form.getValues('ballSizeGrams') === 250) {
             form.setValue('numberOfBalls', 1);
             form.setValue('ballSizeGrams', 800);
        }
    } else { // Reset to pizza defaults if switching away from Focaccia
        if (form.getValues('numberOfBalls') === 1 && form.getValues('ballSizeGrams') === 800) {
            form.setValue('numberOfBalls', 3);
            form.setValue('ballSizeGrams', 250);
        }
    }

    // Handle preFermentFlourPercentage
    if (requiresPreFerment && recipeDef?.preFermentation) {
        // Set default only if it's currently undefined (e.g., on first load or type change)
        if (form.getValues('preFermentFlourPercentage') === undefined) {
            form.setValue('preFermentFlourPercentage', recipeDef.preFermentation.flourPercentage, { shouldValidate: true });
        }
    } else {
        form.setValue('preFermentFlourPercentage', undefined);
        form.clearErrors('preFermentFlourPercentage');
    }

    // Handle doughHydrationPercentage
    if (requiresHydrationInput && recipeDef) {
        // Set default only if it's currently undefined
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
        data.doughHydrationPercentage // Pass the hydration percentage
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
          <div className="flex shadow-md">
            <div className="w-6 h-9 bg-[hsl(var(--primary))]"></div>
            <div className="w-6 h-9 bg-white"></div>
            <div className="w-6 h-9 bg-[hsl(var(--accent))]"></div>
          </div>
          <h1 className="text-4xl font-bold text-primary">Dough Guide do Marshut</h1>
           <div className="flex shadow-md">
            <div className="w-6 h-9 bg-[hsl(var(--primary))]"></div>
            <div className="w-6 h-9 bg-white"></div>
            <div className="w-6 h-9 bg-[hsl(var(--accent))]"></div>
          </div>
        </div>
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
                            form.setValue('doughHydrationPercentage', undefined, {shouldValidate: true}); // Reset hydration too
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
                                 watchedDoughType === 'poolish' ? 'e.g., 70' : 'e.g., 65'
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
    </>
  );
}

