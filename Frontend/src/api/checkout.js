import axiosInstance from "./axiosInstance";

export const fetchCheckoutSession = async () => {
  const res = await axiosInstance.post("/checkout/session");
  return res.data.data;
};

export const validateCheckout = async (shippingAddress) => {
  const res = await axiosInstance.post("/checkout/validate", {
    shippingAddress,
  });
  return res.data;
};

export const calculateTotal = async () => {
  const res = await axiosInstance.post("/checkout/calculate");
  return res.data.total;
};

export const placeOrder = async (shippingAddress, paymentMethod, email, phoneNumber, guestName) => {
    const res = await axiosInstance.post("/checkout/place-order", {
      shippingAddress,
      paymentMethod,
      email,
      phoneNumber,
      guestName,
    });
    return res.data.order;
  };
  
