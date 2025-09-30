// src/components/Layout.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from '../components/sidebar/SideBar';
import Header from '../components/sidebar/Header';

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <>
      <Header />
      {!isLoginPage && <SideBar />}
      <div className={isLoginPage ? 'login-content' : 'content'}>
        {children}
      </div>
    </>
  );
};

export default Layout;
