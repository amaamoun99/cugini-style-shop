
import React from 'react';
import ProductCard from './ProductCard';

const products = [
  {
    id: 1,
    name: 'Tailored Wool Blazer',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1760&auto=format&fit=crop',
    category: 'Men'
  },
  {
    id: 2,
    name: 'Linen Sundress',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1976&auto=format&fit=crop',
    category: 'Women'
  },
  {
    id: 3,
    name: 'Leather Oxford Shoes',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1972&auto=format&fit=crop',
    category: 'Men'
  },
  {
    id: 4,
    name: 'Cashmere Scarf',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=1974&auto=format&fit=crop',
    category: 'Accessories'
  }
];

const BestSellers = () => {
  return (
    <section className="py-16 bg-cugini-gray/20">
      <div className="container-custom">
        <h2 className="section-title text-center">Bestsellers</h2>
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

export default BestSellers;
