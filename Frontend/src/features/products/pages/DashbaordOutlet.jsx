import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SellerNavbar from '../components/SellerNavbar';
import '../style/dashboardOutlet.scss';

function DashboardOutlet() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="dashboard-outlet">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && (
        <div
          className="dashboard-outlet__backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <div className="dashboard-outlet__main">
        <SellerNavbar onMenuClick={toggleSidebar} />

        <div className="dashboard-outlet__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardOutlet;