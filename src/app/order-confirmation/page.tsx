"use client";
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const total = searchParams.get('total') || '0';
  const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="items-center text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-bold font-headline">Order Confirmed!</CardTitle>
          <CardDescription>Thank you for your purchase.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your order has been placed successfully. A confirmation email with your order details has been sent.
          </p>
          <div className="border rounded-lg p-4 bg-secondary">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="text-lg font-mono font-bold">{orderId}</p>
          </div>
          <div className="border rounded-lg p-4 bg-secondary">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-lg font-mono font-bold">${parseFloat(total).toFixed(2)}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Estimated delivery: 3-5 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/shop">
              <Button size="lg" variant="outline">Continue Shopping</Button>
            </Link>
            <Button size="lg" variant="secondary">
              <Download className="mr-2 h-5 w-5" /> Download Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmationContent />
        </Suspense>
    )
}
