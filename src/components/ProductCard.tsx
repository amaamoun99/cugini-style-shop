
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
  return (
    <div className="product-card">
      <Link to={`/product/${id}`} className="block">
        <div className="product-image-container">
          <img 
            src={image} 
            alt={name} 
            className="product-image w-full h-[400px] object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 backdrop-blur-sm">
            <button className="flex items-center justify-center w-full py-2 bg-cugini-dark text-white hover:bg-cugini-wine transition-colors">
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
        <div className="product-info">
          <p className="text-xs uppercase tracking-wider text-cugini-wine mb-1">{category}</p>
          <h3 className="product-title">{name}</h3>
          <p className="product-price">${price.toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
