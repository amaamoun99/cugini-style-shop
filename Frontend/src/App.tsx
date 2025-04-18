import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ShopCatalog from "./pages/ShopCatalog";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import AboutPage from "./pages/AboutPage";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import OrderCompletedPage from "./pages/OrderCompletedPage";
import OrderManagement from "./pages/OrderManagement";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage";
import RegisterModal from "./components/RegisterModal"; // For future use in modals
import { SpeedInsights } from "@vercel/speed-insights/react";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <SpeedInsights />
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" />
          <LoadingScreen />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<ShopCatalog />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/shop/men" element={<ShopCatalog />} />
              <Route path="/shop/women" element={<ShopCatalog />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/order-completed" element={<OrderCompletedPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* User Registration & Profile */}
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProtectedRoute requireAdmin={false}><UserProfilePage /></ProtectedRoute>} />

              {/* Protected Admin Routes */}
              <Route 
                path="/orders" 
                element={<ProtectedRoute requireAdmin={true}><OrderManagement /></ProtectedRoute>} 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
