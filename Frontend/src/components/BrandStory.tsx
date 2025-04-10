
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightCircle } from 'lucide-react';

const BrandStory = () => {
  return (
    <section className="py-16 bg-cugini-taupe/10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 border border-cugini-golden/30 rotate-12 opacity-70"></div>
      <div className="absolute bottom-10 -left-10 w-48 h-48 border border-cugini-golden/20 -rotate-12"></div>
      
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <img 
              src="/images/DSC00427.jpg" 
              alt="Cugini craftsmanship" 
              className="w-full h-[700px] object-cover shadow-xl"
            />
            <div className="absolute inset-0 border-[4px] border-cugini-golden/20 -translate-x-4 translate-y-4 z-[-1]"></div>
          </div>
          <div className="md:pl-8 relative z-10">
            <h2 className="font-serif text-4xl md:text-5xl text-cugini-dark mb-8 relative">
              Our Story
              <div className="h-1 w-24 bg-cugini-golden absolute -bottom-3 left-0"></div>
            </h2>
            <p className="text-cugini-dark mb-6 font-serif italic text-lg">
              CUGINI, meaning "cousins" in Italian, is more than a brand it's a legacy. Inspired by our grandfather, a master tailor for over 65 years, we set out to revive the art of timeless Italian craftsmanship.
            </p>
            <p className="text-cugini-dark mb-10 font-serif italic text-lg">
              In the 1950s, he built a tailoring house where every stitch was made with precision and love. Though no one in our family continued his craft, we refused to let it fade. CUGINI brings his passion back to life, crafting high-quality, tailored pants designed for those who appreciate effortless elegance.
            </p>
            <Link 
              to="/about" 
              className="group inline-flex items-center gap-3 relative overflow-hidden font-serif text-lg"
            >
              <span className="relative z-10 text-cugini-dark group-hover:text-cugini-golden transition-colors duration-300">
                Discover Our Heritage
              </span>
              <ArrowRightCircle className="text-cugini-golden h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-cugini-golden group-hover:w-full transition-all duration-500"></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
