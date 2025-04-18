import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ShoppingBag, Clock, Check, X } from "lucide-react";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: OrderStatus;
  orderId: string;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  isOpen,
  onClose,
  currentStatus,
  orderId,
  onStatusChange,
}) => {
  const [status, setStatus] = React.useState<OrderStatus>(currentStatus);

  React.useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleStatusChange = () => {
    onStatusChange(orderId, status);
    toast({
      title: "Status updated",
      description: `Order ${orderId} status changed to ${status}`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={status}
            onValueChange={(value) => setStatus(value as OrderStatus)}
            className="gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pending" id="pending" />
              <Label
                htmlFor="pending"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Clock className="h-4 w-4 text-[#a55341]" />
                <span>Pending</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="processing" id="processing" />
              <Label
                htmlFor="processing"
                className="flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4 text-[#611c20]" />
                <span>Processing</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="completed" />
              <Label
                htmlFor="completed"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Check className="h-4 w-4 text-[#b3a99b]" />
                <span>Completed</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cancelled" id="cancelled" />
              <Label
                htmlFor="cancelled"
                className="flex items-center gap-2 cursor-pointer"
              >
                <X className="h-4 w-4 text-[#1a0c0c]" />
                <span>Cancelled</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleStatusChange}>Update Status</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderStatusModal;