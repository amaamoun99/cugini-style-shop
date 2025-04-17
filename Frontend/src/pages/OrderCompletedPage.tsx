import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
}

const OrderCompletedPage: React.FC = () => {
  const location = useLocation();
  const order: Order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4 md:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-serif text-primary">CUGINI</h1>
          </Link>
        </div>

        <Card className="border-muted mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-serif">Order Confirmed!</h2>
              <p className="text-muted-foreground">Thank you for your order. We'll send you shipping confirmation soon.</p>
            </div>

            <Separator className="my-6" />
            <div className="space-y-4 text-left">
              <div><h3 className="font-medium">Order Number</h3><p className="text-muted-foreground">{order.id}</p></div>
              {order.guestEmail && <div><h3 className="font-medium">Email</h3><p className="text-muted-foreground">{order.guestEmail}</p></div>}
              {order.guestName && <div><h3 className="font-medium">Name</h3><p className="text-muted-foreground">{order.guestName}</p></div>}
              {order.guestPhone && <div><h3 className="font-medium">Phone</h3><p className="text-muted-foreground">{order.guestPhone}</p></div>}
              <div><h3 className="font-medium">Total Amount</h3><p className="text-muted-foreground">${order.totalAmount.toFixed(2)}</p></div>
              <div><h3 className="font-medium">Status</h3><p className="text-muted-foreground capitalize">{order.status}</p></div>
            </div>
          </CardContent>
        </Card>

        <Link to="/shop">
          <Button size="lg" className="btn-vintage">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderCompletedPage;
