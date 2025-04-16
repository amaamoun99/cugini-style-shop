
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

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

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  isPromoApplied: boolean;
  onApplyPromo: () => void;
  onSubmit: () => void;
}

const OrderSummary = ({
  cartItems,
  subtotal,
  discount,
  shipping,
  total,
  discountCode,
  setDiscountCode,
  isPromoApplied,
  onApplyPromo,
  onSubmit,
}: OrderSummaryProps) => {
  return (
    <Card className="border-muted sticky top-8">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Order Summary</h3>
        <div className="space-y-4 max-h-80 overflow-auto mb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="flex-1">
                <h3 className="font-medium text-sm">{item.variant.product.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.variant.color} / {item.variant.size}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${item.variant.product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {isPromoApplied && (
            <div className="flex justify-between text-green-600 mb-2">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium text-lg mt-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Promo code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled={isPromoApplied}
            />
            <Button
              variant="outline"
              onClick={onApplyPromo}
              disabled={isPromoApplied || !discountCode}
            >
              Apply
            </Button>
          </div>

          {isPromoApplied && (
            <div className="text-sm text-green-600">
              Promo code "CUGINI10" applied!
            </div>
          )}

          <Button
            className="w-full bg-cugini-golden hover:bg-cugini-golden/90 text-white"
            onClick={onSubmit}
          >
            Complete Order
          </Button>

          <div className="mt-4 text-center">
            <Link to="/cart" className="text-sm text-muted-foreground flex items-center justify-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Return to cart
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
