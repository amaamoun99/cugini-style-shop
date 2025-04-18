import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCheckoutSession, placeOrder } from '@/api/checkout';
import { useCart } from '@/contexts/CartContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Truck } from 'lucide-react';

interface CartItem {
  id: string;
  quantity: number;
  variant: {
    size: string;
    color: string;
    product: {
      name: string;
      price: number;
    };
  };
}

const CheckoutPage: React.FC = () => {
  const { clearCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    street: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [saveInfo, setSaveInfo] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const session = await fetchCheckoutSession();
        setCartItems(session.items || []);
      } catch (error) {
        console.error('Failed to load cart items:', error);
      }
    };
    loadCart();
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.variant.product.price * item.quantity,
    0
  );

  const shipping = 8;
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal + shipping + tax - discount;

  const handleApplyDiscount = () => {
    if (discountCode.trim().toLowerCase() === 'cugini10') {
      setDiscountApplied(true);
    } else {
      alert('Invalid discount code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const shippingAddress = {
      street: shippingInfo.street,
      city: shippingInfo.city,
      state: "EG",
      zip: shippingInfo.zipCode,
      country: shippingInfo.country,
    };

    const guestName = `${shippingInfo.firstName} ${shippingInfo.lastName}`;
    const phoneNumber = shippingInfo.phone;

    try {
      setIsProcessingOrder(true);
      console.log('Placing order with:', { shippingAddress, paymentMethod, email, phoneNumber, guestName });
      const orderResponse = await placeOrder(shippingAddress, paymentMethod, email, phoneNumber, guestName);
      console.log('Order response received:', orderResponse);
      
      // Clear the cart after successful order placement
      await clearCart();
      
      // Prepare order data for the completion page
      const orderData = orderResponse.order || orderResponse;
      console.log('Order data for navigation:', orderData);
      
      // Use window.location for a full page navigation instead of React Router
      // This is more reliable for state transitions between pages
      window.location.href = `/order-completed?orderId=${orderData.id}`;
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to submit order. Please try again.');
      setIsProcessingOrder(false); // Reset loading state on error
    }
    // We don't need a finally block since on success we're navigating away from the page
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-serif text-primary">CUGINI</h1>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif">Checkout</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-muted mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email}
                      onChange={(e) => setEmail(e.target.value)} required placeholder="Your email address" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      required placeholder="Phone number for delivery updates" className="mt-1" />
                  </div>
                </div>

                <Separator className="my-6" />
                <h3 className="text-lg font-medium mb-4">Shipping Address</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                      required placeholder="First name" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                      required placeholder="Last name" className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="street">Street</Label>
                    <Input id="street" value={shippingInfo.street}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                      required placeholder="Street address" className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Additional Address Info</Label>
                    <Input id="address" value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      placeholder="Apartment, suite, etc." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      required placeholder="City" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                      required placeholder="ZIP Code" className="mt-1" />
                  </div>
                </div>

                <Separator className="my-6" />
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3 mb-6">
                  <div className="flex items-center justify-between border p-4 rounded-md opacity-50 pointer-events-none">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" disabled />
                      <Label htmlFor="card" className="font-medium flex items-center">Pay with Credit Card (Unavailable)</Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="font-medium flex items-center">
                        <Truck className="mr-2 h-5 w-5" /> Payment on Delivery
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox id="saveInfo" checked={saveInfo}
                    onCheckedChange={(checked) => setSaveInfo(!!checked)} />
                  <Label htmlFor="saveInfo" className="text-sm">Save this information for next time</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-muted sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                <div className="space-y-4 max-h-80 overflow-auto mb-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.variant.product.name}</h3>
                        <p className="text-xs text-muted-foreground">{item.variant.color} / {item.variant.size}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.variant.product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {discountApplied && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Taxes</span><span>${tax.toFixed(2)}</span></div>
                <Separator className="my-4" />
                <div className="flex justify-between font-medium text-lg mb-6"><span>Total</span><span>${total.toFixed(2)}</span></div>
                <LoadingButton 
                  type="submit" 
                  className="w-full btn-vintage" 
                  isLoading={isProcessingOrder}
                  loadingText="Processing Order..."
                >
                  Place Order
                </LoadingButton>
                <div className="mt-4 text-center">
                  <Link to="/cart" className="text-sm text-muted-foreground flex items-center justify-center">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Return to cart
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
