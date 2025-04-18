
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, ShoppingCart, Search, User, UserPlus, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount } = useCart();
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="block md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-serif font-medium text-cugini-dark">CUGINI</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="nav-link">Home</Link>
            {/* <Link to="/shop/men" className="nav-link">Men</Link>
            <Link to="/shop/women" className="nav-link">Women</Link> */}
            <Link to="/shop" className="nav-link">Shop Catalog</Link>
            <Link to="/about" className="nav-link">Our Story</Link>
            {/* <Link to="/new-arrivals" className="nav-link">New Arrivals</Link>
            <Link to="/sale" className="nav-link">Sale</Link> */}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSearch}
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-cugini-dark" />
            </Button> */}
            {/* <Link to="/wishlist">
              <Button 
                variant="ghost" 
                size="icon"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5 text-cugini-dark" />
              </Button>
            </Link> */}
            {/* <Link to="/account">
              <Button 
                variant="ghost" 
                size="icon"
                aria-label="Account"
              >
                <User className="h-5 w-5 text-cugini-dark" />
              </Button>
            </Link> */}
            {/* User/Register Icon */}
            {user ? (
              <Link to="/profile">
                <Button variant="ghost" size="icon" aria-label="Profile">
                  <User className="h-5 w-5 text-cugini-dark" />
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button variant="ghost" size="icon" aria-label="Register">
                  <UserPlus className="h-5 w-5 text-cugini-dark" />
                </Button>
              </Link>
            )}
            <Link to="/cart">
              <Button 
                variant="ghost" 
                size="icon"
                aria-label="Cart"
                className="relative"
              >
                <ShoppingCart className="h-5 w-5 text-cugini-dark" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cugini-golden text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar (conditionally visible) */}
        {isSearchOpen && (
          <div className="py-3 border-t border-gray-200 animate-fade-in">
            <form className="flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border-0 focus:ring-0 focus:outline-none bg-transparent text-cugini-dark"
                autoFocus
              />
              <Button 
                variant="ghost"
                size="icon"
                onClick={toggleSearch}
                aria-label="Close search"
              >
                <X className="h-5 w-5 text-cugini-dark" />
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 animate-fade-in">
          <div className="container py-4 flex justify-between items-center border-b">
            <h2 className="text-xl font-serif">Menu</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="container py-8 flex flex-col space-y-4">
            <Link to="/" className="nav-link text-xl py-2 border-b border-gray-100" onClick={toggleMenu}>Home</Link>
            <Link to="/shop" className="nav-link text-xl py-2 border-b border-gray-100" onClick={toggleMenu}>Shop All</Link>
            <Link to="/about" className="nav-link text-xl py-2 border-b border-gray-100" onClick={toggleMenu}>our story</Link>
            <Link to="/cart" className="nav-link text-xl py-2 border-b border-gray-100" onClick={toggleMenu}>Cart</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
