'use client';

import * as React from 'react';
import { getRecipes } from '@/lib/recipes';
import type { Recipe } from '@/types/recipe';
import { RecipeCard } from '@/components/recipe-card';
import { SearchBar } from '@/components/search-bar';
import { Skeleton } from "@/components/ui/skeleton";
import { Pizza } from 'lucide-react';

export default function Home() {
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = React.useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadRecipes() {
      setIsLoading(true);
      try {
        const fetchedRecipes = await getRecipes();
        setRecipes(fetchedRecipes);
        setFilteredRecipes(fetchedRecipes);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
        // Handle error state here, e.g., show a message to the user
      } finally {
        setIsLoading(false);
      }
    }
    loadRecipes();
  }, []);

  React.useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(lowerCaseSearchTerm))
    );
    setFilteredRecipes(results);
  }, [searchTerm, recipes]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
         <div className="flex justify-center items-center gap-2 mb-2">
             <Pizza className="h-10 w-10 text-primary" />
             <h1 className="text-4xl font-bold text-primary">Pizza Pal</h1>
         </div>
        <p className="text-lg text-muted-foreground">Your ultimate guide to homemade pizza!</p>
      </header>

      <div className="mb-8 flex justify-center">
        <SearchBar onSearch={handleSearch} placeholder="Search by name or ingredient..." />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
             <div key={index} className="flex flex-col space-y-3">
               <Skeleton className="h-[200px] w-full rounded-xl" />
               <div className="space-y-2">
                 <Skeleton className="h-6 w-[250px]" />
                 <Skeleton className="h-4 w-[200px]" />
                 <Skeleton className="h-4 w-[150px] ml-auto" />
               </div>
             </div>
          ))}
        </div>
      ) : (
        filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-10">
            <p>No pizzas found matching "{searchTerm}". Try another search!</p>
          </div>
        )
      )}
    </div>
  );
}
