import { getRecipeById, getRecipes } from '@/lib/recipes';
import type { Recipe } from '@/types/recipe';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, ListChecks } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

interface RecipePageProps {
  params: { id: string };
}

// Generate static paths for recipes
export async function generateStaticParams() {
  const recipes = await getRecipes();
  return recipes.map((recipe) => ({
    id: recipe.id,
  }));
}

// Generate metadata for each recipe page
export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const recipe = await getRecipeById(params.id);

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
      description: 'Could not find the requested pizza recipe.',
    }
  }

  return {
    title: `${recipe.name} | Pizza Pal`,
    description: recipe.description,
  }
}


export default async function RecipePage({ params }: RecipePageProps) {
  const recipe = await getRecipeById(params.id);

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
         <h1 className="text-3xl font-bold mb-4">Recipe Not Found</h1>
         <p className="text-muted-foreground mb-6">Sorry, we couldn't find the pizza you're looking for.</p>
         <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recipes
            </Link>
         </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <Button asChild variant="outline" className="mb-6">
         <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recipes
         </Link>
       </Button>

      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="p-0">
           <Image
              src={recipe.imageUrl}
              alt={recipe.name}
              width={1200}
              height={600}
              className="w-full h-64 md:h-96 object-cover"
              priority
            />
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <CardTitle className="text-3xl md:text-4xl font-bold mb-2 text-primary">{recipe.name}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mb-6">{recipe.description}</CardDescription>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                 <ListChecks className="mr-2 h-6 w-6 text-accent" /> Ingredients
              </h2>
              <ul className="list-disc list-inside space-y-2 text-foreground/90">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
               <h2 className="text-2xl font-semibold mb-4 flex items-center">
                 <ChefHat className="mr-2 h-6 w-6 text-accent" /> Instructions
               </h2>
               <ol className="list-decimal list-inside space-y-3 text-foreground/90">
                  {recipe.instructions.map((step, index) => (
                     <li key={index}>{step}</li>
                  ))}
               </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
