import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Mail, AlertCircle, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const { resetPassword } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: resetError } = await resetPassword(email);
      
      if (resetError) throw resetError;
      
      // Show success message
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to process your request. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center shadow-md 
              transform transition-transform hover:rotate-3 hover:scale-105 duration-300 border border-primary-200">
              <CheckCircle className="h-10 w-10 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-secondary-800">
            Check Your Email
          </h1>
          <p className="text-secondary-600 mt-2 text-lg">
            We've sent instructions to reset your password to{' '}
            <span className="font-medium text-secondary-800 bg-secondary-50 px-2 py-0.5 rounded-md border border-secondary-200">
              {email}
            </span>
          </p>
          <p className="text-secondary-500 mt-3">
            Please check your inbox and spam folder
          </p>
        </div>
        
        <div className="mt-8">
          <Button
            variant="outline"
            fullWidth
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="py-2.5 text-base rounded-lg"
            onClick={() => window.location.href = '/auth/login'}
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary-800">
          Reset Password
        </h1>
        <p className="text-secondary-600 mt-3 text-lg">Enter your email to receive reset instructions</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100 text-red-600 flex items-start animate-slide-in">
          <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0 text-red-500" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className={`block text-sm font-semibold transition-colors duration-200 ${focusedField === 'email' ? 'text-primary-600' : 'text-secondary-700'}`}>
            Email Address
          </label>
          <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.01]' : ''}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'email' ? 'text-primary-500' : 'text-secondary-400'}`} />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              placeholder="name@company.com"
              required
              aria-label="Email Address"
              className="block w-full pl-10 pr-3 py-2.5 border border-secondary-200 rounded-lg shadow-sm placeholder-secondary-400 
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 
                text-base bg-white hover:bg-gray-50"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
            rightIcon={!loading && <Send className="h-4 w-4" />}
            className="py-2.5 text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>
          
          <Link 
            to="/auth/login" 
            className="flex items-center justify-center text-sm font-medium text-primary-600 
              hover:text-primary-700 transition-colors py-2 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-[-2px] transition-transform" />
            <span>Back to Login</span>
          </Link>
        </div>
      </form>
      
      <div className="mt-8 text-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-secondary-200 to-transparent mb-6"></div>
        <p className="text-sm text-secondary-600">
          Remember your password?{' '}
          <Link to="/auth/login" className="font-medium text-primary-600 hover:text-primary-700 transition-colors hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 