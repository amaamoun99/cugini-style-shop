
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';



import { useEffect, useState } from "react";
import { getAllProducts } from "@/api/product";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts.filter((p) => p.isNewArrival));
      } catch (err) {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-10">
          <div className="relative">
            <h2 className="section-title mb-0 italic">New Arrivals</h2>
            <div className="absolute -bottom-2 left-0 w-24 h-[1px] bg-cugini-golden"></div>
          </div>
          <Link to="/new-arrivals" className="text-cugini-wine hover:text-cugini-dark font-serif italic">View All</Link>
        </div>
        
        <div className="relative">
          {/* Decorative element inspired by the Ralph Lauren design */}
          {/* <div className="hidden md:block absolute -top-10 -right-4 w-48 h-48 border border-cugini-golden opacity-30 -rotate-12"></div> */}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 relative z-10">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.images?.[0]?.url}
                hoverImage={product.images?.[1]?.url || product.images?.[0]?.url}
                category={product.category?.name || ""}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
