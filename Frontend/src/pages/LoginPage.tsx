import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  // If already authenticated, redirect to the intended page
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Set form error from auth context error
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Basic validation
    if (!email || !password) {
      setFormError('Email and password are required');
      return;
    }
    
    try {
      // Attempt to login
      await login(email, password);
    } catch (err) {
      // Error handling is done in the AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4 block">
            <h1 className="text-3xl font-serif text-primary">CUGINI</h1>
          </Link>
          <CardTitle className="text-xl">Welcome Back to Cugini Style</CardTitle>
          <CardDescription>
            <span className="block mb-2 text-cugini-golden font-serif text-base">Access your personal Italian fashion experience.</span>
            <span className="text-gray-600 text-xs">Sign in to manage your wishlist, orders, and more!</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {formError && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
              {formError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center gap-2">
          <Link to="/register" className="text-sm text-cugini-golden underline hover:text-cugini-dark transition-colors">
            New to Cugini Style? Create an account
          </Link>
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary">
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
