
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <LoadingScreen />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<ShopCatalog />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shop/men" element={<ShopCatalog />} />
          <Route path="/shop/women" element={<ShopCatalog />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Add other routes here */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
