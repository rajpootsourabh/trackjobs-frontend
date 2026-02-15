import { useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../../../../utils/constants';
import { Bell, BellIcon } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  // Get current page title based on route
  const getCurrentPageTitle = () => {
    const currentNav = NAV_ITEMS.find((item) =>
      location.pathname.startsWith(item.path)
    );
    return currentNav?.label || 'Dashboard';
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

        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">John Doe</span>
            <span className="text-xs text-gray-500">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;