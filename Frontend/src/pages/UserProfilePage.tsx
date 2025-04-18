import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { fetchUserProfile, fetchUserOrders, removeFromWishlist } from "@/api/user";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/api/axiosInstance";

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  productId?: string; // For wishlist items that contain productId
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  items?: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}

const UserProfilePage: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [fetchingWishlist, setFetchingWishlist] = useState(false);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  // Remove product from wishlist
  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user) return;
    setRemovingId(productId);
    try {
      await removeFromWishlist(productId);
      setWishlist(wishlist.filter(item => 
        (item.productId && item.productId !== productId) || 
        (item.id !== productId)
      ));
      toast({
        title: "Success",
        description: "Item removed from wishlist",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message || "Failed to update wishlist",
        variant: "destructive",
      });
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user profile with wishlist data from enhanced /me endpoint
        const profileRes = await fetchUserProfile();
        
        if (profileRes.status === "success" && profileRes.data?.user) {
          // Process wishlist data if available
          if (profileRes.data.user.wishlist?.items?.length > 0) {
            const wishlistItems = profileRes.data.user.wishlist.items.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              name: item.product.name,
              price: item.product.price,
              images: item.product.images?.map((img: any) => img.url) || []
            }));
            setWishlist(wishlistItems);
          } else {
            setWishlist([]);
          }
          
          // Fetch order history data
          setFetchingOrders(true);
          try {
            const ordersRes = await fetchUserOrders();
            if (ordersRes.status === "success" && Array.isArray(ordersRes.data)) {
              setOrders(ordersRes.data);
            } else {
              setOrders([]);
            }
          } catch (err: any) {
            console.error("Error fetching orders:", err);
            toast({
              title: "Error",
              description: "Failed to load order history",
              variant: "destructive",
            });
          } finally {
            setFetchingOrders(false);
          }
        }
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        setError(err.response?.data?.message || err.message || "Failed to load profile");
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user?.id, toast]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-serif mb-8 text-cugini-dark">My Profile</h1>
        {/* Wishlist Section */}
        <section className="mb-10">
          <h2 className="text-xl font-serif mb-4 text-cugini-golden">Wishlist</h2>
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            {fetchingWishlist ? (
              <p className="text-gray-500">Loading wishlist items...</p>
            ) : wishlist.length === 0 ? (
              <p className="text-gray-500">Your wishlist is empty.</p>
            ) : (
              <ul className="divide-y">
                {wishlist.map((product) => (
                  <li key={product.id || product.productId} className="flex items-center py-2">
                    {product.images && product.images[0] && (
                      <img 
                        src={`${import.meta.env.VITE_BASE_URL}${product.images[0]}`}  
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded mr-4" 
                      />
                    )}
                    <span className="font-serif flex-1">{product.name}</span>
                    <span className="text-cugini-golden ml-4">${parseFloat(product.price.toString()).toFixed(2)}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-4"
                      onClick={() => handleRemoveFromWishlist(product.productId || product.id)}
                      disabled={removingId === (product.productId || product.id)}
                    >
                      {removingId === (product.productId || product.id) ? "Removing..." : "Remove"}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Orders */}
        <section>
          <h2 className="text-xl font-serif mb-4 text-cugini-golden">Orders</h2>
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            {fetchingOrders ? (
              <div className="py-8 flex justify-center">
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">You have not placed any orders yet.</p>
              </div>
            ) : (
              <ul className="divide-y">
                {orders.map((order) => (
                  <li key={order.id} className="flex flex-col py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <span className="font-serif text-lg text-cugini-dark">Order #{order.id.slice(-6)}</span>
                        <div className="flex items-center mt-1">
                          <span className="text-gray-500 text-sm mr-3">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                            {order.status === 'pending' ? '🕒' : 
                             order.status === 'processing' ? '⚙️' : 
                             order.status === 'shipped' ? '🚚' : 
                             order.status === 'delivered' ? '✅' : 
                             order.status === 'cancelled' ? '❌' : ''}  
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-cugini-golden text-lg mt-2 sm:mt-0">
                        ${parseFloat(order.totalAmount?.toString() || '0').toFixed(2)}
                      </span>
                    </div>
                    
                    {order.items && order.items.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-200">
                        <ul className="space-y-2">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center py-1">
                              <div className="flex-1">
                                <span className="font-medium">{item.product.name}</span>
                                <span className="text-gray-500 text-sm ml-2">× {item.quantity}</span>
                              </div>
                              <span className="text-cugini-dark">
                                ${parseFloat(item.product.price.toString()).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        {/* Optionally, add logout button or edit profile */}
        <div className="mt-8">
          <Button variant="outline" onClick={async () => {
            setLogoutLoading(true);
            await Promise.resolve(logout());
            setLogoutLoading(false);
            navigate("/");
          }} disabled={logoutLoading}>
            {logoutLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
