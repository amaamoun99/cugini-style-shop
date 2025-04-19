import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import CatalogHero from '@/components/CatalogHero';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getAllProducts } from '@/api/product';

const ShopCatalog = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const activeProducts = products.filter(product => product.isActive);
    if (activeCategory === 'all') return activeProducts;
    return activeProducts.filter(product => product.category?.name?.toLowerCase() === activeCategory);
  }, [activeCategory, products]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <CatalogHero />

        <div className="container-custom py-8">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="w-full flex justify-center align-middle space-x-4 mb-8 border-b border-gray-200 overflow-hidden pb-2">
              <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-cugini-golden hover:text-cugini-golden px-6 py-2">All Products</TabsTrigger>
              <TabsTrigger value="men" className="data-[state=active]:border-b-2 data-[state=active]:border-cugini-golden hover:text-cugini-golden px-6 py-2">Men</TabsTrigger>
              <TabsTrigger value="women" className="data-[state=active]:border-b-2 data-[state=active]:border-cugini-golden hover:text-cugini-golden px-6 py-2">Women</TabsTrigger>
            </TabsList>

            <div className="container-custom">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, idx) => (
                    <ProductCardSkeleton key={idx} />
                  ))}
                </div>
              ) : (
                ['all', 'men', 'women'].map(category => (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          image={product.images?.[0]?.url}
                          hoverImage={product.images?.[1]?.url || product.images?.[0]?.url}
                          category={product.category?.name}
                        />
                      ))}
                    </div>
                  </TabsContent>
                ))
              )}
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopCatalog;
