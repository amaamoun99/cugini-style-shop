
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-cugini-dark text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <h3 className="text-xl font-serif mb-4">CUGINI</h3>
            <p className="text-gray-300 mb-4">Timeless Italian-inspired fashion, crafting pieces that blend vintage elegance with modern sensibility.</p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-4 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/men" className="hover:text-white transition-colors">Men</Link></li>
              <li><Link to="/women" className="hover:text-white transition-colors">Women</Link></li>
              <li><Link to="/accessories" className="hover:text-white transition-colors">Accessories</Link></li>
              <li><Link to="/sale" className="hover:text-white transition-colors">Sale</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-lg font-medium mb-4 uppercase tracking-wider">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-medium mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@cugini.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>123 Fashion Street,<br /> Milan, Italy 20123</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Cugini. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Link to="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
