import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { fetchOrderById } from '@/api/orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface OrderItem {
  id: string;
  productName: string;
  variantSize: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  items?: OrderItem[];
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
  createdAt?: string;
}

const OrderCompletedPage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order ID from URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('orderId');
  
  // If order data exists in location state, use it directly
  const orderFromState = location.state?.order;
  
  useEffect(() => {
    // If we have order data in state, use it
    if (orderFromState) {
      setOrder(orderFromState);
      setLoading(false);
      return;
    }
    
    // If we have order ID, fetch order details
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          setLoading(true);
          const orderData = await fetchOrderById(orderId);
          console.log('Fetched order details:', orderData);
          
          // The fetchOrderById already handles extracting data from the response
          // Set order data from the response
          setOrder(orderData);
          
          if (!orderData) {
            setError('Order data is missing or invalid.');            
          }
          setLoading(false);
        } catch (err) {
          console.error('Error fetching order details:', err);
          setError('Failed to load order details. Please try again later.');
          setLoading(false);
        }
      };
      
      fetchOrderDetails();
    } else {
      // No order ID and no order in state, redirect to home
      setError('No order information found.');
      setLoading(false);
      // Don't redirect immediately, show the error first
    }
  }, [orderId, orderFromState]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error || !order) {
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
              <div className="py-12">
                <h2 className="text-2xl font-serif mb-4">Order Not Found</h2>
                <p className="text-muted-foreground mb-8">{error || 'We couldn\'t find your order information.'}</p>
                <Button size="lg" className="btn-vintage" onClick={() => navigate('/')}>
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
              
              {/* Customer Information */}
              <div className="border-t pt-4 mt-6">
                <h3 className="font-medium text-lg mb-2">Customer Information</h3>
                {order.guestEmail && <div className="mb-1"><span className="font-medium">Email:</span> <span className="text-muted-foreground">{order.guestEmail}</span></div>}
                {order.guestName && <div className="mb-1"><span className="font-medium">Name:</span> <span className="text-muted-foreground">{order.guestName}</span></div>}
                {order.guestPhone && <div className="mb-1"><span className="font-medium">Phone:</span> <span className="text-muted-foreground">{order.guestPhone}</span></div>}
                {order.createdAt && <div className="mb-1"><span className="font-medium">Order Date:</span> <span className="text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</span></div>}
              </div>
              
              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="border-t pt-4">
                  <h3 className="font-medium text-lg mb-2">Shipping Address</h3>
                  <div className="text-muted-foreground">
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              )}
              
              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-medium text-lg mb-2">Order Items</h3>
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">Size: {item.variantSize} × {item.quantity}</p>
                      </div>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Order Summary */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-lg mb-2">Order Summary</h3>
                <div className="flex justify-between mb-1">
                  <span>Payment Method:</span>
                  <span className="capitalize">{order.paymentMethod || 'Payment on Delivery'}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Order Status:</span>
                  <span className="capitalize">{order.status || 'Processing'}</span>
                </div>
                <div className="flex justify-between font-medium text-lg mt-2">
                  <span>Total:</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
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
