import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // 실제 경로 맞게 수정

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleMyInfoClick = () => {
    if (user) {
      // 로그인 상태면 로그아웃 여부 확인
      const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
      if (confirmLogout) {
        logout();
        alert("로그아웃 되었습니다.");
        navigate("/main");
      }
      // 취소 시에는 아무 동작 안 함 (로그인 페이지 진입 막기)
    } else {
      // 비로그인 상태면 로그인 페이지로 이동
      navigate("/login");
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleMyCartClick = () => {
    navigate('/wishlist');
  };

  return (
    <>
      <div className='title'>
        <div className='logo' onClick={handleHomeClick}></div>
        <div className='sideBar'>
          <div className='cart' onClick={handleMyCartClick}></div>
          <div className='myInfo' onClick={handleMyInfoClick}></div>
          <div className='menu'></div>
        </div>
      </div>

      <div className="greeting-message">
        {user ? (
          <p>{user.name} 님 안녕하세요</p>
        ) : (
          <p>로그인하여 다양한 기능을 사용하세요</p>
        )}
      </div>
    </>
  );
};

export default Header;
