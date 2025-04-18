import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SizeChart from "@/components/SizeChart";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Share2,
  ZoomIn,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format, addDays } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getProductById } from "@/api/product";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const { addItem } = useCart();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [variantStockMap, setVariantStockMap] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isMobile = useIsMobile();
  const { toast } = useToast();

  console.log("Product ID:", id);
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        console.log("Product data:", productData);

        // Make sure we have product data before proceeding
        if (!productData) {
          throw new Error("Product data is undefined");
        }

        // Set the product state first
        setProduct(productData);

        // Only then check for variants - use optional chaining for safety
        if (productData?.variants?.length > 0) {
          const sizes = [
            ...new Set(productData.variants.map((variant) => variant.size)),
          ];
          console.log("sizes", sizes);
          setSizes(sizes);
          
          // Create a mapping of size to stock for easy lookup
          const stockMap = {};
          productData.variants.forEach(variant => {
            stockMap[variant.size] = variant.stock;
          });
          setVariantStockMap(stockMap);
          
          // Set default size to first available size with stock > 0
          const availableSize = sizes.find(size => stockMap[size] > 0);
          setSelectedSize(availableSize || "");
        }

        // Rest of your code...
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async (categoryId) => {
      if (!categoryId) return;

      try {
        // This would need to be implemented based on your API
        // const products = await getProductsByCategoryId(categoryId, 3);
        // const filtered = products.filter(p => p.id !== id).slice(0, 2);
        // setRelatedProducts(filtered);

        // For now, just set empty array
        setRelatedProducts([]);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cugini-golden mx-auto"></div>
            <p className="mt-4 text-cugini-dark">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-serif text-cugini-dark mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the product you're looking for.
            </p>
            <Button asChild>
              <a href="/shop">Continue Shopping</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const deliveryDate = addDays(new Date(), 5);
  const formattedDeliveryDate = format(deliveryDate, "MMMM d, yyyy");

  // Get product details safely
  const productDetails = product.details
    ? typeof product.details === "string"
      ? [product.details]
      : Array.isArray(product.details)
      ? product.details
      : []
    : [];

  // Format images correctly - API returns array of objects with url property
  const productImages = Array.isArray(product.images)
    ? product.images.map((img) => img.url)
    : [];

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      
      // Find the selected variant based on size
      const selectedVariant = product.variants.find(
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

      // Use CartContext addItem method instead of direct API call
      await addItem(selectedVariant.id, quantity);

      toast({
        title: "Added to Cart",
        description: `${quantity} × ${product.name} (${selectedSize}) added to your cart.`,
      });
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

  const handleBuyNow = async () => {
    try {
      await handleAddToCart();
      // Only redirect if add to cart was successful
      window.location.href = "/checkout";
    } catch (error) {
      // Error is already handled in handleAddToCart
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
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

  const handleShare = async () => {
    const url = window.location.href;
    const title = `Check out this amazing product: ${product.name}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: product.description,
          url,
        });
        toast({
          title: "Shared Successfully",
          description: "Thanks for sharing our product!",
        });
      } catch (error) {
        console.error("Error sharing:", error);
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Link Copied!",
          description: "Product link copied to clipboard.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Share Failed",
          description: "Could not copy link to clipboard.",
          variant: "destructive",
        });
      });
  };

  const zoomModalContent = (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 hover:bg-white"
          onClick={() => setZoomOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-4 max-w-full max-h-full overflow-auto">
        <img
          src={`${import.meta.env.VITE_BASE_URL}${productImages[selectedImage]}`}
          alt={product.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );

  // Get category name - this will need to be updated based on your data structure
  const categoryName = product.categoryId ? "Products" : "";
  
  // Check if selected size is out of stock
  const isSelectedSizeOutOfStock = selectedSize ? variantStockMap[selectedSize] <= 0 : false;
  
  // Check if any size is available (with stock > 0)
  const hasAnySizeInStock = Object.values(variantStockMap).some(stock => stock > 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <div className="container-custom py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="product-images">
              <div className="relative aspect-square overflow-hidden mb-4">
                {productImages.length > 0 ? (
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${productImages[selectedImage]}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}

                {productImages.length > 0 && (
                  <button
                    onClick={() => setZoomOpen(true)}
                    className="absolute bottom-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                    aria-label="Zoom Image"
                  >
                    <ZoomIn className="h-5 w-5 text-cugini-dark" />
                  </button>
                )}
              </div>

              {productImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      className={`relative w-24 h-24 border-2 ${
                        selectedImage === index
                          ? "border-cugini-golden"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}${image}`}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="product-info">
              <h1 className="text-3xl md:text-4xl font-serif text-cugini-dark mb-2">
                {product.name}
              </h1>

              <p className="text-2xl text-cugini-golden font-serif italic mb-4">
                ${(product.price || 0).toFixed(2)}
              </p>

              <p className="text-gray-600 mb-6">
                {product.description || "No description available"}
              </p>

              <div className="bg-gray-50 p-4 mb-8 border border-gray-200">
                <p className="text-cugini-dark font-medium">
                  Estimated Delivery:{" "}
                  <span className="text-cugini-golden">
                    {formattedDeliveryDate}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Order within 24 hours for fastest processing
                </p>
              </div>

              {sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-cugini-dark mb-2">
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
                  
                  <p className="text-sm text-gray-500 mt-2">
                    <SizeChart category={categoryName} />
                  </p>
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-medium text-cugini-dark mb-2">Quantity:</h3>
                <div className="flex items-center border border-gray-300 w-fit">
                  <button
                    className={`px-3 py-2 ${
                      quantity <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-cugini-dark"
                    }`}
                    onClick={decrementQuantity}
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
                    onClick={incrementQuantity}
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

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleBuyNow}
                  className={`flex-1 bg-cugini-golden hover:bg-cugini-dark text-white py-3 px-8 transition-colors`}
                  disabled={!selectedSize || isSelectedSizeOutOfStock || !hasSufficientStock()}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Buy Now
                </Button>

                <LoadingButton
                  className="flex-1 border border-gray-300 hover:border-cugini-golden py-3 px-8 transition-colors"
                  onClick={handleAddToCart}
                  isLoading={isAddingToCart}
                  loadingText="Adding..."
                  disabled={!selectedSize || isSelectedSizeOutOfStock || !hasSufficientStock()}
                >
                  Add to Cart
                </LoadingButton>
              </div>
              
              {isSelectedSizeOutOfStock && selectedSize && (
                <div className="flex items-center mt-3 text-red-500">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>Selected size is out of stock</p>
                </div>
              )}

              <button
                className="flex items-center text-gray-500 hover:text-cugini-dark mt-4"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-12">
          <div className="container-custom">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="flex justify-center mb-8 border-b border-gray-200 overflow-hidden pb-2 bg-transparent">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-cugini-golden hover:text-cugini-golden px-6 py-2"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="care"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-cugini-golden hover:text-cugini-golden px-6 py-2"
                >
                  Care Instructions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-0">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-serif text-cugini-dark mb-4">
                    Product Features
                  </h2>
                  {productDetails.length > 0 ? (
                    <ul className="space-y-2 mb-8 list-disc pl-5 text-gray-600">
                      {productDetails.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">
                      Product details not available.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="care" className="mt-0">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-serif text-cugini-dark mb-4">
                    Care Instructions
                  </h2>
                  <p className="text-gray-600">
                    {product.care || "Care instructions not available."}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* related products */}
        {relatedProducts.length > 0 && (
          <div className="container-custom py-16">
            <h2 className="text-2xl md:text-3xl font-serif text-cugini-dark text-center mb-8">
              You May Also Like
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProducts.map((related) => (
                <div
                  key={related.id}
                  className="group relative overflow-hidden"
                >
                  <a
                    href={`/product/${related.id}`}
                    className="block aspect-square overflow-hidden"
                  >
                    {related.images && related.images[0] ? (
                      <img
                        src={related.images[0].url}
                        alt={related.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-400">No image available</p>
                      </div>
                    )}
                  </a>

                  <div className="mt-4 text-center">
                    <h3 className="font-serif uppercase tracking-wider text-sm text-cugini-dark">
                      {related.name}
                    </h3>
                    <p className="font-serif italic text-cugini-golden mt-1">
                      ${(related.price || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <a
                href={`/shop/${categoryName?.toLowerCase() || ""}`}
                className="inline-flex items-center px-8 py-3 bg-cugini-dark text-white hover:bg-cugini-golden transition-colors"
              >
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </main>

      {productImages.length > 0 &&
        (isMobile ? (
          <Sheet open={zoomOpen} onOpenChange={setZoomOpen}>
            <SheetContent side="bottom" className="h-[80vh] p-0">
              {zoomModalContent}
            </SheetContent>
          </Sheet>
        ) : (
          <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
            <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
              {zoomModalContent}
            </DialogContent>
          </Dialog>
        ))}

      <Footer />
    </div>
  );
};

export default ProductDetails;