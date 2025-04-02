
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const InstagramFeed = () => {
  const instagramPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1483118714900-540cf339fd46?q=80&w=2070&auto=format&fit=crop',
      link: 'https://instagram.com'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?q=80&w=2070&auto=format&fit=crop',
      link: 'https://instagram.com'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=1986&auto=format&fit=crop',
      link: 'https://instagram.com'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
      link: 'https://instagram.com'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80&w=1964&auto=format&fit=crop',
      link: 'https://instagram.com'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1622495966027-e0173192c728?q=80&w=1974&auto=format&fit=crop',
      link: 'https://instagram.com'
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title mb-0">Follow Our Style</h2>
          <Link 
            to="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center text-cugini-dark hover:text-cugini-wine"
          >
            <Instagram className="w-5 h-5 mr-2" />
            <span>@cugini</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post) => (
            <a 
              href={post.link} 
              key={post.id} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group relative overflow-hidden aspect-square"
            >
              <img 
                src={post.image} 
                alt={`Instagram post ${post.id}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-cugini-dark/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
