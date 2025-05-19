import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, Search, MessageSquare, ChevronDown, Briefcase } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const {logout} = useAuthStore()
  const location = useLocation();
  const handleLogout =()=>{
    logout()
    setDropdownOpen(false)
  }

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/explore') return 'Explore Jobs';
    if (path.startsWith('/jobs/')) return 'Job Details';
    if (path === '/profile') return 'Profile';
    if (path === '/applications') return 'My Applications';
    if (path === '/saved-jobs') return 'Saved Jobs';
    if (path === '/seminars') return 'Professional Development';
    if (path.startsWith('/seminars/')) return 'Seminar Details';
    if (path === '/learning') return 'Learning Hub';
    if (path === '/notifications') return 'Notifications';
    if (path === '/settings') return 'Settings';
    
    return path.charAt(1).toUpperCase() + path.slice(2);
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex flex-1 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none lg:hidden"
          >
            <Menu size={24} />
          </button>
          <h1 className="hidden sm:block text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
        </div>

        <div className="mx-4 hidden md:block flex-1 max-w-xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Search for jobs, skills, or companies..."
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/explore" className="hidden sm:flex items-center text-gray-700 hover:text-primary-600 transition-colors">
            <Briefcase size={20} className="mr-1" />
            <span className="text-sm">Jobs</span>
          </Link>

          <Link to="/seminars" className="hidden sm:flex items-center text-gray-700 hover:text-primary-600 transition-colors">
            <span className="text-sm">Seminars</span>
          </Link>

          <div className="relative">
            <button 
              className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="py-2 px-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                    <p className="text-sm font-medium">New job matching your skills</p>
                    <p className="text-xs text-gray-500">Frontend Developer at Tech Solutions</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                  <div className="py-2 px-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                    <p className="text-sm font-medium">Application status update</p>
                    <p className="text-xs text-gray-500">Your application for UX Designer is being reviewed</p>
                    <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                  </div>
                  <div className="py-2 px-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium">New seminar available</p>
                    <p className="text-xs text-gray-500">Tech Job Search Strategies - June 20th</p>
                    <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                  </div>
                </div>
                <div className="p-2 border-t border-gray-200 text-center">
                  <a href="#" className="text-xs text-primary-600 hover:text-primary-800">View all notifications</a>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
            >
              <MessageSquare size={20} />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center rounded-full text-gray-700 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                <img 
                  src="https://randomuser.me/api/portraits/women/42.jpg" 
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <ChevronDown size={16} className="ml-1 hidden md:block" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <Link 
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to="/applications" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Applications
                </Link>
                <Link
                  to="/saved-jobs"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Saved Jobs
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Settings
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleLogout()}
                >
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;