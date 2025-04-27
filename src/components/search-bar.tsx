'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search recipes..." }: SearchBarProps) {
  const [query, setQuery] = React.useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        className="flex-grow"
        aria-label="Search recipes"
      />
      <Button type="submit" variant="default" size="icon" aria-label="Search">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
