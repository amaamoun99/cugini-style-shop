import React from "react";
import BestSellerCard from "./BestSellerCard";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const products = [
  {
    id: 1,
    name: "Black Borgia",
    price: 900.0,
    image: "/images/IMG-20250403-WA0018.jpg",
    category: "Men",
  },
  {
    id: 2,
    name: " SFORZA Beige pinstriped pants",
    price: 189.99,
    image: "/images/IMG-20250403-WA0013.jpg",
    category: "Women",
  },
  {
    id: 3,
    name: "PALLADIO Tailored pants",
    price: 249.99,
    image: "/images/IMG-20250403-WA0011.jpg",
    category: "Men",
  },
  {
    id: "1b17fbb5-b889-480e-b00f-a82abd703c61",
    name: "PALLADIO Tailored pants",
    price: 249.99,
    image: "/images/DSC00400.jpg",
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
