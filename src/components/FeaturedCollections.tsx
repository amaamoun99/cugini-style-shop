
import React from 'react';
import { Link } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";

const collections = [
  {
    id: 1,
    title: 'Men',
    video: "/videos/man walking (1).mp4",
    image: "/images/DSC00414.jpg",
    link: '/shop/men'
  },
  
  {
    id: 2,
    title: 'Women',
    video: "/videos/CUGINI(SHRK)xG (1).mp4",
    image: "/images/IMG-20250403-WA0009.jpg",
    link: '/shop/women'
  }
];

const FeaturedCollections = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-cugini-dark tracking-wider mb-6">Featured Collections</h2>
          
          {/* Premium decorative line similar to Ralph Lauren */}
          <div className="flex justify-center items-center gap-2 mb-16  ">
            <div className="h-px w-12 bg-cugini-golden"></div>
            <div className="h-1 w-1 rounded-full bg-cugini-golden"></div>
            <div className="h-px w-24 bg-cugini-golden"></div>
            <div className="h-2 w-2 rounded-full bg-cugini-golden"></div>
            <div className="h-px w-24 bg-cugini-golden"></div>
            <div className="h-1 w-1 rounded-full bg-cugini-golden"></div>
            <div className="h-px w-12 bg-cugini-golden"></div>
          </div>
          
          <p className="text-lg font-serif text-cugini-dark/80 italic tracking-wide max-w-2xl mx-auto">
            Destinations for timeless style Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, beatae! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, quasi.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={collection.link}
              className="group block"
            >
              <Card className="overflow-hidden border-cugini-taupe/30 relative">
                <AspectRatio ratio={3 / 4} className="bg-muted">
                  <div className="relative w-full h-full">
                    {/* Video that shows by default */}
                    <video
                      src={collection.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Image that appears on hover */}
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />

                    {/* Decorative custom-shaped border that appears on hover - now with custom shape that curves at corners */}
                    <div className="absolute inset-10 border-0 group-hover:border-[1px] border-cugini-golden opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-500">
                      {/* Corner accents for the Ralph Lauren style border */}
                      <div className="absolute -top-[5px] -left-[5px] w-4 h-4 border-t border-l border-cugini-golden group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                      <div className="absolute -top-[5px] -right-[5px] w-4 h-4 border-t border-r border-cugini-golden group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                      <div className="absolute -bottom-[5px] -left-[5px] w-4 h-4 border-b border-l border-cugini-golden group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                      <div className="absolute -bottom-[5px] -right-[5px] w-4 h-4 border-b border-r border-cugini-golden group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex items-end p-8">
                      <div className="transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                        <h3 className="text-3xl font-serif text-white uppercase tracking-wide">{collection.title}</h3>
                        <div className="h-0.5 w-0 group-hover:w-full bg-cugini-golden mt-2 transition-all duration-700"></div>
                      </div>
                    </div>
                  </div>
                </AspectRatio>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
