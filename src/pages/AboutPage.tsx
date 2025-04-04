
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const AboutPage = () => {
  // Fade-in animation for content sections
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <video 
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="/videos/VIDEO-2025-04-03-02-05-06.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-serif mb-4">Our Story</h1>
              
              {/* Premium decorative line similar to Ralph Lauren */}
              <div className="flex justify-center items-center gap-2 mb-6">
                <div className="h-px w-12 bg-cugini-golden"></div>
                <div className="h-1 w-1 rounded-full bg-cugini-golden"></div>
                <div className="h-px w-24 bg-cugini-golden"></div>
                <div className="h-2 w-2 rounded-full bg-cugini-golden"></div>
                <div className="h-px w-24 bg-cugini-golden"></div>
                <div className="h-1 w-1 rounded-full bg-cugini-golden"></div>
                <div className="h-px w-12 bg-cugini-golden"></div>
              </div>
              
              <p className="text-white/90 text-lg md:text-xl italic font-serif max-w-xl mx-auto px-4">
                Where tradition meets timeless style
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-24">
              <motion.div 
                className="order-2 md:order-1"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="text-3xl md:text-4xl font-serif text-cugini-dark mb-6 italic">CUGINI</h2>
                <p className="text-cugini-dark/90 mb-6 text-lg leading-relaxed">
                  CUGINI was born from a legacy of craftsmanship, family, and timeless elegance. The name itself meaning "cousins" in Italian speaks to the heart of our brand. We are more than business partners; we are family, united by a shared dream to revive a tradition that started decades ago.
                </p>
                <p className="text-cugini-dark/90 mb-6 text-lg leading-relaxed">
                  Our grandfather was a master tailor, dedicating over 65 years to perfecting his craft. In the 1950s, he opened his own tailoring store, creating garments that weren't just clothes but pieces of art made to last, made with love. His passion for fine tailoring ran deep, but as time passed, no one in our family continued his profession. That's where we stepped in.
                </p>
              </motion.div>
              <motion.div 
                className="order-1 md:order-2"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <img 
                  src="/images/DSC00427.jpg" 
                  alt="CUGINI craftsmanship" 
                  className="w-full h-[500px] object-cover shadow-lg"
                />
              </motion.div>
            </div>

            {/* Decorative separator */}
            <div className="flex items-center justify-center my-16">
              <Separator className="w-1/4 bg-cugini-golden/30" />
              <div className="mx-4">
                <img 
                  src="/images/DSC00421.jpg" 
                  alt="Decorative element" 
                  className="w-16 h-16 object-cover rounded-full border-2 border-cugini-golden" 
                />
              </div>
              <Separator className="w-1/4 bg-cugini-golden/30" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-24">
              <motion.div 
                className="order-1"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <div className="relative">
                  <img 
                    src="/images/DSC00402.jpg" 
                    alt="Italian craftsmanship" 
                    className="w-full h-[500px] object-cover shadow-lg"
                  />
                  <div className="absolute -bottom-6 -right-6 border-2 border-cugini-golden w-40 h-40 hidden md:block"></div>
                </div>
              </motion.div>
              <motion.div 
                className="order-2"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <p className="text-cugini-dark/90 mb-6 text-lg leading-relaxed">
                  CUGINI is our way of honoring his legacy, bringing back the elegance and precision of true Italian tailoring. Every piece we create is designed with the same dedication to quality, simplicity, and love that he poured into his work. Our tailored pants are crafted for those who appreciate refinement and timeless style because true elegance never fades.
                </p>
                <p className="text-cugini-dark/90 mb-6 text-lg leading-relaxed">
                  Our slogan, "TAILORED FOR THE TIMELESS," reflects everything we stand for. We don't follow fleeting trends; we craft garments that transcend time. Every stitch, every cut, every detail is made with purpose just like our grandfather would have done.
                </p>
              </motion.div>
            </div>

            {/* Video Section */}
            <motion.div 
              className="my-24"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <video 
                  className="w-full h-[70vh] object-cover"
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                >
                  <source src="/videos/man walking (1).mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center p-4">
                  <p className="text-white text-3xl md:text-4xl font-serif italic">
                    "TAILORED FOR THE TIMELESS"
                  </p>
                  <div className="mt-6 flex items-center gap-2">
                    <div className="h-px w-14 bg-cugini-golden"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-cugini-golden"></div>
                    <div className="h-px w-14 bg-cugini-golden"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              <motion.div 
                className="order-2 md:order-1"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <p className="text-cugini-dark/90 mb-6 text-lg leading-relaxed">
                  At CUGINI, family is at the core of everything we do. From the hands that design to the hearts that wear our pieces, our mission is to create clothing that feels like home luxurious, elegant, and filled with love.
                </p>
                <p className="text-cugini-dark/90 mb-8 text-lg leading-relaxed">
                  Welcome to CUGINI. Where tradition meets timeless style.
                </p>
                
                {/* Signature-like ending */}
                <div className="relative">
                  <img 
                    src="/images/DSC00400.jpg" 
                    alt="CUGINI signature" 
                    className="w-full max-w-[200px] object-cover" 
                  />
                  <p className="text-cugini-dark/60 mt-2 italic text-sm">Founders of CUGINI</p>
                </div>
              </motion.div>
              <motion.div 
                className="order-1 md:order-2"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <img 
                      src="/images/DSC00479.jpg" 
                      alt="CUGINI craftsmanship" 
                      className="w-full h-[180px] object-cover shadow-md"
                    />
                    <img 
                      src="/images/DSC00480.jpg" 
                      alt="CUGINI heritage" 
                      className="w-full h-[240px] object-cover shadow-md"
                    />
                  </div>
                  <div>
                    <img 
                      src="/images/DSC00409.jpg" 
                      alt="CUGINI legacy" 
                      className="w-full h-full object-cover shadow-md"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
