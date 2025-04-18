// src/api/orders.ts
import axiosInstance from "./axiosInstance";

export const fetchOrders = async () => {
  const response = await axiosInstance.get("/orders/admin");
  return response.data;
};

export const fetchOrderById = async (id) => {
  try {
    console.log('Fetching order with ID:', id);
    const response = await axiosInstance.get(`/orders/${id}`);
    console.log('Order API response:', response.data);
    // Return the order data from the success response
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching order:', error.response?.data || error.message);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  const response = await axiosInstance.put(`/orders/status/${id}`, {
    status,
  });
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axiosInstance.delete(`/orders/${id}`);
  return response.data;
};
