
import React from 'react';
import { Link } from 'react-router-dom';

const DiscoverCollection = () => {
    return (
        <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
            <div className="absolute inset-0 w-full h-full z-0">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="/videos/VIDEO-2025-04-03-02-06-18.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex items-center">
                <div className="container-custom">
                    <div className="max-w-xl animate-fade-up">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">Tailored pants Collection</h1>
                        <p className="text-white/90 text-lg mb-8">TAILORED FORTHETIMELESS.</p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/shop" className="btn-vintage">Discover collection</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DiscoverCollection;
