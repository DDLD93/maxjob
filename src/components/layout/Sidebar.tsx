import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  Briefcase,
  User,
  Calendar,
  BookOpen,
  Bookmark,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import logo from '../../assets/logo.png';
import { mockMembers } from '../../data/mockData';

// Default logged in user is the first member
const currentUser = mockMembers[0];

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  section?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle, isMobile = false }) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} />, section: 'main' },
    { name: 'Explore Jobs', path: '/explore', icon: <Search size={20} />, section: 'main' },
    { name: 'My Applications', path: '/applications', icon: <Briefcase size={20} />, section: 'main' },
    { name: 'Saved Jobs', path: '/saved-jobs', icon: <Bookmark size={20} />, section: 'main' },
    { name: 'Seminars', path: '/seminars', icon: <Calendar size={20} />, section: 'resources' },
    { name: 'Learning', path: '/learning', icon: <BookOpen size={20} />, section: 'resources' },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={20} />, section: 'account' },
    { name: 'Profile', path: '/profile', icon: <User size={20} />, section: 'account' },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} />, section: 'account' },
  ];

  // Group items by section
  const mainItems = navItems.filter(item => item.section === 'main');
  const resourceItems = navItems.filter(item => item.section === 'resources');
  const accountItems = navItems.filter(item => item.section === 'account');

  const renderNavItem = (item: NavItem) => (
    <Link
      key={item.path}
      to={item.path}
      className={cn(
        'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
        location.pathname === item.path
          ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-600 shadow-sm border-l-4 border-primary-500'
          : 'text-secondary-600 hover:bg-secondary-50 hover:text-primary-600',
        !open && !isMobile && 'justify-center'
      )}
      onClick={isMobile ? onToggle : undefined}
    >
      <div className={cn(
        'flex items-center',
        !open && !isMobile && 'justify-center w-full',
        location.pathname === item.path 
          ? 'transform transition-transform group-hover:translate-x-1 duration-200'
          : 'transform transition-transform group-hover:translate-x-1 duration-200'
      )}>
        <span className={cn(
          "mr-3",
          location.pathname === item.path ? 'text-primary-600' : 'text-secondary-500'
        )}>
          {item.icon}
        </span>
        {(open || isMobile) && (
          <span className={location.pathname === item.path ? 'font-semibold' : ''}>
            {item.name}
          </span>
        )}
      </div>
    </Link>
  );

  const renderSectionLabel = (title: string) => {
    if (!open && !isMobile) return null;
    
    return (
      <div className="px-4 pt-5 pb-2">
        <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wider">
          {title}
        </p>
      </div>
    );
  };

  // Function to generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <aside
      className={cn(
        'flex flex-col bg-white border-r border-secondary-100 shadow-sm transition-all duration-300 ease-in-out',
        isMobile
          ? 'fixed inset-y-0 left-0 z-50'
          : 'relative',
        open
          ? 'w-64'
          : isMobile
            ? '-translate-x-full'
            : 'w-20',
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-secondary-100">
        <div className={cn('flex items-center', open ? '' : 'justify-center w-full')}>
          {open ? (
            <div className="flex items-center">
              <img src={logo} alt="MaxJob Africa Logo" className="h-9" />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                MaxJob Africa
              </span>
            </div>
          ) : (
            !isMobile && (
              <div className="h-9 w-9 rounded-md bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-sm">
                <span className="text-lg font-bold text-white">MA</span>
              </div>
            )
          )}
        </div>
        {!isMobile && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-full bg-secondary-50 hover:bg-secondary-100 text-secondary-500 hover:text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-colors"
          >
            {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary-200 scrollbar-track-transparent">
        {renderSectionLabel('Main')}
        <div className="space-y-1">
          {mainItems.map(renderNavItem)}
        </div>

        {renderSectionLabel('Resources')}
        <div className="space-y-1">
          {resourceItems.map(renderNavItem)}
        </div>

        {renderSectionLabel('Account')}
        <div className="space-y-1">
          {accountItems.map(renderNavItem)}
        </div>
      </nav>

      <div className="mt-auto border-t border-secondary-100 p-3">
        {open ? (
          <div className="flex items-center p-2 rounded-lg hover:bg-secondary-50 transition-colors cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 p-0.5">
              <div className="h-full w-full rounded-full overflow-hidden flex items-center justify-center">
                {currentUser.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture} 
                    alt={currentUser.fullName} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-primary-600 font-semibold">{getInitials(currentUser.fullName)}</span>
                )}
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-secondary-900">{currentUser.fullName}</p>
              <p className="text-xs text-secondary-500">{currentUser.membershipLevel} Account</p>
            </div>
            <button className="p-1.5 rounded-full text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          !isMobile && (
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 p-0.5">
                <div className="h-full w-full rounded-full overflow-hidden flex items-center justify-center">
                  {currentUser.profilePicture ? (
                    <img 
                      src={currentUser.profilePicture} 
                      alt={currentUser.fullName} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-600 font-semibold">{getInitials(currentUser.fullName)}</span>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </aside>
  );
};

export default Sidebar;