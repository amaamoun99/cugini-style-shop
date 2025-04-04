
import React from 'react';
import { Link } from 'react-router-dom';

const BrandStory = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <img 
              src="/images/DSC00427.jpg" 
              alt="Cugini craftsmanship" 
              className="w-full h-[700px] object-cover"
            />
          </div>
          <div className="md:pl-8">
            <h2 className="section-title">Our Story</h2>
            <p className="text-cugini-dark mb-6">
              CUGINI, meaning "cousins" in Italian, is more than a brand it's a legacy. Inspired by our grandfather, a master tailor for over 65 years, we set out to revive the art of timeless Italian craftsmanship.
            </p>
            <p className="text-cugini-dark mb-8">
              In the 1950s, he built a tailoring house where every stitch was made with precision and love. Though no one in our family continued his craft, we refused to let it fade. CUGINI brings his passion back to life, crafting high-quality, tailored pants designed for those who appreciate effortless elegance.
            </p>
            <Link to="/about" className="btn-vintage">Discover Our Heritage</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
