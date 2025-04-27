import type { Recipe } from '@/types/recipe';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`} passHref legacyBehavior>
      <a className="block group transition-transform duration-200 ease-in-out hover:scale-[1.02]">
        <Card className="h-full flex flex-col overflow-hidden bg-card shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="p-0 relative">
            <Image
              src={recipe.imageUrl}
              alt={recipe.name}
              width={600}
              height={400}
              className="w-full h-48 object-cover transition-opacity duration-300 group-hover:opacity-90"
              priority={recipe.id === '1' || recipe.id === '2'} // Prioritize loading images for the first few cards
            />
          </CardHeader>
          <CardContent className="p-4 flex flex-col flex-grow">
            <CardTitle className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">{recipe.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mb-4 flex-grow">
              {recipe.description.length > 100 ? `${recipe.description.substring(0, 97)}...` : recipe.description}
            </CardDescription>
            <div className="mt-auto flex justify-end items-center text-accent group-hover:underline">
              View Recipe
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
