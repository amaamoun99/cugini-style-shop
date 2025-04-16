
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
import { SpeedInsights } from "@vercel/speed-insights/react";
