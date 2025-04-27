
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
import { generateDoughRecipe, type GenerateDoughInput, type GenerateDoughOutput } from '@/ai/flows/generate-dough-flow';
import { Pizza, Loader2, ListChecks, ChefHat } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

// Define Zod schema for form validation
const doughFormSchema = z.object({
  numberOfBalls: z.coerce.number().int().min(1, 'Must be at least 1 dough ball').max(20, 'Cannot exceed 20 dough balls'),
  ballSizeGrams: z.coerce.number().int().min(150, 'Minimum size is 150g').max(1000, 'Maximum size is 1000g'),
  doughType: z.enum(['biga', 'poolish', 'neapolitan', 'new_york', 'brazilian'], {
    required_error: 'Please select a dough type.',
  }),
});

type DoughFormValues = z.infer<typeof doughFormSchema>;

// Define dough type display names
const doughTypeNames: Record<DoughFormValues['doughType'], string> = {
  biga: 'Biga',
  poolish: 'Poolish',
  neapolitan: 'Classic Neapolitan',
  new_york: 'New York Style',
  brazilian: 'Brazilian Style',
};

export default function Home() {
  const [doughRecipe, setDoughRecipe] = React.useState<GenerateDoughOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<DoughFormValues>({
    resolver: zodResolver(doughFormSchema),
    defaultValues: {
      numberOfBalls: 3,
      ballSizeGrams: 250,
      doughType: undefined, // Start with no default selection
    },
  });

  const onSubmit: SubmitHandler<DoughFormValues> = async (data) => {
    setIsLoading(true);
    setDoughRecipe(null); // Clear previous results
    console.log('Form submitted:', data);

    const input: GenerateDoughInput = {
      numberOfBalls: data.numberOfBalls,
      ballSizeGrams: data.ballSizeGrams,
      doughType: doughTypeNames[data.doughType], // Send display name to flow
    };

    try {
      const result = await generateDoughRecipe(input);
      setDoughRecipe(result);
    } catch (error) {
      console.error('Failed to generate dough recipe:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Recipe',
        description: 'Could not generate the dough recipe. Please try again.',
      });
    } finally {
      setIsLoading(false);
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Dough Recipe'
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
                 <CardTitle className="text-2xl text-primary">Your {doughTypeNames[form.getValues('doughType')]} Dough Recipe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Ingredients */}
                <div>
                  <h2 className="text-xl font-semibold mb-3 flex items-center">
                    <ListChecks className="mr-2 h-5 w-5 text-accent" /> Ingredients
                  </h2>
                  <ul className="list-disc list-inside space-y-1 text-foreground/90 bg-muted/30 p-4 rounded-md border">
                    {doughRecipe.ingredients.map((item, index) => (
                      <li key={index}>
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
                         <ChefHat className="mr-2 h-5 w-5 text-accent" /> Pre-Fermentation
                       </h2>
                       <ol className="list-decimal list-inside space-y-2 text-foreground/90 pl-4">
                         {doughRecipe.preFermentationSteps.map((step, index) => (
                           <li key={index}>{step}</li>
                         ))}
                       </ol>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Fermentation Steps */}
                 <div>
                   <h2 className="text-xl font-semibold mb-3 flex items-center">
                     <ChefHat className="mr-2 h-5 w-5 text-accent" /> Fermentation & Dough Making
                   </h2>
                   <ol className="list-decimal list-inside space-y-2 text-foreground/90 pl-4">
                     {doughRecipe.fermentationSteps.map((step, index) => (
                       <li key={index}>{step}</li>
                     ))}
                   </ol>
                 </div>

              </CardContent>
            </Card>
          )}

          {!isLoading && !doughRecipe && (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-10 border border-dashed rounded-lg">
                <Pizza size={48} className="mb-4" />
                <p className="text-lg">Enter your preferences above and click "Generate" to get your custom pizza dough recipe!</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
