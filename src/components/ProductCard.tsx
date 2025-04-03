
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  hoverImage?: string; // Optional second image for hover effect
}

const ProductCard = ({ id, name, price, image, category, hoverImage }: ProductCardProps) => {
  // Use default image as hover image if none provided
  const secondaryImage = hoverImage || image;
  
  return (
    <div className="product-card group">
      <Link to={`/product/${id}`} className="block">
        <div className="product-image-container relative">
          {/* Primary image */}
          <img 
            src={image} 
            alt={name} 
            className="product-image w-full h-[400px] object-cover transition-opacity duration-700 ease-in-out"
          />
          
          {/* Hover image with overlay */}
          <img 
            src={secondaryImage} 
            alt={`${name} hover`} 
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"
          />
          
          {/* Elegant frame border that appears on hover */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-cugini-golden opacity-0 group-hover:opacity-100 transition-all duration-500 m-3 pointer-events-none"></div>
          
          {/* Category label */}
          <div className="absolute bottom-0 left-0 bg-cugini-dark bg-opacity-80 text-white py-1 px-3 uppercase text-xs tracking-wider font-serif">{category}</div>
          
          {/* Add to cart button */}
          <div className="absolute bottom-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <button className="flex items-center justify-center py-2 px-3 bg-cugini-golden text-white hover:bg-cugini-dark transition-colors">
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span className="text-xs uppercase tracking-wider">Add to Cart</span>
            </button>
          </div>
        </div>
        
        {/* Product title in elegant style */}
        <div className="product-info mt-4 text-center">
          <h3 className="product-title font-serif uppercase tracking-wider text-sm text-cugini-dark">{name}</h3>
          <p className="product-price font-serif italic text-cugini-golden mt-1">${price.toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
