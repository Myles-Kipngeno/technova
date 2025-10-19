export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Smartphones' | 'Laptops' | 'Audio' | 'Wearables' | 'Cameras' | 'Drones';
  brand: 'Nova' | 'Electro' | 'Sonic' | 'Connect';
  stock: number;
  imageIds: string[];
  isFeatured: boolean;
  newArrival: boolean;
  rating: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: CartItem[];
  total: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Unpaid';
  deliveryStatus: 'Processing' | 'Shipped' | 'Delivered';
  createdAt: Date;
};
