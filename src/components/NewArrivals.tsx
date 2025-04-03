
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

// Updated product data with hover images
const products = [
  {
    id: 5,
    name: 'Striped Linen Shirt',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1602810318660-d2c46b750f88?q=80&w=1974&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1974&auto=format&fit=crop',
    category: 'Men'
  },
  {
    id: 6,
    name: 'Silk Blouse',
    price: 169.99,
    image: 'https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?q=80&w=1974&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1617551307578-7232f8f61993?q=80&w=1974&auto=format&fit=crop',
    category: 'Women'
  },
  {
    id: 7,
    name: 'Cotton Chino Pants',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1604176424472-9d0d52985b20?q=80&w=1965&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1974&auto=format&fit=crop',
    category: 'Men'
  },
  {
    id: 8,
    name: 'Leather Handbag',
    price: 219.99,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2076&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop',
    category: 'Women'
  }
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
          <div className="hidden md:block absolute -top-10 -right-4 w-48 h-48 border border-cugini-golden opacity-30 -rotate-12"></div>
          
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
