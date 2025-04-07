import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SizeChart from '@/components/SizeChart';
import { ArrowRight, Minus, Plus, Star, ShoppingBag, Share2, ZoomIn, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format, addDays } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const products = [
  {
    id: 1,
    name: 'Italian Wool Blazer',
    price: 399.99,
    images: [
      '/images/DSC00399.jpg', 
      '/images/DSC00400.jpg',
      '/images/DSC00402.jpg',
    ],
    colors: ['Black', 'Navy', 'Gray'],
    sizes: ['S', 'M', 'L'],
    description: 'Crafted from premium Italian wool, this blazer embodies timeless elegance with a modern silhouette. Perfect for both formal occasions and elevated casual wear.',
    details: [
      'Made in Italy from 100% virgin wool',
      'Two-button front closure',
      'Notched lapels with pick stitching',
      'Left chest pocket and two front flap pockets',
      'Four-button detail at cuffs',
      'Double back vent for comfort and mobility',
      'Fully lined in signature Cugini print fabric'
    ],
    care: 'Dry clean only. Do not bleach. Iron on low heat if needed.',
    category: 'men'
  },
  {
    id: 2,
    name: 'Linen Summer Shirt',
    price: 149.99,
    images: [
      '/images/DSC00402.jpg',
      '/images/DSC00405.jpg',
      '/images/DSC00406.jpg',
    ],
    colors: ['White', 'Blue', 'Sand'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Pure Italian linen shirt crafted for breathable comfort in warm weather. The relaxed fit and natural texture create an effortlessly sophisticated look.',
    details: [
      '100% Italian linen',
      'Button-down collar',
      'Front button closure',
      'Left chest pocket',
      'Curved hem',
      'Mother-of-pearl buttons',
      'Relaxed fit for comfort'
    ],
    care: 'Machine wash cold on gentle cycle. Tumble dry low. Iron on medium heat if needed.',
    category: 'men'
  },
  {
    id: 3,
    name: 'Silk Evening Dress',
    price: 329.99,
    images: [
      '/images/IMG-20250403-WA0010.jpg',
      '/images/IMG-20250403-WA0011.jpg',
      '/images/IMG-20250403-WA0012.jpg',
    ],
    colors: ['Black', 'Emerald', 'Burgundy'],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Elegant silk evening dress with a flowing silhouette. Designed to create a captivating presence for special occasions with its luxurious fabric and timeless design.',
    details: [
      '100% silk with satin finish',
      'Asymmetrical neckline',
      'Hidden side zipper',
      'Fully lined',
      'Midi length',
      'Handcrafted in Italy',
      'Subtle side slit for ease of movement'
    ],
    care: 'Dry clean only. Store on padded hanger.',
    category: 'women'
  },
  {
    id: 4,
    name: 'Cashmere Sweater',
    price: 259.99,
    images: [
      '/images/IMG-20250403-WA0012.jpg',
      '/images/IMG-20250403-WA0013.jpg',
      '/images/IMG-20250403-WA0014.jpg',
    ],
    colors: ['Cream', 'Camel', 'Black'],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Luxuriously soft cashmere sweater with a relaxed fit. Perfect for layering or wearing alone, this essential piece offers both warmth and refined style.',
    details: [
      '100% Grade-A Mongolian cashmere',
      'Ribbed crewneck, cuffs, and hem',
      'Relaxed fit',
      'Seamless construction',
      'Hand-finished edges',
      '12-gauge knit for ideal weight and drape',
      'Sustainably and ethically sourced material'
    ],
    care: 'Hand wash cold or dry clean. Lay flat to dry. Store folded.',
    category: 'women'
  }
];

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "1");
  const product = products.find(p => p.id === productId) || products[0];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]); // Default to M
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const { toast } = useToast();
  
  const deliveryDate = addDays(new Date(), 5);
  const formattedDeliveryDate = format(deliveryDate, "MMMM d, yyyy");
  
  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity} × ${product.name} (${selectedSize}, ${selectedColor}) added to your cart.`,
    });
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleShare = async () => {
    const url = window.location.href;
    const title = `Check out this amazing product: ${product.name}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: product.description,
          url
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
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
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
          variant: "destructive"
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
          src={product.images[selectedImage]}
          alt={product.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
  
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 2);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container-custom py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="product-images">
              <div className="relative aspect-square overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                <button
                  onClick={() => setZoomOpen(true)}
                  className="absolute bottom-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                  aria-label="Zoom Image"
                >
                  <ZoomIn className="h-5 w-5 text-cugini-dark" />
                </button>
              </div>
              
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
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
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="product-info">
              <h1 className="text-3xl md:text-4xl font-serif text-cugini-dark mb-2">
                {product.name}
              </h1>
              
              <p className="text-2xl text-cugini-golden font-serif italic mb-4">
                ${product.price.toFixed(2)}
              </p>
              
              <p className="text-gray-600 mb-6">
                {product.description}
              </p>
              
              <div className="bg-gray-50 p-4 mb-8 border border-gray-200">
                <p className="text-cugini-dark font-medium">
                  Estimated Delivery: <span className="text-cugini-golden">{formattedDeliveryDate}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Order within 24 hours for fastest processing
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-cugini-dark mb-2">Size: <span className="font-normal">{selectedSize}</span></h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
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
                <p className="text-sm text-gray-500 mt-2">
                  <SizeChart category={product.category} />
                </p>
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium text-cugini-dark mb-2">Quantity:</h3>
                <div className="flex items-center border border-gray-300 w-fit">
                  <button 
                    className="px-3 py-2 text-gray-500 hover:text-cugini-dark"
                    onClick={decrementQuantity}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  <span className="px-4 py-2 border-x border-gray-300">
                    {quantity}
                  </span>
                  
                  <button 
                    className="px-3 py-2 text-gray-500 hover:text-cugini-dark"
                    onClick={incrementQuantity}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleBuyNow} 
                  className="flex-1 bg-cugini-golden hover:bg-cugini-dark text-white py-3 px-8 transition-colors"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Buy Now
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleAddToCart}
                  className="flex-1 border border-gray-300 hover:border-cugini-golden py-3 px-8 transition-colors"
                >
                  Add to Cart
                </Button>
              </div>
              
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
                <TabsTrigger 
                  value="sizing"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-cugini-golden hover:text-cugini-golden px-6 py-2"
                >
                  Size Guide
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-0">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-serif text-cugini-dark mb-4">Product Features</h2>
                  <ul className="space-y-2 mb-8 list-disc pl-5 text-gray-600">
                    {product.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="care" className="mt-0">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-serif text-cugini-dark mb-4">Care Instructions</h2>
                  <p className="text-gray-600">{product.care}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="sizing" className="mt-0">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-serif text-cugini-dark mb-4">Size Guide</h2>
                  <div className="bg-white border border-gray-200 rounded-md p-6">
                    <SizeChart category={product.category} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="container-custom py-16">
            <h2 className="text-2xl md:text-3xl font-serif text-cugini-dark text-center mb-8">
              You May Also Like
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProducts.map(related => (
                <div 
                  key={related.id} 
                  className="group relative overflow-hidden"
                >
                  <a href={`/product/${related.id}`} className="block aspect-square overflow-hidden">
                    <img
                      src={related.images[0]}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </a>
                  
                  <div className="mt-4 text-center">
                    <h3 className="font-serif uppercase tracking-wider text-sm text-cugini-dark">
                      {related.name}
                    </h3>
                    <p className="font-serif italic text-cugini-golden mt-1">
                      ${related.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <a 
                href={`/shop/${product.category}`}
                className="inline-flex items-center px-8 py-3 bg-cugini-dark text-white hover:bg-cugini-golden transition-colors"
              >
                View All {product.category === 'men' ? "Men's" : "Women's"} <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </main>
      
      {isMobile ? (
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
      )}
      
      <Footer />
    </div>
  );
};

export default ProductDetails;
