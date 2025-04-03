
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
  thumbnail_url?: string;
}

const InstagramFeed = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fallback images in case the API fails or isn't set up
  const fallbackPosts = [
    {
      id: '1',
      media_url: 'https://images.unsplash.com/photo-1483118714900-540cf339fd46?q=80&w=2070&auto=format&fit=crop',
      permalink: 'https://www.instagram.com/cugini.eg/'
    },
    {
      id: '2',
      media_url: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?q=80&w=2070&auto=format&fit=crop',
      permalink: 'https://www.instagram.com/cugini.eg/'
    },
    {
      id: '3',
      media_url: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=1986&auto=format&fit=crop',
      permalink: 'https://www.instagram.com/cugini.eg/'
    },
    {
      id: '4',
      media_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
      permalink: 'https://www.instagram.com/cugini.eg/'
    },
    {
      id: '5',
      media_url: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80&w=1964&auto=format&fit=crop',
      permalink: 'https://www.instagram.com/cugini.eg/'
    },
    {
      id: '6',
      media_url: 'https://images.unsplash.com/photo-1622495966027-e0173192c728?q=80&w=1974&auto=format&fit=crop',
      permalink: 'https://www.instagram.com/cugini.eg/'
    },
    {
      id: '7',
      media_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070&auto=format&fit=crop',
      permalink: 'https://www.instagram.com/cugini.eg/'
    },
    {
      id: '8',
      media_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1974&auto=format&fit=crop',
      permalink: 'https://www.instagram.com/cugini.eg/'
    },
  ];

  useEffect(() => {
    // In a real implementation, this would fetch from Instagram Graph API
    // For now, we'll use the fallback posts after a brief loading delay
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // Simulating API fetch delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a production environment, you would fetch real data:
        // const response = await fetch('your-instagram-api-endpoint');
        // const data = await response.json();
        // setPosts(data.data);
        
        // For now, use fallback data
        setPosts(fallbackPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Instagram posts:', err);
        setError('Failed to load Instagram posts');
        setPosts(fallbackPosts); // Use fallbacks on error
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-title mb-8 italic">Follow Our Style</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="aspect-square bg-gray-100 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error(error);
  }

  // For mobile, we'll use a carousel
  const MobileView = () => (
    <Carousel
      opts={{ loop: true, align: "start" }}
      className="w-full md:hidden"
    >
      <CarouselContent>
        {posts.map((post) => (
          <CarouselItem key={post.id} className="basis-1/2 sm:basis-1/3">
            <InstagramPostCard post={post} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );

  // For desktop, we'll use a grid layout
  const DesktopView = () => (
    <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
      {posts.slice(0, 6).map((post) => (
        <InstagramPostCard key={post.id} post={post} />
      ))}
    </div>
  );

  // Instagram post card component
  const InstagramPostCard = ({ post }: { post: InstagramPost }) => (
    <a 
      href={post.permalink}
      target="_blank" 
      rel="noopener noreferrer"
      className="block group relative overflow-hidden aspect-square"
    >
      <img 
        src={post.media_url} 
        alt="Instagram post" 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-cugini-dark/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Instagram className="w-8 h-8 text-white" />
      </div>
    </a>
  );

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title mb-0 italic">Follow Our Style</h2>
          <Link 
            to="https://www.instagram.com/cugini.eg/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center text-cugini-dark hover:text-cugini-wine"
          >
            <Instagram className="w-5 h-5 mr-2" />
            <span>@cugini.eg</span>
          </Link>
        </div>
        
        <MobileView />
        <DesktopView />
        
        <div className="mt-10 text-center">
          <a 
            href="https://www.instagram.com/cugini.eg/" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn-vintage inline-block"
          >
            View More on Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
