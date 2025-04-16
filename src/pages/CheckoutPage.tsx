
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCheckoutSession, placeOrder } from '@/api/checkout';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import ContactInformation from '@/components/checkout/ContactInformation';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentMethod from '@/components/checkout/PaymentMethod';
import OrderSummary from '@/components/checkout/OrderSummary';

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

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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
  
    try {
      const order = await placeOrder(
        shippingAddress, 
        paymentMethod, 
        email, 
        shippingInfo.phone, 
        guestName
      );
      navigate('/order-completed', { 
        state: { 
          orderDetails: order
        } 
      });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to submit order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <CheckoutHeader />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif">Checkout</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-muted mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                <ContactInformation
                  email={email}
                  setEmail={setEmail}
                  phone={shippingInfo.phone}
                  setPhone={(phone) => setShippingInfo({ ...shippingInfo, phone })}
                />

                <Separator className="my-6" />
                <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                <ShippingForm shippingInfo={shippingInfo} setShippingInfo={setShippingInfo} />

                <Separator className="my-6" />
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="saveInfo"
                    checked={saveInfo}
                    onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                  />
                  <Label htmlFor="saveInfo" className="text-sm">
                    Save this information for next time
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              total={total}
              discountCode={discountCode}
              setDiscountCode={setDiscountCode}
              isPromoApplied={discountApplied}
              onApplyPromo={handleApplyDiscount}
              onSubmit={handleSubmit}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
