import React from 'react';
import { Link } from 'react-router-dom';  // Link 임포트
import './Header.css';

const Header = () => {
  return (
    <>
      <Link to="/">
        <div className="logo"></div>
      </Link>
      <Link to="/wishlist">
        <div className="logo"></div>
      </Link>
    </>
  );
};

export default Header;
