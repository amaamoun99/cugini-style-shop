
import React from 'react';
import { ArrowRight } from 'lucide-react';

const CatalogHero = () => {
  return (
    <div className="relative bg-gray-100 py-16 md:py-24">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="/images/DSC00411.jpg" 
          alt="Catalog Hero" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
      </div>
      
      <div className="container-custom relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-cugini-dark mb-4">
          Timeless Italian Elegance
        </h1>
        <p className="text-lg md:text-xl font-serif italic text-cugini-dark/80 max-w-2xl mx-auto mb-8">
          Shop Our Limited Pieces – Crafted with passion and steeped in heritage
        </p>
        
        <a 
          href="#product-grid" 
          className="inline-flex items-center px-8 py-3 bg-cugini-golden text-white hover:bg-cugini-dark transition-colors"
        >
          Explore Now <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default CatalogHero;
