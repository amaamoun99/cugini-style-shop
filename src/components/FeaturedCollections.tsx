
import React from 'react';
import { Link } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";

const collections = [
  {
    id: 1,
    title: 'Men',
    video: "https://video.twimg.com/amplify_video/1496259005577752582/vid/720x900/2LaF8n8p1LvG4IZ0.mp4?tag=14",
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1974&auto=format&fit=crop",
    link: '/collections/men'
  },
  {
    id: 2,
    title: 'Women',
    video: "https://video.twimg.com/amplify_video/1496267383149801472/vid/720x900/jAkFEoxfXV5zwfng.mp4?tag=14",
    image: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=1964&auto=format&fit=crop",
    link: '/collections/women'
  }
];

const FeaturedCollections = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="section-title text-center">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-5xl mx-auto">
          {collections.map((collection) => (
            <Link 
              key={collection.id} 
              to={collection.link} 
              className="group block"
            >
              <Card className="overflow-hidden border-cugini-taupe/30 relative">
                <AspectRatio ratio={3/4} className="bg-muted">
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
                    
                    {/* Decorative border that appears on hover */}
                    <div className="absolute inset-0 border-0 group-hover:border-4 border-cugini-golden opacity-0 group-hover:opacity-100 m-4 pointer-events-none transition-all duration-500"></div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex items-end p-8">
                      <div className="transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                        <h3 className="text-3xl font-serif text-white">{collection.title}</h3>
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
