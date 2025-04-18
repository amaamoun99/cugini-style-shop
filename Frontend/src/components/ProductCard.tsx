import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import QuickViewModal from './QuickViewModal';
import WishlistButton from './WishlistButton';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  hoverImage?: string;
  sizes?: string[];
}



const ProductCard = ({ id, name, price, image, category, hoverImage, sizes }: ProductCardProps) => {
  console.log("ProductCard Props:", { id, name, price, image, category, hoverImage, sizes });
  console.log("VITE_BASE_URL:", import.meta.env.VITE_BASE_URL);
  // Use default image as hover image if none provided
  const secondaryImage = hoverImage || image;
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };
  
  return (
    <div className="product-card group relative" id="product-grid">
      <Link to={`/product/${id}`} className="block">
        <div className="product-image-container relative overflow-hidden">
          {/* Primary image */}
          <img 
            src={`${import.meta.env.VITE_BASE_URL}${image}`}
            alt={name}
            loading="lazy"
            className="product-image w-full h-[500px] object-cover transition-opacity duration-700 ease-in-out"
          />
          
          {/* Hover image with overlay */}
          <img 
            src={`${import.meta.env.VITE_BASE_URL}${secondaryImage}`}
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
            <button
              onClick={handleQuickView}
              className="bg-cugini-dark hover:bg-cugini-golden text-white text-xs uppercase tracking-wider py-2 px-4 transition-colors w-full flex items-center justify-center"
            >
              <Eye className="mr-2 h-4 w-4" /> Quick View
            </button>
          </div>
        </div>
      </Link>
      
      {/* Use the separate WishlistButton component */}
      <WishlistButton productId={id} productName={name} />
      
      {/* Quick View Modal */}
      <QuickViewModal
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        productId={id}
      />
    </div>
  );
};

export default ProductCard;