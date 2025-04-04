
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';

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
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };
  
  return (
    <div className="product-card group relative" id="product-grid">
      <Link to={`/product/${id}`} className="block">
        <div className="product-image-container relative overflow-hidden">
          {/* Primary image */}
          <img 
            src={image} 
            alt={name} 
            loading="lazy"
            className="product-image w-full h-[400px] object-cover transition-opacity duration-700 ease-in-out"
          />
          
          {/* Hover image with overlay */}
          <img 
            src={secondaryImage} 
            alt={`${name} hover`} 
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"
          />
          
          {/* Category label */}
          <div className="absolute bottom-0 left-0 bg-cugini-dark bg-opacity-80 text-white py-1 px-3 uppercase text-xs tracking-wider font-serif">{category}</div>
        </div>
        
        {/* Product title in elegant style */}
        <div className="product-info mt-4 text-center">
          <h3 className="product-title font-serif uppercase tracking-wider text-sm text-cugini-dark">{name}</h3>
          <p className="product-price font-serif italic text-cugini-golden mt-1">${price.toFixed(2)}</p>
          
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-cugini-dark hover:bg-cugini-golden text-white text-xs uppercase tracking-wider py-2 px-4 transition-colors w-full">
              View Details
            </button>
          </div>
        </div>
      </Link>
      
      {/* Wishlist button */}
      <button 
        onClick={toggleWishlist} 
        className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-md hover:bg-cugini-golden hover:text-white transition-colors"
        aria-label="Add to wishlist"
      >
        <Heart 
          className={`h-5 w-5 ${isWishlisted ? 'fill-cugini-golden text-cugini-golden' : 'text-gray-600'}`} 
        />
      </button>
    </div>
  );
};

export default ProductCard;
