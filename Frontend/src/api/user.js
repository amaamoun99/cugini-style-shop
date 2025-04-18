import axiosInstance from "./axiosInstance";

// Fetch current user profile (with wishlist and orders)
export const fetchUserProfile = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

// Fetch user's orders
export const fetchUserOrders = async () => {
  const response = await axiosInstance.get("/users/orders");
  return response.data;
};

// Update user's wishlist
export const updateUserWishlist = async (userId, wishlist) => {
  const response = await axiosInstance.patch(`/users/${userId}`, { wishlist });
  return response.data;
};

// Add product to wishlist
export async function addToWishlist(productId) {
  // Now sends productId (not variantId)
  const response = await axiosInstance.post("/users/wishlist", { productId });
  return response.data;
};

// Remove product from wishlist
export async function removeFromWishlist(productId) {
  const response = await axiosInstance.post("/users/wishlist/remove", { productId });
  return response.data;
};
