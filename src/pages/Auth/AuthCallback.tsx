import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkSession } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsLoading(true);
        
        // Set the supabase session from the URL
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Update the auth store
        await checkSession();
        
        // Clear the URL hash
        if (window.location.hash) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [checkSession]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
        <p className="mt-4 text-secondary-600">Completing authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5">
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 max-w-md w-full">
          <h2 className="text-red-600 font-medium mb-2">Authentication Error</h2>
          <p className="text-red-500">{error}</p>
          <a 
            href="/auth/login" 
            className="mt-4 inline-block text-primary-600 hover:underline"
          >
            Back to login
          </a>
        </div>
      </div>
    );
  }

  // Redirect to dashboard on success
  return <Navigate to="/" replace />;
};

export default AuthCallback; 