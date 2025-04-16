// src/api/cart.ts
import axiosInstance from "./axiosInstance";

export const fetchCart = async () => {
  const res = await axiosInstance.get("/cart");
  console.log(res);
  return res.data;
};

export const addCartItem = async (variantId, quantity) => {
  const res = await axiosInstance.post("/cart/items", { variantId, quantity });
  return res.data.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const res = await axiosInstance.put(`/cart/items/${itemId}`, { quantity });
  return res.data.data;
};

export const deleteCartItem = async (itemId) => {
  const res = await axiosInstance.delete(`/cart/items/${itemId}`);
  return res.data.data;
};

export const clearCart = async () => {
  const res = await axiosInstance.delete("/cart");
  return res.data.data;
};
