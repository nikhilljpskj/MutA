import {React, useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
// import AddEmployee from './components/AddEmployee';
import axios from 'axios';
import AppLayout from './components/AppLayout';
// import AdminDashboard from './components/AdminDashboard'
// import StaffDashboard from './components/StaffDashboard'
// import StatsPage from './components/StatsPage';
import {LoginPage} from './pages/LoginPage'
// import ComplaintStatus from './components/ComplaintStatus'

import './App.css';
import Registration from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddCategories from './pages/AddCategories';
import ViewCategories from './pages/ViewCategories';
import AddSubCategories from './pages/AddSubCategories';
import ViewSubCategories from './pages/ViewSubCategories';
import AddProduct from './pages/AddProduct';
import ViewProducts from './pages/ViewProducts';
import Home from './pages/Home';
import Product from './pages/Product';
import ProductDetails from './pages/ProductDetails';
import OrderSummary from './pages/OrderSummary';
import PaymentPage from './pages/PaymentPage';
import OrderDetails from './pages/OrderDetails';

// import Profile from './components/Profile';

function App() {

    return (
      <Router>
        {/* <AppLayout> */}
          <Routes> 
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product" element={<Product />} />
            <Route path="/add-category" element={<AddCategories />} />
            <Route path="/view-category" element={<ViewCategories />} />
            <Route path="/add-sub-category" element={<AddSubCategories />} />
            <Route path="/view-sub-category" element={<ViewSubCategories />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/view-product" element={<ViewProducts />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/order-summary/:productId" element={<OrderSummary />} />
            <Route path="/payment/:rentalId" element={<PaymentPage />} />
            <Route path="/orderdetails" element={<OrderDetails />} />
            {/* <Route
              path="/customer/complaint-registration"
              element={<ComplaintRegistration />}
            />
            <Route
              path="/customer/complaint-status/:id"
              element={<ComplaintStatus id={id} />}
            /> */}
          </Routes>
        {/* </AppLayout> */}
      </Router>
    );


}

export default App;
