import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuthStore } from '../../store/useAuthStore';
import ProfileSetupModal from '../ProfileSetupModal';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, checkSession } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      await checkSession();
      setIsLoading(false);
    };
    
    initAuth();
  }, [checkSession]);

  // Check if on mobile screen and adjust sidebar state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initialize
    checkScreenSize();
    
    // Set sidebar open state based on screen size
    setSidebarOpen(!isMobile);
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isMobile]);

  // Launch profile setup modal 5 seconds after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProfileModal(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
        <p className="ml-3 text-secondary-600">Loading dashboard...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  // if (!isAuthenticated) {
  //   return <Navigate to="/auth/login" />;
  // }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const handleMainContentClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} isMobile={isMobile} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        
        <main 
          className="flex-1 overflow-y-auto p-4 bg-secondary-50"
          onClick={handleMainContentClick}
        >
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {showProfileModal && (
        <ProfileSetupModal 
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onComplete={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;