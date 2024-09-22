import React from 'react';
import { NavLink } from 'react-router-dom';
import './LeftSidebar.scss';

const LeftSidebar = () => {
  return (
    <div className="left-sidebar">
      <div className="menu-title">Menu</div>
      <NavLink to="/dashboard" className="menu-item" activeclassname="active">Dashboard</NavLink>
      <NavLink to="/add-product" className="menu-item" activeclassname="active">Add Product</NavLink>
      <NavLink to="/order-history" className="menu-item" activeclassname="active">Order History</NavLink>
      <NavLink to="/view-product" className="menu-item" activeclassname="active">View Products</NavLink>
      {/* <NavLink to="/add-category" className="menu-item" activeclassname="active">Add Category</NavLink> */}
      <NavLink to="/view-category" className="menu-item" activeclassname="active">Category</NavLink>
      <NavLink to="/view-sub-category" className="menu-item" activeclassname="active">Sub Category</NavLink>
      
      
    </div>
  );
};

export default LeftSidebar;
