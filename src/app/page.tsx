
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getCalculatedRecipe, type DoughRecipe, recipes as recipeDefinitions } from '@/data/recipes'; // Import definitions too
import { Pizza, ListChecks, ChefHat, Calculator, Wheat, Percent } from 'lucide-react'; // Added Wheat, Percent Icons
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

// Define Zod schema for form validation
const doughFormSchema = z.object({
  numberOfBalls: z.coerce.number().int().min(1, 'Must be at least 1 dough ball').max(20, 'Cannot exceed 20 dough balls'),
  ballSizeGrams: z.coerce.number().int().min(150, 'Minimum size is 150g').max(1000, 'Maximum size is 1000g'),
  doughType: z.enum(['biga', 'poolish', 'neapolitan', 'new_york', 'brazilian'], {
    required_error: 'Please select a dough type.',
  }),
  preFermentFlourPercentage: z.coerce.number().int().min(10, 'Must be at least 10%').max(80, 'Cannot exceed 80%').optional(),
}).refine(data => {
  // Require preFermentFlourPercentage only if dough type uses it
  const requiresPreFerment = data.doughType === 'biga' || data.doughType === 'poolish';
  return !requiresPreFerment || (requiresPreFerment && typeof data.preFermentFlourPercentage === 'number');
}, {
  message: "Pre-ferment percentage is required for this dough type.",
  path: ["preFermentFlourPercentage"], // Apply error to this field
});


type DoughFormValues = z.infer<typeof doughFormSchema>;

// Define dough type keys used in the recipes data
const recipeKeys: Record<DoughFormValues['doughType'], keyof typeof recipeDefinitions> = {
  biga: 'biga',
  poolish: 'poolish',
  neapolitan: 'neapolitan',
  new_york: 'new_york',
  brazilian: 'brazilian',
};

// Define dough type display names (can be fetched from recipes.ts if needed)
const doughTypeNames: Record<DoughFormValues['doughType'], string> = {
  biga: 'Biga (Pre-ferment)',
  poolish: 'Poolish (Pre-ferment)',
  neapolitan: 'Classic Neapolitan',
  new_york: 'New York Style',
  brazilian: 'Brazilian Style',
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
      preFermentFlourPercentage: undefined, // Initialize as undefined
    },
  });

  // Watch the doughType field to conditionally show the percentage input
  const watchedDoughType = form.watch('doughType');
  const requiresPreFerment = watchedDoughType === 'biga' || watchedDoughType === 'poolish';

  // Effect to set default percentage when dough type changes
  React.useEffect(() => {
    if (watchedDoughType === 'biga') {
      // Set default for Biga if percentage is not already set or type changed
      if (form.getValues('preFermentFlourPercentage') === undefined) {
         form.setValue('preFermentFlourPercentage', recipeDefinitions.biga.preFermentation?.flourPercentage || 40, { shouldValidate: true });
      }
    } else if (watchedDoughType === 'poolish') {
       // Set default for Poolish if percentage is not already set or type changed
       if (form.getValues('preFermentFlourPercentage') === undefined) {
         form.setValue('preFermentFlourPercentage', recipeDefinitions.poolish.preFermentation?.flourPercentage || 30, { shouldValidate: true });
       }
    } else {
      // Clear the percentage if the type doesn't need it
      form.setValue('preFermentFlourPercentage', undefined);
      // Manually clear errors if field is hidden
      form.clearErrors('preFermentFlourPercentage');
    }
  }, [watchedDoughType, form]);


  const onSubmit: SubmitHandler<DoughFormValues> = (data) => {
    setIsLoading(true);
    setDoughRecipe(null);
    console.log('Form submitted:', data);

    try {
      const recipeKey = recipeKeys[data.doughType];
      // Pass the user-defined percentage if available
      const result = getCalculatedRecipe(
        recipeKey,
        data.numberOfBalls,
        data.ballSizeGrams,
        data.preFermentFlourPercentage // Pass the percentage
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
        description = error.message; // Show more specific error if available
      }
      toast({
        variant: 'destructive',
        title: 'Error Calculating Recipe',
        description: description,
      });
    } finally {
      setTimeout(() => setIsLoading(false), 300); // Simulate network delay
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <Pizza className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-primary">Pizza Dough Pal</h1>
        </div>
        <p className="text-lg text-muted-foreground">Your guide to perfect homemade pizza dough!</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="md:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Dough Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="numberOfBalls"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Dough Balls</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 3" {...field} />
                        </FormControl>
                        <FormDescription>How many pizzas you want to make.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ballSizeGrams"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size per Dough Ball (grams)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 250" {...field} />
                        </FormControl>
                        <FormDescription>Typical size is 200-300g.</FormDescription>
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
                            // Reset percentage when type changes to allow default setting
                            form.setValue('preFermentFlourPercentage', undefined, {shouldValidate: true});
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
                        <FormDescription>Choose the style of pizza dough.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                   {/* Conditional Pre-ferment Percentage Input */}
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
                             Percentage of total flour used in the {doughTypeNames[watchedDoughType!].split(' ')[0]}.
                           </FormDescription>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                   )}


                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Calculator className="mr-2 h-4 w-4 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      'Calculate Dough Recipe'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="md:col-span-2">
          {isLoading && (
            <Card className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Skeleton className="h-6 w-1/4 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <Separator />
                 <div>
                  <Skeleton className="h-6 w-1/4 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && doughRecipe && (
            <Card className="shadow-lg">
              <CardHeader>
                 <CardTitle className="text-2xl text-primary">Your {doughRecipe.doughType} Dough Recipe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pre-Ferment Ingredients (if applicable) */}
                {doughRecipe.preFermentIngredients && doughRecipe.preFermentIngredients.length > 0 && (
                   <>
                     <div>
                       <h2 className="text-xl font-semibold mb-3 flex items-center">
                         <Wheat className="mr-2 h-5 w-5 text-accent" /> {recipeDefinitions[recipeKeys[watchedDoughType!]]?.preFermentation?.type} Ingredients ({doughRecipe.preFermentPercentageUsed}%)
                       </h2>
                       <ul className="list-disc list-inside space-y-1 text-foreground/90 bg-muted/30 p-4 rounded-md border">
                         {doughRecipe.preFermentIngredients.map((item, index) => (
                           <li key={`pf-ing-${index}`}>
                             <strong>{item.name}:</strong> {item.quantity}
                           </li>
                         ))}
                       </ul>
                     </div>
                     <Separator />
                   </>
                 )}

                {/* Final Dough Ingredients */}
                <div>
                  <h2 className="text-xl font-semibold mb-3 flex items-center">
                    <ListChecks className="mr-2 h-5 w-5 text-accent" />
                    {doughRecipe.preFermentIngredients ? 'Final Dough Ingredients' : 'Ingredients'}
                  </h2>
                  <ul className="list-disc list-inside space-y-1 text-foreground/90 bg-muted/30 p-4 rounded-md border">
                    {doughRecipe.ingredients.map((item, index) => (
                      <li key={`final-ing-${index}`}>
                        <strong>{item.name}:</strong> {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Pre-Fermentation Steps */}
                {doughRecipe.preFermentationSteps && doughRecipe.preFermentationSteps.length > 0 && (
                  <>
                    <div>
                       <h2 className="text-xl font-semibold mb-3 flex items-center">
                         <ChefHat className="mr-2 h-5 w-5 text-accent" /> {recipeDefinitions[recipeKeys[watchedDoughType!]]?.preFermentation?.type} Steps
                       </h2>
                       <ol className="list-decimal list-inside space-y-2 text-foreground/90 pl-4">
                         {doughRecipe.preFermentationSteps.map((step, index) => (
                           <li key={`pf-step-${index}`}>{step}</li>
                         ))}
                       </ol>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Fermentation & Dough Making Steps */}
                 <div>
                   <h2 className="text-xl font-semibold mb-3 flex items-center">
                     <ChefHat className="mr-2 h-5 w-5 text-accent" />
                     {doughRecipe.preFermentationSteps ? 'Final Dough Making & Fermentation' : 'Fermentation & Dough Making'}
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
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-10 border border-dashed rounded-lg">
                <Pizza size={48} className="mb-4" />
                <p className="text-lg">Enter your preferences above and click "Calculate" to get your custom pizza dough recipe!</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
