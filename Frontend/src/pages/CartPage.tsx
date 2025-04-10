
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MinusCircle, 
  PlusCircle, 
  X, 
  ShoppingBag, 
  ArrowLeft 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

// Sample cart data - in a real app this would come from a state management solution
const initialCartItems = [
  {
    id: 1,
    name: 'Classic Tailored Trousers',
    size: 'M',
    color: 'Black',
    price: 149.99,
    quantity: 2,
    image: '/images/DSC00402.jpg'
  },
  {
    id: 2,
    name: 'Slim Fit Italian Wool Pants',
    size: 'L',
    color: 'Navy',
    price: 179.99,
    quantity: 1,
    image: '/images/DSC00409.jpg'
  }
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleQuantityChange = (id: number, change: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) } 
          : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
      variant: "default",
    });
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'cugini10') {
      setIsPromoApplied(true);
      toast({
        title: "Promo code applied!",
        description: "10% discount has been applied to your order.",
        variant: "default",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please enter a valid promo code.",
        variant: "destructive",
      });
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const discount = isPromoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 300 ? 0 : 25;
  const total = subtotal - discount + shipping;

  const estimatedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container-custom py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-serif text-center mb-8 text-cugini-dark">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex justify-center items-center rounded-full bg-cugini-taupe/10 p-6 mb-4">
              <ShoppingBag className="h-12 w-12 text-cugini-golden" />
            </div>
            <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Button 
              asChild 
              className="bg-cugini-golden hover:bg-cugini-golden/90 text-white"
            >
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items (Left Column) */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-4 md:p-6 border border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="sm:w-24 sm:h-24 flex-shrink-0">
                        <img 
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow space-y-2">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label="Remove item"
                            className="text-gray-400 hover:text-cugini-golden transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          <span>Size: {item.size}</span>
                          <span className="mx-2">|</span>
                          <span>Color: {item.color}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleQuantityChange(item.id, -1)}
                              aria-label="Decrease quantity"
                              className="text-gray-400 hover:text-cugini-golden transition-colors"
                            >
                              <MinusCircle size={20} />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => handleQuantityChange(item.id, 1)}
                              aria-label="Increase quantity"
                              className="text-gray-400 hover:text-cugini-golden transition-colors"
                            >
                              <PlusCircle size={20} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                            <div className="text-sm text-gray-500">${item.price.toFixed(2)} each</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8">
                <Button 
                  asChild 
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <Link to="/shop">
                    <ArrowLeft size={18} />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Cart Summary (Right Column) */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border border-gray-200">
                <div className="p-6">
                  <h2 className="font-serif text-xl mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {isPromoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (10%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
                    <p className="font-medium">{estimatedDeliveryDate()}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Promo code" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={isPromoApplied}
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleApplyPromo}
                        disabled={isPromoApplied || !promoCode}
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
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;
