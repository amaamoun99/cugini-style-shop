
import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop')]">
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      <div className="absolute inset-0 flex items-center">
        <div className="container-custom">
          <div className="max-w-xl animate-fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">Discover Timeless Italian Elegance</h1>
            <p className="text-white/90 text-lg mb-8">Crafted with passion and steeped in heritage</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/men" className="btn-primary">Shop Men's Collection</Link>
              <Link to="/women" className="border border-white text-white px-6 py-2 hover:bg-white hover:text-cugini-dark transition-colors duration-300 inline-block">Shop Women's Collection</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
