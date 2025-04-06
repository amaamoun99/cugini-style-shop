
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, CreditCard } from "lucide-react";

// Mock data for the cart items
const cartItems = [
  {
    id: 1,
    name: "Cotton Linen Shirt",
    price: 89.99,
    color: "Ivory",
    size: "M",
    quantity: 1,
    image: "/images/DSC00400.jpg",
  },
  {
    id: 2,
    name: "Silk Blend Scarf",
    price: 49.99,
    color: "Blue",
    size: "One Size",
    quantity: 1,
    image: "/images/DSC00409.jpg",
  },
];

const CheckoutPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "United States",
    phone: "",
  });
  const [shippingMethod, setShippingMethod] = useState<string>("standard");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [saveInfo, setSaveInfo] = useState<boolean>(false);
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  
  // Calculate order summary
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = shippingMethod === "express" ? 15 : 8;
  const discount = discountApplied ? subtotal * 0.1 : 0; // 10% discount if applied
  const tax = (subtotal - discount) * 0.08; // 8% tax after discount
  const total = subtotal + shipping + tax - discount;
  
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };
  
  const handleApplyDiscount = () => {
    if (discountCode.trim().toLowerCase() === "cugini10") {
      setDiscountApplied(true);
    } else {
      alert("Invalid discount code");
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process payment and order logic would go here
    alert("Order submitted! This would be connected to your payment processor in a real implementation.");
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="border-muted mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        placeholder="First name"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        placeholder="Last name"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        placeholder="Street address"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        placeholder="City"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input 
                        id="zipCode" 
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                        placeholder="ZIP code"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        placeholder="Phone number for delivery updates"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <h3 className="text-lg font-medium mb-4">Shipping Method</h3>                  
                  <RadioGroup 
                    value={shippingMethod}
                    onValueChange={setShippingMethod}
                    className="space-y-3 mb-6"
                  >
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="font-medium">Standard Shipping</Label>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$8.00</p>
                        <p className="text-sm text-muted-foreground">3-5 business days</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="font-medium">Express Shipping</Label>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$15.00</p>
                        <p className="text-sm text-muted-foreground">1-2 business days</p>
                      </div>
                    </div>
                  </RadioGroup>
                  
                  <Separator className="my-6" />
                  
                  <h3 className="text-lg font-medium mb-4">Payment</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center border p-4 rounded-md">
                      <CreditCard className="mr-2 h-5 w-5" />
                      <span className="font-medium">Credit Card</span>
                    </div>
                    
                    <div>
                      <Label htmlFor="cardName">Name on card</Label>
                      <Input 
                        id="cardName" 
                        placeholder="Name as it appears on your card"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardNumber">Card number</Label>
                      <Input 
                        id="cardNumber" 
                        placeholder="•••• •••• •••• ••••"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiration date</Label>
                        <Input 
                          id="expiry" 
                          placeholder="MM / YY"
                          className="mt-1"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input 
                          id="cvc" 
                          placeholder="•••"
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                    
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
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-muted sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                
                <div className="space-y-4 max-h-80 overflow-auto mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative w-16 h-20 bg-muted rounded overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-0 right-0 bg-background/80 w-5 h-5 rounded-full flex items-center justify-center text-xs">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">{item.color} / {item.size}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 mb-4">
                  <div className="flex">
                    <Input
                      placeholder="Discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button 
                      type="button" 
                      onClick={handleApplyDiscount}
                      className="rounded-l-none"
                      variant="outline"
                    >
                      Apply
                    </Button>
                  </div>
                  {discountApplied && (
                    <p className="text-sm text-green-600 mt-1">Discount applied!</p>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${formatPrice(subtotal)}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>${formatPrice(tax)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-medium text-lg mb-6">
                  <span>Total</span>
                  <span>${formatPrice(total)}</span>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full btn-vintage"
                  onClick={handleSubmit}
                >
                  Complete Order
                </Button>
                
                <div className="mt-4 text-center">
                  <Link to="/cart" className="text-sm text-muted-foreground flex items-center justify-center">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Return to cart
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
