import { useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../../../../utils/constants';
import { useAuth } from '../../../../auth/hooks/useAuth';
import Notifications from './Notifications';
import ProfileMenu from './ProfileMenu';


const Header = () => {
  const location = useLocation();
  const { user } = useAuth();

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
        {/* Page Title - Uncomment if needed */}
        {/* <h2 className="text-xl font-semibold text-gray-900">{getCurrentPageTitle()}</h2> */}
      </div>

      <div className="flex items-center gap-6">
        <Notifications />
        <ProfileMenu user={user} />
      </div>
    </header>
  );
};

export default Header;