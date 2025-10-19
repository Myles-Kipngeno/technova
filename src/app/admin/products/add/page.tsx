
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from 'react';
import Image from 'next/image';
import type { Product } from "@/lib/types";
import { useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.enum(['Smartphones', 'Laptops', 'Audio', 'Wearables', 'Cameras', 'Drones']),
  brand: z.enum(['Nova', 'Electro', 'Sonic', 'Connect']),
  stock: z.coerce.number().int().min(0, "Stock must be a non-negative integer"),
  uploadedImage: z.any().optional(),
  isFeatured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  rating: z.coerce.number().int().min(1).max(5),
});

export default function AddProductPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      isFeatured: false,
      newArrival: false,
      rating: 4,
    },
  });

  async function onSubmit(values: z.infer<typeof productSchema>) {
    if (!firestore) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Firestore is not available. Please try again later.",
        });
        return;
    }

    const productsCollection = collection(firestore, "products");
    
    // For now, we are not handling image uploads to a storage bucket,
    // so we'll use the preview (a data URL) or an empty string.
    // The `imageUrl` will also be an empty string since we removed imageIds.
    // In a real app, you'd upload the file and get a URL.
    const newProductData = {
        name: values.name,
        description: values.description,
        price: values.price,
        category: values.category,
        brand: values.brand,
        stock: values.stock,
        isFeatured: values.isFeatured,
        newArrival: values.newArrival,
        rating: values.rating,
        imageUrl: preview || '', // Using data URL as imageUrl for now.
        imageIds: [], // This was from the mock data, keeping it for type consistency
    };

    try {
        await addDocumentNonBlocking(productsCollection, newProductData);
        toast({
            title: "Product Added!",
            description: `${values.name} has been added to the catalog.`,
        });
        router.push('/admin/products');
    } catch (error) {
        console.error("Error adding product: ", error);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Could not add the product.",
        });
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        form.setValue('uploadedImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Add New Product</CardTitle>
        <CardDescription>Fill out the form below to add a new product to the catalog.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. NovaPhone X2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (Ksh.)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 1299" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the product..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
              </FormControl>
              {preview && (
                <div className="mt-4 relative w-48 h-48">
                    <Image src={preview} alt="Product preview" layout="fill" objectFit="cover" className="rounded-md" />
                </div>
              )}
              <FormMessage />
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Smartphones">Smartphones</SelectItem>
                        <SelectItem value="Laptops">Laptops</SelectItem>
                        <SelectItem value="Audio">Audio</SelectItem>
                        <SelectItem value="Wearables">Wearables</SelectItem>
                        <SelectItem value="Cameras">Cameras</SelectItem>
                        <SelectItem value="Drones">Drones</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Nova">Nova</SelectItem>
                        <SelectItem value="Electro">Electro</SelectItem>
                        <SelectItem value="Sonic">Sonic</SelectItem>
                        <SelectItem value="Connect">Connect</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (1-5)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="5" placeholder="e.g. 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-6">
                <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            Featured Product
                            </FormLabel>
                            <FormDescription>
                            Display this product on the homepage.
                            </FormDescription>
                        </div>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="newArrival"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            New Arrival
                            </FormLabel>
                             <FormDescription>
                            Mark this product as a new arrival.
                            </FormDescription>
                        </div>
                        </FormItem>
                    )}
                />
            </div>
            
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit">Add Product</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    