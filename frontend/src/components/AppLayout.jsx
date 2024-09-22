import React from 'react';
import { useLocation } from 'react-router-dom';// Assuming you have a SideNav component
import NavbarTop from './Header';
import './AppLayout.css';

const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // List of paths where the side nav should be hidden
  const pathsWithoutSideNav = ['/login', '/register', '/about', '/dashboard'];

  // Add the dynamic route to the no-sidenav list
  const shouldHideSideNav = pathsWithoutSideNav.includes(location.pathname) || location.pathname.startsWith('/customer');

  const contentClassName = !shouldHideSideNav ? 'content' : 'base';

  return (
    <div className="app-layout">
      <div className={contentClassName}>
        {!shouldHideSideNav && <NavbarTop />}
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
