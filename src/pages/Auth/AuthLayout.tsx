import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import logo from '../../assets/logo.png';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, checkSession } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const initAuth = async () => {
      await checkSession();
      setIsLoading(false);
    };
    
    initAuth();
  }, [checkSession]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
        <p className="mt-4 text-secondary-600">Loading...</p>
      </div>
    );
  }
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-1/3 h-1/2 rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/5 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-1/3 h-1/2 rounded-full bg-gradient-to-tr from-secondary-500/10 to-primary-500/5 blur-3xl"></div>
        <div className="absolute top-[40%] left-[30%] w-1/4 h-1/4 rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/5 blur-3xl animate-pulse"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <div className="flex items-center">
            <img src={logo} alt="MaxJob Africa Logo" className="h-12" />
            <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
              MaxJob Africa
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100 animate-fade-in">
          <Outlet />
        </div>
      </div>
      
      <div className="mt-6 text-center z-10">
        <p className="text-sm text-secondary-500">
          © {new Date().getFullYear()} MaxJob Africa. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout; 