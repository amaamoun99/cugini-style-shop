
import React, { useState } from 'react';
import { toast } from 'sonner';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-cugini-taupe/30">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-4 text-cugini-dark">Join Our Community</h2>
          <p className="text-cugini-dark/80 mb-8">
            Subscribe to receive updates on new collections, exclusive offers, and styling inspiration.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 border border-cugini-taupe focus:outline-none focus:border-cugini-dark"
              required
            />
            <button 
              type="submit" 
              className="btn-primary py-3 px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
