import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Smartphone, Laptop, Headphones, Watch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const featuredProducts = products.filter(p => p.isFeatured);
  const newArrivals = products.filter(p => p.newArrival);
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero');

  const categories = [
    { name: "Smartphones", icon: Smartphone, imageId: "category-smartphones" },
    { name: "Laptops", icon: Laptop, imageId: "category-laptops" },
    { name: "Audio", icon: Headphones, imageId: "category-audio" },
    { name: "Wearables", icon: Watch, imageId: "category-wearables" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container mx-auto flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline animate-fade-in-down">
            The Future of Tech is Here
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/80 animate-fade-in-up">
            Discover cutting-edge electronics that redefine your world.
          </p>
          <Link href="/shop" className="mt-8">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 animate-fade-in-up">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center font-headline mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center font-headline mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(category => {
              const categoryImage = PlaceHolderImages.find(img => img.id === category.imageId);
              return (
                <Link key={category.name} href={`/shop?category=${category.name}`}>
                  <Card className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    {categoryImage && (
                      <Image 
                        src={categoryImage.imageUrl}
                        alt={category.name}
                        width={500}
                        height={300}
                        className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={categoryImage.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40"/>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <category.icon className="w-12 h-12 text-white mb-2"/>
                      <h3 className="text-xl font-bold text-white font-headline">{category.name}</h3>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* New Arrivals Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center font-headline mb-8">New Arrivals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
