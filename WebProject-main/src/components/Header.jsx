import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleMyInfoClick = () => {
    navigate('/login');
  };

  return (
    <>
      <div className='title'>
        <div className='logo'></div>
        <div className='sideBar'> 
          <div className='cart'></div>
          <div className='myInfo' onClick={handleMyInfoClick}></div>
          <div className='menu'></div>
        </div>
      </div>
    </>
  );
};

export default Header;