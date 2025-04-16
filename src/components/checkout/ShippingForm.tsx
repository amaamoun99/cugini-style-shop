
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  street: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

interface ShippingFormProps {
  shippingInfo: ShippingInfo;
  setShippingInfo: (info: ShippingInfo) => void;
}

const ShippingForm = ({ shippingInfo, setShippingInfo }: ShippingFormProps) => {
  const handleChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo({ ...shippingInfo, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          value={shippingInfo.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          placeholder="First name"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          value={shippingInfo.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          placeholder="Last name"
          required
          className="mt-1"
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="street">Street</Label>
        <Input
          id="street"
          value={shippingInfo.street}
          onChange={(e) => handleChange('street', e.target.value)}
          placeholder="Street address"
          required
          className="mt-1"
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="address">Additional Address Info</Label>
        <Input
          id="address"
          value={shippingInfo.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Apartment, suite, etc."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={shippingInfo.city}
          onChange={(e) => handleChange('city', e.target.value)}
          placeholder="City"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="zipCode">ZIP Code</Label>
        <Input
          id="zipCode"
          value={shippingInfo.zipCode}
          onChange={(e) => handleChange('zipCode', e.target.value)}
          placeholder="ZIP Code"
          required
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default ShippingForm;
