import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Phone, Mail, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CustomerData {
  name: string | null;
  email: string | null;
  phone: string | null;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

interface CustomerDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerData;
}

const CustomerDataModal: React.FC<CustomerDataModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#611c20]" />
            Customer Information
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <h3 className="text-md font-medium text-[#1a0c0c]">Personal Details</h3>
            <div className="bg-[#cbc2bb]/10 p-4 rounded-md space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-[#611c20] mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.name || "Guest User"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#611c20] mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.email || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#611c20] mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="bg-[#cbc2bb]/20" />
          
          <div className="space-y-2">
            <h3 className="text-md font-medium text-[#1a0c0c]">Shipping Address</h3>
            <div className="bg-[#cbc2bb]/10 p-4 rounded-md">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#611c20] mt-0.5" />
                <div>
                  <p className="text-sm">
                    {customer.address.street}<br />
                    {customer.address.city}, {customer.address.state} {customer.address.zip}<br />
                    {customer.address.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDataModal;