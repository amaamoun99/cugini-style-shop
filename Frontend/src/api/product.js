import axiosInstance from "./axiosInstance";

export const getAllProducts = async () => {
  const res = await axiosInstance.get("/products");
  return res.data.data.data;
};

export const getProductById = async (id) => {
    const res = await axiosInstance.get(`/products/${id}`);
    // Make sure to return the most deeply nested "data" which contains the product
    return res.data.data.data;
  };