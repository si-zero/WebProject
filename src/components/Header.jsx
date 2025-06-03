import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Pixen</div>
      <div className="header-icons">
        <button className="icon">🛒</button>
        <button className="icon">☰</button>
      </div>
    </header>
  );
};

export default Header;