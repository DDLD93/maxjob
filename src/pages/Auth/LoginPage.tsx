import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { Mail, Lock, AlertCircle, ArrowRight, UserPlus } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { login, loginWithGoogle } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: loginError } = await login(email, password);
      
      if (loginError) {
        throw loginError;
      }
      
      // Redirect handled by AuthLayout
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      // Redirect will be handled by the OAuth flow
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
      console.error('Google sign-in error:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-secondary-800">Welcome Back</h1>
        <p className="text-secondary-600 mt-2 text-lg">Sign in to your account</p>
      </div>

      {/* <p className="text-sm text-secondary-600">
            Don't have an account?{' '}
            <Link to="/auth/register" className="font-medium text-primary-600 hover:text-primary-700 transition-colors hover:underline">
              Sign up
            </Link>
          </p> */}

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100 text-red-600 flex items-start animate-slide-in">
          <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0 text-red-500" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className={`block text-sm font-semibold transition-colors duration-200 ${focusedField === 'password' ? 'text-primary-600' : 'text-secondary-700'}`}>
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors hover:underline"
              aria-label="Forgot password?"
            >
              Forgot password?
            </Link>
          </div>
          <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.01]' : ''}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'password' ? 'text-primary-500' : 'text-secondary-400'}`} />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              placeholder="••••••••"
              required
              aria-label="Password"
              className="block w-full pl-10 pr-12 py-2.5 border border-secondary-200 rounded-lg shadow-sm placeholder-secondary-400 
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 
                text-base bg-white hover:bg-gray-50"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm font-medium text-secondary-500 hover:text-primary-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded-md"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary-700">
            Remember me
          </label>
        </div>

        <div>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
            rightIcon={!loading && <ArrowRight className="h-4 w-4" />}
            className="py-2.5 text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
        <div className="pt-1">
          <Button
            variant="outline"
            onClick={() => navigate('/auth/register')}
            fullWidth
            rightIcon={<UserPlus className="h-4 w-4" />}
            className="py-2.5 text-base rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-secondary-300"
          >
            Create an account 
          </Button>
        </div>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-secondary-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-secondary-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-secondary-300 rounded-lg shadow-sm bg-white text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-all duration-200"
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
              </g>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-secondary-500">
          By signing in, you agree to our <Link to="/terms" className="underline hover:text-primary-600">Terms of Service</Link> and <Link to="/privacy" className="underline hover:text-primary-600">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 