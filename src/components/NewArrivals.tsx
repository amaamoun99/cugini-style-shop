
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const products = [
  {
    id: 5,
    name: 'Striped Linen Shirt',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1602810318660-d2c46b750f88?q=80&w=1974&auto=format&fit=crop',
    category: 'Men'
  },
  {
    id: 6,
    name: 'Silk Blouse',
    price: 169.99,
    image: 'https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?q=80&w=1974&auto=format&fit=crop',
    category: 'Women'
  },
  {
    id: 7,
    name: 'Cotton Chino Pants',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1604176424472-9d0d52985b20?q=80&w=1965&auto=format&fit=crop',
    category: 'Men'
  },
  {
    id: 8,
    name: 'Leather Crossbody Bag',
    price: 219.99,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2076&auto=format&fit=crop',
    category: 'Accessories'
  }
];

const NewArrivals = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title mb-0">New Arrivals</h2>
          <Link to="/new-arrivals" className="text-cugini-wine hover:text-cugini-dark font-medium">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
