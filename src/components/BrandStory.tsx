
import React from 'react';
import { Link } from 'react-router-dom';

const BrandStory = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1556717711-450e3664d412?q=80&w=1980&auto=format&fit=crop" 
              alt="Cugini craftsmanship" 
              className="w-full h-[500px] object-cover"
            />
          </div>
          <div className="md:pl-8">
            <h2 className="section-title">Our Story</h2>
            <p className="text-cugini-dark mb-6">
              Founded in the heart of Milan, Cugini brings together the traditional craftsmanship 
              of Italian tailoring with vintage-inspired designs. Our pieces are created with 
              a dedication to quality materials, timeless silhouettes, and the subtle details 
              that elevate everyday fashion.
            </p>
            <p className="text-cugini-dark mb-8">
              Each Cugini garment tells a story of heritage, passion, and the art of slow fashion, 
              offering you pieces that transcend trends and become cherished parts of your wardrobe for years to come.
            </p>
            <Link to="/about" className="btn-primary">Discover Our Heritage</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
