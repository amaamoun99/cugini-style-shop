import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Clock, 
  Check, 
  X, 
  ChevronDown, 
  Phone,
  Mail
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import OrderTable from "@/components/OrderTable";
import { toast } from "@/hooks/use-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchOrders } from "../api/orders.js"; // Import the API function
import { updateOrderStatus } from "../api/orders.js"; // Import the API function
// Type definitions for order data based on backend response
type Product = {
  id: string;
  name: string;
  // Add other product fields as needed
};

type Variant = {
  id: string;
  product: Product;
  // Add other variant fields as needed
};

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  variant: Variant;
};

type Address = {
  id?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type Payment = {
  id?: string;
  method: string;
  status: string;
  paidAt: string | null; // Adjust to handle ISO date strings
};

type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
} | null;

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

type Order = {
  id: string;
  userId: string | null;
  guestEmail: string | null;
  guestName: string | null;
  guestPhone: string | null;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string; // ISO date string
  address: Address;
  payment: Payment;
  user: User;
  orderItems: OrderItem[];
};

// Status options for filtering
const statusOptions = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" }
];

const OrderManagement = () => {
  // State for orders data
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all"); // all, email, phone
  
  // State for status filter
  const [statusFilter, setStatusFilter] = useState("all");
  
  // State for sorting
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Stats for summary cards
  const [summaryStats, setSummaryStats] = useState([
    { title: "All Orders", value: 0, icon: ShoppingBag, color: "bg-[#cbc2bb]/20 text-[#1a0c0c]" },
    { title: "Pending", value: 0, icon: Clock, color: "bg-[#b3a99b]/20 text-[#b3a99b]" },
    { title: "Processing", value: 0, icon: Clock, color: "bg-[#611c20]/20 text-[#611c20]" },
    { title: "Completed", value: 0, icon: Check, color: "bg-[#cbc2bb]/20 text-[#cbc2bb]" },
    { title: "Cancelled", value: 0, icon: X, color: "bg-[#1a0c0c]/20 text-[#1a0c0c]" }
  ]);

  // Fetch orders data
  useEffect(() => {
    const getOrders = async () => {
      try {
        setIsLoading(true);
        const result = await fetchOrders();
        console.log("result",result); // Debugging line
        if (result.status === "success") {
          // Process orders to match your data structure
          const processedOrders = result.data.map((order) => ({
            ...order,
            createdAt: order.createdAt, // Keep as ISO string
            totalAmount: parseFloat(order.totalAmount)
          }));
          console.log("processedOrders",processedOrders); // Debugging line
          setOrders(processedOrders);
          updateSummaryStats(processedOrders);
        } else {
          throw new Error(result.message || 'Error fetching orders');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to load orders',
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    getOrders();
  }, []);

  // Update summary stats based on orders
  const updateSummaryStats = (orders: Order[]) => {
    const pendingCount = orders.filter(order => order.status === "pending").length;
    const processingCount = orders.filter(order => order.status === "processing").length;
    const completedCount = orders.filter(order => order.status === "completed").length;
    const cancelledCount = orders.filter(order => order.status === "cancelled").length;
    
    setSummaryStats([
      { title: "All Orders", value: orders.length, icon: ShoppingBag, color: "bg-[#cbc2bb]/20 text-[#1a0c0c]" },
      { title: "Pending", value: pendingCount, icon: Clock, color: "bg-[#b3a99b]/20 text-[#b3a99b]" },
      { title: "Processing", value: processingCount, icon: Clock, color: "bg-[#611c20]/20 text-[#611c20]" },
      { title: "Completed", value: completedCount, icon: Check, color: "bg-[#cbc2bb]/20 text-[#cbc2bb]" },
      { title: "Cancelled", value: cancelledCount, icon: X, color: "bg-[#1a0c0c]/20 text-[#1a0c0c]" }
    ]);
  };

  // Handle the search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  // Handle sort change
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      
      if (result.status === "success") {
        // Update local state
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        
        setOrders(updatedOrders);
        updateSummaryStats(updatedOrders);
        
        toast({
          title: "Status updated",
          description: `Order ${orderId} status changed to ${newStatus}`,
        });
      } else {
        throw new Error(result.message || 'Error updating order status');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update order status',
        variant: "destructive"
      });
    }
  };

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      if (searchType === "email") {
        const email = order.user?.email || order.guestEmail || "";
        return email.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (searchType === "phone") {
        const phone = order.user?.phone || order.guestPhone || "";
        return phone.includes(searchQuery);
      } else {
        // Search in all fields
        const email = order.user?.email || order.guestEmail || "";
        const phone = order.user?.phone || order.guestPhone || "";
        const name = order.user?.name || order.guestName || "";
        const orderId = order.id;
        
        return (
          email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          phone.includes(searchQuery) ||
          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          orderId.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    }
    
    return true;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === "createdAt") {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortField === "totalAmount") {
      return sortOrder === "asc" 
        ? a.totalAmount - b.totalAmount 
        : b.totalAmount - a.totalAmount;
    }
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-[#1a0c0c]">Order Management</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {summaryStats.map((stat, index) => (
          <Card key={index} className="border-[#cbc2bb]/20">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-[#1a0c0c]">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search orders..."
            className="pl-10 border-[#cbc2bb]/30"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 border-[#cbc2bb]/30">
              {searchType === "all" ? (
                <span>All Fields</span>
              ) : searchType === "email" ? (
                <><Mail className="h-4 w-4" /> <span>Email</span></>
              ) : (
                <><Phone className="h-4 w-4" /> <span>Phone</span></>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem onClick={() => setSearchType("all")}>
              All Fields
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchType("email")}>
              <Mail className="h-4 w-4 mr-2" /> Email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchType("phone")}>
              <Phone className="h-4 w-4 mr-2" /> Phone
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] border-[#cbc2bb]/30">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Orders Table */}
      <Card className="border-[#cbc2bb]/20">
        <CardHeader className="pb-0">
          <CardTitle className="text-[#1a0c0c]">Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#611c20]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <OrderTable 
              orders={sortedOrders} 
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={toggleSort}
              onStatusChange={handleStatusUpdate}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;