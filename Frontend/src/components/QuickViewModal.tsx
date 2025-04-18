import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getProductById } from "@/api/product";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

interface Variant {
  id: string;
  size: string;
  stock: number;
  // Add other properties as needed
}

interface ProductImage {
  url: string;
  // Add other properties if present
}

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  images: ProductImage[];
  variants: Variant[];
  categoryId?: string;
  // Add other properties as needed
}

interface QuickViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | null;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ open, onOpenChange, productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [variantStockMap, setVariantStockMap] = useState<Record<string, number>>({});
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Fetch product data when modal opens
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || !open) return;

      try {
        setLoading(true);
        // Use the shared API utility for fetching product data
        const productData: Product | undefined = await getProductById(productId);

        if (!productData) {
          throw new Error("Product data is undefined");
        }

        setProduct(productData);

        // Check for variants and set sizes
        if (productData?.variants?.length > 0) {
          const sizeOptions = [
            ...new Set(productData.variants.map((variant) => variant.size)),
          ];
          setSizes(sizeOptions);
          
          // Create a mapping of size to stock for easy lookup
          const stockMap = {};
          productData.variants.forEach(variant => {
            stockMap[variant.size] = variant.stock;
          });
          setVariantStockMap(stockMap);
          
          // Set default size to first available size with stock > 0
          const availableSize = sizeOptions.find(size => stockMap[size] > 0);
          setSelectedSize(availableSize || "");
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

  // Get the current variant's stock based on selected size
  const getCurrentVariantStock = () => {
    if (!selectedSize || !variantStockMap[selectedSize]) return 0;
    return variantStockMap[selectedSize];
  };

  // Check if selected variant has sufficient stock for requested quantity
  const hasSufficientStock = () => {
    const currentStock = getCurrentVariantStock();
    return currentStock >= quantity;
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    const currentStock = getCurrentVariantStock();
    if (quantity < currentStock) {
      setQuantity(quantity + 1);
    } else {
      toast({
        title: "Maximum Stock Reached",
        description: `Only ${currentStock} units available.`,
        variant: "destructive",
      });
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = async () => {
    try {
      // Find the selected variant based on size
      const selectedVariant = product?.variants.find(
        (v) => v.size === selectedSize
      );

      if (!selectedVariant) {
        toast({
          title: "Error",
          description: "Please select a size",
          variant: "destructive",
        });
        return;
      }

      // Check stock before adding to cart
      if (selectedVariant.stock < quantity) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${selectedVariant.stock} units available.`,
          variant: "destructive",
        });
        return;
      }

      setIsAddingToCart(true);
      
      // Use CartContext addItem method which will update the cart count in real-time
      await addItem(selectedVariant.id, quantity);

      toast({
        title: "Added to Cart",
        description: `${quantity} × ${product.name} (${selectedSize}) added to your cart.`,
      });

      onOpenChange(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast({
          title: "Error",
          description: error.response.data.message,
          variant: "destructive",
        });
      } else {
        console.error("Error adding to cart:", error);
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsAddingToCart(false);
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
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Format images correctly - API returns array of objects with url property
  const productImages = Array.isArray(product.images)
    ? product.images.map((img) => img.url)
    : [];
    
  // Check if selected size is out of stock
  const isSelectedSizeOutOfStock = selectedSize ? variantStockMap[selectedSize] <= 0 : false;
  
  // Check if any size is available (with stock > 0)
  const hasAnySizeInStock = Object.values(variantStockMap).some(stock => stock > 0);

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
      {/* Product Image Carousel */}
      <div className="relative bg-gray-50 h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center">
        {productImages.length > 0 ? (
          <img
            src={`http://localhost:3000${productImages[selectedImage]}`}
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
              onClick={() =>
                setSelectedImage((prev) =>
                  prev > 0 ? prev - 1 : productImages.length - 1
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-cugini-golden hover:text-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() =>
                setSelectedImage((prev) =>
                  prev < productImages.length - 1 ? prev + 1 : 0
                )
              }
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
              {selectedSize && (
                <span className="ml-2 text-sm">
                  ({variantStockMap[selectedSize] || 0} in stock)
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const isOutOfStock = variantStockMap[size] <= 0;
                return (
                  <button
                    key={size}
                    className={`w-12 h-12 flex items-center justify-center border relative
                      ${selectedSize === size
                        ? "border-cugini-golden bg-cugini-dark text-white"
                        : isOutOfStock
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-cugini-dark hover:border-cugini-golden"
                      } transition-colors`}
                    onClick={() => !isOutOfStock && setSelectedSize(size)}
                    disabled={isOutOfStock}
                    aria-label={isOutOfStock ? `Size ${size} - Out of stock` : `Select size ${size}`}
                  >
                    {size}
                    {isOutOfStock && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 border-t border-gray-400 rotate-45"></div>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {!hasAnySizeInStock && (
              <div className="flex items-center mt-3 text-red-500">
                <AlertCircle className="h-4 w-4 mr-1" />
                <p className="text-sm">All sizes are currently out of stock</p>
              </div>
            )}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="mb-6">
          <h3 className="text-sm uppercase tracking-wider font-serif mb-3">
            Quantity:
          </h3>
          <div className="flex items-center border border-gray-300 w-fit">
            <button
              className={`px-3 py-2 ${
                quantity <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-cugini-dark"
              }`}
              onClick={decreaseQuantity}
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="px-4 py-2 border-x border-gray-300">
              {quantity}
            </span>

            <button
              className={`px-3 py-2 ${
                !selectedSize || quantity >= getCurrentVariantStock()
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-cugini-dark"
              }`}
              onClick={increaseQuantity}
              aria-label="Increase quantity"
              disabled={!selectedSize || quantity >= getCurrentVariantStock()}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {selectedSize && variantStockMap[selectedSize] > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {variantStockMap[selectedSize] <= 5 ? (
                <span className="text-amber-600">
                  Only {variantStockMap[selectedSize]} left in stock!
                </span>
              ) : (
                <span>In stock</span>
              )}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
          <LoadingButton
            onClick={handleAddToCart}
            disabled={!selectedSize || isSelectedSizeOutOfStock || !hasSufficientStock()}
            className="bg-cugini-dark hover:bg-cugini-golden text-white text-xs uppercase tracking-wider py-6 flex-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            isLoading={isAddingToCart}
            loadingText="Adding to Cart..."
            startIcon={<ShoppingBag className="h-4 w-4" />}
          >
            Add to Cart
          </LoadingButton>

          <Button
            onClick={toggleWishlist}
            variant="outline"
            className={cn(
              "text-xs uppercase tracking-wider py-6 border-gray-300",
              isWishlisted ? "bg-cugini-golden/10 border-cugini-golden" : ""
            )}
          >
            <Heart
              className={cn(
                "mr-2 h-4 w-4",
                isWishlisted ? "fill-cugini-golden text-cugini-golden" : ""
              )}
            />
            {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
          </Button>
        </div>

        {isSelectedSizeOutOfStock && selectedSize && (
          <div className="flex items-center mt-3 text-red-500">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>Selected size is out of stock</p>
          </div>
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
            <h2 className="font-serif text-sm uppercase tracking-wider">
              Quick View
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-y-auto h-[calc(90vh-48px)]">{content}</div>
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