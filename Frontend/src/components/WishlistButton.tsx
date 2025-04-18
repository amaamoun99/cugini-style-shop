import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchUserProfile, addToWishlist, removeFromWishlist } from '@/api/user';
import RegisterModal from './RegisterModal';

// Create a global cache object that persists during the session
// This helps maintain state between component mounts/unmounts
const wishlistCache: Record<string, boolean> = {};

interface WishlistButtonProps {
  productId: string;
  productName: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, productName }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState<boolean>(() => {
    // Initialize state from cache if available or fallback to localStorage
    return wishlistCache[productId] ?? 
      (JSON.parse(localStorage.getItem('userWishlist') || '{}')[productId] || 
      false);
  });
  const [wishLoading, setWishLoading] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Sync wishlist state on mount and when user changes
  useEffect(() => {
    // Save to localStorage whenever isWishlisted changes
    const updateLocalStorage = () => {
      const storedWishlist = JSON.parse(localStorage.getItem('userWishlist') || '{}');
      localStorage.setItem('userWishlist', JSON.stringify({
        ...storedWishlist,
        [productId]: isWishlisted
      }));
      // Also update session cache
      wishlistCache[productId] = isWishlisted;
    };

    // Don't save to localStorage if user isn't logged in
    if (user && isWishlisted !== undefined) {
      updateLocalStorage();
    }
  }, [isWishlisted, productId, user]);

  // Sync with server data
  useEffect(() => {
    let isMounted = true;
    
    const syncWishlist = async () => {
      if (!user) {
        if (isMounted) setIsWishlisted(false);
        return;
      }
      
      try {
        setWishLoading(true);
        const profileRes = await fetchUserProfile();
        // Fix the data structure access based on actual API response
        const wishlistItems = profileRes?.data?.user?.wishlist?.items || [];
        const productIds = wishlistItems.map((item: any) => item.productId);
        
        // Update both state and cache
        const isInWishlist = productIds.includes(productId);
        if (isMounted) {
          setIsWishlisted(isInWishlist);
          wishlistCache[productId] = isInWishlist;
        }

        // Update all cached items
        const wishlistMap: Record<string, boolean> = {};
        productIds.forEach((id: string) => {
          wishlistMap[id] = true;
        });
        localStorage.setItem('userWishlist', JSON.stringify(wishlistMap));
      } catch (err) {
        console.error('Error syncing wishlist:', err);
        if (isMounted) setIsWishlisted(false);
      } finally {
        if (isMounted) setWishLoading(false);
      }
    };
    
    syncWishlist();
    
    // Set up a polling interval for periodic updates
    const intervalId = setInterval(syncWishlist, 30000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [user, productId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setRegisterModalOpen(true);
      return;
    }
    
    setWishLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
        setIsWishlisted(false);
        toast({
          title: "Removed from Wishlist",
          description: productName,
        });
      } else {
        await addToWishlist(productId);
        setIsWishlisted(true);
        toast({
          title: "Added to Wishlist",
          description: productName,
        });
      }
    } catch (err: any) {
      toast({
        title: "Wishlist Error",
        description: err.response?.data?.message || err.message || "Could not update wishlist.",
        variant: "destructive",
      });
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={toggleWishlist}
        className={`absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-md hover:bg-cugini-golden hover:text-white transition-colors ${wishLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        disabled={wishLoading}
      >
        <Heart 
          className={`h-5 w-5 ${isWishlisted ? 'fill-cugini-golden text-cugini-golden' : 'text-gray-600'}`}
        />
        <span className="sr-only">{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</span>
      </button>
      
      {/* Register Modal for unauthenticated wishlist action */}
      <RegisterModal open={registerModalOpen} onOpenChange={setRegisterModalOpen} />
    </>
  );
};

export default WishlistButton;
