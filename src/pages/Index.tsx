
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import FeaturedCollections from '@/components/FeaturedCollections';
import BestSellers from '@/components/BestSellers';
import BrandStory from '@/components/BrandStory';
import InstagramFeed from '@/components/InstagramFeed';
import NewArrivals from '@/components/NewArrivals';
import Newsletter from '@/components/Newsletter';
import DiscoverCollection from '@/components/DiscoverCollection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroBanner />
        <FeaturedCollections />
        <BestSellers />
        <BrandStory />
        <DiscoverCollection />
        <NewArrivals />
        {/* <InstagramFeed /> */}
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
