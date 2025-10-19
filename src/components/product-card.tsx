"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const placeholderImage = PlaceHolderImages.find(img => img.id === product.imageIds[0]);

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/shop/${product.id}`} className="block">
          <div className="aspect-square relative">
            {placeholderImage && (
              <Image
                src={placeholderImage.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={placeholderImage.imageHint}
              />
            )}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {product.newArrival && (
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">NEW</span>
              )}
            </div>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <span className="text-xs font-semibold text-primary uppercase">{product.category}</span>
        <CardTitle className="mt-1 text-lg font-headline">
          <Link href={`/shop/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <p className="text-xl font-bold font-headline text-foreground">Ksh.{product.price.toFixed(2)}</p>
        <Button size="icon" variant="outline" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}>
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
