import React from "react";
import BestSellerCard from "./BestSellerCard";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const products = [
  {
    id: "977b2a15-ecb6-4f25-b7ef-de0fd181bb00",
    name: "paladio forza",
    price: 900.0,
    image: "/uploads/1744894255850-DSC00411.jpg",
    category: "Men",
  },
];

const BestSellers = () => {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: true })]
  );

  return (
    <section className="bestsellers-section">
      <div className="bestsellers-overlay"></div>
      <div className="container-custom bestseller-content">
        <h2 className="section-title text-center text-white mb-10 italic">
          I Nostri Bestsellers
        </h2>

        <div className="carousel-container" ref={emblaRef}>
          <div className="flex">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-3"
              >
                <BestSellerCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
