
import React from 'react';
import ProductCard from './ProductCard';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const products = [
  {
    id: 1,
    name: 'Tailored Wool Blazer',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1760&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=1974&auto=format&fit=crop',
    category: 'Men'
  },
  {
    id: 2,
    name: 'Linen Sundress',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1976&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1974&auto=format&fit=crop',
    category: 'Women'
  },
  {
    id: 3,
    name: 'Leather Oxford Shoes',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1972&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?q=80&w=1974&auto=format&fit=crop',
    category: 'Men'
  },
  {
    id: 5,
    name: 'Italian Silk Tie',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1598532213298-8540061fea51?q=80&w=1976&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1591741535018-d592fe0bf28b?q=80&w=1974&auto=format&fit=crop',
    category: 'Men'
  },
  {
    id: 7,
    name: 'Wool Sweater',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1434510423563-c7e99bbc5dfd?q=80&w=1974&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1580331452209-c484408cf663?q=80&w=1974&auto=format&fit=crop',
    category: 'Women'
  },
  {
    id: 8,
    name: 'Designer Dress',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1973&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1974&auto=format&fit=crop',
    category: 'Women'
  }
];

const BestSellers = () => {
  const [emblaRef] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    skipSnaps: false,
  }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);

  return (
    <section className="bestsellers-section">
      <div className="bestsellers-overlay"></div>
      <div className="container-custom bestseller-content">
        <h2 className="section-title text-center text-white mb-10 italic">I Nostri Bestsellers</h2>
        
        <div className="carousel-container" ref={emblaRef}>
          <div className="flex">
            {products.map((product) => (
              <div key={product.id} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-3">
                <div className="bg-white p-2">
                  <ProductCard 
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    hoverImage={product.hoverImage}
                    category={product.category}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
