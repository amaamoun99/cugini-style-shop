import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Heart, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { getProductById } from '@/api/product';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const QuickViewModal = ({ open, onOpenChange, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizes, setSizes] = useState([]);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Fetch product data when modal opens
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || !open) return;
      
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        
        // Make sure we have product data before proceeding
        if (!productData) {
          throw new Error("Product data is undefined");
        }

        // Set the product state
        setProduct(productData);

        // Check for variants and set sizes
        if (productData?.variants?.length > 0) {
          const sizeOptions = [
            ...new Set(productData.variants.map((variant) => variant.size)),
          ];
          setSizes(sizeOptions);
          setSelectedSize(""); // Reset size selection when product changes
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, open]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setQuantity(1);
      setSelectedSize("");
      setSelectedImage(0);
    }
  }, [open]);

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
  
  const handleAddToCart = async () => {
    try {
      // Find the selected variant based on size
      const selectedVariant = product.variants.find(v => v.size === selectedSize);
      
      if (!selectedVariant) {
        toast({
          title: "Error",
          description: "Please select a size",
          variant: "destructive"
        });
        return;
      }
  
      await axios.post('http://localhost:3000/api/v1/cart/items', {
        variantId: selectedVariant.id,
        quantity: quantity
      });
  
      toast({
        title: "Added to Cart",
        description: `${quantity} × ${product.name} (${selectedSize}) added to your cart.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cugini-golden"></div>
            <p className="ml-4 text-cugini-dark">Loading product details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white">
          <div className="p-6 text-center">
            <h2 className="text-xl font-serif text-cugini-dark mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "We couldn't find the product you're looking for."}
            </p>
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Format images correctly - API returns array of objects with url property
  const productImages = Array.isArray(product.images)
    ? product.images.map((img) => img.url)
    : [];

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
      {/* Product Image Carousel */}
      <div className="relative bg-gray-50 h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center">
        {productImages.length > 0 ? (
          <img 
            src={productImages[selectedImage]} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <p className="text-gray-400">No image available</p>
          </div>
        )}
        
        {productImages.length > 1 && (
          <>
            <button 
              onClick={() => setSelectedImage(prev => (prev > 0 ? prev - 1 : productImages.length - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-cugini-golden hover:text-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setSelectedImage(prev => (prev < productImages.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-cugini-golden hover:text-white transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        
        {/* Category Label */}
        <div className="absolute bottom-4 left-4 bg-cugini-dark bg-opacity-80 text-white py-1 px-3 uppercase text-xs tracking-wider font-serif">
          {product.categoryId ? "Products" : ""}
        </div>
      </div>
      
      {/* Product Details */}
      <div className="p-6 flex flex-col max-h-[calc(100vh-40px)] md:max-h-none overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="font-serif uppercase tracking-wider text-xl text-cugini-dark">
            {product.name}
          </DialogTitle>
          <p className="font-serif italic text-cugini-golden text-lg mt-1">
            ${(product.price || 0).toFixed(2)}
          </p>
        </DialogHeader>
        
        <div className="mt-2 mb-6">
          <p className="text-gray-600">
            {product.description || "No description available"}
          </p>
        </div>
        
        {/* Decorative Line */}
        <div className="luxury-line my-4">
          <div className="h-px w-12 luxury-line-element"></div>
          <div className="h-px w-24 luxury-line-element"></div>
          <div className="h-px w-12 luxury-line-element"></div>
        </div>
        
        {/* Size Selection */}
        {sizes.length > 0 && (
          <div className="mt-4 mb-6">
            <h3 className="text-sm uppercase tracking-wider font-serif mb-3">
              Size: <span className="font-normal">{selectedSize}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`w-12 h-12 flex items-center justify-center border ${
                    selectedSize === size
                      ? "border-cugini-golden bg-cugini-dark text-white"
                      : "border-gray-300 text-cugini-dark hover:border-cugini-golden"
                  } transition-colors`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Quantity Selector */}
        <div className="mb-6">
          <h3 className="text-sm uppercase tracking-wider font-serif mb-3">Quantity:</h3>
          <div className="flex items-center border border-gray-300 w-fit">
            <button
              className="px-3 py-2 text-gray-500 hover:text-cugini-dark"
              onClick={decreaseQuantity}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="px-4 py-2 border-x border-gray-300">
              {quantity}
            </span>

            <button
              className="px-3 py-2 text-gray-500 hover:text-cugini-dark"
              onClick={increaseQuantity}
              aria-label="Increase quantity"
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
        
        {!selectedSize && sizes.length > 0 && (
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
  );
  
  // Render different components based on screen size
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side="bottom" 
          className="h-[90vh] p-0 rounded-t-xl overflow-hidden"
        >
          <div className="sticky top-0 z-10 bg-white p-3 border-b flex justify-between items-center">
            <h2 className="font-serif text-sm uppercase tracking-wider">Quick View</h2>
            <button onClick={() => onOpenChange(false)} className="rounded-full p-1 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-y-auto h-[calc(90vh-48px)]">
            {content}
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white">
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;