
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ChevronLeft, MapPin, CreditCard, ShoppingBag, X, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const [currentStep, setCurrentStep] = useState<number>(1);
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
  
  // Calculate order summary
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = shippingMethod === "express" ? 15 : 8;
  const tax = subtotal * 0.08; // Assuming 8% tax
  const total = subtotal + shipping + tax;
  
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };
  
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };
  
  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process payment and order logic would go here
    alert("Order submitted! This would be connected to your payment processor in a real implementation.");
  };
  
  // Progress indicators for each step
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center space-x-2 mb-8">
        {[1, 2, 3].map((step) => (
          <div 
            key={step} 
            className={`flex items-center ${currentStep === step ? "text-primary" : "text-muted-foreground"}`}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                currentStep === step ? "border-primary" : "border-muted"
              } ${currentStep > step ? "bg-primary text-primary-foreground" : ""}`}
            >
              {currentStep > step ? "✓" : step}
            </div>
            {step < 3 && (
              <div className={`h-px w-8 mx-1 ${currentStep > step ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-background py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-serif text-primary">CUGINI</h1>
          </Link>
        </div>
        
        {renderStepIndicator()}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="border-muted mb-6">
              <CardContent className="p-6">
                {/* Step 1: Information */}
                {currentStep === 1 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <MapPin className="mr-2 h-5 w-5" />
                      <h2 className="text-xl font-serif">Contact Information</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="updates" 
                          checked={saveInfo}
                          onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                        />
                        <Label htmlFor="updates" className="text-sm">
                          Email me with news and offers
                        </Label>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="flex items-center mb-6">
                      <MapPin className="mr-2 h-5 w-5" />
                      <h2 className="text-xl font-serif">Shipping Address</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                          placeholder="First name"
                          className="mt-1"
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
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <Button onClick={handleNextStep} className="btn-vintage">
                        Continue to Shipping <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Shipping */}
                {currentStep === 2 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      <h2 className="text-xl font-serif">Shipping Method</h2>
                    </div>
                    
                    <RadioGroup 
                      value={shippingMethod}
                      onValueChange={setShippingMethod}
                      className="space-y-3"
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
                    
                    <div className="mt-8 flex justify-between">
                      <Button variant="outline" onClick={handlePreviousStep}>
                        <ChevronLeft className="mr-1 h-4 w-4" /> Back
                      </Button>
                      <Button onClick={handleNextStep} className="btn-vintage">
                        Continue to Payment <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <CreditCard className="mr-2 h-5 w-5" />
                      <h2 className="text-xl font-serif">Payment</h2>
                    </div>
                    
                    <RadioGroup 
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-3 mb-6"
                    >
                      <div className="flex items-center border p-4 rounded-md">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="ml-2 font-medium">Credit Card</Label>
                        <div className="ml-auto flex space-x-2">
                          <div className="w-10 h-6 bg-muted rounded"></div>
                          <div className="w-10 h-6 bg-muted rounded"></div>
                          <div className="w-10 h-6 bg-muted rounded"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center border p-4 rounded-md">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="ml-2 font-medium">PayPal</Label>
                        <div className="ml-auto w-16 h-6 bg-muted rounded"></div>
                      </div>
                    </RadioGroup>
                    
                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardName">Name on card</Label>
                          <Input 
                            id="cardName" 
                            placeholder="Name as it appears on your card"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="cardNumber">Card number</Label>
                          <Input 
                            id="cardNumber" 
                            placeholder="•••• •••• •••• ••••"
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiration date</Label>
                            <Input 
                              id="expiry" 
                              placeholder="MM / YY"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input 
                              id="cvc" 
                              placeholder="•••"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-8 flex justify-between">
                      <Button variant="outline" onClick={handlePreviousStep}>
                        <ChevronLeft className="mr-1 h-4 w-4" /> Back
                      </Button>
                      <Button onClick={handleSubmit} className="btn-vintage">
                        Complete Order
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-muted sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-serif mb-4">Order Summary</h2>
                
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
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${formatPrice(subtotal)}</span>
                  </div>
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
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${formatPrice(total)}</span>
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
