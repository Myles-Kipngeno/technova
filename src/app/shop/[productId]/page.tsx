"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { ProductCard } from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

type ProductPageProps = {
  params: {
    productId: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const { productId } = params;
  const product = products.find(p => p.id === productId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    notFound();
  }

  const relatedProducts = products.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const productImages = product.imageIds.map(id => PlaceHolderImages.find(img => img.id === id)).filter(Boolean);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {productImages.map((image, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-0">
                      {image && (
                         <Image
                          src={image.imageUrl}
                          alt={`${product.name} image ${index + 1}`}
                          width={600}
                          height={600}
                          className="object-cover rounded-lg"
                          data-ai-hint={image.imageHint}
                        />
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex"/>
          </Carousel>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold text-primary uppercase">{product.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold font-headline mt-2">{product.name}</h1>
          
          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">({product.rating}.0)</span>
          </div>

          <p className="mt-4 text-muted-foreground text-lg">{product.description}</p>
          <Separator className="my-6" />
          
          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold font-headline text-primary">Ksh.{product.price.toFixed(2)}</span>
            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" onClick={handleAddToCart} disabled={product.stock === 0} className="flex-grow">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-24">
        <h2 className="text-3xl font-bold text-center font-headline mb-8">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map(relatedProduct => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </div>
    </div>
  );
}
