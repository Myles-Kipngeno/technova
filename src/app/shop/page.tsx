"use client";

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const allCategories = [...new Set(products.map(p => p.category))];
const allBrands = [...new Set(products.map(p => p.brand))];
const maxPrice = Math.max(...products.map(p => p.price));

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange([0, maxPrice]);
    setSelectedCategories([]);
    setSelectedBrands([]);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      return matchesSearch && matchesPrice && matchesCategory && matchesBrand;
    });
  }, [searchTerm, priceRange, selectedCategories, selectedBrands]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline">Our Collection</h1>
        <p className="mt-2 text-lg text-muted-foreground">Find the perfect tech for your lifestyle.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 bg-secondary p-6 rounded-lg self-start sticky top-24">
          <h2 className="text-2xl font-bold font-headline mb-6">Filters</h2>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="search" className="text-lg font-semibold font-headline">Search</Label>
              <Input
                id="search"
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="mt-2 bg-background"
              />
            </div>

            <div>
              <Label className="text-lg font-semibold font-headline">Price Range</Label>
              <Slider
                min={0}
                max={maxPrice}
                step={10}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value)}
                className="mt-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold font-headline mb-2">Category</h3>
              <div className="space-y-2">
                {allCategories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label htmlFor={`cat-${category}`} className="cursor-pointer">{category}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold font-headline mb-2">Brand</h3>
              <div className="space-y-2">
                {allBrands.map(brand => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => handleBrandChange(brand)}
                    />
                    <Label htmlFor={`brand-${brand}`} className="cursor-pointer">{brand}</Label>
                  </div>
                ))}
              </div>
            </div>
             <Button onClick={clearFilters} variant="outline" className="w-full">
              <X className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          </div>
        </aside>

        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full bg-secondary rounded-lg p-12">
                <h3 className="text-2xl font-bold font-headline">No Products Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or clearing them to see all products.</p>
                 <Button onClick={clearFilters} className="mt-4">
                  <X className="mr-2 h-4 w-4" /> Clear Filters
                </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
