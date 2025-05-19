import { useRouteError, isRouteErrorResponse, Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  
  let errorMessage: string;
  let statusCode: number | null = null;
  
  if (isRouteErrorResponse(error)) {
    // Error is a route error
    statusCode = error.status;
    errorMessage = error.statusText || error.data?.message || 'An unexpected error occurred';
  } else if (error instanceof Error) {
    // Error is a regular JavaScript error
    errorMessage = error.message || 'An unexpected error occurred';
  } else if (typeof error === 'string') {
    // Error is a string
    errorMessage = error;
  } else {
    // Unknown error type
    errorMessage = 'An unexpected error occurred';
  }
  
  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-8 border border-secondary-100 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center shadow-sm border border-red-100">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-secondary-800 mb-2">
          {statusCode ? `Error ${statusCode}` : 'Something went wrong'}
        </h1>
        
        <p className="text-secondary-600 text-center mb-8">
          {errorMessage}
        </p>
        
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => window.location.reload()}
            rightIcon={<RefreshCw className="h-4 w-4" />}
            className="py-2.5 text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/')}
            rightIcon={<Home className="h-4 w-4" />}
            className="py-2.5 text-base rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-secondary-300"
          >
            Go Home
          </Button>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-secondary-500">
          © {new Date().getFullYear()} MaxJob. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage; 