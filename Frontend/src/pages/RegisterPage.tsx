import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { register as apiRegister } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Call backend register API
      const response = await apiRegister(name, email, password);
      if (response.status === "success" && response.token) {
        // Use AuthContext login to set user state and token
        await login(email, password); // Optionally, you could set the token manually here, but login will fetch user profile
        navigate("/profile");
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-serif mb-6 text-cugini-dark">Register</h2>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Password</label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-cugini-golden underline hover:text-cugini-dark transition-colors">Log in here</a>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
