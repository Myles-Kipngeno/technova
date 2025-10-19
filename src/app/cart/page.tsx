"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-4 text-3xl font-bold font-headline">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/shop" className="mt-6 inline-block">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-4xl font-bold font-headline mb-8">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => {
            const productImage = PlaceHolderImages.find(img => img.id === item.product.imageIds[0]);
            return (
              <Card key={item.product.id} className="flex items-center p-4">
                <div className="relative h-24 w-24 flex-shrink-0">
                  {productImage && (
                    <Image
                      src={productImage.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                      data-ai-hint={productImage.imageHint}
                    />
                  )}
                </div>
                <div className="ml-4 flex-grow">
                  <Link href={`/shop/${item.product.id}`}>
                    <h2 className="font-semibold font-headline hover:text-primary">{item.product.name}</h2>
                  </Link>
                  <p className="text-sm text-muted-foreground">Ksh.{item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="font-semibold w-20 text-right">Ksh.{(item.product.price * item.quantity).toFixed(2)}</p>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            );
          })}
           <Button variant="outline" onClick={clearCart}>
            <Trash2 className="mr-2 h-4 w-4"/> Clear Cart
          </Button>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Ksh.{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Ksh.{cartTotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout" className="w-full">
                <Button size="lg" className="w-full">
                  Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
