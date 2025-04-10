
import React from 'react';
import ProductCard from './ProductCard';

interface BestSellerCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  hoverImage?: string;
}

const BestSellerCard = ({ id, name, price, image, category, hoverImage }: BestSellerCardProps) => {
  return (
    <div className="bg-[#ccb999] p-2">
      <ProductCard
        id={id}
        name={name}
        price={price}
        image={image}
        category={category}
        hoverImage={hoverImage}
      />
    </div>
  );
};

export default BestSellerCard;
