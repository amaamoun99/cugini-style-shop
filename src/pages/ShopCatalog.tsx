
import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CatalogHero from '@/components/CatalogHero';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Sample product data
const products = [
  {
    id: 5,
    name: 'Striped Linen Shirt',
    price: 149.99,
    image: '/images/DSC00399.jpg',
    hoverImage: '/images/DSC00400.jpg',
    category: 'men'
  },
  {
    id: 6,
    name: 'Silk Blouse',
    price: 169.99,
    image: '/images/IMG-20250403-WA0009.jpg',
    hoverImage: '/images/IMG-20250403-WA0010.jpg',
    category: 'women'
  },
  {
    id: 7,
    name: 'Cotton Chino Pants',
    price: 129.99,
    image: '/images/IMG-20250403-WA0012.jpg',
    hoverImage: '/images/IMG-20250403-WA0016.jpg',
    category: 'men'
  },
  {
    id: 8,
    name: 'Leather Handbag',
    price: 219.99,
    image: '/images/IMG-20250403-WA0013.jpg',
    hoverImage: '/images/IMG-20250403-WA0014.jpg',
    category: 'women'
  }
];

const ShopCatalog = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(product => product.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <CatalogHero />
        
        {/* Category Navigation */}
        <div className="container-custom py-8">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="w-full flex justify-center align-middle space-x-4 mb-8 border-b border-gray-200 overflow-hidden pb-2">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:border-b-2 data-[state=active]:border-cugini-golden hover:text-cugini-golden px-6 py-2"
              >
                All Products
              </TabsTrigger>
              <TabsTrigger 
                value="men"
                className="data-[state=active]:border-b-2 data-[state=active]:border-cugini-golden hover:text-cugini-golden px-6 py-2"
              >
                Men
              </TabsTrigger>
              <TabsTrigger 
                value="women"
                className="data-[state=active]:border-b-2 data-[state=active]:border-cugini-golden hover:text-cugini-golden px-6 py-2"
              >
                Women
              </TabsTrigger>
            </TabsList>
          
            {/* Product Grid */}
            <div className="container-custom">
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      hoverImage={product.hoverImage}
                      category={product.category === 'men' ? 'Men' : 'Women'}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="men" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      hoverImage={product.hoverImage}
                      category="Men"
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="women" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      hoverImage={product.hoverImage}
                      category="Women"
                    />
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopCatalog;
