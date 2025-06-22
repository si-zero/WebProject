import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { UserProvider } from '../context/UserContext';
import { useUser } from '../context/UserContext';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleMyInfoClick = () => {
    if (user) {
      navigate('/myInfo');
    } else {
      navigate('/login');
    }
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