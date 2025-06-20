import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

// 훅으로 간편하게 사용 가능하게
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 앱 시작 시 localStorage에 저장된 사용자 정보 복원
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 로그아웃 함수: 상태 초기화 + localStorage에서 제거
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
