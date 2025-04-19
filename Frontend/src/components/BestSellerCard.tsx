
import React from 'react';
import ProductCard from './ProductCard';

interface BestSellerCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  hoverImage?: string;
}

const BestSellerCard = ({ id, name, price, image, category, hoverImage }: BestSellerCardProps) => {
  return (
    <div className="bg-[#ffffff] p-2">
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
