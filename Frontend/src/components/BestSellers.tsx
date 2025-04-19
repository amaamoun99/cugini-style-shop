import React from "react";
import BestSellerCard from "./BestSellerCard";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";



import { useEffect, useState } from "react";
import { getAllProducts } from "@/api/product";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts.filter((p) => p.isBestSeller));
      } catch (err) {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);
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
                  image={product.images?.[0]?.url}
                  category={product.category?.name || ""}
                  hoverImage={product.images?.[0]?.url || product.images?.[0]?.url}
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
