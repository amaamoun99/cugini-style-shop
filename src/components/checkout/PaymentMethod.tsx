
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Truck } from 'lucide-react';

interface PaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethod = ({ paymentMethod, setPaymentMethod }: PaymentMethodProps) => {
  return (
    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3 mb-6">
      <div className="flex items-center justify-between border p-4 rounded-md opacity-50 pointer-events-none">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="card" id="card" disabled />
          <Label htmlFor="card" className="font-medium flex items-center">
            Pay with Credit Card (Unavailable)
          </Label>
        </div>
      </div>

      <div className="flex items-center justify-between border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="cod" id="cod" />
          <Label htmlFor="cod" className="font-medium flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Payment on Delivery
          </Label>
        </div>
      </div>
    </RadioGroup>
  );
};

export default PaymentMethod;
