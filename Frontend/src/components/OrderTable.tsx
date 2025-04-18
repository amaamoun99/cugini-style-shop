import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Info,
  ShoppingCart,
  MoreHorizontal,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OrderStatusModal from "./OrderStatusModal";
import CustomerDataModal from "./CustomerDataModal";

// Type definitions for order data
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
  paidAt: string | null;
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
  createdAt: string;
  address: Address;
  payment: Payment;
  user: User;
  orderItems: OrderItem[];
};

interface OrderTableProps {
  orders: Order[];
  sortField: string;
  sortOrder: string;
  onSort: (field: string) => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  sortField,
  sortOrder,
  onSort,
  onStatusChange,
}) => {
  // State for status modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedOrderStatus, setSelectedOrderStatus] =
    useState<OrderStatus>("pending");

  // State for customer modal
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    name: string | null;
    email: string | null;
    phone: string | null;
    address: Address;
  }>({
    name: null,
    email: null,
    phone: null,
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  // State to track open dropdown menus
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-[#b3a99b] hover:bg-[#a5998a]">Pending</Badge>
        );
      case "processing":
        return (
          <Badge className="bg-[#611c20] hover:bg-[#50181c]">Processing</Badge>
        );
      case "completed":
        return (
          <Badge className="bg-[#cbc2bb] hover:bg-[#b9aea5]">Completed</Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-[#1a0c0c] hover:bg-[#291414]">Cancelled</Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Helper function to get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  // Handle status change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    onStatusChange(orderId, newStatus);
  };

  // Open status modal
  const openStatusModal = (order: Order) => {
    setSelectedOrderId(order.id);
    setSelectedOrderStatus(order.status);
    setStatusModalOpen(true);
    // Close the dropdown when opening the modal
    setOpenDropdownId(null);
  };

  // Open customer modal
  const openCustomerModal = (order: Order) => {
    setSelectedCustomer({
      name: order.user?.name || order.guestName,
      email: order.user?.email || order.guestEmail,
      phone: order.user?.phone || order.guestPhone,
      address: order.address,
    });
    setCustomerModalOpen(true);
    // Close the dropdown when opening the modal
    setOpenDropdownId(null);
  };

  // Toggle dropdown menu
  const toggleDropdown = (orderId: string) => {
    if (openDropdownId === orderId) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(orderId);
    }
  };

  // Format product name from variant
  const getProductName = (orderItem: OrderItem) => {
    return orderItem.variant?.product?.name || "Unknown Product";
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => onSort("id")}
                >
                  Order ID
                </div>
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("createdAt")}
              >
                <div className="flex items-center">
                  Date
                  {getSortIcon("createdAt")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("totalAmount")}
              >
                <div className="flex items-center">
                  Amount
                  {getSortIcon("totalAmount")}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div
                      className="flex flex-col cursor-pointer hover:text-[#611c20]"
                      onClick={() => openCustomerModal(order)}
                    >
                      <div className="flex items-center">
                        <span>
                          {order.user?.name || order.guestName || "Guest"}
                        </span>
                        <User className="ml-1 h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {order.user?.email || order.guestEmail || "No email"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="capitalize text-sm">
                      {order.payment?.method?.replace("_", " ") || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          <span>{order.orderItems.length}</span>
                          <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="p-2">
                          {order.orderItems.map((item, index) => (
                            <div key={index} className="text-sm">
                              {item.quantity}x {getProductName(item)} - $
                              {parseFloat(item.price.toString()).toFixed(2)}
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu
                      open={openDropdownId === order.id}
                      onOpenChange={(isOpen) => {
                        if (isOpen) {
                          setOpenDropdownId(order.id);
                        } else {
                          setOpenDropdownId(null);
                        }
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem
                          onClick={() => openStatusModal(order)}
                        >
                          Change Status
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openCustomerModal(order)}
                        >
                          View Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Status Change Modal */}
      <OrderStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        currentStatus={selectedOrderStatus}
        orderId={selectedOrderId}
        onStatusChange={handleStatusChange}
      />

      {/* Customer Data Modal */}
      <CustomerDataModal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        customer={selectedCustomer}
      />
    </>
  );
};

export default OrderTable;
