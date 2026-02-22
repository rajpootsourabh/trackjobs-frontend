import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../../../../utils/constants';
import { Bell, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../../auth/hooks/useAuth';

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Get current page title based on route
  const getCurrentPageTitle = () => {
    const currentNav = NAV_ITEMS.find((item) =>
      location.pathname.startsWith(item.path)
    );
    return currentNav?.label || 'Dashboard';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.full_name) {
      return user.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.first_name && user?.last_name) {
      return (user.first_name[0] + user.last_name[0]).toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Get user display name
  const getDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // Get user role display
  const getUserRole = () => {
    if (user?.primary_role) {
      return user.primary_role
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    if (user?.role_slugs?.length > 0) {
      return user.role_slugs[0]
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return 'User';
  };

  const handleLogout = async () => {
    try {
      setIsProfileMenuOpen(false);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="flex justify-between items-center px-6 py-2 bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* <h2 className="text-xl font-semibold text-gray-900">{getCurrentPageTitle()}</h2> */}
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 bg-none border-none cursor-pointer rounded-md hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-4 text-center">
            3
          </span>
        </button>

        <div className="relative">
          <div
            className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              {getUserInitials()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {getDisplayName()}
              </span>
              <span className="text-xs text-gray-500">{getUserRole()}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <>
              {/* Backdrop for clicking outside */}
              <div
                className="fixed inset-0 z-50"
                onClick={() => setIsProfileMenuOpen(false)}
              ></div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                {/* User Info Section - Horizontally Centered with Initials Above */}
                <div className="px-4 py-6 border-b border-gray-100 flex flex-col items-center text-center">
                  {/* Initials Circle - Larger and Above */}
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xl mb-3 shadow-md">
                    {getUserInitials()}
                  </div>
                  
                  {/* User Details - Centered */}
                  <p className="text-base font-semibold text-gray-900">{getDisplayName()}</p>
                  <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                  
                  {/* Vendor Info - If Available */}
                  {user?.vendor && (
                    <div className="mt-3 w-full">
                      <p className="text-sm font-medium text-gray-700 bg-gray-50 rounded-lg px-3 py-2 inline-block">
                        {user.vendor.business_name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    disabled={true}
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      window.location.href = '/profile';
                    }}
                    className="w-full px-4 py-2 text-sm text-gray-400 flex items-center gap-3 cursor-not-allowed opacity-60"
                    title="Coming soon"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    Your Profile
                    <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Soon</span>
                  </button>
                  
                  <button
                    disabled={true}
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      window.location.href = '/settings';
                    }}
                    className="w-full px-4 py-2 text-sm text-gray-400 flex items-center gap-3 cursor-not-allowed opacity-60"
                    title="Coming soon"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Settings
                    <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Soon</span>
                  </button>
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add this style to your global CSS or as a style tag */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;