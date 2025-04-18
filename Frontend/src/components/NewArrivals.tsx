
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

// Updated product data with hover images
const products = [
  {
    id: "977b2a15-ecb6-4f25-b7ef-de0fd181bb00",
    name: "paladio forza",
    price: 900.0,
    image: "/uploads/1744894255850-DSC00411.jpg",
    hoverImage:"/uploads/1744894255870-DSC00410.jpg",
    category: "Men",
  },
];

const NewArrivals = () => {
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
                image={product.image}
                hoverImage={product.hoverImage}
                category={product.category}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
