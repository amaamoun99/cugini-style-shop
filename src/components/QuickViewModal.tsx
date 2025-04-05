
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductDetails {
  id: number;
  name: string;
  price: number;
  image: string;
  hoverImage?: string;
  category: string;
  description?: string;
  sizes?: string[]; // Add sizes property
}

interface QuickViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductDetails;
}

const QuickViewModal = ({ open, onOpenChange, product }: QuickViewModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImage, setCurrentImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  // Default sizes if none provided
  const availableSizes = product.sizes || ['S', 'M', 'L', 'XL'];
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };
  
  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} (Size: ${selectedSize}) to cart`);
    // Here you would add the product to the cart
    onOpenChange(false);
  };
  
  // Use both images if available
  const images = [product.image];
  if (product.hoverImage && product.hoverImage !== product.image) {
    images.push(product.hoverImage);
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Image Carousel */}
          <div className="relative bg-gray-50 h-full flex items-center justify-center">
            <img 
              src={currentImage} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentImage(images[0])}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-cugini-golden hover:text-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setCurrentImage(images[1])}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-cugini-golden hover:text-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            
            {/* Category Label */}
            <div className="absolute bottom-4 left-4 bg-cugini-dark bg-opacity-80 text-white py-1 px-3 uppercase text-xs tracking-wider font-serif">
              {product.category}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="mb-4">
              <DialogTitle className="font-serif uppercase tracking-wider text-xl text-cugini-dark">
                {product.name}
              </DialogTitle>
              <p className="font-serif italic text-cugini-golden text-lg mt-1">
                ${product.price.toFixed(2)}
              </p>
            </DialogHeader>
            
            <div className="mt-2 mb-6">
              <p className="text-gray-600">
                {product.description || "Crafted with the finest materials, this exquisite piece embodies the timeless elegance and quality craftsmanship that defines CUGINI."}
              </p>
            </div>
            
            {/* Decorative Line */}
            <div className="luxury-line my-4">
              <div className="h-px w-12 luxury-line-element"></div>
              <div className="h-px w-24 luxury-line-element"></div>
              <div className="h-px w-12 luxury-line-element"></div>
            </div>
            
            {/* Size Selection */}
            <div className="mt-4 mb-6">
              <h3 className="text-sm uppercase tracking-wider font-serif mb-3">Size</h3>
              <RadioGroup 
                value={selectedSize || undefined} 
                onValueChange={setSelectedSize}
                className="flex flex-wrap gap-3"
              >
                {availableSizes.map((size) => (
                  <div key={size} className="relative">
                    <RadioGroupItem
                      value={size}
                      id={`size-${size}`}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`size-${size}`}
                      className={cn(
                        "flex h-10 w-10 cursor-pointer items-center justify-center rounded-none border text-sm uppercase font-medium transition-colors hover:bg-cugini-golden/10",
                        selectedSize === size
                          ? "border-cugini-golden bg-cugini-golden/10 text-cugini-dark font-bold"
                          : "border-gray-200 text-gray-500"
                      )}
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </RadioGroup>
              {selectedSize && (
                <p className="text-xs text-gray-500 mt-2 italic">
                  Selected size: {selectedSize}
                </p>
              )}
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center mt-4 mb-6">
              <span className="text-sm uppercase tracking-wider font-serif mr-4">Quantity:</span>
              <div className="flex items-center border border-gray-300">
                <button 
                  onClick={decreaseQuantity}
                  className="px-3 py-2 border-r border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="px-3 py-2 border-l border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <Button 
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="bg-cugini-dark hover:bg-cugini-golden text-white text-xs uppercase tracking-wider py-6 flex-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              
              <Button
                onClick={toggleWishlist}
                variant="outline"
                className={cn(
                  "text-xs uppercase tracking-wider py-6 border-gray-300",
                  isWishlisted ? "bg-cugini-golden/10 border-cugini-golden" : ""
                )}
              >
                <Heart className={cn(
                  "mr-2 h-4 w-4",
                  isWishlisted ? "fill-cugini-golden text-cugini-golden" : ""
                )} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>
            
            {!selectedSize && (
              <p className="text-xs text-red-500 mt-2 text-center">
                Please select a size to add to cart
              </p>
            )}
            
            {/* View Full Details Link */}
            <a 
              href={`/product/${product.id}`} 
              className="text-center text-sm italic text-cugini-golden hover:underline mt-4"
            >
              View full product details
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;

