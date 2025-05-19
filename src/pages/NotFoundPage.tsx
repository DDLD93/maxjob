import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

interface NotFoundPageProps {
  title?: string;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ title }) => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div className="mb-4 rounded-full bg-primary-100 p-6 text-primary-600">
        <svg
          className="h-16 w-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">
        {title ? `${title} Page Coming Soon` : 'Page Not Found'}
      </h1>
      <p className="mb-8 text-gray-600">
        {title
          ? `The ${title.toLowerCase()} section is currently under development.`
          : "The page you're looking for doesn't exist or has been moved."}
      </p>
      <Link to="/admin/dashboard">
        <Button leftIcon={<ArrowLeft size={16} />}>Back to Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;