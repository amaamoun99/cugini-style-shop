
import React from 'react';
import { Link } from 'react-router-dom';

const collections = [
  {
    id: 1,
    title: 'Italian Tailoring',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop',
    link: '/collections/italian-tailoring'
  },
  {
    id: 2,
    title: 'Vintage Summer Styles',
    image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?q=80&w=1974&auto=format&fit=crop',
    link: '/collections/vintage-summer'
  },
  {
    id: 3,
    title: 'Accessories',
    image: 'https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=1970&auto=format&fit=crop',
    link: '/collections/accessories'
  }
];

const FeaturedCollections = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="section-title text-center">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {collections.map((collection) => (
            <Link 
              key={collection.id} 
              to={collection.link} 
              className="group relative block h-80 overflow-hidden"
            >
              <img 
                src={collection.image} 
                alt={collection.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end p-6">
                <h3 className="text-xl font-serif text-white">{collection.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
