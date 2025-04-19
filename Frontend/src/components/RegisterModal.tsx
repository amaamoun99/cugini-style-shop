import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register as apiRegister } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegistered?: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ open, onOpenChange, onRegistered }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Call backend register API
      const response = await apiRegister(name, email, password, phoneNumber);
      if (response.status === "success" && response.token) {
        // Use AuthContext login to set user state and token
        await login(email, password);
        onOpenChange(false);
        onRegistered && onRegistered();
      } else {
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
        </DialogHeader>
        <div className="mb-4 text-center">
          <div className="font-serif text-lg text-cugini-golden mb-2">Join Cugini Style and unlock exclusive features!</div>
          <div className="text-gray-700 text-sm">Create your account to save your wishlist, track orders, and enjoy a personalized shopping experience.</div>
          <div className="mt-2 text-xs text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-cugini-golden underline hover:text-cugini-dark transition-colors">Log in here</a>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Name" type="text" value={name} onChange={e => setName(e.target.value)} required />
          <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input placeholder="Phone Number" type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
