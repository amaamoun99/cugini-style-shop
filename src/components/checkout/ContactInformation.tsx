
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactInformationProps {
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
}

const ContactInformation = ({ email, setEmail, phone, setPhone }: ContactInformationProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number for delivery updates"
          required
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default ContactInformation;
