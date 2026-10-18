import React from 'react';
import { Search, SlidersHorizontal, Leaf, Utensils } from 'lucide-react';
import { Category } from '../types/index.ts';

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  dietaryFilter: 'all' | 'veg' | 'non-veg';
  onDietaryFilterChange: (f: 'all' | 'veg' | 'non-veg') => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'prep-time';
  onSortChange: (s: 'featured' | 'price-asc' | 'price-desc' | 'prep-time') => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  dietaryFilter,
  onDietaryFilterChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Category Pills / Segmented Scroll Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
            selectedCategoryId === 'all'
              ? 'bg-orange-700 text-white shadow-sm'
              : 'bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
          }`}
        >
          All Offerings
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
              selectedCategoryId === cat.id
                ? 'bg-orange-700 text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search & Secondary Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search momos, burgers, noodles, cold drinks..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-stone-900 placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 px-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dietary and Sort Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Dietary Segmented Buttons */}
          <div className="flex items-center p-1 bg-stone-200/70 rounded-lg text-xs font-medium">
            <button
              onClick={() => onDietaryFilterChange('all')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                dietaryFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onDietaryFilterChange('veg')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                dietaryFilter === 'veg'
                  ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Leaf className="w-3 h-3 text-emerald-300" />
              <span>Veg Only</span>
            </button>
            <button
              onClick={() => onDietaryFilterChange('non-veg')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                dietaryFilter === 'non-veg'
                  ? 'bg-stone-900 text-white shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Non-Veg
            </button>
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="text-xs bg-white border border-stone-300 rounded-lg py-2 px-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-600 font-medium"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="prep-time">Fastest Prep Time</option>
          </select>
        </div>
      </div>
    </div>
  );
};
